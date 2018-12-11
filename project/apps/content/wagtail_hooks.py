from wagtail.wagtailcore.models import Page
from wagtail.wagtailcore import hooks
from wagtail.wagtailadmin.rich_text import HalloPlugin
from django.utils.html import format_html, format_html_join
from django.conf import settings
from django.contrib.staticfiles.templatetags.staticfiles import static
from wagtail.wagtailcore.whitelist import attribute_rule
from .models import ArticlePage, NewsPage, BlogPage, EventPage
from wagtail.wagtailadmin import messages


@hooks.register('after_edit_page')
def after_edit_page(request, page):
    if type(page) not in (ArticlePage, NewsPage, BlogPage, EventPage):
        return

    if page.live and not page.preview_picture:
        page.unpublish()
        messages.error(request, "Снято с публикации. В статье отсутствует картинки-превью статьи")
        request_messages = request._messages

        for i in list(request_messages):
            if i.level_tag != 'success':
                request_messages.add(i.level, i.message, i.extra_tags)

    if type(page) != ArticlePage and type(page) != NewsPage:
        return
    parent = page.get_parent()
    if parent.id != page.rubric.id:
        destination = Page.objects.filter(pk=page.rubric.pk).first()
        page.move(destination, pos='last-child')

    
@hooks.register('after_create_page')
def after_create_page(request, page):
    if type(page) != ArticlePage and type(page) != NewsPage:
        return
    destination = Page.objects.filter(pk=page.rubric.pk).first()
    page.move(destination, pos='last-child')


@hooks.register('before_edit_page')
def before_edit_page(request, page_class):

    if page_class != ArticlePage and page_class != NewsPage:
        return
    # если так вышло, что родительская страница не соответствует
    # параметру rubric, то очищаем поле перед открытием страницы, 
    # чтобы пользователю пришлось выбрать снова рубрику страницы
    if page_class.get_parent().id != page_class.rubric.id:
        page_class.rubric = None


@hooks.register('insert_editor_css')
def editor_css():

    css_files = [
        'css/font-awesome.css',
        'content/css/editor.css',
    ]
    css_includes = format_html_join(
        '\n', '<link rel="stylesheet" href="{0}{1}">',
        ((settings.STATIC_URL, filename) for filename in css_files)
    )
    return css_includes


@hooks.register('insert_editor_js')
def editor_js():
    js_files = [
        'vendors/jquery/jquery.htmlClean.js',
        'content/js/custom-tag-it.js',
        'content/js/on_changed_rubric.js',
    ]
    js_includes = format_html_join('\n', '<script src="{0}{1}"></script>',
        ((settings.STATIC_URL, filename) for filename in js_files)
    )
    return js_includes
