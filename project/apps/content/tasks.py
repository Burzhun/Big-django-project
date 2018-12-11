import logging
import hashlib
import os
import requests
from PIL import Image

from django.core.cache import cache
from django.apps import apps
from django.core.management import call_command
from django.conf import settings

from wagtail.wagtailcore.models import Page

from mhealth import celery_app
from mhealth.utils import ImageText

logger = logging.getLogger("django")


@celery_app.task
def prepare_gif(image_id, rendition_id, filter_spec):
    from content.models import CustomImage
    image = CustomImage.objects.get(id=image_id)
    image.get_rendition(filter_spec, allowed_gif=True, rendition_id=rendition_id)
    # Очень плохой костыль. После обработки каждой гифки, будет обновляться кеш всего сайта
    call_command('clear_cache')


@celery_app.task
def generate_preview_picture(article_id):
    # Генерация изображения с заголовком и рубрикой для OpenGraph по ID статьи
    try:
        page = Page.objects.get(id=article_id).specific
    except Page.DoesNotExist:
        return

    # Получаем хеш от заголовка и родительского элемента
    _hash = hashlib.md5(page.title.encode())
    if hasattr(page, 'rubric'):
        # Стати хранят родительский элемент в поле rubric (но можно получить и через get_parent())
        rubric = page.rubric.title
    elif hasattr(page, 'category'):
        # Блоги хранят в поле category информацию об авторе блога (title="Блог Ивана Иванова")
        rubric = page.category.title
    else:
        # Если вдруг таких полей нет
        rubric = page.get_parent().title
    _hash.update(rubric.encode())
    if hasattr(page, 'preview_picture') and page.preview_picture:
        _hash.update(str(page.preview_picture.id).encode())
    _hash = _hash.hexdigest()

    file_path = 'images/preview/{pre}/{filename}.png'.format(**{
        'pre': _hash[:2],
        'filename': _hash
    })

    # В BASE_DIR хранится путь до проекта с файлом manage.py
    full_file_path = os.path.join(settings.BASE_DIR, 'media', file_path)

    # # Нужно остановить работу, если файл существует так как название файла зависит от заголовка и рубрики
    try:
        if os.path.exists(full_file_path) and file_path in page.generated_og_preview_picture.url:
            return
    except ValueError:
        pass

    # Нужно создать директорию, Image.save() ее не создает автоматически :(
    os.makedirs(os.path.dirname(full_file_path), 0o755, exist_ok=True)

    if hasattr(page, 'preview_picture') or not page.preview_picture:
        # Получаем полный путь до шаблона изображения
        image = Image.open(os.path.join(settings.PROJECT_DIR, 'static/img/preview_blank.png'))

        # Картинка-превью, которая должна быть под шаблоном
        image_preview = Image.open(page.preview_picture.file.path)
        image_preview_size = list(image_preview.size)

        # размеры должны совпадать
        if image_preview_size[0] != image.size[0]:
            old_width = image_preview_size[0]
            image_preview_size[0] = image.size[0]
            image_preview_size[1] = int(image_preview_size[0] * image_preview_size[1] / old_width)
        if image_preview_size[1] < image.size[1]:
            old_height = image_preview_size[1]
            image_preview_size[1] = image.size[1]
            image_preview_size[0] = int(image_preview_size[1] * image_preview_size[0] / old_height)
        image_preview = image_preview.resize(image_preview_size).crop((0, 0) + image.size)

        # Подогнали по размерам, теперь нужно объединить
        image_preview.paste(image, (0, 0, image.size[0], image.size[1]), image)

        # И заменить на объединенную версию
        image = ImageText(image_preview)
    else:
        image = ImageText(os.path.join(settings.PROJECT_DIR, 'static/img/preview_blank.png'))

    # Заголовок
    title_font_path = os.path.join(settings.PROJECT_DIR,
                                   'static/fonts/mhrgrotesqueregular-webfont.ttf')  # полный путь до шрифта
    title_font_size_in_pt = 70  # размер шрифта в поинтах
    title_font_color_rgb_tuple = (255, 255, 255)  # цвет шрифта

    # Создаем копию изображения и вставляем заголовок, чтобы получить размеры заголовка в пикселях с учетом переносов
    # 54px - отступ слева, а 378px - середина не всего изображения,
    # а только той части, куда можно вставлять заголовок
    xy = [56, 0]
    _, title_height_px = image.write_text_box(xy, page.title, box_width=1114,
                                              font_filename=title_font_path,
                                              font_size=title_font_size_in_pt, color=title_font_color_rgb_tuple,
                                              fake=True)
    # Получаем y-координату: это середина изображения минус половина высоты текста.
    # Таким образом текст разместится по середине
    xy[1] = image.size[1] - title_height_px - 48  # 48px - нижний отступ

    # Вставляем в бланк заголовок статьи (page.title) с отступов слева 54px и сверху 298px
    # Добавляем нужный шрифт с размером и цветом
    image.write_text_box(xy, page.title, box_width=1114,
                         font_filename=title_font_path,
                         font_size=title_font_size_in_pt, color=title_font_color_rgb_tuple)

    # Рубрика
    rubric_font_path = os.path.join(settings.PROJECT_DIR,
                                    'static/fonts/mhrgrotesqueregular-webfont.ttf')  # полный путь до шрифта
    rubric_font_size_in_pt = 40  # размер шрифта в поинтах
    rubric_font_color_rgb_tuple = (230, 57, 23)  # цвет шрифта
    image.write_text_box((56, image.size[1] - title_height_px - 48 - 60), rubric.upper(), box_width=1114,
                         font_filename=rubric_font_path,
                         font_size=rubric_font_size_in_pt, color=rubric_font_color_rgb_tuple)

    # Сохраняем полученное изображение
    image.save(full_file_path)

    # присваиваем статье полученное изображение
    page.generated_og_preview_picture = file_path
    page.save()

    # Повторный скрапинг статьи
    # if page.live:
    #     requests.post(url='https://graph.facebook.com/v3.1/?scrape=true&id={id}&access_token={access_token}'.format(**{
    #         'id': page.get_full_url(),
    #         'access_token': settings.SOCIAL_AUTH_FACEBOOK_APP_ACCESS_TOKEN
    #     }))


