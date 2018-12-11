# -*- coding: utf-8 -*-
# Generated by Django 1.11.10 on 2018-02-16 03:11
from __future__ import unicode_literals

import content.blocks
from django.db import migrations
import wagtail.wagtailcore.blocks
import wagtail.wagtailcore.fields
import wagtail.wagtailimages.blocks


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0021_auto_20180212_2236'),
    ]

    operations = [
        migrations.AlterField(
            model_name='articleindex',
            name='body',
            field=wagtail.wagtailcore.fields.StreamField((('group_1', wagtail.wagtailcore.blocks.StructBlock((('standart', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Материал 2 (стандартный)')), ('headlines', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Главные материалы'))), icon='cog', label='Три блока с главными материалами', template='content/groups/group_1.html')), ('group_2', wagtail.wagtailcore.blocks.StructBlock((('standart', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Материал 3 (стандартный)')),), icon='cog', label='Три блока', template='content/groups/group_2.html')), ('group_3', wagtail.wagtailcore.blocks.StructBlock((('standart', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Материал 3 (стандартный)')), ('expert', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Совет эксперту'))), icon='cog', label='Три блока с советом эксперта', template='content/groups/group_2.html')), ('special_field', wagtail.wagtailcore.blocks.ListBlock(wagtail.wagtailcore.blocks.StructBlock((('image', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фото')), ('title', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок')), ('link', wagtail.wagtailcore.blocks.URLBlock(label='Ссылка')))), icon='view', label='Спецпроекты', template='content/stream_fields/special_field.html')), ('mobile_banner', wagtail.wagtailcore.blocks.StructBlock((('type', wagtail.wagtailcore.blocks.CharBlock(label='Код баннера')),), template='content/stream_fields/mobile_banner.html'))), blank=True, null=True),
        ),
    ]
