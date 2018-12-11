from django.db.models import Q
from django.utils import timezone
from django.db import models
from wagtail.wagtailcore.models import BaseViewRestriction, Page


class PageQuerySetHelper:
    def __init__(self, qs=None, models=None, base_model=Page):
        self.qs = qs if qs else Page.objects.all()
        self.models = models if models else ()
        if self.models:
            self.qs = self.qs.type(models)
        self.extra_fields = []
        self.base_model = base_model

    def live(self):
        self.qs = self.qs.live().exclude(
            view_restrictions__restriction_type__in=(
                BaseViewRestriction.PASSWORD,
                BaseViewRestriction.GROUPS,
                BaseViewRestriction.LOGIN
            )
        )
        if self.base_model is not Page:
            return self.qs.order_by('-published_at')
        if 'published_at' not in self.extra_fields:
            self.add_extra_fields('published_at')
        self.filter(published_at__lte=timezone.now())

        return self

    def type(self, models):
        """
        TODO: Удалить метод
        """
        self.models = models
        self.qs = self.qs.type(models)
        return self

    def add_extra_fields(self, fields):
        if type(fields) not in (list, tuple):
            fields = [fields]
        select = 'SELECT {field} FROM {table} WHERE {table}.page_ptr_id = wagtailcore_page.id '
        extra_select = {}
        for field in fields:
            field_select = ''
            for model in self.models:
                table = model._meta.db_table
                if field_select != '':
                    field_select += ' UNION ' + select.format(field=field, table=table)
                else:
                    field_select = select.format(field=field, table=table)
            extra_select[field] = field_select
            self.extra_fields.append(field)

        self.qs = self.qs.extra(select=extra_select)
        return self

    def filter(self, *args, **kwargs):
        filter_q = Q()
        for key in kwargs:
            field = key.split('__')[0]

            if field in self.extra_fields or not Page.field_exists(field):
                field_q = Q()
                for model in self.models:
                    if model.field_exists(field):
                        field_q |= Q(**{
                            model.__name__.lower().replace('_', '') + '__' + key: kwargs[key]
                        })
                filter_q &= field_q
            else:
                filter_q &= Q(**{key: kwargs[key]})
        self.qs = self.qs.filter(filter_q)
        return self

    def exclude(self, *args, **kwargs):
        exclude_q = Q()
        for key in kwargs:
            field = key.split('__')[0]
            if field in self.extra_fields or not Page.field_exists(field):
                field_q = Q()
                for model in self.models:
                    if model.field_exists(field):
                        field_q |= Q(**{
                            model.__name__.lower().replace('_', '') + '__' + key: kwargs[key]
                        })
                exclude_q &= field_q
            else:
                exclude_q &= Q(**{key: kwargs[key]})
        self.qs = self.qs.exclude(exclude_q)
        return self

    def order(self, order_field):
        try:
            Page._meta.get_field(order_field.replace('-', ''))
            self.qs = self.qs.order_by(order_field)
            return self
        except models.FieldDoesNotExist:
            if not self.models:
                return self
            for model in self.models:
                try:
                    model._meta.get_field(order_field.replace('-', ''))
                except models.FieldDoesNotExist:
                    return self
            if order_field not in self.extra_fields:
                self.qs = self.add_extra_fields(order_field.replace('-', '')).queryset
            self.qs = self.qs.order_by(order_field)
            return self

    @property
    def queryset(self):
        return self.qs


