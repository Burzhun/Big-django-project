# -*- coding: utf-8 -*-
# Generated by Django 1.11.10 on 2018-04-05 18:46
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0035_issuepage_cover'),
    ]

    operations = [
        migrations.AddField(
            model_name='blogcategory',
            name='short_description',
            field=models.TextField(blank=True, max_length=50, null=True, verbose_name='Регалии'),
        ),
    ]
