# -*- coding: utf-8 -*-
# Generated by Django 1.11.12 on 2018-05-08 02:07
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('banners', '0007_scriptitem_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='scriptitem',
            name='script',
            field=models.TextField(default=' ', verbose_name='Скрипт'),
            preserve_default=False,
        ),
    ]
