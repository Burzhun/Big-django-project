# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2017-12-26 15:37
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0007_auto_20171220_1809'),
    ]

    operations = [
        migrations.AlterField(
            model_name='newspage',
            name='show_in_news',
            field=models.BooleanField(default=True, verbose_name='Отображать в новостях'),
        ),
    ]
