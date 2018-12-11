from __future__ import absolute_import, unicode_literals

import json

from django.template.loader import render_to_string
from django.utils.translation import ugettext_lazy as _

from wagtail.wagtailadmin.widgets import AdminChooser
from giphy import get_giphy_model


class AdminGiphyChooser(AdminChooser):
    choose_one_text = _('Поиск гифок')
    choose_another_text = _('Найти другую гифку')
    show_edit_link = False

    def __init__(self, **kwargs):
        super(AdminGiphyChooser, self).__init__(**kwargs)
        self.giphy_model = get_giphy_model()

    def render_html(self, name, value, attrs):
        original_field_html = super(AdminGiphyChooser, self).render_html(name, value, attrs)

        return render_to_string("giphy/widgets/giphy_chooser.html", {
            'widget': self,
            'original_field_html': original_field_html,
            'attrs': attrs,
            'value': value,
        })

    def render_js_init(self, id_, name, value):
        return "createGiphyChooser({0});".format(json.dumps(id_))
