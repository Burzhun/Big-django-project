# -*- coding: utf-8 -*-
# Generated by Django 1.11.9 on 2018-01-15 16:53
from __future__ import unicode_literals

import content.models
from django.db import migrations
import wagtail.wagtailcore.blocks
import wagtail.wagtailcore.fields
import wagtail.wagtailembeds.blocks
import wagtail.wagtailimages.blocks


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0012_auto_20180113_0458'),
    ]

    operations = [
        migrations.AlterField(
            model_name='articlepage',
            name='body',
            field=wagtail.wagtailcore.fields.StreamField((('h2', wagtail.wagtailcore.blocks.CharBlock(classname='title', icon='title', label='H2', template='content/stream_fields/h2.html')), ('embed', wagtail.wagtailembeds.blocks.EmbedBlock(icon='link', label='Эмбед')), ('image', wagtail.wagtailcore.blocks.StructBlock((('image', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография')), ('caption', wagtail.wagtailcore.blocks.RichTextBlock(label='Подпись', required=False))), icon='image', label='Фотография', template='content/stream_fields/image.html')), ('quote_no_image', wagtail.wagtailcore.blocks.StructBlock((('quote', wagtail.wagtailcore.blocks.TextBlock(label='Цитата')),))), ('quote', wagtail.wagtailcore.blocks.StructBlock((('quote', wagtail.wagtailcore.blocks.TextBlock(label='Цитата')), ('author', wagtail.wagtailcore.blocks.CharBlock(label='Автор')), ('attribution', wagtail.wagtailcore.blocks.TextBlock(label='Подпись автора')), ('photo', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография'))))), ('read_also', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница')),))), ('paragraph', wagtail.wagtailcore.blocks.RichTextBlock(editor='tinymce', label='Параграф', template='content/stream_fields/paragraph.html')), ('gallery', wagtail.wagtailcore.blocks.ListBlock(content.blocks.ImageBlock, icon='image', label='Галерея', template='content/stream_fields/gallery.html')), ('notes', wagtail.wagtailcore.blocks.ListBlock(wagtail.wagtailcore.blocks.TextBlock(label='Подпись', required=False), label='Подписи', template='content/stream_fields/notes.html')), ('box_with_title', wagtail.wagtailcore.blocks.StructBlock((('title', wagtail.wagtailcore.blocks.TextBlock(label='Заголовок')), ('description', wagtail.wagtailcore.blocks.RichTextBlock(label='Описание'))))), ('quote_right', wagtail.wagtailcore.blocks.StructBlock((('text', wagtail.wagtailcore.blocks.TextBlock(label='Текст')),))), ('quote_float_image', wagtail.wagtailcore.blocks.StructBlock((('photo', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография')), ('text', wagtail.wagtailcore.blocks.RichTextBlock(label='Текст'))))), ('author_field', wagtail.wagtailcore.blocks.StructBlock((('image', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография')), ('title', wagtail.wagtailcore.blocks.TextBlock(label='Заголовок')), ('description', wagtail.wagtailcore.blocks.TextBlock(label='Подпись'))))), ('html_field', wagtail.wagtailcore.blocks.TextBlock(help_text='Поле для html, css и js (может использоваться для сложных embed-кодов)', icon='code', label='html врезка', template='content/stream_fields/html_field.html')))),
        ),
        migrations.AlterField(
            model_name='blogpage',
            name='body',
            field=wagtail.wagtailcore.fields.StreamField((('h2', wagtail.wagtailcore.blocks.CharBlock(classname='title', icon='title', label='H2', template='content/stream_fields/h2.html')), ('embed', wagtail.wagtailembeds.blocks.EmbedBlock(icon='link', label='Эмбед')), ('image', wagtail.wagtailcore.blocks.StructBlock((('image', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография')), ('caption', wagtail.wagtailcore.blocks.RichTextBlock(label='Подпись', required=False))), icon='image', label='Фотография', template='content/stream_fields/image.html')), ('quote_no_image', wagtail.wagtailcore.blocks.StructBlock((('quote', wagtail.wagtailcore.blocks.TextBlock(label='Цитата')),))), ('quote', wagtail.wagtailcore.blocks.StructBlock((('quote', wagtail.wagtailcore.blocks.TextBlock(label='Цитата')), ('author', wagtail.wagtailcore.blocks.CharBlock(label='Автор')), ('attribution', wagtail.wagtailcore.blocks.TextBlock(label='Подпись автора')), ('photo', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография'))))), ('read_also', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница')),))), ('paragraph', wagtail.wagtailcore.blocks.RichTextBlock(editor='tinymce', label='Параграф', template='content/stream_fields/paragraph.html')), ('gallery', wagtail.wagtailcore.blocks.ListBlock(content.blocks.ImageBlock, icon='image', label='Галерея', template='content/stream_fields/gallery.html')), ('notes', wagtail.wagtailcore.blocks.ListBlock(wagtail.wagtailcore.blocks.TextBlock(label='Подпись', required=False), label='Подписи', template='content/stream_fields/notes.html')), ('box_with_title', wagtail.wagtailcore.blocks.StructBlock((('title', wagtail.wagtailcore.blocks.TextBlock(label='Заголовок')), ('description', wagtail.wagtailcore.blocks.RichTextBlock(label='Описание'))))), ('quote_right', wagtail.wagtailcore.blocks.StructBlock((('text', wagtail.wagtailcore.blocks.TextBlock(label='Текст')),))), ('quote_float_image', wagtail.wagtailcore.blocks.StructBlock((('photo', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография')), ('text', wagtail.wagtailcore.blocks.RichTextBlock(label='Текст'))))), ('author_field', wagtail.wagtailcore.blocks.StructBlock((('image', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография')), ('title', wagtail.wagtailcore.blocks.TextBlock(label='Заголовок')), ('description', wagtail.wagtailcore.blocks.TextBlock(label='Подпись'))))), ('html_field', wagtail.wagtailcore.blocks.TextBlock(help_text='Поле для html, css и js (может использоваться для сложных embed-кодов)', icon='code', label='html врезка', template='content/stream_fields/html_field.html')))),
        ),
        migrations.AlterField(
            model_name='newspage',
            name='body',
            field=wagtail.wagtailcore.fields.StreamField((('h2', wagtail.wagtailcore.blocks.CharBlock(classname='title', icon='title', label='H2', template='content/stream_fields/h2.html')), ('embed', wagtail.wagtailembeds.blocks.EmbedBlock(icon='link', label='Эмбед')), ('image', wagtail.wagtailcore.blocks.StructBlock((('image', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография')), ('caption', wagtail.wagtailcore.blocks.RichTextBlock(label='Подпись', required=False))), icon='image', label='Фотография', template='content/stream_fields/image.html')), ('quote_no_image', wagtail.wagtailcore.blocks.StructBlock((('quote', wagtail.wagtailcore.blocks.TextBlock(label='Цитата')),))), ('quote', wagtail.wagtailcore.blocks.StructBlock((('quote', wagtail.wagtailcore.blocks.TextBlock(label='Цитата')), ('author', wagtail.wagtailcore.blocks.CharBlock(label='Автор')), ('attribution', wagtail.wagtailcore.blocks.TextBlock(label='Подпись автора')), ('photo', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография'))))), ('read_also', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница')),))), ('paragraph', wagtail.wagtailcore.blocks.RichTextBlock(editor='tinymce', label='Параграф', template='content/stream_fields/paragraph.html')), ('gallery', wagtail.wagtailcore.blocks.ListBlock(content.blocks.ImageBlock, icon='image', label='Галерея', template='content/stream_fields/gallery.html')), ('notes', wagtail.wagtailcore.blocks.ListBlock(wagtail.wagtailcore.blocks.TextBlock(label='Подпись', required=False), label='Подписи', template='content/stream_fields/notes.html')), ('box_with_title', wagtail.wagtailcore.blocks.StructBlock((('title', wagtail.wagtailcore.blocks.TextBlock(label='Заголовок')), ('description', wagtail.wagtailcore.blocks.RichTextBlock(label='Описание'))))), ('quote_right', wagtail.wagtailcore.blocks.StructBlock((('text', wagtail.wagtailcore.blocks.TextBlock(label='Текст')),))), ('quote_float_image', wagtail.wagtailcore.blocks.StructBlock((('photo', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография')), ('text', wagtail.wagtailcore.blocks.RichTextBlock(label='Текст'))))), ('author_field', wagtail.wagtailcore.blocks.StructBlock((('image', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография')), ('title', wagtail.wagtailcore.blocks.TextBlock(label='Заголовок')), ('description', wagtail.wagtailcore.blocks.TextBlock(label='Подпись'))))), ('html_field', wagtail.wagtailcore.blocks.TextBlock(help_text='Поле для html, css и js (может использоваться для сложных embed-кодов)', icon='code', label='html врезка', template='content/stream_fields/html_field.html')))),
        ),
    ]
