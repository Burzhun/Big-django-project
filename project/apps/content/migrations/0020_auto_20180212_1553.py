# -*- coding: utf-8 -*-
# Generated by Django 1.11.10 on 2018-02-12 15:53
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0019_auto_20180212_1543'),
    ]

    operations = [
        migrations.AlterField(
            model_name='othermenu',
            name='type',
            field=models.SmallIntegerField(choices=[(0, 'Главное боковое меню')], db_index=True, unique=True, verbose_name='Тип меню'),
        ),
    ]
