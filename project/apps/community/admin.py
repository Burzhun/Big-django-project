from django.contrib import admin
from .models import User, Comment, Rating
from content.models import ArticlePage
from wagtail.contrib.modeladmin.options import (
    ModelAdmin, modeladmin_register)


class RatingAdmin(admin.ModelAdmin):
    pass


class UserAdmin(admin.ModelAdmin):
    search_fields = ('email', 'first_name', 'last_name', 'old_id',)
    list_display = ('email', 'first_name', 'last_name', 'old_id',)
    list_filter = ('groups', 'is_superuser', 'is_staff', 'is_active')


class CommentAdmin(admin.ModelAdmin):
    pass


class ArticlePageAdmin(admin.ModelAdmin):
    pass


admin.site.register(Rating, RatingAdmin)
admin.site.register(ArticlePage, ArticlePageAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(Comment, CommentAdmin)


class CommentWagtailAdmin(ModelAdmin):
    model = Comment
    menu_label = 'Комментарии'
    menu_icon = 'group'
    menu_order = 205
    add_to_settings_menu = False
    exclude_from_explorer = False
    list_display = ('name', 'author', '__str__', 'content_type', 'old_id')
    ordering = ('-id',)
    search_fields = ('name', 'text',)
    list_per_page = 50
    inspect_view_fields_exclude = ('article', 'news', 'blog', 'author', 'parent_comment')
    form_fields_exclude = ('article', 'news', 'blog', 'author', 'parent_comment')


modeladmin_register(CommentWagtailAdmin)
