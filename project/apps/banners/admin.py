from django.contrib import admin
from wagtail.contrib.modeladmin.options import (
    ModelAdmin, ModelAdminGroup, modeladmin_register)

from .models import BannerType, Banner, ScriptItem


class BannerTypeAdmin(ModelAdmin):
    model = BannerType
    menu_label = 'Типы баннеров'
    menu_icon = 'tag'
    add_to_settings_menu = False
    exclude_from_explorer = False
    list_display = ('title', 'active', 'banner_id',)
    list_filter = ('active',)
    ordering = ('-id',)
    search_fields = ('title', 'banner_id',)

    list_per_page = 10


class BannerAdmin(ModelAdmin):
    model = Banner
    menu_label = 'Баннер'
    menu_icon = 'pick'
    add_to_settings_menu = False
    exclude_from_explorer = False
    list_display = ('title', 'active', 'banner_type', 'start_time',)
    list_filter = ('active', 'banner_type', 'start_time',)
    ordering = ('-id',)
    search_fields = ('title', 'code',)

    list_per_page = 10


class BannerAdminGroup(ModelAdminGroup):
    menu_label = 'Баннеры'
    menu_icon = 'folder-open-inverse'
    menu_order = 207
    items = (BannerTypeAdmin, BannerAdmin)


class ScriptAdmin(ModelAdmin):
    model = ScriptItem
    menu_label = 'Сторонние скрипты'
    menu_icon = 'list-ol'
    menu_order = 1000
    add_to_settings_menu = True
    exclude_from_explorer = False
    list_display = ('title', 'active', 'weight', 'position', )
    list_filter = ('active', 'position', )
    search_fields = ('title',)


modeladmin_register(ScriptAdmin)
modeladmin_register(BannerAdminGroup)
