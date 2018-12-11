# -*- coding: utf-8 -*-
# Generated by Django 1.11.10 on 2018-04-10 21:34
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('community', '0010_comment_event'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='has_children',
            field=models.SmallIntegerField(choices=[(0, 'Да'), (1, 'Нет'), (2, 'Не указано')], default=2, verbose_name='Есть ли дети'),
        ),
    ]