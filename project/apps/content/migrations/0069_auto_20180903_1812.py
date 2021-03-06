# -*- coding: utf-8 -*-
# Generated by Django 1.11.14 on 2018-09-03 18:12
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0068_auto_20180827_1721'),
    ]

    operations = [
        migrations.AddField(
            model_name='articlepage',
            name='show_in_promo_widget',
            field=models.BooleanField(default=True, help_text='Действует если статья имеет рубрику promotion или галочку "Отображать в рубрике promotion"', verbose_name='Отображать в виджете promotion на главной'),
        ),
        migrations.AddField(
            model_name='blogpage',
            name='show_in_promo_widget',
            field=models.BooleanField(default=True, help_text='Действует если статья имеет рубрику promotion или галочку "Отображать в рубрике promotion"', verbose_name='Отображать в виджете promotion на главной'),
        ),
        migrations.AddField(
            model_name='eventpage',
            name='show_in_promo_widget',
            field=models.BooleanField(default=True, help_text='Действует если статья имеет рубрику promotion или галочку "Отображать в рубрике promotion"', verbose_name='Отображать в виджете promotion на главной'),
        ),
        migrations.AddField(
            model_name='newspage',
            name='show_in_promo_widget',
            field=models.BooleanField(default=True, help_text='Действует если статья имеет рубрику promotion или галочку "Отображать в рубрике promotion"', verbose_name='Отображать в виджете promotion на главной'),
        ),
        migrations.AlterField(
            model_name='articlepage',
            name='show_in_promo',
            field=models.BooleanField(default=False, help_text='Действует если статья не имеет рубрику promotion, но ее нужно добавить в этот раздел', verbose_name='Отображать в рубрике promotion'),
        ),
        migrations.AlterField(
            model_name='blogpage',
            name='show_in_promo',
            field=models.BooleanField(default=False, help_text='Действует если статья не имеет рубрику promotion, но ее нужно добавить в этот раздел', verbose_name='Отображать в рубрике promotion'),
        ),
        migrations.AlterField(
            model_name='eventpage',
            name='show_in_promo',
            field=models.BooleanField(default=False, help_text='Действует если статья не имеет рубрику promotion, но ее нужно добавить в этот раздел', verbose_name='Отображать в рубрике promotion'),
        ),
        migrations.AlterField(
            model_name='newspage',
            name='show_in_promo',
            field=models.BooleanField(default=False, help_text='Действует если статья не имеет рубрику promotion, но ее нужно добавить в этот раздел', verbose_name='Отображать в рубрике promotion'),
        ),
    ]