@celery_app.task
def create_descendant_redirects(old_slug, new_slug, path, pk):
    from wagtail.wagtailcore.models import Page
    from wagtail.wagtailredirects.models import Redirect
    descendant_pages = Page.objects.filter(path__startswith=path).exclude(pk=pk)
    for page in descendant_pages:
        if page.live:
            redirect = Redirect(old_path=page.get_url().replace(new_slug, old_slug), redirect_page=page,
                                is_permanent=True)
            redirect.clean()
            if not Redirect.objects.filter(old_path=redirect.old_path).exists():
                redirect.save()


@celery_app.task
def home_clear_cache():
    from content.models import (
        ArticlePage, BlogPage, NewsPage, EventPage, IssuePage
    )
    from content.helpers import prefix_key, PageStructureHelper
    HomePage = apps.get_model(app_label='home', model_name='HomePage')
    page_models = (ArticlePage, NewsPage, BlogPage, EventPage, IssuePage, HomePage,)
    home_page = HomePage.objects.exclude(body=None).first()
    if not home_page:
        return
    for is_mobile in (True, False):
        key = prefix_key(
            'home_page',
            page_models,
            is_mobile=is_mobile
        )
        if cache.get('home_page_sign') != key:
            cache.delete_many(cache.keys('*home_page*'))

            key_structure = 'home_page_structure'
            if is_mobile:
                key_structure += '_mobile'
            ps = PageStructureHelper(home_page.body, is_mobile, key_structure)
            ps.get_structure()
            cache.set('home_page_sign', key, 60 * 60 * 7)
