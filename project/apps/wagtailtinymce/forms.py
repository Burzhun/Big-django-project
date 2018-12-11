from django import forms
from wagtail.wagtailadmin.forms import URLOrAbsolutePathField
from django.utils.translation import ugettext_lazy


class ExternalLinkChooserForm(forms.Form):
    url = URLOrAbsolutePathField(required=True, label=ugettext_lazy("URL"))
    link_text = forms.CharField(required=False)
    blank_link = forms.BooleanField(required=False, label="Открывать в новом окне")
