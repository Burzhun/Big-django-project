from django.conf.urls import include, url
from specials import views

urlpatterns = [
    url(r'^embeds/(?P<project_name>[0-9A-Za-z_-]+)/$', views.embed_view)
]
