# -*- coding: utf-8 -*-
# Generated by Django 1.11.10 on 2018-04-05 16:20
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0035_issuepage_cover'),
        ('community', '0006_comment_created_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='issue',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='comments', to='content.IssuePage'),
        ),
    ]