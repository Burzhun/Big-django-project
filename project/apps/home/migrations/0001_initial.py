# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2017-12-11 12:19
from __future__ import unicode_literals

import content.blocks
from django.db import migrations, models
import django.db.models.deletion
import wagtail.wagtailcore.blocks
import wagtail.wagtailcore.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('wagtailcore', '0040_page_draft_title'),
    ]

    operations = [
        migrations.CreateModel(
            name='HomePage',
            fields=[
                ('page_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='wagtailcore.Page')),
                ('body', wagtail.wagtailcore.fields.StreamField((('group_1', wagtail.wagtailcore.blocks.StructBlock((('slider', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Материал 1 (большой)')), ('standart', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Материал 2 (стандартный)'))), icon='cog', label='Большой материал со стандартным', template='content/groups/group_1.html')), ('group_2', wagtail.wagtailcore.blocks.StructBlock((('little_1', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Материал 1 (маленький)')), ('little_2', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Материал 2 (маленький)')), ('cube', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Материал 3 (куб)')), ('standart', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Материал 4 (стандартный)'))), icon='cog', label='Два маленьких, куб и стандартный', template='content/groups/group_2.html')), ('group_3', wagtail.wagtailcore.blocks.StructBlock((('standart', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Материал 1 (стандартный)')), ('big', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Материал 2 (большой)'))), icon='cog', label='Стандартный и большой', template='content/groups/group_3.html')), ('group_4', wagtail.wagtailcore.blocks.StructBlock((('standart', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Материал 1 (стандартный)')), ('little_1', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Материал 2 (маленький)')), ('little_2', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Материал 3 (маленький)')), ('cube', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница', required=False)), ('tag', content.blocks.TagBlock(label='Тег', required=False)), ('is_random', wagtail.wagtailcore.blocks.BooleanBlock(label='Золотой фонд', required=False))), label='Материал 4 (куб)'))), icon='cog', label='Стандартный, два маленьких и куб', template='content/groups/group_4.html'))), blank=True, null=True)),
            ],
            options={
                'abstract': False,
            },
            bases=('wagtailcore.page',),
        ),
    ]
