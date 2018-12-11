from __future__ import absolute_import, unicode_literals

from django.conf.urls import include, url
from django.contrib.staticfiles.templatetags.staticfiles import static
from django.utils.html import format_html, format_html_join
from django.core import urlresolvers
from wagtail.wagtailadmin.templatetags.wagtailadmin_tags import hook_output

from wagtail.wagtailcore import hooks

from giphy import admin_urls


@hooks.register('register_admin_urls')
def register_admin_urls():
    return [
        url(r'^giphy/', include(admin_urls, namespace='giphy', app_name='giphy')),
    ]


@hooks.register('insert_editor_css')
def insert_editor_css():
    css_files = [
        'giphy/css/giphy_widget.css'
    ]
    css_includes = format_html_join(
        '\n',
        '<link rel="stylesheet" href="{0}">',
        ((static(filename),) for filename in css_files),
    )
    return css_includes + hook_output('insert_tinymce_css')


@hooks.register('insert_editor_js')
def editor_js():
    js_files = [
        static('giphy/js/giphy-chooser.js'),
    ]
    js_includes = format_html_join(
        '\n', '<script src="{0}"></script>',
        ((filename, ) for filename in js_files)
    )
    return js_includes + format_html(
        """
        <script>
            window.chooserUrls.giphyChooser = '{0}';
        </script>
        """,
        urlresolvers.reverse('giphy:chooser')
    )
