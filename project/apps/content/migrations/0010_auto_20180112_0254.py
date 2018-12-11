# -*- coding: utf-8 -*-
# Generated by Django 1.11.9 on 2018-01-12 02:54
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0009_auto_20180110_1618'),
    ]

    operations = [
        migrations.AddField(
            model_name='articlepage',
            name='published_at',
            field=models.DateTimeField(blank=True, default=django.utils.timezone.now, null=True, verbose_name='Дата/время публикации'),
        ),
        migrations.AddField(
            model_name='blogpage',
            name='published_at',
            field=models.DateTimeField(blank=True, default=django.utils.timezone.now, null=True, verbose_name='Дата/время публикации'),
        ),
        migrations.AddField(
            model_name='newspage',
            name='published_at',
            field=models.DateTimeField(blank=True, default=django.utils.timezone.now, null=True, verbose_name='Дата/время публикации'),
        ),
    ]