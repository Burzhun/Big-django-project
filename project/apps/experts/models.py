from django.db import models
from django.conf import settings
from django.http import JsonResponse, Http404, HttpResponse
from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.utils.text import slugify
from django.utils import timezone
from django.views.decorators.cache import cache_page
from wagtail.contrib.wagtailroutablepage.models import RoutablePageMixin, route
from wagtail.wagtailimages.edit_handlers import ImageChooserPanel
from wagtail.wagtailadmin.edit_handlers import FieldPanel
from wagtail.wagtailcore.fields import RichTextField
from wagtail.wagtailcore.models import Page
from wagtail.wagtailsearch import index

from content.helpers import prefix_key
from community.models import Comment


class MobileTemplateMixin:

    def get_template(self, request, *args, **kwargs):
        if request.is_ajax():
            return self.ajax_template or self.template
        elif request.user_agent.is_mobile:
            parts = self.template.split('/')
            parts.insert(1, 'mobile')
            return '/'.join(parts)
        else:
            return self.template


SECTION_BEAUTY = 0
SECTION_FITNESS = 1
SECTION_RELATIONS = 2
SECTION_HEALTH = 3
SECTION_GROOMING = 4
SECTION_LIFE = 5

SECTION_CHOICES = (
    (SECTION_BEAUTY, 'Стиль'),
    (SECTION_FITNESS, 'Фитнес и спорт'),
    (SECTION_RELATIONS, 'Секс и отношения'),
    (SECTION_HEALTH, 'Здоровье'),
    (SECTION_GROOMING, 'Груминг'),
    (SECTION_LIFE, 'Жизнь'),
)


class ExpertIndex(MobileTemplateMixin, Page):
    parent_page_types = ['home.HomePage']
    subpage_types = ['experts.ExpertPage']

    def get_context(self, request, *args, **kwargs):
        context = super(ExpertIndex, self).get_context(request, *args, **kwargs)
        context['models'] = []
        for section, _ in SECTION_CHOICES:
            expert = ExpertPage.objects.live().filter(section=section).first()
            if expert is None:
                continue
            answers = AnswerPage.objects.live().descendant_of(expert).filter(published_at__lte=timezone.now())
            context['models'].append((expert, answers.order_by('-published_at')[:5]))
        return context

    def serve(self, request, *args, **kwargs):
        page_models = (AnswerPage, ExpertPage)
        prefix = prefix_key(
            'expert_index',
            page_models,
            1,
            request.user_agent.is_mobile
        )
        return cache_page(60 * 60, key_prefix=prefix)(super(ExpertIndex, self).serve)(request, *args, **kwargs)

    class Meta:
        verbose_name = "Страница экспертов"
        verbose_name_plural = "Страницы экспертов"


