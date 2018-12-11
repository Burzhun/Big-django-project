import json
import shutil
from random import randrange
from uuid import uuid4
from datetime import date
import logging
import os

from django.core.exceptions import ValidationError
from django.db import models, transaction
from django.db.models.functions import ExtractYear
from django.http import Http404, JsonResponse
from django.template.response import TemplateResponse
from django.utils import timezone
from django.utils.functional import cached_property
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import cache_page
from django.utils.translation import ugettext_lazy as _, ugettext_lazy
from django.template.loader import render_to_string
from django.utils.six import BytesIO, string_types
from django.core.files import File
from django.conf import settings
from django.core.cache import cache

from wagtail.wagtailcore.models import Page, BaseViewRestriction, Orderable, Site
from wagtail.wagtailcore.fields import RichTextField, StreamField
from wagtail.wagtailcore.url_routing import RouteResult
from wagtail.wagtailimages.edit_handlers import ImageChooserPanel
from wagtail.wagtailsearch import index
from wagtail.wagtailimages.models import Image, AbstractImage, AbstractRendition, Filter
from wagtail.wagtailredirects.models import Redirect
from wagtail.contrib.wagtailroutablepage.models import RoutablePageMixin, route
from wagtail.wagtailadmin.edit_handlers import (
    FieldPanel, MultiFieldPanel, StreamFieldPanel,
    InlinePanel, PageChooserPanel
)

from modelcluster.models import ClusterableModel
from modelcluster.fields import ParentalKey, ParentalManyToManyField
from modelcluster.contrib.taggit import ClusterTaggableManager
from colorfield.fields import ColorField
from taggit.models import TaggedItemBase, Tag

from community.models import Comment
from content.helpers import prefix_key, PageStructureHelper, PageQuerySetHelper
from content.fields import PageBodyStreamField, ContentStreamField
from content.tasks import prepare_gif, create_descendant_redirects, generate_preview_picture
from content.widgets import SpecialTagGroupWidget, SpecialTagRubricsWidget, SpecialTagWidget

logger = logging.getLogger("django")


def get_upload_to(folder_name, filename):
    if folder_name is None:
        folder_name = 'original_images'
    ext = filename.split('.')[-1]
    filename = "%s.%s" % (str(uuid4()).replace('-', ''), ext)
    today = date.today()
    full_path = os.path.join(folder_name, '{y}/{m}/{d}/{filename}'.format(**{
        'y': today.year,
        'm': today.month,
        'd': today.day,
        'filename': filename
    }))

    return full_path


class SpecialTagManager(models.Manager):
    def related_tags(self):
        return self.filter(articles__isnull=False).distinct('id')


class SpecialTag(models.Model):
    title = models.CharField(verbose_name=_('Name'), max_length=100)
    group = ParentalKey(
        'content.SpecialTagGroup',
        verbose_name='Группа',
        on_delete=models.CASCADE,
        related_name='tags'
    )
    objects = SpecialTagManager()

    panels = [
        FieldPanel('title'),
    ]

    def __str__(self):
        return '%s - %s' % (self.group.name, self.title)

    class Meta:
        verbose_name = 'Тег'
        verbose_name_plural = 'Теги'


class SpecialTagGroup(ClusterableModel):
    name = models.CharField(
        verbose_name='Название группы',
        max_length=250
    )

    panels = [
        FieldPanel('name', classname='full'),
        InlinePanel('tags', label='Теги', min_num=1)
    ]

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Группа тегов'
        verbose_name_plural = 'Группы тегов'


class SpecialTagFilter(ClusterableModel):
    updated_at = models.DateTimeField(
        auto_now=True
    )
    title = models.CharField(
        verbose_name='Заголовок фильтра',
        default='Поиск по статьям',
        max_length=250
    )
    description = models.CharField(
        verbose_name='Описание',
        max_length=250,
        null=True,
        blank=True
    )
    rubric = models.OneToOneField(
        'content.ArticleIndex',
        verbose_name='Рубрика',
        related_name='special_tag_filter',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        unique=True,
        limit_choices_to={'depth': 3}  # Решили использовать только родительские рубрики
    )
    group_default_title = models.CharField(
        verbose_name='Заголовок группы тегов',
        default="Выберите группу",
        max_length=250
    )
    tag_default_title = models.CharField(
        verbose_name='Заголовок тегов',
        default="Выберите тег",
        max_length=250
    )
    groups = models.ManyToManyField(
        'content.SpecialTagGroup',
        verbose_name='Группы тегов',
        blank=True,
        related_name='filters'
    )

    panels = [
        FieldPanel('title'),
        FieldPanel('description'),
        FieldPanel('rubric'),
        FieldPanel('group_default_title'),
        FieldPanel('tag_default_title'),
        FieldPanel('groups', widget=SpecialTagGroupWidget),
    ]

    def save(self, *args, **kwargs):
        r = super(SpecialTagFilter, self).save(*args, **kwargs)
        try:
            cache.delete_pattern('*article_index*')
        except AttributeError:  # 'DummyCache' object has no attribute 'delete_pattern'
            pass
        return r

    def __str__(self):
        return self.rubric.title

    class Meta:
        verbose_name = 'Фильтр'
        verbose_name_plural = 'Фильтры'


