# -*- coding: utf-8 -*-
# Generated by Django 1.11.15 on 2018-11-06 14:43
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0078_auto_20181029_1751'),
    ]

    operations = [
        migrations.AddField(
            model_name='articlepage',
            name='rubric_title_as_promo',
            field=models.BooleanField(default=False, help_text='Отображается только на странице статьи и выбранной рубрике', verbose_name="Показывать название рубрики 'Promotion'"),
        ),
        migrations.AddField(
            model_name='newspage',
            name='rubric_title_as_promo',
            field=models.BooleanField(default=False, help_text='Отображается только на странице статьи и выбранной рубрике', verbose_name="Показывать название рубрики 'Promotion'"),
        ),
    ]