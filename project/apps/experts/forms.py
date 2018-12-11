from django import forms
from django.utils.text import slugify
from wagtail.wagtailcore.models import Page

from experts.models import AnswerPage


from unidecode import unidecode


class NewQuestionForm(forms.ModelForm):
    title = forms.CharField(
        required=True,
        label='Тема',
        help_text='Например: волосатые ноги; как накачать руки',
        widget=forms.TextInput(attrs={'class': 'input_text'})
    )
    question = forms.CharField(
        required=True,
        label='Суть вопроса',
        widget=forms.Textarea(attrs={'id': 'question-text'})
    )

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user')
        super(NewQuestionForm, self).__init__(*args, **kwargs)

    def save(self, commit=True):
        answer = super(NewQuestionForm, self).save(commit=False)
        answer.author = self.user
        slug = slugify(unidecode(answer.title))
        uniq_slug = slug
        suffix = 2
        while Page.objects.filter(slug=uniq_slug).exists():
            uniq_slug = slug + '-' + str(suffix)
            suffix += 1
        answer.slug = uniq_slug
        answer.live = False
        if commit:
            answer.save()
        return answer

    class Meta:
        model = AnswerPage
        fields = ('title', 'question',)
