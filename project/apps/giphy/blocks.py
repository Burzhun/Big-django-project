from __future__ import absolute_import, unicode_literals

from django.utils.functional import cached_property
from django import forms

from wagtail.wagtailcore.blocks import ChooserBlock


class GiphyChooserBlock(ChooserBlock):

    @cached_property
    def target_model(self):
        from giphy import get_giphy_model
        return get_giphy_model()

    @cached_property
    def widget(self):
        from giphy.widgets import AdminGiphyChooser
        return AdminGiphyChooser

    def render_basic(self, value, context=None):
        return 'Giphy block'

    def get_prep_value(self, value):
        return value

    def value_from_form(self, value):
        return value

    def to_python(self, value):
        return value

    def bulk_to_python(self, values):
        return values

    @cached_property
    def field(self):
        return forms.CharField(
            widget=self.widget, required=self._required, help_text=self._help_text)

    class Meta:
        icon = "image"
