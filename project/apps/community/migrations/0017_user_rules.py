# -*- coding: utf-8 -*-
# Generated by Django 1.11.12 on 2018-04-24 23:54
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('community', '0016_auto_20180417_0122'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='rules',
            field=models.BooleanField(default=True, verbose_name='Принял условия'),
        ),
    ]