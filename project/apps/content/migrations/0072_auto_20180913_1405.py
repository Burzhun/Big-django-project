# -*- coding: utf-8 -*-
# Generated by Django 1.11.14 on 2018-09-13 14:05
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0071_auto_20180912_1349'),
    ]

    operations = [
        migrations.AlterField(
            model_name='articlepage',
            name='has_adult_content',
            field=models.BooleanField(default=False, verbose_name='Содержит контент 18+'),
        ),
        migrations.AlterField(
            model_name='blogpage',
            name='has_adult_content',
            field=models.BooleanField(default=False, verbose_name='Содержит контент 18+'),
        ),
        migrations.AlterField(
            model_name='eventpage',
            name='has_adult_content',
            field=models.BooleanField(default=False, verbose_name='Содержит контент 18+'),
        ),
        migrations.AlterField(
            model_name='newspage',
            name='has_adult_content',
            field=models.BooleanField(default=False, verbose_name='Содержит контент 18+'),
        ),
    ]