from django import forms
from django.utils.functional import cached_property
from django.apps import apps

from wagtail.wagtailcore import blocks
from wagtail.wagtailadmin.widgets import AdminTagWidget
from wagtail.wagtailimages.blocks import ImageChooserBlock

from content.helpers import PageQuerySetHelper
from experts.models import SECTION_CHOICES


class TagBlock(blocks.FieldBlock):
    def __init__(self, *args, **kwargs):
        super(blocks.FieldBlock, self).__init__(*args, **kwargs)

    @cached_property
    def field(self):
        field_kwargs = {'widget': AdminTagWidget(), 'required': False}
        return forms.CharField(**field_kwargs)


class Banner(blocks.StructBlock):
    """
    Баннерный блок в конструкторе.

    type – код баннера.

    Загружает баннер из списка баннеров по коду (TODO: сортируя по полю weight)
    """
    type = blocks.CharBlock(label='Код баннера')


class GroupBlock(blocks.StructBlock):
    """
    Базовый блок в конструкторе главной страницы.

    Можно выбрать страницу (page), тег (tag) или случайную статью с золотого фонда (is_random)
    Золотой фонд – частный случай тега, посклольку это выборка по тегу "Золотой фонд"
    """
    page = blocks.PageChooserBlock(label='Страница', required=False)
    tag = TagBlock(label='Тег', required=False)
    is_random = blocks.BooleanBlock(label='Золотой фонд', required=False)


class HeadlinesBlock(blocks.StaticBlock):
    """
    Блок с несколькими статьями. Только новости, статьи и посты из блогов. Без промо-постов
    """
    def get_context(self, *args, **kwargs):
        context = super(HeadlinesBlock, self).get_context(*args, *kwargs)
        models = [
            apps.get_model(app_label='content', model_name=model)
            for model in ('ArticlePage', 'BlogPage', 'NewsPage')
        ]

        promo = apps.get_model(app_label='content', model_name='ArticleIndex').objects.filter(title='Promotion').first()
        context['entries'] = PageQuerySetHelper(models=models).live().filter(
            show_in_promo=False
        ).exclude(rubric=promo).order_by('-published_at')[:5]

        return context

    class Meta:
        label = 'Последние записи'
        template = 'content/blocks/headlines.html'


class ExpertBlock(blocks.StructBlock):
    """
    Блок эксперта.

    Предлагает выбрать раздел эксперта, откуда потом в блок попадает последний ответ из раздела
    """
    expert = blocks.ChoiceBlock(
        choices=SECTION_CHOICES,
        label='Раздел'
    )

    class Meta:
        label = 'Эксперт'
        template = 'content/blocks/expert.html'


class SpecialBlock(blocks.StructBlock):
    """
    Блок спецпроектов

    Базовый блок, который собирается в плашку из нескольких таких блоков на главной.
    Базовый блок попадает в блок списка blocks.ListBlock.
    В каждом блоке заполняются поля картинки, заголовка и ссылки
    """
    image = ImageChooserBlock(label='Фото')
    title = blocks.CharBlock(label='Заголовок')
    link = blocks.URLBlock(label='Ссылка')

    class Meta:
        label = 'Блок'


class ReadAlso(blocks.StructBlock):
    """
    Блок 'читайте также'

    Используется в статьях
    Добавляет блок со ссылкой и картинкой (preview_picture) из выбранной страницы.
    """
    page = blocks.PageChooserBlock(label='Страница')

    class Meta:
        icon = "plus"
        label = "Это интересно"
        template = 'content/stream_fields/read_also.html'


class ImageBlock(blocks.StructBlock):
    """
    Базовый блок с картинкой и подписью.

    Используется в статьях или для сложных блоков галерея.
    """
    image = ImageChooserBlock(label='Фотография')
    caption = blocks.CharBlock(label='Подпись', required=False)


class NoteBlock(blocks.StructBlock):
    """
    Блок подписи.

    Используется в статьях
    Используется для подписей в конце статьи (не зависит от порядка в конструкторе StreamField)
    или в блоке картинки слева от статьи
    """
    key = blocks.CharBlock(label='Заголовок')
    value = blocks.CharBlock(label='Описание')

    class Meta:
        label = 'Подпись'


class ImageNotesBlock(blocks.StructBlock):
    """
    Блок картинки, который выводится слева от статьи

    Используется блок подписи
    """
    image = ImageChooserBlock(label='Фотография')
    title = blocks.CharBlock(label='Заголовок', required=False)
    notes = blocks.ListBlock(
        NoteBlock(),
        label='Подписи',
    )


class LeftText(blocks.StructBlock):
    """
    Блок с текстом слева от статьи
    """
    title = blocks.CharBlock(label='Заголовок', required=False)
    text = blocks.RichTextBlock(
        editor='tinymce',
        language='ru'
    )


class BoxBlock(blocks.StructBlock):
    """
    Блок текста с заголовком в теле статьи,
    который отличается от основного текста цветом фона
    """
    title = blocks.CharBlock(
        label='Заголовок',
    )
    body = blocks.RichTextBlock(
        label='Содержание',
        editor='tinymce',
        language='ru',
        required=True
    )

    class Meta:
        label = 'Врезка с заголовком'
        icon = 'form'
        template = 'content/stream_fields/box_field.html'


class QuestionBlock(blocks.StructBlock):
    title = blocks.CharBlock(label='Вопрос')
    counter = blocks.IntegerBlock(
        label='Счетчик',
        default=0,
        help_text = 'Внимание! Голоса могут увеличиваться во время редактирования опубликованной статьи'
    )


class PollBlock(blocks.StructBlock):
    """
    Блок анонимного голосования с двумя возможными вариантами
    Каждый голос обновляет блок в статье,
    для этого приходится проходиться по всем блокам, чтобы найти нужный (в модели BaseContentModel).
    """
    title = blocks.CharBlock(label='Заголовок')
    question_1 = QuestionBlock(label='Вопрос 1')
    question_2 = QuestionBlock(label='Вопрос 2')

    class Meta:
        label = 'Опрос'
        template = 'content/stream_fields/poll.html'


class BigSideImageBlock(blocks.StructBlock):
    image = ImageChooserBlock(label='Изображение', required=True)
    text = blocks.RichTextBlock(
        label='Текст',
        editor='tinymce',
        language='ru',
        required=True
    )

    class Meta:
        label = 'Большое фото, описание справа'
        template = 'content/stream_fields/big_side_image.html'