class CustomImage(AbstractImage):
    """
    Модель изображений (JPEG, PNG, GIF).

    Наследуется от абстрактного класса AbstractImage модуля wagtailimages.
    Применяется во всех моделях, где имеются картинки, кроме аватарки пользователя.
    """

    admin_form_fields = Image.admin_form_fields + (
        # Then add the field names here to make them appear in the form:
        # 'caption',
    )

    def get_rendition(self, filter, allowed_gif=False, rendition_id=None):
        """
        Изменение картинки по заданному фильтру.

        Изменение сохраняется в базе данных (модель CustomRendition)
        и повторно (важно!) не создаются, если удалить файл.
        Так как гифки кропаются долго и нагружают сервер,
        вызываетя таск prepare_gif (content/tasks.py) во время выполнения функции
        и возвращает первый кадр в виде PNG.
        По завершении таска, в модели представления (CustomRendition) заменяется путь до файла с гифкой.
        """
        if isinstance(filter, string_types):
            filter = CustomFilter(spec=filter)
        else:
            filter = CustomFilter(spec=filter.spec)
        cache_key = filter.get_cache_key(self)
        Rendition = self.get_rendition_model()
        if allowed_gif and rendition_id:
            cache_key = None
        try:

            rendition = self.renditions.get(
                filter_spec=filter.spec,
                focal_point_key=cache_key,
            )
        except Rendition.DoesNotExist:
            cache_key = filter.get_cache_key(self)

            # Generate the rendition image
            generated_image = filter.run(self, BytesIO(), allowed_gif)

            # Generate filename
            input_filename = os.path.basename(self.file.name)
            input_filename_without_extension, input_extension = os.path.splitext(input_filename)

            # A mapping of image formats to extensions
            FORMAT_EXTENSIONS = {
                'jpeg': '.jpg',
                'png': '.png',
                'gif': '.gif',
            }

            output_extension = filter.spec.replace('|', '.') + FORMAT_EXTENSIONS[generated_image.format_name]
            if cache_key:
                output_extension = cache_key + '.' + output_extension

            # Truncate filename to prevent it going over 60 chars
            output_filename_without_extension = input_filename_without_extension[:(59 - len(output_extension))]
            output_filename = output_filename_without_extension + '.' + output_extension

            # Обновляем существующее представление, если передан ID
            if rendition_id:
                try:
                    rendition = Rendition.objects.get(id=rendition_id)
                    rendition.focal_point_key = cache_key
                    rendition.file = File(generated_image.f, name=output_filename)
                    rendition.save()
                except Rendition.DoesNotExist:
                    pass
            else:
                rendition, created = self.renditions.get_or_create(
                    filter_spec=filter.spec,
                    focal_point_key=cache_key,
                    defaults={'file': File(generated_image.f, name=output_filename)}
                )
                # Откалываем кроп гифки в селери
                if input_extension == '.gif' and FORMAT_EXTENSIONS[generated_image.format_name] != input_extension:
                    prepare_gif.delay(self.id, rendition.id, filter.spec)

        return rendition

    def get_upload_to(self, filename):
        """
        Возвращает функцию сохранения файла.

        Исходя из даты создания, файлы раскладываютя по соответствующим директориям.
        Пример:
            /original_images/2018/02/12/910de24699a8491194825f7a8a6496d0.jpg
        """

        return get_upload_to('original_images', filename)


class CustomFilter(Filter):
    """
    Класс для модификации изображений.

    Переодпределен дефолтный класс wagtail из-за необходимости
    откладывать кроп гифки в отдельный таск и возвращать только png
    """

    @staticmethod
    def get_default_image():
        # Пока обрабатывается гифка, нужно вернуть какое-то изображение.
        # В папке static/img лежит уже готовое изображение load.png.
        # Нужно его скопировать в папку media, если оно не было еще создано.
        image, created = CustomImage.objects.get_or_create(
            file='load.png',
            title='Load',
            width='1024',
            height='768'
        )
        if not created:
            image_path = os.path.join(settings.PROJECT_DIR, 'static/img/load.png')
            shutil.copy2(image_path, '/app/media/')
        return image

    def run(self, image, output, allowed_gif=False):
        with image.get_willow_image() as willow:
            original_format = willow.format_name
            if original_format == 'gif' and not allowed_gif:
                image = CustomFilter.get_default_image()
                return self.run(image, output, allowed_gif)

            # Fix orientation of image
            willow = willow.auto_orient()

            env = {
                'original-format': original_format,
            }
            for operation in self.operations:
                willow = operation.run(willow, image, env) or willow

            # Find the output format to use
            if 'output-format' in env:
                # Developer specified an output format
                output_format = env['output-format']
            else:
                # Default to outputting in original format
                output_format = original_format

                # Convert BMP files to PNG
                if original_format == 'bmp':
                    output_format = 'png'

                # Если фильтр вызывается не из таска селери, нужно вернуть пнг-файл из гифки
                if original_format == 'gif' and not (willow.has_animation() and allowed_gif):
                    output_format = 'png'

            if output_format == 'jpeg':
                # Allow changing of JPEG compression quality
                if 'jpeg-quality' in env:
                    quality = env['jpeg-quality']
                elif hasattr(settings, 'WAGTAILIMAGES_JPEG_QUALITY'):
                    quality = settings.WAGTAILIMAGES_JPEG_QUALITY
                else:
                    quality = 85

                return willow.save_as_jpeg(output, quality=quality, progressive=True, optimize=True)
            elif output_format == 'png':
                return willow.save_as_png(output)
            elif output_format == 'gif':
                return willow.save_as_gif(output)


class CustomRendition(AbstractRendition):
    """
    Класс представления.

    Хранит связь картинки-оригинала и его представления.
    Важное свойство: не проверяет существование файла после создания представления
    из-за чего на сайте могут быть битые ссылки.
    """
    image = models.ForeignKey(CustomImage, related_name='renditions', on_delete=models.CASCADE)

    def get_upload_to(self, filename):
        """
        Измененные картинки хранятся в папке images, но имеют название оригинального файла с префиксом фильтра
        """
        folder_name = 'images'
        filename = self.file.field.storage.get_valid_name(filename)

        today = self.image.created_at
        return os.path.join(folder_name, '{y}/{m}/{d}/{filename}'.format(**{
            'y': today.year,
            'm': today.month,
            'd': today.day,
            'filename': filename
        }))

    class Meta:
        unique_together = (
            ('image', 'filter_spec', 'focal_point_key'),
        )


@classmethod
def model_field_exists(cls, field):
    try:
        cls._meta.get_field(field)
        return True
    except models.FieldDoesNotExist:
        return False


models.Model.field_exists = model_field_exists


class MobileTemplateMixin:

    def get_template(self, request, *args, **kwargs):
        if request.is_ajax():
            return self.ajax_template or self.template
        elif request.user_agent.is_mobile:
            parts = self.template.split('/')
            parts.insert(1, 'mobile')
            return '/'.join(parts)
        else:
            return self.template


