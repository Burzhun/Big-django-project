from django.contrib import admin
from .models import StaticPage

class StaticPageAdmin(admin.ModelAdmin):
	pass


admin.site.register(StaticPage, StaticPageAdmin)