# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-05-24 20:23
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0056_auto_20180518_1117'),
    ]

    operations = [
        migrations.AlterField(
            model_name='articlepage',
            name='preview_picture',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.PROTECT, related_name='+', to='content.CustomImage', verbose_name='Основная иллюстрация'),
        ),
        migrations.AlterField(
            model_name='blogpage',
            name='preview_picture',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.PROTECT, related_name='+', to='content.CustomImage', verbose_name='Основная иллюстрация'),
        ),
        migrations.AlterField(
            model_name='eventpage',
            name='preview_picture',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.PROTECT, related_name='+', to='content.CustomImage', verbose_name='Основная иллюстрация'),
        ),
        migrations.AlterField(
            model_name='newspage',
            name='preview_picture',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.PROTECT, related_name='+', to='content.CustomImage', verbose_name='Основная иллюстрация'),
        ),
    ]
