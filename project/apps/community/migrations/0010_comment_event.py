# -*- coding: utf-8 -*-
# Generated by Django 1.11.10 on 2018-04-06 17:52
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0039_auto_20180406_1752'),
        ('community', '0009_auto_20180406_0008'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='event',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='comments', to='content.EventPage'),
        ),
    ]
