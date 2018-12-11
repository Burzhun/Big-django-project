from django.db.models import Q
from django_select2.forms import ModelSelect2MultipleWidget
from django.apps import apps


class UsersListWidget(ModelSelect2MultipleWidget):
    search_fields = [
        'first_name',
        'last_name'
    ]

    def __init__(self, *args, **kwargs):
        super(UsersListWidget, self).__init__(*args, **kwargs)
        self.model = apps.get_model(app_label='content', model_name='Author')

    def filter_queryset(self, term, queryset=None, **dependent_fields):
        term = term.replace('\n', '')
        term = term.replace('\t', '')
        search = Q()
        terms = term.split(' ')
        for term in terms:
            search |= Q(first_name__istartswith=term) | Q(last_name__istartswith=term)

        return list(queryset.filter(search))[:10]

    def label_from_instance(self, obj):
        return obj.first_name + ' ' + obj.last_name


class SpecialTagRubricsWidget(ModelSelect2MultipleWidget):
    def __init__(self, *args, **kwargs):
        super(SpecialTagRubricsWidget, self).__init__(*args, **kwargs)
        self.model = apps.get_model(app_label='content', model_name='ArticleIndex')

    def filter_queryset(self, term, queryset=None, **dependent_fields):
        term = term.replace('\n', '')
        term = term.replace('\t', '')
        qs = queryset.filter(title__istartswith=term)
        return list(qs[:10])

    search_fields = [
        'title',
    ]


class SpecialTagGroupWidget(ModelSelect2MultipleWidget):
    def __init__(self, *args, **kwargs):
        super(SpecialTagGroupWidget, self).__init__(*args, **kwargs)
        self.model = apps.get_model(app_label='content', model_name='SpecialTagGroup')

    def filter_queryset(self, term, queryset=None, **dependent_fields):
        term = term.replace('\n', '')
        term = term.replace('\t', '')
        qs = queryset.filter(name__istartswith=term)
        return list(qs[:10])

    search_fields = [
        'name',
    ]


class SpecialTagWidget(ModelSelect2MultipleWidget):
    dependent_fields = {
        'rubric': 'rubric'
    }

    def __init__(self, *args, **kwargs):
        super(SpecialTagWidget, self).__init__(*args, **kwargs)
        self.model = apps.get_model(app_label='content', model_name='SpecialTag')
        self.ArticleIndex = apps.get_model(app_label='content', model_name='ArticleIndex')

    def build_attrs(self, *args, **kwargs):
        attrs = super(SpecialTagWidget, self).build_attrs(*args, **kwargs)
        return attrs

    def filter_queryset(self, term, queryset=None, **dependent_fields):
        term = term.replace('\n', '')
        term = term.replace('\t', '')
        qs = queryset.filter(Q(group__name__istartswith=term) | Q(title__istartswith=term))
        if 'rubric' in dependent_fields:
            try:
                rubric = self.ArticleIndex.objects.get(id=dependent_fields['rubric'])
                # специальные теги могут быть только у родительских рубрик
                if rubric.depth == 4:
                    rubric = rubric.get_parent()
                qs = qs.filter(group__filters__rubric=rubric)
            except self.ArticleIndex.DoesNotExist:
                qs = []
        return list(qs[:10])

    search_fields = [
        'title',
    ]
