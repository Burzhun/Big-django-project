import re
from django import template
from django.utils.safestring import mark_safe

from wagtail.wagtailcore.models import Page, BaseViewRestriction
from django.db.models import Q
from django.utils import timezone
from django.template.loader import render_to_string
from content.models import ArticlePage, NewsPage, BlogPage, OtherMenu, IssuePage, ArticleIndex
from itertools import chain
from content.helpers import get_breadcrumbs

register = template.Library()


@register.inclusion_tag('widgets/news.html', takes_context=True)
def news_widget(context):
    count = 5
    qs = []
    for PageModel in (ArticlePage, NewsPage, BlogPage):
        qs.append(
            PageModel.objects.live().exclude(
                view_restrictions__restriction_type__in=(
                    BaseViewRestriction.PASSWORD,
                    BaseViewRestriction.GROUPS,
                    BaseViewRestriction.LOGIN
                )
            ).filter(
                published_at__lte=timezone.now(),
                show_in_news=True
            ).order_by('-published_at')[:count]
        )

    news = list(
        sorted(
            chain(*qs),
            key=lambda x: x.published_at,
            reverse=True
        )
    )[:count]

    return {'news': news}


@register.inclusion_tag('widgets/side_promo.html', takes_context=True)
def promo_side_widget(context):
    count = 5

    widget = OtherMenu.objects.filter(type=OtherMenu.RUBRIC_PROMO).order_by('-id').first()
    widget_entries = widget.menu_items.all()[:count] if widget else []
    count -= len(widget_entries)
    promotion = ArticleIndex.objects.filter(title='Promotion').first()
    entries = ArticlePage.objects.live().filter(
        Q(show_in_promo_widget=True),
        Q(show_in_promo=True) | Q(rubric=promotion)
    ).order_by('-published_at')[:count]

    return {'entries': entries, 'widget_entries': widget_entries}


@register.inclusion_tag('widgets/rubric_promo.html', takes_context=True)
def promo_rubric_widget(context):
    count = 4

    widget = OtherMenu.objects.filter(type=OtherMenu.RUBRIC_PROMO).order_by('-id').first()
    widget_entries = widget.menu_items.all()[:count] if widget else []
    count -= len(widget_entries)
    promotion = ArticleIndex.objects.filter(title='Promotion').first()
    entries = ArticlePage.objects.live().filter(
        Q(show_in_promo_widget=True),
        Q(show_in_promo=True) | Q(rubric=promotion)
    ).order_by('-published_at')[:count]

    return {'entries': entries, 'widget_entries': widget_entries, 'is_mobile': context['request'].user_agent.is_mobile}


@register.inclusion_tag('widgets/subscribe_modal.html')
def subscribe_modal():
    return {}


@register.inclusion_tag('widgets/subscribe_widget.html')
def subscribe_widget():
    menu = OtherMenu.objects.filter(key='subscribe_widget').first()
    if menu:
        return {'items': menu.menu_items.all()}
    return {}


@register.filter(name='safe_text')
def safe_text(value):
    illegal_xml_re = re.compile(u'[\x00-\x08\x0b-\x1f\x7f-\x84\x86-\x9f\ud800-\udfff\ufdd0-\ufddf\ufffe-\uffff]')
    return illegal_xml_re.sub('', str(value))


@register.simple_tag(name="other_menu", takes_context=True)
def other_menu(context, menu_name, template_name):
    if not template_name:
        return ''
    if hasattr(OtherMenu, menu_name):
        menu_type = getattr(OtherMenu, menu_name)
    elif hasattr(OtherMenu, menu_name.upper()):
        menu_type = getattr(OtherMenu, menu_name.upper())
    try:
        menu = OtherMenu.objects.get(type=menu_type)
    except OtherMenu.DoesNotExist:
        return ''

    return render_to_string(template_name, {
        'items': menu.menu_items.all(),
        'is_mobile': context['request'].user_agent.is_mobile
    })


@register.simple_tag(name='breadcrumbs')
def breadcrumbs(page):
    breadcrumbs = get_breadcrumbs(page)
    result = ''
    for title, link in breadcrumbs:
        result += '<li><a href="%s">%s</a></li>' % (link, title)
    return mark_safe('<ol>%s</ol>' % result)


@register.inclusion_tag('widgets/paginator.html', name='paginator', takes_context=True)
def generate_pagination(context, paginator_obj):
    if paginator_obj.number <= 3:
        start_page = 2
        page_count = min(paginator_obj.paginator.num_pages, 7)
    elif paginator_obj.paginator.num_pages <= paginator_obj.number + 3:
        start_page = paginator_obj.paginator.num_pages - 5
        page_count = paginator_obj.paginator.num_pages
    else:
        start_page = paginator_obj.number - 2
        page_count = paginator_obj.number + 3
    context.update({
        'page_obj': paginator_obj,
        'page_range': [i for i in range(start_page, page_count)]
    })
    return context


@register.inclusion_tag('widgets/last_issue.html', name='last_issue')
def last_issue():
    return {
        'issue': IssuePage.objects.live().filter(published_at__lte=timezone.now()).order_by('-published_at').first()
    }


@register.simple_tag(takes_context=True)
def active_class_item(context, item):
    if item.active_class:
        return 'active'
    if 'page' not in context:
        return ''
    for children_item in item.link_page.get_children():
        if context['page'].id == children_item.id:
            return 'active'
    return ''