class CommentsPageMixin:

    @route(r'comments/$')
    def comments(self, request):
        if not request.method == 'POST':
            raise Http404
        if not getattr(self, 'allowed_comments', False):
            return HttpResponse('')

        return render(request, 'content/comments_ajax.html', {'self': self, 'page': self})

    @login_required
    @route(r'add_comment/$')
    def new_comment(self, request):
        if not (request.method == 'POST' and request.user.is_authenticated):
            raise Http404

        text = request.POST.get('text')
        parent_comment = int(request.POST.get('parent', 0))
        if not text:
            raise Http404  # TODO
        if parent_comment:
            try:
                parent_comment = Comment.objects.get(id=parent_comment)
            except Comment.DoesNotExist:
                parent_comment = None

        comment = Comment(author=request.user, text=text)

        if parent_comment:
            comment.parent_comment = parent_comment

        comment.save()
        self.comments.add(comment)
        return redirect(self.get_url() + '#comment_' + str(comment.id))

    @login_required
    @route(r'delete_comment/$')
    def delete_comment(self, request):
        if not (request.is_ajax() and request.user.is_authenticated):
            raise Http404

        comment_id = int(request.POST.get('comment_id', 0))
        try:
            comment = self.comments.get(id=comment_id)
            if comment.check_permission(request.user):
                comment.delete()
            else:
                return HttpResponse('error', code=403)
        except Comment.DoesNotExist:
            raise Http404

        return HttpResponse('ok')

    def all_comments(self):
        return self.comments.filter(parent_comment=None).order_by('created_date')


class ItemMenu(models.Model):
    page = models.ForeignKey(
        Page,
        verbose_name='Страница',
        blank=True,
        null=True,
        on_delete=models.SET_NULL
    )

    _title = models.CharField(
        verbose_name='Заголовок',
        max_length=255,
        db_column='title',
        blank=True,
        null=True
    )

    _icon = models.ForeignKey(
        'content.CustomImage',
        on_delete=models.PROTECT,
        related_name='+',
        verbose_name="Иконка",
        db_column='icon',
        blank=True,
        null=True
    )
    _link = models.URLField(
        verbose_name='Гиперссылка',
        blank=True,
        null=True,
        db_column='link'
    )
    _description = models.TextField(
        verbose_name='Описание',
        max_length=255,
        db_column='description',
        blank=True,
        null=True
    )

    panels = [
        PageChooserPanel('page'),
        FieldPanel('_title'),
        ImageChooserPanel('_icon'),
        FieldPanel('_link')
    ]

    @cached_property
    def title(self):
        if self._title:
            return self._title
        elif self.page:
            return self.page.title

    @cached_property
    def link(self):
        if self._link:
            return self._link
        elif self.page:
            return self.page.get_url
        else:
            return

    @cached_property
    def icon(self):
        if self._icon:
            return self._icon
        elif self.page:
            page = self.page.specific
            return page.preview_picture if hasattr(page, 'preview_picture') else ''

    @cached_property
    def description(self):
        if self._description:
            return self._description
        elif self.page:
            return self.page.specific.short_lead

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Элемент'
        verbose_name_plural = 'Элементы'


class OtherMenuItems(Orderable, ItemMenu):
    menu = ParentalKey('content.OtherMenu', related_name='menu_items')


class OtherMenu(ClusterableModel):
    SIDE_MENU = 0
    TOP_NEWS = 1
    RUBRIC_PROMO = 2

    MENU_CHOICES = (
        (SIDE_MENU, 'Главное боковое меню'),
        (TOP_NEWS, 'Верхняя панель на главной'),
        (RUBRIC_PROMO, 'Закрепленные материалы в промо рубрик'),
    )
    name = models.CharField(
        verbose_name='Название',
        max_length=200
    )
    type = models.SmallIntegerField(
        verbose_name='Тип меню',
        unique=True,
        db_index=True,
        choices=MENU_CHOICES
    )

    panels = [
        FieldPanel('name'),
        FieldPanel('type'),
        InlinePanel('menu_items', label='Элементы меню', min_num=1)
    ]

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Меню'
        verbose_name_plural = 'Меню'


class Author(models.Model):
    first_name = models.CharField(
        'Имя',
        max_length=150
    )
    last_name = models.CharField(
        'Фамилия',
        max_length=150
    )
    photo = models.ForeignKey(
        'content.CustomImage',
        on_delete=models.PROTECT,
        related_name='+',
        verbose_name="Фото",
        null=True,
        blank=True
    )
    panels = [
        FieldPanel('first_name'),
        FieldPanel('last_name'),
        ImageChooserPanel('photo')
    ]

    def __str__(self):
        return self.first_name + ' ' + self.last_name

    class Meta:
        verbose_name = 'Автор'
        verbose_name_plural = 'Авторы'


