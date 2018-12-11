# -*- coding: utf-8 -*-
# Generated by Django 1.11.12 on 2018-04-24 18:52
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('experts', '0015_auto_20180412_1725'),
    ]

    operations = [
        migrations.AlterField(
            model_name='answerpage',
            name='section',
            field=models.SmallIntegerField(choices=[(0, 'Стиль'), (1, 'Фитнес и спорт'), (2, 'Секс и отношения'), (3, 'Здоровье'), (4, 'Груминг'), (5, 'Жизнь')], db_index=True, default=0, verbose_name='Тема'),
        ),
        migrations.AlterField(
            model_name='expertpage',
            name='section',
            field=models.SmallIntegerField(choices=[(0, 'Стиль'), (1, 'Фитнес и спорт'), (2, 'Секс и отношения'), (3, 'Здоровье'), (4, 'Груминг'), (5, 'Жизнь')], db_index=True, default=0, verbose_name='Тема'),
        ),
    ]
