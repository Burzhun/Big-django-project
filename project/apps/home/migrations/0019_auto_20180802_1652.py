# -*- coding: utf-8 -*-
# Generated by Django 1.11.14 on 2018-08-02 16:52
from __future__ import unicode_literals

import content.blocks
import content.models
from django.db import migrations
import wagtail.wagtailcore.blocks
import wagtail.wagtailcore.fields
import wagtail.wagtailimages.blocks


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0018_auto_20180702_1831'),
    ]

    operations = [
        migrations.AlterField(
            model_name='homepage',
            name='body',
            field=wagtail.wagtailcore.fields.StreamField((('group_1', wagtail.wagtailcore.blocks.StructBlock((('standart_1', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Материал 1 (стандартный)')), ('headlines', content.blocks.HeadlinesBlock()), ('standart_2', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Материал 2 (стандартный)'))), icon='cog', label='Три блока с главными материалами', template='content/groups/group_1.html')), ('group_2', wagtail.wagtailcore.blocks.StructBlock((('standart_1', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Материал 1 (стандартный)')), ('standart_2', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Материал 2 (стандартный)')), ('standart_3', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Материал 3 (стандартный)'))), icon='cog', label='Три блока', template='content/groups/group_2.html')), ('group_3', wagtail.wagtailcore.blocks.StructBlock((('standart_1', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Материал 1 (стандартный)')), ('expert', wagtail.wagtailcore.blocks.StructBlock((('expert', wagtail.wagtailcore.blocks.ChoiceBlock(choices=[(0, 'Стиль'), (1, 'Фитнес и спорт'), (2, 'Секс и отношения'), (3, 'Здоровье'), (4, 'Груминг'), (5, 'Жизнь')], label='Раздел')),))), ('standart_2', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Материал 3 (стандартный)'))), icon='cog', label='Три блока с советом эксперта', template='content/groups/group_3.html')), ('special_field', wagtail.wagtailcore.blocks.ListBlock(wagtail.wagtailcore.blocks.StructBlock((('image', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фото')), ('title', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок')), ('link', wagtail.wagtailcore.blocks.URLBlock(label='Ссылка')))), icon='view', label='Спецпроекты', template='content/stream_fields/special_field.html')), ('banner', wagtail.wagtailcore.blocks.StructBlock((('type', wagtail.wagtailcore.blocks.CharBlock(label='Код баннера')),), template='content/stream_fields/banner.html')), ('mobile_banner', wagtail.wagtailcore.blocks.StructBlock((('type', wagtail.wagtailcore.blocks.CharBlock(label='Код баннера')),), template='content/stream_fields/banner.html'))), blank=True, null=True),
        ),
    ]
