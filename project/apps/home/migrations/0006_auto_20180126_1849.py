# -*- coding: utf-8 -*-
# Generated by Django 1.11.9 on 2018-01-26 18:49
from __future__ import unicode_literals

import content.blocks
from django.db import migrations
import wagtail.wagtailcore.blocks
import wagtail.wagtailcore.fields
import wagtail.wagtailimages.blocks


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0005_auto_20180126_1516'),
    ]

    operations = [
        migrations.AlterField(
            model_name='homepage',
            name='body',
            field=wagtail.wagtailcore.fields.StreamField((('group_1', wagtail.wagtailcore.blocks.StructBlock((('slider', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Материал 1 (большой)')), ('standart', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Материал 2 (стандартный)'))), icon='cog', label='Большой материал со стандартным', template='content/groups/group_1.html')), ('group_2', wagtail.wagtailcore.blocks.StructBlock((('little_1', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Материал 1 (маленький)')), ('little_2', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Материал 2 (маленький)')), ('cube', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Материал 3 (куб)')), ('standart', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Материал 4 (стандартный)'))), icon='cog', label='Два маленьких, куб и стандартный', template='content/groups/group_2.html')), ('group_3', wagtail.wagtailcore.blocks.StructBlock((('standart', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Материал 1 (стандартный)')), ('big', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Материал 2 (большой)'))), icon='cog', label='Стандартный и большой', template='content/groups/group_3.html')), ('group_4', wagtail.wagtailcore.blocks.StructBlock((('standart', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Материал 1 (стандартный)')), ('little_1', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Материал 2 (маленький)')), ('little_2', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Материал 3 (маленький)')), ('cube', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Материал 4 (куб)'))), icon='cog', label='Стандартный, два маленьких и куб', template='content/groups/group_4.html')), ('special_field', wagtail.wagtailcore.blocks.ListBlock(wagtail.wagtailcore.blocks.StructBlock((('image', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фото')), ('title', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок')), ('link', wagtail.wagtailcore.blocks.URLBlock(label='Ссылка')))), icon='view', label='Спецпроекты', template='content/stream_fields/special_field.html')), ('mobile_banner', wagtail.wagtailcore.blocks.StructBlock((('type', wagtail.wagtailcore.blocks.CharBlock(label='Код баннера')),), template='content/stream_fields/mobile_banner.html'))), blank=True, null=True),
        ),
    ]