class BaseContentPage(MobileTemplateMixin, CommentsPageMixin, RoutablePageMixin, Page):
    full_title = models.CharField(
        verbose_name='Полный заголовок',
        max_length=150,
        null=True,
        blank=True,
        help_text='До 150 символов'
    )
    subtitle = models.CharField(
        max_length=60,
        verbose_name='Подзаголовок',
        null=True,
        blank=True,
        help_text='До 60 символов'
    )

    short_lead = models.TextField(
        max_length=300,
        verbose_name="Короткий лид",
        help_text='До 160 символов'
    )

    full_lead = models.TextField(
        max_length=500,
        verbose_name="Полный лид",
        null=True,
        blank=True,
        help_text='До 500 символов'
    )

    preview_picture = models.ForeignKey(
        'content.CustomImage',
        on_delete=models.SET_NULL,
        related_name='+',
        verbose_name="Основная иллюстрация",
        blank=True,
        null=True
    )
    generate_og_preview_picture = models.BooleanField(
        verbose_name='Использовать сгенерированную картинку-превью для OpenGraph',
        default=False
    )
    generated_og_preview_picture = models.ImageField(
        null=True,
        blank=True
    )

    count_view = models.PositiveIntegerField(default=0)

    allowed_comments = models.BooleanField(
        default=True,
        verbose_name='Включить комментарии'
    )

    body = StreamField(ContentStreamField())

    show_in_news = models.BooleanField(
        verbose_name='Отображать в новостях',
        default=False
    )
    show_in_promo = models.BooleanField(
        verbose_name='Отображать в рубрике promotion',
        default=False,
        help_text='Действует если статья не имеет рубрику promotion, но ее нужно добавить в этот раздел'
    )
    show_in_promo_widget = models.BooleanField(
        verbose_name='Отображать в виджете promotion',
        default=True,
        help_text='Действует если статья имеет рубрику promotion или галочку "Отображать в рубрике promotion"'
    )

    old_id = models.IntegerField(
        null=True,
        blank=True
    )

    published_at = models.DateTimeField(
        verbose_name='Дата/время публикации',
        default=timezone.now,
        blank=True,
        null=True,
    )
    # Влияет на вывод статей в некоторых фидах (feeds.py), в которых недопустим контент 18+
    has_adult_content = models.BooleanField(
        verbose_name='Содержит контент 18+',
        default=False
    )
    exclude_from_dzen_feed = models.BooleanField(
        verbose_name='Исключить материал из Яндекс.Дзен',
        default=False
    )

    # индексируемые поля для поиска
    search_fields = Page.search_fields + [
        index.SearchField('body'),
        index.FilterField('full_lead'),
        index.FilterField('short_lead'),
        index.FilterField('full_title')
    ]

    content_panels = Page.content_panels + [
        FieldPanel('full_title', classname='full title'),
        FieldPanel('subtitle', classname="full title"),
        FieldPanel('short_lead'),
        FieldPanel('full_lead'),
        ImageChooserPanel('preview_picture'),
        FieldPanel('has_adult_content'),
        StreamFieldPanel('body'),
    ]

    promote_panels = [
        MultiFieldPanel([
            FieldPanel('slug'),
            FieldPanel('seo_title'),
            FieldPanel('show_in_menus'),
            FieldPanel('search_description'),
            FieldPanel('generate_og_preview_picture')
        ], ugettext_lazy('Common page configuration')),
    ]

    settings_panels = [
        FieldPanel('published_at'),
        MultiFieldPanel([
            # FieldPanel('allowed_comments'),
            FieldPanel('show_in_news'),
            FieldPanel('exclude_from_dzen_feed'),
            FieldPanel('show_in_promo'),
            FieldPanel('show_in_promo_widget')
        ], heading='Настройки')
    ]

    @route(r'poll/$', name='poll')
    def poll(self, request):
        question_id = request.POST.get('question_id')
        sequence_number = request.POST.get('sequence_number')
        if not (sequence_number and sequence_number.isdigit()) or request.user_agent.is_bot:
            raise Http404

        sequence_number = int(sequence_number)
        stream_data = self.body.stream_data
        result = None
        for i, block in enumerate(stream_data):
            if i == sequence_number and block['type'] == 'poll':
                if question_id and block['value'].get(question_id):
                    stream_data[i]['value'][question_id]['counter'] += 1
                result = stream_data[i]['value']
                result['all_counter'] = sum([
                    value.get('counter', 0)
                    for key, value in stream_data[i]['value'].items()
                    if type(value) is not str
                ])
                break
        self.body = json.dumps(stream_data)
        self.save()
        if result:
            return JsonResponse(result)
        else:
            raise Http404

    @transaction.atomic
    def save(self, *args, **kwargs):
        is_new = self.id is None
        if self.live and not is_new:
            old_record = Page.objects.get(id=self.id)
            old_url = old_record.get_url()
            if old_record.slug != self.slug and not Redirect.objects.filter(old_path=old_url).exists():
                redirect = Redirect(old_path=old_url, redirect_page=old_record, is_permanent=True)
                redirect.clean()
                if not Redirect.objects.filter(old_path=redirect.old_path).exists():
                    redirect.save()
        super().save(*args, **kwargs)
        if self.generate_og_preview_picture:
            # Если требуется сгенировать картинку-превью для OpenGraph
            # Картинка генерируется на основе заголовка статьи и рубрики
            generate_preview_picture.delay(self.id)

    @transaction.atomic  # only commit when all descendants are properly updated
    def move(self, target, pos=None):
        """
        Extension to the treebeard 'move' method to ensure that url_path is updated too.
        """
        old_url_path = Page.objects.get(id=self.id).url_path

        super(Page, self).move(target, pos=pos)
        # treebeard's move method doesn't actually update the in-memory instance, so we need to work
        # with a freshly loaded one now
        new_self = Page.objects.get(id=self.id)
        old_url = new_self.get_url()
        new_url_path = new_self.set_url_path(new_self.get_parent())
        try:
            new_self.save()

        except ValidationError:
            new_self.slug = Page._get_autogenerated_slug(new_self, new_self.slug)
            new_url_path = new_self.set_url_path(new_self.get_parent())
            new_self.save()
            self.slug = new_self.slug
            self.set_url_path(new_self.get_parent())
            r = new_self.get_latest_revision()
            r.content_json = self.to_json()
            r.save()

        new_self._update_descendant_url_paths(old_url_path, new_url_path)

        if self.live:
            redirect = Redirect(old_path=old_url, redirect_page=new_self, is_permanent=True)
            redirect.clean()
            redirect.save()

        # Log
        logger.info("Page moved: \"%s\" id=%d path=%s", self.title, self.id, new_url_path)

    @route(r'^slide/([0-9]+)/$')
    def slide_view(self, *args, **kwargs):
        return self.index_route(*args, **kwargs)

    @property
    def parent_title(self):
        return self.get_parent().title

    @property
    def parent_url(self):
        return self.get_parent().get_url()

    def get_seo_title(self):
        return self.seo_title or self.title

    def get_search_description(self):
        return self.search_description or self.short_lead

    @cached_property
    def has_video(self):
        for block in self.body:
            if block.block_type == 'html_field' and 'iframe' in block.value and \
                    'youtu' in block.value:
                return True
            if block.block_type == 'embed' and 'youtu' in block.value.url:
                return True

        return False

    @property
    def is_promotion(self):
        if self.show_in_promo or self.rubric.title == 'Promotion':
            return True
        return False

    @property
    def status_string(self):
        if not self.live:
            if self.expired:
                return _("expired")
            else:
                return _("draft")
        else:
            if self.published_at and self.published_at > timezone.now():
                return _("scheduled")
            else:
                return _("live")

    def render_body(self):
        render_to_string('content/entry_body.html', {'page': self})

    def serve(self, request, *args, **kwargs):
        def inner_serve(request, *args, **kwargs):
            return TemplateResponse(
                request,
                self.get_template(request, *args, **kwargs),
                self.get_context(request, *args, **kwargs)
            )

        request.is_preview = getattr(request, 'is_preview', False)

        if not request.is_preview:
            if self.last_published_at:
                time = str(int(self.last_published_at.timestamp()))
            else:
                time = str(int(self.published_at.timestamp()))
            prefix = 'page_id_' + str(self.id) + '_t_' + time
            if request.user_agent.is_mobile:
                prefix += '_mobile'
            cls = self.specific_class
            return cache_page(60 * 60, key_prefix=prefix)(super(BaseContentPage, self).serve)(request, *args, **kwargs)
        else:
            return super(BaseContentPage, self).serve(request, *args, **kwargs)

    class Meta:
        abstract = True


