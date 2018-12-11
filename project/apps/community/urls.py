from django.conf.urls import include, url
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    url(r'^registration/$', views.RegistrationView.as_view(), name='registration'),
    url(r'^login/', views.login_view, name='login'),
    url(r'^logout/', views.logout_view, name='logout'),
    url(
        r'^registration/done/$',
        auth_views.password_reset_done,
        {
            'template_name': 'registration/done.html',
        },
        name='registration-done'
    ),
    url(
        r'^registration/confirm/(?P<code>[0-9A-Za-z]{32})/$',
        views.email_confirm,
        name='registration-confirm'
    ),
    url(r'^base/$', views.base_profile_view, name='base-profile-page'),
    url(r'^user_bar/(?P<id>[0-9]+)/$', views.user_bar_view, name='user-bar-page'),
    url(r'^(?P<id>[0-9]+)/$', views.profile_view, name='profile'),
    url(r'^(?P<id>[0-9]+)/notify/$', views.profile_notify_view, name='profile-notify'),
    url(r'^avatar_update/$', views.upload_image_view, name='profile-avatar-update'),
    url(r'^forgot_password/$', auth_views.password_reset, name='password_reset'),
    url(r'^forgot_password/done/$', auth_views.password_reset_done, name='password_reset_done'),
    url(r'^forgot_password/reset/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        auth_views.password_reset_confirm, name='password_reset_confirm'),
    url(r'^forgot_password/reset/done/$', auth_views.password_reset_complete, name='password_reset_complete'),

]
