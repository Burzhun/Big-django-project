from django.contrib.syndication.views import Feed
from content.models import ArticlePage, BlogPage, NewsPage
from wagtail.wagtailcore.models import Page, BaseViewRestriction

from django.shortcuts import render
from datetime import datetime
from django.utils import timezone
from itertools import chain
from django.utils import translation


def yandex_dzen_feed(request):
    translation.activate('en')
    proto = "https" if request.is_secure() else "http"
    host = "%s://%s" % (proto, request.get_host())

    title = "Новое на mhealth.ru"
    link = "/"
    description = "Новости www.mhealth.ru"
    count = 50
    qs = []
    for PageModel in (ArticlePage, BlogPage, NewsPage):
        _qs = PageModel.objects.live().filter(
            published_at__lte=timezone.now(),
            show_in_promo=False,
            exclude_from_dzen_feed=False
        )
        if PageModel in (ArticlePage, NewsPage):
            _qs = _qs.exclude(
                rubric__title='Promotion'
            )

        _qs = _qs.exclude(
            view_restrictions__restriction_type__in=(
                BaseViewRestriction.PASSWORD,
                BaseViewRestriction.GROUPS,
                BaseViewRestriction.LOGIN
            )
        ).order_by('-published_at')[:count]
        qs.append(_qs)

    articles = list(
        sorted(
            chain(*qs),
            key=lambda x: x.published_at,
            reverse=True
        )
    )[:count]

    cache_key = 'yandex_dzen_entries'
    cache_live_time = 15 * 60

    return render(request, "content/rss/news_yandex_dzen_ru.html", {
        "title": title,
        "link": link,
        "description": description,
        "host": host,
        "articles": articles
    }, content_type="text/xml")


def yandex_feed(request):
    translation.activate('en')
    proto = "https" if request.is_secure() else "http"
    host = "%s://%s" % (proto, request.get_host())

    title = "Новое на mhealth.ru"
    link = "/"
    description = "Новости www.mhealth.ru"
    count = 50
    qs = []
    for PageModel in (ArticlePage, BlogPage, NewsPage):
        qs.append(
            PageModel.objects.live().filter(
                published_at__lte=timezone.now(),
                show_in_promo=False
            ).exclude(
                view_restrictions__restriction_type__in=(
                    BaseViewRestriction.PASSWORD,
                    BaseViewRestriction.GROUPS,
                    BaseViewRestriction.LOGIN
                )
            ).order_by('-published_at')[:count]
        )

    articles = list(
        sorted(
            chain(*qs),
            key=lambda x: x.published_at,
            reverse=True
        )
    )[:count]

    cache_key = 'yandex_entries'
    cache_live_time = 15 * 60

    return render(request, "content/rss/news_yandex_ru.html", {
        "title": title,
        "link": link,
        "description": description,
        "host": host,
        "articles": articles
    }, content_type="text/xml")


def kiozk_feed(request):
    translation.activate('en')
    proto = "https" if request.is_secure() else "http"
    host = "%s://%s" % (proto, request.get_host())

    title = "Новое на mhealth.ru"
    link = "/"
    description = "Статьи и новости www.mhealth.ru"
    count = 50
    qs = []
    for PageModel in (ArticlePage, BlogPage, NewsPage):
        qs.append(
            PageModel.objects.live().filter(
                published_at__lte=timezone.now(),
                show_in_promo=False
            ).exclude(
                view_restrictions__restriction_type__in=(
                    BaseViewRestriction.PASSWORD,
                    BaseViewRestriction.GROUPS,
                    BaseViewRestriction.LOGIN
                )
            ).order_by('-published_at')[:count]
        )

    articles = list(
        sorted(
            chain(*qs),
            key=lambda x: x.published_at,
            reverse=True
        )
    )[:count]

    cache_key = 'kiozk_entries'
    cache_live_time = 15 * 60

    return render(request, "content/rss/kiozk_rss.html", {
        "title": title,
        "link": link,
        "description": description,
        "host": host,
        "articles": articles
    }, content_type="text/xml")


def anews_feed(request):
    translation.activate('en')
    proto = "https" if request.is_secure() else "http"
    host = "%s://%s" % (proto, request.get_host())

    title = "Новое на mhealth.ru"
    link = "/"
    description = "Новости www.mhealth.ru"
    count = 50
    qs = []
    for PageModel in (ArticlePage, BlogPage, NewsPage):
        qs.append(
            PageModel.objects.live().filter(
                published_at__lte=timezone.now(),
                show_in_promo=False
            ).exclude(
                view_restrictions__restriction_type__in=(
                    BaseViewRestriction.PASSWORD,
                    BaseViewRestriction.GROUPS,
                    BaseViewRestriction.LOGIN
                )
            ).order_by('-published_at')[:count]
        )

    articles = list(
        sorted(
            chain(*qs),
            key=lambda x: x.published_at,
            reverse=True
        )
    )[:count]

    cache_key = 'anews_entries'
    cache_live_time = 15 * 60

    return render(request, "content/rss/anews_rss.html", {
        "title": title,
        "link": link,
        "description": description,
        "host": host,
        "articles": articles
    }, content_type="text/xml")


def mailru_feed(request):
    translation.activate('en')
    proto = "https" if request.is_secure() else "http"
    host = "%s://%s" % (proto, request.get_host())

    title = "Men's Health"
    link = "/"
    description = "Новости Men's Health"
    count = 50
    qs = []
    for PageModel in (ArticlePage, BlogPage):
        _qs = PageModel.objects.live().filter(
            published_at__lte=timezone.now(),
            show_in_promo=False,
            has_adult_content=False,
        ).exclude(
            view_restrictions__restriction_type__in=(
                BaseViewRestriction.PASSWORD,
                BaseViewRestriction.GROUPS,
                BaseViewRestriction.LOGIN
            )
        )
        if PageModel is ArticlePage:
            _qs = _qs.exclude(rubric__title__in=['Секс', "Девушки Men's Health"])
        qs.append(_qs.order_by('-published_at')[:count])

    articles = list(
        sorted(
            chain(*qs),
            key=lambda x: x.published_at,
            reverse=True
        )
    )[:count]

    cache_key = 'mailru_entries'
    cache_live_time = 15 * 60

    return render(request, "content/rss/news_mail_ru.html", {
        "title": title,
        "link": link,
        "description": description,
        "host": host,
        "articles": articles
    }, content_type="text/xml")
