# -*- coding: utf-8 -*-
# Generated by Django 1.11.10 on 2018-04-04 15:38
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('experts', '0011_answerpage_created_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='answerpage',
            name='created_date',
            field=models.DateTimeField(db_index=True, default=django.utils.timezone.now, verbose_name='Дата создания'),
        ),
    ]
