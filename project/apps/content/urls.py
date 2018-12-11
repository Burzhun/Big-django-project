from django.conf.urls import include, url
from django.db.utils import ProgrammingError
from django.views.generic import RedirectView

from .feeds import yandex_dzen_feed, yandex_feed, kiozk_feed, anews_feed, mailru_feed
from content import views
from content.models import ArticleIndex

try:
    rubrics = "|".join([item.slug for item in ArticleIndex.objects.filter()])
except ProgrammingError:
    rubrics = 'sex|form|health|diet|life|technics'
old_news_rubrics = 'fitnessnews|sexnews|healthnews|dietnews|lifenews|fashionnews|news'

urlpatterns = [
    url(r'^subscription/$', views.subscription_view, name='subscription-page'),
    url(r'^subscribe/$', views.subscribe_email),
    url(r'^get_revisions/$', views.get_revision_log),
    url(r'^rss/news_yandex_ru\.xml$', yandex_feed),
    url(r'^rss/anews-news\.xml$', anews_feed),
    url(r'^rss/news_mail_ru\.xml$', mailru_feed),
    url(r'^rss/kiozk\.xml$', kiozk_feed),
    url(r'^rss/news_yandex_dzen_ru\.xml$', yandex_dzen_feed),
    url(r'^events/(?P<old_id>[0-9]+)/$', views.events_redirect_view),
    url(r'^blog_redakcii/$', views.blog_redirect_view),
    url(r'^(?P<rubric>(%s))/(?P<sub_rubric>(%s))/(?P<slug>[0-9A-Za-z_\-]+)/$' % (rubrics, old_news_rubrics), views.news_redirect_view),
    url(r'^(?P<rubric>(%s))/(?P<sub_rubric>[0-9A-Za-z_\-]+/)/(?P<old_id>[0-9]+)(\.php)?/$' % rubrics, views.redirect_view),
    url(r'[0-9A-Za-z_\-/]+\.php', views.php_redirect),
    url(r'^magazine/archive/journal/(?P<slug>[0-9A-Za-z_\-]+)/$', views.issue_redirect_view),

]
