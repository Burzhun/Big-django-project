from django.conf.urls import include, url
from home import views

urlpatterns = [
    url(r'^iframe_page\.html', views.iframe_view),
    url(r'^google63e6e4540db3adc8\.html$', views.google_index_view),
    url(r'^yandex_4111d8aca73f15ad\.html$', views.yandex_verification),
    url(r'^robots\.txt$', views.robots_view),
    url(r'^ads\.txt$', views.ads_view),
    url(r'^rtb1\.html$', views.rtb_1),
    url(r'^rtb2\.html$', views.rtb_2)
]
