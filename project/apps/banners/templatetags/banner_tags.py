from django import template
from banners.models import Banner, ScriptItem
from django.utils.safestring import mark_safe
from django.db.models import Q
import random

register = template.Library()


@register.simple_tag
def load_banner(banner_id):
    if not banner_id:
        return ''
    try:
        banner = Banner.objects.live().get(banner_type__banner_id=banner_id)
    except Banner.DoesNotExist:
        return ''

    tag = '#RANDOM%i#'
    code = banner.code
    for i in range(1, 11):
        code = code.replace(tag % i, str(random.randint(10000, 99999)))

    return mark_safe(code)


@register.simple_tag
def head_desktop_scripts(page):
    scripts = ScriptItem.objects.filter(active=True, position=ScriptItem.POSITION_HEAD) \
        .filter(Q(platform=ScriptItem.PLATFORM_ALL) or Q(platform=ScriptItem.PLATFORM_DESKTOP)) \
        .order_by('weight')
    return prepare_scripts(scripts, page)


@register.simple_tag
def footer_desktop_scripts(page):
    scripts = ScriptItem.objects.filter(active=True, position=ScriptItem.POSITION_FOOTER) \
        .filter(Q(platform=ScriptItem.PLATFORM_ALL) or Q(platform=ScriptItem.PLATFORM_DESKTOP)) \
        .order_by('weight')
    return prepare_scripts(scripts, page)


@register.simple_tag
def head_mobile_scripts(page):
    scripts = ScriptItem.objects.filter(active=True, position=ScriptItem.POSITION_HEAD) \
        .filter(Q(platform=ScriptItem.PLATFORM_MOBILE) | Q(platform=ScriptItem.PLATFORM_ALL)) \
        .order_by('weight')
    return prepare_scripts(scripts, page)


@register.simple_tag
def footer_mobile_scripts(page):
    scripts = ScriptItem.objects.filter(active=True, position=ScriptItem.POSITION_FOOTER) \
        .filter(Q(platform=ScriptItem.PLATFORM_ALL) | Q(platform=ScriptItem.PLATFORM_MOBILE)) \
        .order_by('weight')
    return prepare_scripts(scripts, page)


@register.simple_tag
def article_before_content_scripts(page):
    scripts = ScriptItem.objects.filter(active=True, position=ScriptItem.POSITION_BEFORE_ARTICLE_CONTENT) \
        .filter(Q(platform=ScriptItem.PLATFORM_ALL) | Q(platform=ScriptItem.PLATFORM_DESKTOP)) \
        .order_by('weight')
    return prepare_scripts(scripts, page)


@register.simple_tag
def article_after_content_scripts(page):
    scripts = ScriptItem.objects.filter(active=True, position=ScriptItem.POSITION_AFTER_ARTICLE_CONTENT) \
        .filter(Q(platform=ScriptItem.PLATFORM_ALL) | Q(platform=ScriptItem.PLATFORM_DESKTOP)) \
        .order_by('weight')
    return prepare_scripts(scripts, page)


@register.simple_tag
def article_before_content_mobile_scripts(page):
    scripts = ScriptItem.objects.filter(active=True, position=ScriptItem.POSITION_BEFORE_ARTICLE_CONTENT) \
        .filter(Q(platform=ScriptItem.PLATFORM_ALL) | Q(platform=ScriptItem.PLATFORM_MOBILE)) \
        .order_by('weight')
    return prepare_scripts(scripts, page)


@register.simple_tag
def article_after_content_mobile_scripts(page):
    scripts = ScriptItem.objects.filter(active=True, position=ScriptItem.POSITION_AFTER_ARTICLE_CONTENT) \
        .filter(Q(platform=ScriptItem.PLATFORM_ALL) | Q(platform=ScriptItem.PLATFORM_MOBILE)) \
        .order_by('weight')
    return prepare_scripts(scripts, page)


def prepare_scripts(scripts, page):
    result = ''
    for item in scripts:
        if type(page) is not str:
            if item.exclude_from_promo \
                    and (hasattr(page, 'show_in_promo') and page.show_in_promo \
                         or (hasattr(page, 'rubric_title_as_promo') and page.rubric_title_as_promo)):
                continue
        pages = [item.page.specific for item in item.pages.all()]
        if item.rule == ScriptItem.RULE_ALL_PAGES:
            result += '\n' + item.script
        if item.rule == ScriptItem.RULE_EXCLUDE_PAGES:
            if page in pages:
                continue
            else:
                result += '\n' + item.script
        if item.rule == ScriptItem.RULE_IN_PAGES:
            if page in pages:
                result += '\n' + item.script
    return mark_safe(result)
