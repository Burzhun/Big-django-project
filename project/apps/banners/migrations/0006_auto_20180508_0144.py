# -*- coding: utf-8 -*-
# Generated by Django 1.11.12 on 2018-05-08 01:44
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('banners', '0005_auto_20180508_0127'),
    ]

    operations = [
        migrations.AddField(
            model_name='scriptitem',
            name='weight',
            field=models.IntegerField(default=500, verbose_name='Вес'),
        ),
        migrations.AlterField(
            model_name='scriptitem',
            name='rule',
            field=models.SmallIntegerField(choices=[(0, 'Вставить в страницы'), (1, 'Исключить страницы'), (2, 'Во все страницы')], default=2, verbose_name='Правила вставки'),
        ),
    ]