class ExpertPage(MobileTemplateMixin, RoutablePageMixin, Page):
    section = models.SmallIntegerField(
        verbose_name='Тема',
        db_index=True,
        default=SECTION_BEAUTY,
        choices=SECTION_CHOICES
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        verbose_name='Пользователь',
        related_name='expert_page',
        db_index=True,
        on_delete=models.PROTECT,
        limit_choices_to={'groups__name': "Эксперты"},
        null=True,
        blank=True
    )

    image = models.ForeignKey(
        'content.CustomImage',
        on_delete=models.PROTECT,
        related_name='+',
        verbose_name="Изображение",
        null=True
    )
    intro = models.TextField(
        verbose_name='Интро',
        max_length=500,
        null=True,
        blank=True
    )

    short_description = models.CharField(
        verbose_name='Регалии',
        max_length=150,
        null=True,
    )

    description = models.TextField(
        verbose_name='Описание',
        max_length=300,
        null=True,
        blank=True
    )

    old_id = models.IntegerField(
        null=True,
        blank=True
    )

    search_fields = Page.search_fields + [
        index.SearchField('description')
    ]

    content_panels = Page.content_panels + [
        FieldPanel('section'),
        FieldPanel('user'),
        ImageChooserPanel('image'),
        FieldPanel('intro'),
        FieldPanel('description'),
        FieldPanel('short_description'),
    ]

    subpage_types = ['experts.AnswerPage']
    parent_page_types = ['experts.ExpertIndex']
    ajax_template = 'experts/expert_page_ajax.html'

    @route(r'^add_question/$', name='add_question')
    def add_question(self, request):
        from experts.forms import NewQuestionForm

        if request.method != 'POST' or not request.user.is_authenticated:
            raise Http404
        form = NewQuestionForm(request.POST, user=request.user)
        context = self.get_context(request)

        if form.is_valid():
            answer = form.save(commit=False)
            self.add_child(instance=answer)
            return redirect(self.get_url() + '?success=true#form')

        context['form'] = form
        return render(request, self.template, context)

    def get_context(self, request, *args, **kwargs):
        from experts.forms import NewQuestionForm

        context = super(ExpertPage, self).get_context(request, *args, **kwargs)
        answers = AnswerPage.objects.live()
        answers = answers.filter(published_at__lte=timezone.now()).descendant_of(self).order_by('-published_at')
        context['form'] = NewQuestionForm(user=request.user)

        page = 1
        page = request.POST.get('page') or request.GET.get('page') or page
        if request.GET.get('q'):
            q = request.GET.get('q', '')
            answers = answers.search(q)
            context['q'] = q
        paginator = Paginator(answers, per_page=5)
        try:
            page_obj = paginator.page(page)
        except PageNotAnInteger:
            page_obj = paginator.page(1)
        except EmptyPage:
            page_obj = paginator.page(paginator.num_pages)
        context['answers'] = page_obj.object_list
        context['page_obj'] = page_obj

        if request.GET.get('success'):
            context['form_success'] = True

        return context

    def top_answers(self):
        return AnswerPage.objects.descendant_of(self)[:5]

    def serve(self, request, *args, **kwargs):
        page_models = (AnswerPage,)
        prefix = prefix_key(
            'expert_page',
            page_models,
            1,
            request.user_agent.is_mobile
        )
        return cache_page(60 * 60, key_prefix=prefix)(super(ExpertPage, self).serve)(request, *args, **kwargs)

    class Meta:
        verbose_name = "Страница эксперта"
        verbose_name_plural = "Страницы эксперта"


class AnswerPage(MobileTemplateMixin, RoutablePageMixin, Page):
    section = models.SmallIntegerField(
        verbose_name='Тема',
        db_index=True,
        default=SECTION_BEAUTY,
        choices=SECTION_CHOICES
    )

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name='Автор',
        related_name='questions',
        db_index=True,
        null=True,
        on_delete=models.SET_NULL,
        blank=True
    )
    question = models.TextField(
        max_length=1000,
        verbose_name='Вопрос',
    )
    answer = RichTextField(
        max_length=2000,
        verbose_name='Ответ',
        null=True,
        blank=True,
        # editor='tinymce',
    )
    old_id = models.IntegerField(
        null=True,
        blank=True
    )
    published_at = models.DateTimeField(
        verbose_name='Дата/время публикации',
        blank=True,
        null=True,
    )
    created_date = models.DateTimeField(
        default=timezone.now,
        verbose_name='Дата создания',
        db_index=True
    )

    parent_page_types = ['experts.ExpertPage']
    subpage_types = []

    search_fields = Page.search_fields + [
        index.SearchField('answer'),
        index.FilterField('published_at')
    ]

    content_panels = Page.content_panels + [
        FieldPanel('question'),
        FieldPanel('answer'),
        FieldPanel('created_date'),
    ]

    settings_panels = [
        FieldPanel('published_at')
    ]

    def get_context(self, request, *args, **kwargs):
        context = super(AnswerPage, self).get_context(request, *args, **kwargs)
        context['expert'] = self.get_parent().specific
        if not request.user_agent.is_mobile:
            context['experts'] = ExpertPage.objects.live().exclude(id=context['expert'].id)
        else:
            answers = AnswerPage.objects.live().filter(published_at__lte=timezone.now()).exclude(id=self.id)
            answers = answers.sibling_of(self).order_by('-published_at')
            paginator = Paginator(answers, per_page=5)
            page_obj = paginator.page(1)
            context['answers'] = page_obj.object_list
            context['page_obj'] = page_obj

        return context

    def all_comments(self):
        return self.comments.filter(parent_comment=None)

    def save(self, *args, **kwargs):
        if not self.published_at:
            self.published_at = timezone.now()
        self.section = self.get_parent().specific.section
        super(AnswerPage, self).save(*args, **kwargs)

    class Meta:
        verbose_name = "Вопрос"
        verbose_name_plural = "Вопросы"
