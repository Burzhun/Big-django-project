from django.db import models
from django.utils import timezone
from modelcluster.models import ClusterableModel
from wagtail.wagtailadmin.edit_handlers import MultiFieldPanel, FieldPanel, InlinePanel, PageChooserPanel
from wagtail.wagtailcore.models import Page, Orderable
from django.db.models import Q
from modelcluster.fields import ParentalKey


class BannerType(models.Model):
    active = models.BooleanField(
        default=True,
        verbose_name='Активный'
    )
    title = models.CharField(
        max_length=225,
        verbose_name='Название баннерного места'
    )
    banner_id = models.CharField(
        verbose_name='Идентификатор баннера',
        help_text='допустимы латинские буквы, цифры, либо символ "_"',
        unique=True,
        max_length=150
    )

    panels = [
        FieldPanel('active'),
        FieldPanel('title'),
        FieldPanel('banner_id')
    ]

    def __str__(self):
        return "[%s] %s" % (self.banner_id, self.title)

    class Meta:
        verbose_name = 'Тип баннера'
        verbose_name_plural = 'Типы баннеров'


class BannerManagement(models.Manager):

    def live(self):
        now = timezone.now()
        return self.filter(
            active=True,
            start_time__lte=now,
        ).filter(
            Q(end_time__gte=now) |
            Q(end_time__isnull=True)
        )


class Banner(models.Model):
    objects = BannerManagement()

    title = models.CharField(
        max_length=225,
        verbose_name='Название баннера'
    )
    active = models.BooleanField(
        default=True,
        verbose_name='Активный'
    )
    banner_type = models.ForeignKey(
        'banners.BannerType',
        verbose_name='Тип баннера',
        related_name='banners',
        on_delete=models.CASCADE
    )
    start_time = models.DateTimeField(
        default=timezone.now,
        verbose_name='Дата/время публикации'
    )
    end_time = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Дата/время истечения'
    )
    code = models.TextField(
        verbose_name='Код баннера',
        help_text='Могут быть использованы от одного до десяти случайных чисел с именами #RANDOM<номер>#'
    )
    last_modifed_date = models.DateTimeField(auto_now=True)

    panels = [
        FieldPanel('active'),
        FieldPanel('title'),
        FieldPanel('banner_type'),
        MultiFieldPanel(
            [
                FieldPanel('start_time'),
                FieldPanel('end_time')
            ],
            heading='Интервал показа'
        ),
        FieldPanel('code'),
    ]

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Баннер'
        verbose_name_plural = 'Баннеры'


class PageRelate(models.Model):
    page = models.ForeignKey(
        Page,
        verbose_name='Страница',
        blank=True,
        null=True,
        on_delete=models.SET_NULL
    )
    panels = [
        PageChooserPanel('page'),
    ]

    class Meta:
        verbose_name = 'Страница'
        verbose_name_plural = 'Страницы'


class ScriptItems(Orderable, PageRelate):
    related_page = ParentalKey('banners.ScriptItem', related_name='pages')


class ScriptItem(ClusterableModel):
    POSITION_HEAD = 0
    POSITION_FOOTER = 1
    POSITION_BEFORE_ARTICLE_CONTENT = 2
    POSITION_AFTER_ARTICLE_CONTENT = 3

    POSITION_CHOICES = (
        (POSITION_HEAD, 'HEAD'),
        (POSITION_FOOTER, 'FOOTER'),
        (POSITION_BEFORE_ARTICLE_CONTENT, 'BEFORE ARTICLE CONTENT'),
        (POSITION_AFTER_ARTICLE_CONTENT, 'AFTER ARTICLE CONTENT'),
    )

    position = models.SmallIntegerField(
        verbose_name='Вставить в',
        choices=POSITION_CHOICES
    )

    RULE_IN_PAGES = 0
    RULE_EXCLUDE_PAGES = 1
    RULE_ALL_PAGES = 2

    RULE_CHOICES = (
        (RULE_IN_PAGES, 'Вставить в страницы'),
        (RULE_EXCLUDE_PAGES, 'Исключить страницы'),
        (RULE_ALL_PAGES, 'Во все страницы')
    )

    rule = models.SmallIntegerField(
        verbose_name='Правила вставки',
        choices=RULE_CHOICES,
        default=RULE_ALL_PAGES
    )

    PLATFORM_MOBILE = 0
    PLATFORM_DESKTOP = 1
    PLATFORM_ALL = 2
    PLATFORM_CHOICES = (
        (PLATFORM_MOBILE, 'Мобильная'),
        (PLATFORM_DESKTOP, 'Десктоп'),
        (PLATFORM_ALL, 'Все')
    )

    exclude_from_promo = models.BooleanField(
        verbose_name='Исключить из статей, имеющие отношения к промо',
        default=False
    )

    platform = models.SmallIntegerField(
        verbose_name='Платформа',
        choices=PLATFORM_CHOICES,
        default=PLATFORM_ALL
    )

    title = models.CharField(
        verbose_name='Название',
        max_length=255,
    )

    weight = models.IntegerField(
        verbose_name='Вес',
        default=500
    )

    active = models.BooleanField(
        verbose_name='Активный',
        default=True
    )

    script = models.TextField(
        verbose_name='Скрипт'
    )
    last_modifed_date = models.DateTimeField(auto_now=True)

    panels = [
        FieldPanel('active'),
        FieldPanel('exclude_from_promo'),
        FieldPanel('title'),
        FieldPanel('position'),
        FieldPanel('platform'),
        FieldPanel('rule'),
        FieldPanel('weight'),
        FieldPanel('script'),
        InlinePanel('pages', label='Страницы')
    ]

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Скрипт'
        verbose_name_plural = 'Скрипты'
