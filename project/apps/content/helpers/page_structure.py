from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.utils.functional import cached_property
from django.db.models import Q
from django.core.cache import cache

from wagtail.wagtailcore.models import Page, BaseViewRestriction

from .page_queryset import PageQuerySetHelper
from django.apps import apps


class PageStructureHelper:

    def __init__(self, body, is_mobile, key, parent_page=None, page=1):
        self.ExpertPage = apps.get_model(app_label='experts', model_name='ExpertPage')
        self.AnswerPage = apps.get_model(app_label='experts', model_name='AnswerPage')
        self.ArticleIndex = apps.get_model(app_label='content', model_name='ArticleIndex')
        self.ArticlePage = apps.get_model(app_label='content', model_name='ArticlePage')
        self.BlogPage = apps.get_model(app_label='content', model_name='BlogPage')
        self.NewsPage = apps.get_model(app_label='content', model_name='NewsPage')
        self.EventPage = apps.get_model(app_label='content', model_name='EventPage')


        self.body = body
        self.parent_page = parent_page
        self.exluded_ids = [0]
        self.page = self.__prepare_page(page)
        self.is_mobile = is_mobile
        self.key = key

        self.excluded_rubric = self.ArticleIndex.objects.filter(title='Promotion').first()
        if parent_page and parent_page.title == 'Promotion':
            self.excluded_rubric = None
        self.base_qs = self.get_qs(self.excluded_rubric)

        if parent_page:
            self.base_qs = self.base_qs.descendant_of(self.parent_page)
        else:
            self.page = 1

    def get_qs(self, excluded_rubric=None):
        types = (self.ArticlePage, self.BlogPage, self.NewsPage)
        r = PageQuerySetHelper(qs=Page.objects.all()).type(types).live()
        if self.parent_page and self.parent_page.title != 'Promotion':
            r = r.filter(
                show_in_promo=False
            )
        if excluded_rubric:
            r = r.exclude(rubric=excluded_rubric)
        return r.order('-published_at').queryset

    def __prepare_page(self, page):
        if type(page) is str and page.isdigit():
            return int(page)
        elif type(page) is int:
            return page
        return 1

    @cached_property
    def count_entries(self):
        return self.count_hold_entries() + self.count_free_entries()

    def count_hold_entries(self):
        count = 0
        for block in self.body:
            if block.block_type in ('special_field', 'mobile_banner', 'banner', 'load_more'):
                continue
            for i, key in enumerate(block.value):
                if not (key in ('headlines', 'expert',) or block.value[key]['page'] or
                        block.value[key]['tag'] or
                        block.value[key]['is_random']):
                    continue

                count += 1
        return count

    def count_free_entries(self):
        count = 0
        for block in self.body:
            if block.block_type in ('special_field', 'mobile_banner', 'banner', 'load_more'):
                continue
            for i, key in enumerate(block.value):
                if key in ('headlines', 'expert',) or block.value[key]['page'] or \
                        block.value[key]['tag'] or \
                        block.value[key]['is_random']:
                    continue

                count += 1
        return count

    @cached_property
    def held_entries(self):
        result = []
        for block in self.body:
            if block.block_type in ('special_field', 'mobile_banner', 'banner', 'load_more'):
                continue
            for i, key in enumerate(block.value):
                if key in ('headlines', 'expert',):
                    continue
                if block.value[key]['page']:
                    qs = block.value[key]['page']
                    if str(qs.content_type) == 'Рубрика':
                        qs = qs.get_children() \
                            .live() \
                            .exclude(pk__in=self.exluded_ids) \
                            .extra(
                            select={
                                'published_at': '''
                                        SELECT published_at
                                          FROM content_articlepage
                                          WHERE content_articlepage.page_ptr_id = wagtailcore_page.id 
                                        UNION SELECT published_at
                                          FROM content_blogpage
                                          WHERE content_blogpage.page_ptr_id = wagtailcore_page.id
                                    '''
                            }
                        ).order_by('-published_at').first()
                    if qs and qs.id not in self.exluded_ids:
                        qs = qs.specific
                        self.exluded_ids.append(qs.id)
                        result.append(qs)
                        continue
                    result.append(None)

                if block.value[key]['tag']:
                    tag = block.value[key]['tag']

                    qs = self.base_qs \
                        .filter(
                        Q(articlepage__tags__name=tag) |
                        Q(blogpage__tags__name=tag) |
                        Q(newspage__tags__name=tag)
                    ) \
                        .exclude(pk__in=self.exluded_ids) \
                        .extra(
                        select={
                            'published_at': '''
                                    SELECT published_at
                                      FROM content_articlepage
                                      WHERE content_articlepage.page_ptr_id = wagtailcore_page.id 
                                    UNION SELECT published_at
                                      FROM content_blogpage
                                      WHERE content_blogpage.page_ptr_id = wagtailcore_page.id
                                '''
                        }
                    ).order_by('-published_at') \
                        .first()

                    if qs:
                        qs = qs.specific
                        self.exluded_ids.append(qs.id)
                        result.append(qs)
                        continue
                    result.append(None)

                if block.value[key]['is_random']:
                    tag = 'Золотой фонд'

                    qs = self.base_qs \
                        .filter(
                        Q(articlepage__tags__name=tag) |
                        Q(blogpage__tags__name=tag) |
                        Q(newspage__tags__name=tag)
                    ) \
                        .exclude(pk__in=self.exluded_ids) \
                        .order_by('?') \
                        .first()

                    if qs:
                        qs = qs.specific
                        self.exluded_ids.append(qs.id)
                        result.append(qs)
                        continue
                    result.append(None)
        return result

    def get_page_obj(self):
        if self.parent_page is None:
            return None

        paginator = Paginator(self.base_qs, per_page=self.count_entries)
        try:
            result = paginator.page(self.page)
        except PageNotAnInteger:
            result = paginator.page(1)
        except EmptyPage:
            result = paginator.page(paginator.num_pages)
        return result

    def get_structure(self):

        result = list()
        offset = self.count_free_entries()
        held_entries = iter(self.held_entries)
        for block in self.body:
            group_content = [None] * (len(block.value) if block.value is not None else 1)
            if block.block_type in ('special_field', 'mobile_banner', 'banner', 'load_more'):
                if not self.is_mobile and block.block_type == 'special_field':
                    if len(result) == 0 or result[-1]['type'] != 'content':
                        result.append({'type': 'content', 'items': []})
                    result[-1]['items'].append(block.render_as_block())

                elif (self.is_mobile and block.block_type == 'mobile_banner')\
                        or (block.block_type == 'banner' and not self.is_mobile) \
                        or (block.block_type == 'load_more'):

                    result.append({'type': block.block_type, 'items': [block.render_as_block()]})
                continue
            for i, key in enumerate(block.value):
                if key == 'headlines':
                    group_content[i] = self.get_qs(self.excluded_rubric)[:5]
                    continue
                if key == 'expert':
                    expert = self.ExpertPage.objects.live().filter(section=block.value[key]['expert']).first()
                    if expert:
                        question = self.AnswerPage.objects.descendant_of(expert).first()
                        group_content[i] = {
                            'expert': expert,
                            'question': question
                        }
                    continue
                # не холдим записи в рубриках (временно)
                if self.page == 1 and self.parent_page is None:
                    if block.value[key]['page'] or block.value[key]['tag'] or block.value[key]['is_random']:
                        obj = next(held_entries)
                        if obj:
                            group_content[i] = obj
                        continue

                group_content[i] = self.base_qs.exclude(pk__in=self.exluded_ids)[(self.page - 1) * offset:].first()

                if group_content[i]:
                    group_content[i] = group_content[i].specific
                    self.exluded_ids.append(group_content[i].id)

            if len(result) == 0 or result[-1]['type'] != 'content':
                result.append({'type': 'content', 'items': []})
            result[-1]['items'].append(block.render_as_block(context={
                'content': group_content,
                'is_mobile': self.is_mobile,
                'parent_page': self.parent_page
            }))


        return result
