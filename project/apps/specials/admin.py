from django.contrib import admin
from .models import KamasutraPosition, KamasutraIndex, KamasutraPage
from wagtail.contrib.modeladmin.options import (
    ModelAdmin, ModelAdminGroup, modeladmin_register)


class KamasutraPageAdmin(ModelAdmin):
    model = KamasutraPage
    menu_label = 'Позы'
    menu_icon = 'view'
    add_to_settings_menu = False
    exclude_from_explorer = False
    list_display = ('title',  'live', 'positions_title', 'published_at')
    list_filter = ('live',  'positions',)
    ordering = ('-published_at',)
    search_fields = ('title', 'body')

    def positions_title(self, obj):
        return ", ".join([i.title for i in obj.positions.all()])

    positions_title.short_description = 'Метки'

    list_per_page = 20


class KamasutraPositionsAdmin(ModelAdmin):
    model = KamasutraPosition
    menu_label = 'Варианты поз'
    menu_icon = 'success'
    add_to_settings_menu = False
    exclude_from_explorer = False
    list_display = ('title', )
    search_fields = ('title', )

    list_per_page = 20


class KamasutraAdminGroup(ModelAdminGroup):
    menu_label = 'Камасутра'
    menu_icon = 'folder-open-inverse'
    menu_order = 206
    items = (KamasutraPositionsAdmin, KamasutraPageAdmin)


modeladmin_register(KamasutraAdminGroup)