class ArticleIndexTag(TaggedItemBase):
    content_object = ParentalKey(
        'content.ArticleIndex',
        related_name='tagged_items')


class ArticleIndex(MobileTemplateMixin, Page):
    description = models.TextField(
        max_length=160,
        verbose_name="Описание",
        blank=True,
    )

    tags = ClusterTaggableManager(
        through=ArticleIndexTag,
        blank=True,
        verbose_name='Тэги'
    )

    color = ColorField(
        default='#FF0000',
        verbose_name='Цвет рубрики',
        blank=True
    )

    preview_picture = models.ForeignKey(
        'content.CustomImage',
        on_delete=models.PROTECT,
        related_name='+',
        verbose_name="Основная иллюстрация",
        blank=True,
        null=True
    )

    expert = models.ForeignKey(
        'experts.ExpertPage',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name='Страница эксперта',
        related_name='related_article_rubrics'
    )

    body = StreamField(PageBodyStreamField(), blank=True, null=True)

    content_panels = Page.content_panels + [
        FieldPanel('tags'),
        FieldPanel('description'),
        ImageChooserPanel('preview_picture'),
        FieldPanel('expert'),
        # FieldPanel('color'),
        StreamFieldPanel('body'),
    ]

    parent_page_types = ['home.HomePage', 'content.ArticleIndex']
    ajax_template = 'content/article_index_ajax.html'

    def serve(self, request, *args, **kwargs):
        page_models = (ArticlePage, BlogPage, NewsPage)
        prefix = prefix_key(
            'article_index',
            page_models,
            request.GET.get('page', '1'),
            request.user_agent.is_mobile
        )
        return cache_page(60 * 60, key_prefix=prefix)(super(ArticleIndex, self).serve)(request, *args, **kwargs)

    def get_context(self, request, *args, **kwargs):
        context = super(ArticleIndex, self).get_context(request, *args, **kwargs)

        models = (ArticlePage, NewsPage)
        queryset_helper = PageQuerySetHelper().type(models).live()
        if self.title == 'Promotion':
            qs = queryset_helper.filter(show_in_news=False)
        else:
            qs = queryset_helper.filter(show_in_news=False, show_in_promo=False)
        special_tag_id = request.GET.get('search_tag')
        special_group_id = request.GET.get('search_group')
        if special_tag_id and special_tag_id.isdigit():
            try:
                special_tag = SpecialTag.objects.get(id=special_tag_id)
                qs = qs.filter(special_tags__id__contains=special_tag_id)
                context['special_tag'] = special_tag
                context['special_tag_group'] = special_tag.group
            except SpecialTag.DoesNotExist:
                raise Http404
        elif special_group_id:
            special_group = SpecialTagGroup.objects.filter(id=special_group_id)
            if special_group.exists():
                article_ids = special_group.values('tags__articles').distinct('tags__articles')
                qs = qs.filter(id__in=set(map(lambda i: i['tags__articles'], article_ids)))
                context['special_tag_group'] = special_group.first()

        qs = qs.order('-published_at').queryset.descendant_of(self)
        if qs.count() == 0:
            raise Http404

        per_page = 9
        page = request.GET.get('page', 1)
        paginator = Paginator(qs.specific(), per_page=per_page)
        try:
            page_obj = paginator.page(page)
        except PageNotAnInteger:
            page_obj = paginator.page(1)
        except EmptyPage:
            page_obj = paginator.page(paginator.num_pages)

        articles = page_obj.object_list

        # в дочерних рубриках нужно выводить фильтр родительских рубрик
        rubric = self
        if self.depth == 4:
            rubric = self.get_parent().specific
        if hasattr(rubric, 'special_tag_filter'):
            # Нужны те теги, которые имеют хотя бы одну статью
            context['special_tag_filter'] = rubric.special_tag_filter
            context['special_tag_groups'] = rubric.special_tag_filter.groups.filter(
                tags__articles__isnull=False, tags__articles__rubric=self).distinct('id')
        context['articles'] = articles
        context['page_obj'] = page_obj
        context['expert'] = self.expert
        return context

    @transaction.atomic
    # ensure that changes are only committed when we have updated all descendant URL paths, to preserve consistency
    def save(self, *args, **kwargs):
        self.full_clean()

        update_descendant_url_paths = False
        is_new = self.id is None

        if is_new:
            # we are creating a record. If we're doing things properly, this should happen
            # through a treebeard method like add_child, in which case the 'path' field
            # has been set and so we can safely call get_parent
            self.set_url_path(self.get_parent())
        else:
            # Check that we are committing the slug to the database
            # Basically: If update_fields has been specified, and slug is not included, skip this step
            if not ('update_fields' in kwargs and 'slug' not in kwargs['update_fields']):
                # see if the slug has changed from the record in the db, in which case we need to
                # update url_path of self and all descendants
                old_record = Page.objects.get(id=self.id)
                if old_record.slug != self.slug:
                    self.set_url_path(self.get_parent())
                    update_descendant_url_paths = True
                    old_url_path = old_record.url_path
                    old_slug = '/%s/' % old_record.slug
                    new_slug = '/%s/' % self.slug
                    new_url_path = self.url_path

        result = super(Page, self).save(*args, **kwargs)

        if update_descendant_url_paths:
            self._update_descendant_url_paths(old_url_path, new_url_path)
            create_descendant_redirects.delay(old_slug, new_slug, self.path, self.pk)

        # Check if this is a root page of any sites and clear the 'wagtail_site_root_paths' key if so
        if Site.objects.filter(root_page=self).exists():
            cache.delete('wagtail_site_root_paths')

        # Log
        if is_new:
            cls = type(self)
            logger.info(
                "Page created: \"%s\" id=%d content_type=%s.%s path=%s",
                self.title,
                self.id,
                cls._meta.app_label,
                cls.__name__,
                self.url_path
            )

        return result

    def __str__(self):
        return ('-' * (self.depth - 3)) + ' ' + self.title

    class Meta:
        verbose_name = "Рубрика"
        verbose_name_plural = "Рубрики"


