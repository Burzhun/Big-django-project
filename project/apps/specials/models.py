from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.db import models
from django.http import Http404, JsonResponse
from django.utils import timezone
from modelcluster.fields import ParentalManyToManyField
from wagtail.contrib.wagtailroutablepage.models import RoutablePageMixin, route

from wagtail.wagtailcore.models import Page
from wagtail.wagtailcore.fields import RichTextField
from wagtail.wagtailadmin.edit_handlers import FieldPanel
from wagtail.wagtailimages.edit_handlers import ImageChooserPanel

from content.helpers import PageQuerySetHelper
from content.models import CommentsPageMixin
from community.models import Rating


class KamasutraIndex(Page):
    short_lead = models.CharField(
        verbose_name='Описание',
        max_length=150
    )
    content_panels = Page.content_panels + [
        FieldPanel('short_lead'),
    ]

    parent_page_types = ['home.HomePage']
    subpage_types = ['specials.KamasutraPage']

    def get_context(self, request, *args, **kwargs):
        context = super(KamasutraIndex, self).get_context(request, *args, **kwargs)
        context['positions'] = KamasutraPosition.objects.all()
        qs_helper = PageQuerySetHelper(KamasutraPage.objects.live().descendant_of(self), base_model=KamasutraPage)
        qs = qs_helper.live()
        filter_positions = request.GET.getlist('position[]')
        if filter_positions:
            context['filter_positions'] = []
            for id in filter_positions:
                try:
                    context['filter_positions'].append(int(id))
                    qs = qs.filter(positions__id__contains=id)
                except ValueError:
                    raise Http404

        qs = qs.order_by('-published_at')

        page = request.GET.get('page', 1)
        paginator = Paginator(qs, per_page=6)

        try:
            page_obj = paginator.page(page)
        except PageNotAnInteger:
            page_obj = paginator.page(1)
        except EmptyPage:
            page_obj = paginator.page(paginator.num_pages)
        context['page_obj'] = page_obj
        context['entries'] = page_obj.object_list

        return context

    class Meta:
        verbose_name = 'Страница камасутры'
        verbose_name_plural = 'Страница камасутры'


class KamasutraPosition(models.Model):
    title = models.CharField(
        max_length=200,
        verbose_name='Название'
    )

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Вариант позы'
        verbose_name_plural = 'Варианты поз'


class KamasutraPage(CommentsPageMixin, RoutablePageMixin, Page):
    parent_page_types = ['specials.KamasutraIndex']
    subpage_types = []

    positions = ParentalManyToManyField(
        'specials.KamasutraPosition',
        verbose_name='Вариант позы',
        help_text='Удерживайте "Control" (или "Command" на Mac), чтобы выбрать несколько значений.',
        related_name='pages'
    )
    preview_picture = models.ForeignKey(
        'content.CustomImage',
        on_delete=models.PROTECT,
        related_name='+',
        verbose_name="Основная иллюстрация"
    )
    body = RichTextField(
        verbose_name='Текст',
        null=True,
        # editor='tinymce',
    )
    published_at = models.DateTimeField(
        verbose_name='Дата/время публикации',
        blank=True,
        null=True,
    )
    content_panels = Page.content_panels + [
        FieldPanel('positions'),
        ImageChooserPanel('preview_picture'),
        FieldPanel('body')
    ]
    settings_panels = [
        FieldPanel('published_at'),
    ]

    @property
    def rating_percent(self):
        ratings = [i.val * 20 for i in Rating.objects.filter(page_id=self.id)]
        try:
            return int(sum(ratings) / len(ratings))
        except ZeroDivisionError:
            return 0

    @route(r'^save_rating/$', name='save-rating')
    def save_rating(self, request):
        if request.method != 'GET' or not request.user.is_authenticated:
            return JsonResponse({'error': 'Ошибка' })
        try:
            id = int(request.GET.get('id'))
            val = int(request.GET.get('val'))
        except ValueError:
            return JsonResponse({'error': 'Ошибка' })

        if not (id and val) or self.id != id:
            return JsonResponse({'error': 'Ошибка' })

        try:
            page = Page.objects.get(id=id)
            r = Rating.objects.filter(page_id=self.id, author=request.user).first()
            if r:
                r.val = val
                r.save()
            else:
                r = Rating(author=request.user, val=val, page=page)
                r.save()
        except Page.DoesNotExist:
            return JsonResponse({'error': 'Ошибка'})

        return JsonResponse({'id': r.id, 'rating': self.rating_percent})

    def get_context(self, request, *args, **kwargs):
        context = super(KamasutraPage, self).get_context(request, *args, **kwargs)
        context['positions'] = KamasutraPosition.objects.all()
        context['page_positions'] = self.positions.all()
        context['parent_page'] = self.get_parent()
        live_pages = KamasutraPage.objects.live().filter(published_at__lte=timezone.now()).exclude(id=self.id)
        next_page = live_pages.filter(published_at__lte=self.published_at).order_by('-published_at')
        if not next_page.exists():
            next_page = live_pages.filter(published_at__gte=self.published_at).order_by('-published_at')
        context['next_page'] = next_page.first()

        prev_page = live_pages.filter(published_at__gte=self.published_at).order_by('published_at')
        if not prev_page.exists():
            prev_page = live_pages.filter(published_at__lte=self.published_at).order_by('published_at')
        context['prev_page'] = prev_page.first()

        return context

    class Meta:
        verbose_name = 'Поза'
        verbose_name_plural = 'Позы'