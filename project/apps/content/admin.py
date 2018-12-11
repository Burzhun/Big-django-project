from wagtail.contrib.modeladmin.options import (
    ModelAdmin, ModelAdminGroup, modeladmin_register)

from .models import (
    ArticlePage, ArticleIndex, NewsPage, BlogPage,
    BlogIndex, BlogCategory, Author, OtherMenu, EventPage, IssuePage, SpecialTagFilter, SpecialTag, SpecialTagGroup)
from .views import ContentChooseParentView
from django.contrib.admin import SimpleListFilter
from django.utils import timezone


class StatusFilter(SimpleListFilter):
    title = 'статусу'
    parameter_name = 'status_string'

    def lookups(self, request, model_admin):
        return (
            ('live', 'Опубликовано'),
            # ('live_draft', 'Опубликовано + черновик'),
            # ('live_unapproved', 'Опубликовано + на модерации'),
            ('scheduled', 'Запланировано'),
            # ('scheduled_draft', 'Запланировано + черновик'),
            # ('scheduled_unapproved', 'Запланировано + на модерации'),
            ('unapproved', 'На модерации'),
            ('draft', 'Черновик'),
        )

    def queryset(self, request, queryset):
        if self.value() == 'live_unapproved':
            return queryset.live().filter(published_at__lte=timezone.now(), revisions__submitted_for_moderation=True)
        elif self.value() == 'live_draft':
            return queryset.live().filter(published_at__lte=timezone.now(), has_unpublished_changes=True)
        elif self.value() == 'live':
            return queryset.live().filter(published_at__lte=timezone.now())
        elif self.value() == 'scheduled_unapproved':
            return queryset.filter(published_at__gt=timezone.now(), revisions__submitted_for_moderation=True)
        # elif self.value() == 'scheduled_draft':
        #     return queryset.filter(go_live_at__gt=timezone.now(), revisions__approved_go_live_at__isnull=False)
        elif self.value() == 'scheduled':
            return queryset.live().filter(published_at__gt=timezone.now())
        elif self.value() == 'unapproved':
            return queryset.filter(revisions__submitted_for_moderation=True)
        elif self.value() == 'draft':
            return queryset.filter(live=False)


class ArticlePageAdmin(ModelAdmin):
    model = ArticlePage
    menu_label = 'Статьи'  # ditch this to use verbose_name_plural from model
    menu_icon = 'edit'  # change as required
    menu_order = 201  # will put in 3rd place (000 being 1st, 100 2nd)
    add_to_settings_menu = False  # or True to add your model to the Settings sub-menu
    exclude_from_explorer = False  # or True to exclude pages of this type from Wagtail's explorer view
    list_display = ('draft_title_field', 'has_adult_content', 'rubric_title', 'status_string', 'live', 'published_at')
    list_filter = (StatusFilter, 'published_at', 'has_adult_content', 'rubric')
    ordering = ('-published_at',)
    search_fields = ('draft_title',)
    list_per_page = 20

    choose_parent_view_class = ContentChooseParentView

    def rubric_title(self, obj):
        return obj.rubric.title

    rubric_title.short_description = 'Рубрика'

    def draft_title_field(self, obj):
        return obj.draft_title

    draft_title_field.short_description = 'Заголовок'

    def status_string(self, obj):
        if obj.live and obj.published_at and obj.published_at < timezone.now():
            return 'Опубликовано'
        elif obj.live and obj.published_at and obj.published_at > timezone.now():
            return 'Запланировано'
        elif obj.revisions.filter(submitted_for_moderation=True).exists():
            return 'На модерации'
        elif not obj.live:
            return 'Черновик'
        return '-'

    status_string.short_description = 'Статус'

    def status_filter(self):
        return StatusFilter


class NewsPageAdmin(ArticlePageAdmin):
    model = NewsPage
    menu_label = 'Новости'
    menu_icon = 'form'
    menu_order = 203


class EventPageAdmin(ArticlePageAdmin):
    model = EventPage
    menu_label = 'События'
    menu_icon = 'form'
    menu_order = 204
    list_display = ('draft_title_field', 'live', 'status_string', 'published_at')
    list_filter = (StatusFilter, 'published_at')


class IssuePageAdmin(ArticlePageAdmin):
    model = IssuePage
    menu_label = 'Журналы'
    menu_icon = 'form'
    menu_order = 204
    list_display = ('draft_title_field', 'live', 'status_string', 'published_at')
    list_filter = (StatusFilter, 'published_at')


class BlogPageAdmin(ArticlePageAdmin):
    model = BlogPage
    menu_label = 'Посты'
    menu_icon = 'form'
    add_to_settings_menu = False
    exclude_from_explorer = False
    list_display = ('draft_title_field', 'has_adult_content', 'category_title', 'status_string', 'live', 'published_at')
    list_filter = (StatusFilter, 'live', 'published_at', 'has_adult_content', 'category')

    def category_title(self, obj):
        return obj.category.title

    category_title.short_description = 'Блог'

    list_per_page = 10


class BlogIndexAdmin(ModelAdmin):
    model = BlogCategory
    menu_label = 'Блоги'
    menu_icon = 'form'
    add_to_settings_menu = False
    exclude_from_explorer = False
    list_display = ('title', 'live',)
    list_filter = ('live',)
    search_fields = ('title',)


class BlogAdminGroup(ModelAdminGroup):
    menu_label = 'Блоги'
    menu_icon = 'folder-open-inverse'
    menu_order = 202
    items = (BlogIndexAdmin, BlogPageAdmin)


class ArticleIndexAdmin(ModelAdmin):
    model = ArticleIndex
    menu_label = 'Рубрики'
    menu_icon = 'list-ul'
    menu_order = 200
    add_to_settings_menu = False
    exclude_from_explorer = False
    list_display = ('title', 'live',)
    list_filter = ('live',)
    search_fields = ('title',)


class AuthorAdmin(ModelAdmin):
    model = Author
    menu_label = 'Авторы'
    menu_icon = 'user'
    menu_order = 204
    add_to_settings_menu = False
    exclude_from_explorer = False


class OtherMenuAdmin(ModelAdmin):
    model = OtherMenu
    menu_label = 'Остальные меню'
    menu_icon = 'list-ol'
    menu_order = 1000
    add_to_settings_menu = True
    exclude_from_explorer = False


class SpecialTagGroupAdmin(ModelAdmin):
    model = SpecialTagGroup
    list_display = ('name', )


class SpecialTagFilterAdmin(ModelAdmin):
    model = SpecialTagFilter


class SpecialTagAdminGroup(ModelAdminGroup):
    menu_order = 1001
    menu_label = 'Спец. теги'
    menu_icon = 'tag'
    items = (SpecialTagFilterAdmin, SpecialTagGroupAdmin,)


modeladmin_register(SpecialTagAdminGroup)
modeladmin_register(EventPageAdmin)
modeladmin_register(IssuePageAdmin)
modeladmin_register(OtherMenuAdmin)
modeladmin_register(BlogAdminGroup)
modeladmin_register(ArticlePageAdmin)
modeladmin_register(NewsPageAdmin)
modeladmin_register(ArticleIndexAdmin)
modeladmin_register(AuthorAdmin)