class ArticlePageTag(TaggedItemBase):
    content_object = ParentalKey(
        'content.ArticlePage',
        related_name='tagged_items')


from .widgets import UsersListWidget, SpecialTagGroupWidget, SpecialTagGroupWidget


class ArticlePage(BaseContentPage):
    rubric = models.ForeignKey(
        'content.ArticleIndex',
        verbose_name='Рубрика',
        null=False,
        blank=False,
        on_delete=models.PROTECT,
        related_name='articles'
    )

    tags = ClusterTaggableManager(
        through=ArticlePageTag,
        blank=True,
        verbose_name='Тэги'
    )
    special_tags = ParentalManyToManyField(
        'content.SpecialTag',
        verbose_name='Специальные теги',
        blank=True,
        related_name='articles'
    )
    authors = ParentalManyToManyField(
        'content.Author',
        verbose_name='Авторы',
        blank=True,
        related_name='articles'
    )
    issue = models.ForeignKey(
        'content.IssuePage',
        verbose_name='Выпуск журнала',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='articles'
    )

    rubric_title_as_promo = models.BooleanField(
        default=False,
        verbose_name="Показывать название рубрики 'Promotion'",
        help_text="Отображается только на странице статьи и выбранной рубрике"
    )

    content_panels = [
        FieldPanel('issue'),
        FieldPanel('rubric'),
    ] + BaseContentPage.content_panels + [
        FieldPanel('authors', widget=UsersListWidget),
        FieldPanel('tags'),
        FieldPanel('special_tags', widget=SpecialTagWidget),
    ]
    promote_panels = BaseContentPage.promote_panels + []
    settings_panels = [
        FieldPanel('published_at'),
        MultiFieldPanel([
            FieldPanel('show_in_news'),
            FieldPanel('exclude_from_dzen_feed'),
            FieldPanel('show_in_promo'),
            FieldPanel('show_in_promo_widget'),
            FieldPanel('rubric_title_as_promo')
        ], heading='Настройки')
    ]

    parent_page_types = ['content.ArticleIndex']
    subpage_types = []

    def get_context(self, request, *args, **kwargs):
        context = super(ArticlePage, self).get_context(request, *args, **kwargs)
        if hasattr(self.rubric, 'special_tag_filter'):
            # Нужны те теги, которые имеют хотя бы одну статью
            context['special_tag_groups'] = self.rubric.special_tag_filter.groups.filter(
                tags__articles__isnull=False).distinct('id')
        return context

    class Meta:
        verbose_name = "Статья"
        verbose_name_plural = "Статьи"


class NewsPageTag(TaggedItemBase):
    content_object = ParentalKey(
        'content.NewsPage',
        related_name='tagged_items')


class NewsPage(BaseContentPage):
    rubric = models.ForeignKey(
        'content.ArticleIndex',
        verbose_name='Рубрика',
        null=False,
        blank=False,
        on_delete=models.PROTECT,
        related_name='news'
    )

    authors = ParentalManyToManyField(
        'content.Author',
        verbose_name='Авторы',
        blank=True,
        related_name='news'
    )

    tags = ClusterTaggableManager(
        through=NewsPageTag,
        blank=True,
        verbose_name='Тэги',
    )
    show_in_news = models.BooleanField(
        verbose_name='Отображать в новостях',
        default=True
    )
    rubric_title_as_promo = models.BooleanField(
        default=False,
        verbose_name="Показывать название рубрики 'Promotion'",
        help_text="Отображается только на странице статьи и выбранной рубрике"
    )
    content_panels = [
                         FieldPanel('rubric'),
                     ] + BaseContentPage.content_panels + [
                         FieldPanel('authors', widget=UsersListWidget),
                         FieldPanel('tags'),
                     ]
    promote_panels = BaseContentPage.promote_panels + []
    settings_panels = [
        FieldPanel('published_at'),
        MultiFieldPanel([
            FieldPanel('show_in_news'),
            FieldPanel('exclude_from_dzen_feed'),
            FieldPanel('show_in_promo'),
            FieldPanel('show_in_promo_widget'),
            FieldPanel('rubric_title_as_promo')
        ], heading='Настройки')
    ]
    parent_page_types = ['content.ArticleIndex']
    subpage_types = []

    class Meta:
        verbose_name = "Новость"
        verbose_name_plural = "Новости"


