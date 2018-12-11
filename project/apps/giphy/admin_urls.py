from __future__ import absolute_import, unicode_literals

from django.conf.urls import url

from giphy import views

urlpatterns = [
    url(r'^chooser/$', views.chooser, name='chooser'),
    url(r'^gif-chosen/$', views.gif_chosen, name='gif_chosen'),
    # url(r'^chooser/upload/$', chooser.chooser_upload, name='chooser_upload'),
    # url(r'^chooser/(\d+)/select_format/$', chooser.chooser_select_format, name='chooser_select_format'),
]
