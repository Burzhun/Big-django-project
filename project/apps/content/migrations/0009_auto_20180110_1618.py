# -*- coding: utf-8 -*-
# Generated by Django 1.11.9 on 2018-01-10 16:18
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0008_auto_20171226_1837'),
    ]

    operations = [
        migrations.AddField(
            model_name='articlepage',
            name='show_in_promo',
            field=models.BooleanField(default=False, verbose_name='Отображать в promotion'),
        ),
        migrations.AddField(
            model_name='blogpage',
            name='show_in_promo',
            field=models.BooleanField(default=False, verbose_name='Отображать в promotion'),
        ),
        migrations.AddField(
            model_name='newspage',
            name='show_in_promo',
            field=models.BooleanField(default=False, verbose_name='Отображать в promotion'),
        ),
    ]