class BlogIndex(MobileTemplateMixin, Page):
    intro = RichTextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('intro', classname="full")
    ]
    subpage_types = ['content.BlogPage', 'content.BlogIndex']
    parent_page_types = ['home.HomePage', 'content.BlogIndex']
    ajax_template = 'content/blog_index_ajax.html'

    def route(self, request, path_components):
        self.category_slug = None
        if path_components and len(path_components) > 1:
            # request is for a child of this page
            category_slug = path_components[0]
            child_slug = path_components[1]
            remaining_components = path_components[2:]

            # find a matching child or 404
            try:

                # проверяем слаг статьи и категорию блога
                subpage = self.get_children().live().get(
                    slug=child_slug,
                    blogpage__category__slug=category_slug
                )
            except Page.DoesNotExist:
                raise Http404

            # delegate further routing
            return subpage.specific.route(request, remaining_components)

        else:
            if path_components:
                self.category_slug = path_components[0]

            # request is for this very page
            if self.live:
                # Return a RouteResult that will tell Wagtail to call
                # this page's serve() method
                return RouteResult(self)
            else:
                # the page matches the request, but isn't published, so 404
                raise Http404

    def get_context(self, request, *args, **kwargs):
        context = super(BlogIndex, self).get_context(request, *args, **kwargs)
        entries_per_blog = 3

        qs = BlogPage.objects.descendant_of(self).live()
        blogs = qs.filter(category__live=True).exclude(tags__name='Новости')

        if self.category_slug:
            try:
                blog_category = BlogCategory.objects.get(slug=self.category_slug, live=True)
            except BlogCategory.DoesNotExist:
                raise Http404
            entries_per_blog = 6
            qs = qs.filter(category=blog_category).order_by('-published_at')

            page = request.GET.get('page', 1)
            paginator = Paginator(qs, per_page=entries_per_blog)

            try:
                page_obj = paginator.page(page)
            except PageNotAnInteger:
                page_obj = paginator.page(1)
            except EmptyPage:
                page_obj = paginator.page(paginator.num_pages)
            context['page_obj'] = page_obj
            context['blogs'] = [(blog_category, page_obj.object_list)]
            return context

        blogs = sorted(
            BlogCategory.objects.filter(live=True).exclude(posts__isnull=True),
            key=lambda x: x.posts.live().filter(live=True).order_by('-published_at').first().published_at,
            reverse=True
        )

        # blogs = map(lambda i: i.category, blogs)
        result = list()
        if request.user_agent.is_mobile:
            entries_per_blog = 1

        for blog in blogs:
            entries = qs.filter(category=blog).order_by('-published_at')[:entries_per_blog]
            if entries.exists():
                entry = (
                    blog,
                    entries
                )
                result.append(entry)

        context['blogs'] = result
        return context

    def serve(self, request, *args, **kwargs):
        page_models = (BlogPage,)
        prefix = prefix_key(
            'blog_index',
            page_models,
            request.GET.get('page', 1),
            request.user_agent.is_mobile
        )
        return cache_page(60 * 60, key_prefix=prefix)(super(BlogIndex, self).serve)(request, *args, **kwargs)

    class Meta:
        verbose_name = "Блог"
        verbose_name_plural = "Блоги"


class BlogCategory(models.Model):
    live = models.BooleanField(
        verbose_name='Опубликовано',
        default=True
    )

    title = models.CharField(
        max_length=255,
        verbose_name='Заголовок'
    )

    slug = models.CharField(
        max_length=255,
        verbose_name='Символьный код'
    )
    short_description = models.TextField(
        verbose_name="Регалии",
        max_length=50,
        null=True,
        blank=True
    )

    description = models.TextField(
        verbose_name="Описание",
        null=True,
        blank=True
    )

    preview_picture = models.ForeignKey(
        'content.CustomImage',
        on_delete=models.PROTECT,
        related_name='+',
        verbose_name="Основная иллюстрация",
        blank=True,
        null=True
    )
    old_id = models.IntegerField(
        null=True,
        blank=True
    )

    panels = [
        FieldPanel('live'),
        FieldPanel('title', classname='full'),
        FieldPanel('slug'),
        FieldPanel('short_description'),
        FieldPanel('description'),
        ImageChooserPanel('preview_picture')
    ]

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Блог'
        verbose_name_plural = 'Блоги'


class BlogPageTag(TaggedItemBase):
    content_object = ParentalKey(
        'content.BlogPage',
        related_name='tagged_items')


class BlogPage(BaseContentPage):
    category = models.ForeignKey(
        BlogCategory,
        related_name='posts',
        verbose_name='Блог',
        on_delete=models.PROTECT
    )

    authors = ParentalManyToManyField(
        'content.Author',
        verbose_name='Автор',
        related_name='blogs',
        blank=True
    )

    tags = ClusterTaggableManager(
        through=BlogPageTag,
        blank=True,
        verbose_name='Тэги',
    )

    content_panels = [
                         FieldPanel('category')
                     ] + BaseContentPage.content_panels + [
                         FieldPanel('authors', widget=UsersListWidget),
                         FieldPanel('tags')
                     ]

    parent_page_types = ['content.BlogIndex']
    subpage_types = []

    def get_context(self, request, *args, **kwargs):
        context = super(BlogPage, self).get_context(request, *args, **kwargs)
        context['hide_comments'] = True
        return context

    @property
    def is_promotion(self):
        if self.show_in_promo:
            return True

        return False

    @property
    def parent_title(self):
        return self.category.title

    @property
    def parent_url(self):
        return self.get_parent().get_url() + self.category.slug

    def set_url_path(self, parent):
        """
        Populate the url_path field based on this page's slug and the specified parent page.
        (We pass a parent in here, rather than retrieving it via get_parent, so that we can give
        new unsaved pages a meaningful URL when previewing them; at that point the page has not
        been assigned a position in the tree, as far as treebeard is concerned.
        """
        if parent:
            self.url_path = parent.url_path + self.category.slug + '/' + self.slug + '/'
        else:
            # a page without a parent is the tree root, which always has a url_path of '/'
            self.url_path = '/'

        return self.url_path

    class Meta:
        verbose_name = "Пост"
        verbose_name_plural = "Посты"


class TagIndex(MobileTemplateMixin, RoutablePageMixin, Page):
    body = StreamField(PageBodyStreamField(), blank=True, null=True)

    content_panels = Page.content_panels + [
        StreamFieldPanel('body')
    ]

    ajax_template = 'content/tag_index_ajax.html'

    @route(r'^(?P<tag>[0-9A-Za-z_\-]+)')
    def tag_view(self, request, tag):
        context = {}
        try:

            tag = Tag.objects.get(slug=tag)
        except Tag.DoesNotExist:
            raise Http404
        qs = PageQuerySetHelper(qs=Page.objects.all()).type((ArticlePage, NewsPage, BlogPage)).live().filter(
            tags__name=tag
        ).order('-published_at').queryset.specific()

        page = request.GET.get('page', 1)
        paginator = Paginator(qs, per_page=6)

        try:
            page_obj = paginator.page(page)
        except PageNotAnInteger:
            page_obj = paginator.page(1)
        except EmptyPage:
            page_obj = paginator.page(paginator.num_pages)
        context['page_obj'] = page_obj
        context['entries'] = page_obj.object_list
        context['page'] = self
        context['self'] = context['page']
        context['tag'] = tag
        template_name = self.get_template(request)
        return render(request, template_name, context)

    @route(r'')
    def index_view(self, request):
        raise Http404

    def serve(self, request, *args, **kwargs):
        page_models = (ArticlePage, BlogPage, NewsPage, EventPage)
        prefix = prefix_key(
            'tag_index',
            page_models,
            request.GET.get('page', 1),
            request.user_agent.is_mobile
        )
        return cache_page(60 * 60, key_prefix=prefix)(super(TagIndex, self).serve)(request, *args, **kwargs)

    class Meta:
        verbose_name = 'Тег'
        verbose_name_plural = 'Теги'


