# -*- coding: utf-8 -*-
# Generated by Django 1.11.10 on 2018-04-17 01:15
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('wagtailcore', '0040_page_draft_title'),
        ('community', '0014_auto_20180417_0051'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='rating',
            unique_together=set([('author', 'page')]),
        ),
    ]
