# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2017-12-15 14:04
from __future__ import unicode_literals

from django.db import migrations
import wagtail.wagtailcore.fields


class Migration(migrations.Migration):

    dependencies = [
        ('experts', '0005_auto_20171214_1856'),
    ]

    operations = [
        migrations.AlterField(
            model_name='answerpage',
            name='answer',
            field=wagtail.wagtailcore.fields.RichTextField(blank=True, max_length=2000, null=True, verbose_name='Ответ'),
        ),
    ]