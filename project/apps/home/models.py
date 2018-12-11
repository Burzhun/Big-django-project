from __future__ import absolute_import, unicode_literals

from django.db import models
from django.http import Http404, HttpResponse
from django.views.decorators.cache import cache_page
from django.core.cache import cache
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator

from wagtail.contrib.wagtailroutablepage.models import RoutablePageMixin, route
from wagtail.wagtailcore.models import Page
from wagtail.wagtailcore.fields import StreamField
from wagtail.wagtailadmin.edit_handlers import FieldPanel, StreamFieldPanel

from content.helpers import PageStructureHelper, prefix_key
from content.models import (
    MobileTemplateMixin, ArticlePage, BlogPage,
    NewsPage, EventPage, IssuePage
)
from content.fields import PageBodyStreamField
from experts.models import ExpertIndex, AnswerPage
from content.helpers import PageQuerySetHelper


class HomePage(MobileTemplateMixin, RoutablePageMixin, Page):
    body = StreamField(PageBodyStreamField(), blank=True, null=True)
    ajax_line_counter = models.SmallIntegerField(
        default=5,
        verbose_name='Количество подгружаемых линий',
    )

    content_panels = Page.content_panels + [
        FieldPanel('ajax_line_counter'),
        StreamFieldPanel('body'),
    ]

    ajax_template = 'home/home_page_ajax.html'
    key_prefix = 'home_page'

    @method_decorator(ensure_csrf_cookie)
    def serve(self, request, *args, **kwargs):
        page_models = (ArticlePage, NewsPage, BlogPage, EventPage, IssuePage, HomePage,)
        prefix = 'home_page'
        if request.method == 'POST':
            ids = request.POST.get('ids', '').replace(',', '').replace(' ', '')
            prefix += '_' + ids
        prefix = prefix_key(
            prefix,
            page_models,
            is_mobile=request.user_agent.is_mobile
        )
        # return super(HomePage, self).serve(request, *args, **kwargs)
        return cache_page(60 * 60, key_prefix=prefix)(super(HomePage, self).serve)(request, *args, **kwargs)

    def get_context(self, request, *args, **kwargs):
        context = super(HomePage, self).get_context(request, *args, **kwargs)
        if request.method == 'POST':
            try:
                ids = [int(i) for i in request.POST.get('ids', '1').split(',')]
                last_page = Page.objects.get(id=ids[-1]).specific
            except Page.DoesNotExist:
                raise Http404
            except ValueError:
                raise Http404

            types = (ArticlePage, NewsPage, BlogPage)
            count_page = self.ajax_line_counter*3
            qs = PageQuerySetHelper(Page.objects.all()).type(types).live().exclude(id__in=ids)
            qs = qs.filter(published_at__lt=last_page.published_at).order('-published_at').queryset[:count_page]
            context['entries'] = qs.specific()
            context['ids'] = [i.id for i in context['entries']]
            return context

        page = request.GET.get('page', 1)
        key_structure = self.key_prefix+'_structure'
        key_structure += '_mobile' if request.user_agent.is_mobile else ''

        page_structure = PageStructureHelper(self.body, request.user_agent.is_mobile, key_structure, page=page)
        if request.user_agent.is_mobile:
            if ExpertIndex.objects.live().exists():
                context['expert_page'] = ExpertIndex.objects.live().first()

                context['answers'] = AnswerPage.objects.live() \
                    .descendant_of(context['expert_page']) \
                    .order_by('section') \
                    .distinct('section')
        context['structure'] = page_structure.get_structure()
        context['ids'] = page_structure.exluded_ids
        return context


class StaticPage(Page):
    body = models.TextField(
        verbose_name='Тело страницы',
        blank=True,
        null=True
    )
    content_panels = Page.content_panels + [
        FieldPanel('body'),
    ]

    def get_context(self, request, *args, **kwargs):
        context = super(StaticPage, self).get_context(request, *args, **kwargs)
        if not self.body:
            raise Http404
        return context

    class Meta:
        verbose_name = 'Статическая страница'
        verbose_name_plural = 'Статические страницы'
