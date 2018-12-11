from django.conf.urls import url
from wagtailtinymce import views


urlpatterns = [
    url(r'^choose-external-link/$', views.external_link, name='wagtailtinymce_choose_page_external_link'),
]