class IssueIndex(Page):
    parent_page_types = ['home.HomePage']
    subpage_types = ['content.IssuePage']
    ajax_template = 'content/issue_index_ajax.html'

    def get_context(self, request, *args, **kwargs):
        context = super(IssueIndex, self).get_context(request, *args, *kwargs)
        issues = IssuePage.objects.descendant_of(self).live().filter(published_at__lte=timezone.now())
        if request.POST.get('year', '').isdigit() or request.GET.get('year', '').isdigit():
            year = int(request.POST.get('year') or request.GET.get('year'))
            if request.method == 'GET':
                year += 1  # magick kostil
            issues = issues.exclude(published_at__year__gte=year)
            if not issues.exists():
                raise Http404('1')
        elif request.method == 'POST':
            raise Http404('2')

        years = map(
            lambda x: x['year'],
            issues.annotate(year=ExtractYear('published_at')) \
                .values('year') \
                .distinct('year') \
                .order_by('-year')
        )
        try:
            year = next(years)
        except StopIteration:
            raise Http404('3')

        issues = issues.filter(published_at__year=year).order_by('-issue_date')

        if not issues.exists():
            raise Http404('4')

        context['issues'] = issues
        context['year'] = year
        context['last_year'] = False
        try:
            next(years)
        except StopIteration:
            context['last_year'] = True

        return context

    def serve(self, request, *args, **kwargs):
        page_models = (IssuePage,)
        prefix = prefix_key(
            'issue_index',
            page_models,
            request.GET.get('year', 1),
            request.user_agent.is_mobile
        )
        return cache_page(60 * 60, key_prefix=prefix)(super(IssueIndex, self).serve)(request, *args, **kwargs)

    class Meta:
        verbose_name = 'Архив номеров'
        verbose_name_plural = 'Архив номеров'


class IssuePage(CommentsPageMixin, RoutablePageMixin, Page):
    parent_page_types = ['content.IssueIndex']
    subpage_types = []

    cover = models.ForeignKey(
        'content.CustomImage',
        on_delete=models.PROTECT,
        related_name='+',
        verbose_name="Обложка журнала",
        null=True
    )
    body = StreamField(ContentStreamField())
    issue_date = models.DateTimeField(
        verbose_name='Дата выхода номера',
        blank=True,
        null=True,
        default=timezone.now
    )

    published_at = models.DateTimeField(
        verbose_name='Дата/время публикации',
        blank=True,
        null=True,
        default=timezone.now
    )
    old_id = models.IntegerField(
        null=True,
        blank=True
    )

    content_panels = Page.content_panels + [
        FieldPanel('issue_date'),
        ImageChooserPanel('cover'),
        StreamFieldPanel('body'),
    ]
    settings_panels = [
        FieldPanel('published_at'),

    ]

    def __str__(self):
        return str(self.issue_date.date().year) + ' ' + self.title

    class Meta:
        verbose_name = 'Выпуск журнала'
        verbose_name_plural = 'Выпуски журнала'


class EventIndex(MobileTemplateMixin, Page):
    parent_page_types = ['home.HomePage']
    subpage_types = ['content.EventPage']
    ajax_template = 'content/event_index_ajax.html'

    def get_context(self, request, *args, **kwargs):
        context = super(EventIndex, self).get_context(request, *args, **kwargs)
        qs_helper = PageQuerySetHelper(EventPage.objects.live().descendant_of(self), base_model=EventPage)
        qs = qs_helper.live().order_by('-published_at')

        page = request.GET.get('page', 1)
        paginator = Paginator(qs, per_page=6)

        try:
            page_obj = paginator.page(page)
        except PageNotAnInteger:
            page_obj = paginator.page(1)
        except EmptyPage:
            page_obj = paginator.page(paginator.num_pages)
        context['page_obj'] = page_obj
        context['events'] = page_obj.object_list

        return context

    def serve(self, request, *args, **kwargs):
        page_models = (EventPage,)
        prefix = prefix_key(
            'event_index',
            page_models,
            request.GET.get('page', 1),
            request.user_agent.is_mobile
        )
        return cache_page(60 * 60, key_prefix=prefix)(super(EventIndex, self).serve)(request, *args, **kwargs)

    class Meta:
        verbose_name = 'События'
        verbose_name_plural = 'События'


class EventPageTag(TaggedItemBase):
    content_object = ParentalKey(
        'content.EventPage',
        related_name='tagged_items')


class EventPage(BaseContentPage, MobileTemplateMixin, CommentsPageMixin, Page):
    active_from = models.DateTimeField(
        verbose_name='Дата и время начала',
    )
    active_to = models.DateTimeField(
        verbose_name='Дата и время конца',
        null=True,
        blank=True
    )
    mark = models.CharField(
        verbose_name='Специальная метка',
        max_length=150,
        null=True,
        blank=True
    )
    place = models.CharField(
        verbose_name='Место проведения',
        max_length=500,
        null=True,
        blank=True
    )
    price = models.CharField(
        verbose_name='Стоимость участия',
        max_length=300,
        blank=True,
        null=True
    )

    tags = ClusterTaggableManager(
        through=EventPageTag,
        blank=True,
        verbose_name='Теги',
    )

    content_panels = Page.content_panels + [
        ImageChooserPanel('cover'),
        StreamFieldPanel('body'),
    ]

    content_panels = [] + BaseContentPage.content_panels + [
        MultiFieldPanel(
            [
                FieldPanel('active_from'),
                FieldPanel('active_to')
            ],
            heading='Время проведения'
        ),
        FieldPanel('mark'),
        FieldPanel('place'),
        FieldPanel('price'),
        FieldPanel('tags'),
    ]
    promote_panels = BaseContentPage.promote_panels + []
    settings_panels = BaseContentPage.settings_panels + []

    parent_page_types = ['content.EventIndex']
    subpage_types = []

    @property
    def is_event(self):
        return True

    class Meta:
        verbose_name = 'Событие'
        verbose_name_plural = 'События'
