# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2017-12-20 17:33
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('banners', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='banner',
            name='banner_type',
            field=models.ForeignKey( on_delete=django.db.models.deletion.CASCADE, related_name='banners', to='banners.BannerType', verbose_name='Тип баннера'),
            preserve_default=False,
        ),
    ]
