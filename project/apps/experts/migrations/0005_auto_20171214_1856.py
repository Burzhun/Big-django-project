# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2017-12-14 15:56
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('experts', '0004_auto_20171212_2034'),
    ]

    operations = [
        migrations.AlterField(
            model_name='expertpage',
            name='user',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='expert_page', to=settings.AUTH_USER_MODEL, verbose_name='Пользователь'),
        ),
    ]
