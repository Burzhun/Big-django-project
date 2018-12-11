from django.contrib import admin
from .models import AnswerPage, ExpertPage
from wagtail.contrib.modeladmin.options import (
    ModelAdmin, ModelAdminGroup, modeladmin_register)

class AnswerAdmin(admin.ModelAdmin):
    pass

admin.site.register(AnswerPage, AnswerAdmin)


class ExpertPageAdmin(ModelAdmin):
    model = ExpertPage
    menu_label = 'Эксперты'  
    menu_icon = 'view'  
    add_to_settings_menu = False 
    exclude_from_explorer = False 
    list_display = ('title',  'live', 'section', 'user')
    list_filter = ('live',  'section',)
    ordering = ('-go_live_at',)
    search_fields = ('title', 'section')

    list_per_page = 20


class AnswerPageAdmin(ModelAdmin):
    model = AnswerPage
    menu_label = 'Вопросы'  
    menu_icon = 'success'  
    add_to_settings_menu = False 
    exclude_from_explorer = False 
    list_display = ('title', 'get_parent', 'live',)
    list_filter = ('live', 'section', )
    search_fields = ('title', )

    list_per_page = 20


class ExpertAdminGroup(ModelAdminGroup):
    menu_label = 'Эксперты'
    menu_icon = 'folder-open-inverse'
    menu_order = 206 
    items = (ExpertPageAdmin, AnswerPageAdmin)


modeladmin_register(ExpertAdminGroup)
