# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-06-21 19:28
from __future__ import unicode_literals

import content.models
from django.db import migrations
import wagtail.wagtailcore.blocks
import wagtail.wagtailcore.blocks.static_block
import wagtail.wagtailcore.fields
import wagtail.wagtailembeds.blocks
import wagtail.wagtailimages.blocks


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0062_auto_20180608_1845'),
    ]

    operations = [
        migrations.AlterField(
            model_name='articlepage',
            name='body',
            field=wagtail.wagtailcore.fields.StreamField((('h2', wagtail.wagtailcore.blocks.CharBlock(classname='title', icon='title', label='H2', template='content/stream_fields/h2.html')), ('embed', wagtail.wagtailembeds.blocks.EmbedBlock(icon='link', label='Эмбед')), ('image', wagtail.wagtailcore.blocks.StructBlock((('image', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография')), ('caption', wagtail.wagtailcore.blocks.CharBlock(label='Подпись', required=False))), icon='image', label='Фотография', template='content/stream_fields/image.html')), ('wide_image', wagtail.wagtailcore.blocks.StructBlock((('image', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография')), ('caption', wagtail.wagtailcore.blocks.CharBlock(label='Подпись', required=False))), icon='image', label='Широкая фотография', template='content/stream_fields/wide_image.html')), ('left_image', wagtail.wagtailcore.blocks.StructBlock((('image', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография')), ('title', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок', required=False)), ('notes', wagtail.wagtailcore.blocks.ListBlock(wagtail.wagtailcore.blocks.StructBlock((('key', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок')), ('value', wagtail.wagtailcore.blocks.CharBlock(label='Описание')))), label='Подписи'))), icon='image', label='Фотография слева', template='content/stream_fields/left_image.html')), ('left_text', wagtail.wagtailcore.blocks.StructBlock((('title', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок', required=False)), ('notes', wagtail.wagtailcore.blocks.RichTextBlock(editor='tinymce', language='ru'))), label='Текст слева', template='content/stream_field/left_text.html')), ('left_text_gray', wagtail.wagtailcore.blocks.StructBlock((('title', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок', required=False)), ('notes', wagtail.wagtailcore.blocks.RichTextBlock(editor='tinymce', language='ru'))), label='Текст слева на сером фоне', template='content/stream_field/left_text_gray.html')), ('paragraph', wagtail.wagtailcore.blocks.RichTextBlock(editor='tinymce', label='Параграф', language='ru', template='content/stream_fields/paragraph.html')), ('read_also', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница')),))), ('gallery', wagtail.wagtailcore.blocks.ListBlock(content.blocks.ImageBlock, icon='image', label='Галерея', template='content/stream_fields/gallery.html')), ('notes', wagtail.wagtailcore.blocks.ListBlock(wagtail.wagtailcore.blocks.StructBlock((('key', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок')), ('value', wagtail.wagtailcore.blocks.CharBlock(label='Описание')))), label='Подписи', template='content/stream_fields/notes.html')), ('html_field', wagtail.wagtailcore.blocks.TextBlock(help_text='Поле для html, css и js (может использоваться для сложных embed-кодов)', icon='code', label='html врезка', template='content/stream_fields/html_field.html')), ('anchor_field', wagtail.wagtailcore.blocks.static_block.StaticBlock(admin_text='Якорь (передергивает скрипты аналитики и баннеры)', icon='repeat', label='Якорь', template='content/stream_fields/anchor_field.html')), ('box_field', wagtail.wagtailcore.blocks.StructBlock((('title', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок')), ('body', wagtail.wagtailcore.blocks.RichTextBlock(editor='tinymce', label='Содержание', language='ru', required=True))))), ('blockquote', wagtail.wagtailcore.blocks.CharBlock(icon='openquote', label='Цитата', template='content/stream_fields/blockquote.html')))),
        ),
        migrations.AlterField(
            model_name='blogpage',
            name='body',
            field=wagtail.wagtailcore.fields.StreamField((('h2', wagtail.wagtailcore.blocks.CharBlock(classname='title', icon='title', label='H2', template='content/stream_fields/h2.html')), ('embed', wagtail.wagtailembeds.blocks.EmbedBlock(icon='link', label='Эмбед')), ('image', wagtail.wagtailcore.blocks.StructBlock((('image', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография')), ('caption', wagtail.wagtailcore.blocks.CharBlock(label='Подпись', required=False))), icon='image', label='Фотография', template='content/stream_fields/image.html')), ('wide_image', wagtail.wagtailcore.blocks.StructBlock((('image', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография')), ('caption', wagtail.wagtailcore.blocks.CharBlock(label='Подпись', required=False))), icon='image', label='Широкая фотография', template='content/stream_fields/wide_image.html')), ('left_image', wagtail.wagtailcore.blocks.StructBlock((('image', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография')), ('title', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок', required=False)), ('notes', wagtail.wagtailcore.blocks.ListBlock(wagtail.wagtailcore.blocks.StructBlock((('key', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок')), ('value', wagtail.wagtailcore.blocks.CharBlock(label='Описание')))), label='Подписи'))), icon='image', label='Фотография слева', template='content/stream_fields/left_image.html')), ('left_text', wagtail.wagtailcore.blocks.StructBlock((('title', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок', required=False)), ('notes', wagtail.wagtailcore.blocks.RichTextBlock(editor='tinymce', language='ru'))), label='Текст слева', template='content/stream_field/left_text.html')), ('left_text_gray', wagtail.wagtailcore.blocks.StructBlock((('title', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок', required=False)), ('notes', wagtail.wagtailcore.blocks.RichTextBlock(editor='tinymce', language='ru'))), label='Текст слева на сером фоне', template='content/stream_field/left_text_gray.html')), ('paragraph', wagtail.wagtailcore.blocks.RichTextBlock(editor='tinymce', label='Параграф', language='ru', template='content/stream_fields/paragraph.html')), ('read_also', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница')),))), ('gallery', wagtail.wagtailcore.blocks.ListBlock(content.blocks.ImageBlock, icon='image', label='Галерея', template='content/stream_fields/gallery.html')), ('notes', wagtail.wagtailcore.blocks.ListBlock(wagtail.wagtailcore.blocks.StructBlock((('key', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок')), ('value', wagtail.wagtailcore.blocks.CharBlock(label='Описание')))), label='Подписи', template='content/stream_fields/notes.html')), ('html_field', wagtail.wagtailcore.blocks.TextBlock(help_text='Поле для html, css и js (может использоваться для сложных embed-кодов)', icon='code', label='html врезка', template='content/stream_fields/html_field.html')), ('anchor_field', wagtail.wagtailcore.blocks.static_block.StaticBlock(admin_text='Якорь (передергивает скрипты аналитики и баннеры)', icon='repeat', label='Якорь', template='content/stream_fields/anchor_field.html')), ('box_field', wagtail.wagtailcore.blocks.StructBlock((('title', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок')), ('body', wagtail.wagtailcore.blocks.RichTextBlock(editor='tinymce', label='Содержание', language='ru', required=True))))), ('blockquote', wagtail.wagtailcore.blocks.CharBlock(icon='openquote', label='Цитата', template='content/stream_fields/blockquote.html')))),
        ),
        migrations.AlterField(
            model_name='eventpage',
            name='body',
            field=wagtail.wagtailcore.fields.StreamField((('h2', wagtail.wagtailcore.blocks.CharBlock(classname='title', icon='title', label='H2', template='content/stream_fields/h2.html')), ('embed', wagtail.wagtailembeds.blocks.EmbedBlock(icon='link', label='Эмбед')), ('image', wagtail.wagtailcore.blocks.StructBlock((('image', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография')), ('caption', wagtail.wagtailcore.blocks.CharBlock(label='Подпись', required=False))), icon='image', label='Фотография', template='content/stream_fields/image.html')), ('wide_image', wagtail.wagtailcore.blocks.StructBlock((('image', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография')), ('caption', wagtail.wagtailcore.blocks.CharBlock(label='Подпись', required=False))), icon='image', label='Широкая фотография', template='content/stream_fields/wide_image.html')), ('left_image', wagtail.wagtailcore.blocks.StructBlock((('image', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография')), ('title', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок', required=False)), ('notes', wagtail.wagtailcore.blocks.ListBlock(wagtail.wagtailcore.blocks.StructBlock((('key', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок')), ('value', wagtail.wagtailcore.blocks.CharBlock(label='Описание')))), label='Подписи'))), icon='image', label='Фотография слева', template='content/stream_fields/left_image.html')), ('left_text', wagtail.wagtailcore.blocks.StructBlock((('title', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок', required=False)), ('notes', wagtail.wagtailcore.blocks.RichTextBlock(editor='tinymce', language='ru'))), label='Текст слева', template='content/stream_field/left_text.html')), ('left_text_gray', wagtail.wagtailcore.blocks.StructBlock((('title', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок', required=False)), ('notes', wagtail.wagtailcore.blocks.RichTextBlock(editor='tinymce', language='ru'))), label='Текст слева на сером фоне', template='content/stream_field/left_text_gray.html')), ('paragraph', wagtail.wagtailcore.blocks.RichTextBlock(editor='tinymce', label='Параграф', language='ru', template='content/stream_fields/paragraph.html')), ('read_also', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница')),))), ('gallery', wagtail.wagtailcore.blocks.ListBlock(content.blocks.ImageBlock, icon='image', label='Галерея', template='content/stream_fields/gallery.html')), ('notes', wagtail.wagtailcore.blocks.ListBlock(wagtail.wagtailcore.blocks.StructBlock((('key', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок')), ('value', wagtail.wagtailcore.blocks.CharBlock(label='Описание')))), label='Подписи', template='content/stream_fields/notes.html')), ('html_field', wagtail.wagtailcore.blocks.TextBlock(help_text='Поле для html, css и js (может использоваться для сложных embed-кодов)', icon='code', label='html врезка', template='content/stream_fields/html_field.html')), ('anchor_field', wagtail.wagtailcore.blocks.static_block.StaticBlock(admin_text='Якорь (передергивает скрипты аналитики и баннеры)', icon='repeat', label='Якорь', template='content/stream_fields/anchor_field.html')), ('box_field', wagtail.wagtailcore.blocks.StructBlock((('title', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок')), ('body', wagtail.wagtailcore.blocks.RichTextBlock(editor='tinymce', label='Содержание', language='ru', required=True))))), ('blockquote', wagtail.wagtailcore.blocks.CharBlock(icon='openquote', label='Цитата', template='content/stream_fields/blockquote.html')))),
        ),
        migrations.AlterField(
            model_name='issuepage',
            name='body',
            field=wagtail.wagtailcore.fields.StreamField((('h2', wagtail.wagtailcore.blocks.CharBlock(classname='title', icon='title', label='H2', template='content/stream_fields/h2.html')), ('embed', wagtail.wagtailembeds.blocks.EmbedBlock(icon='link', label='Эмбед')), ('image', wagtail.wagtailcore.blocks.StructBlock((('image', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография')), ('caption', wagtail.wagtailcore.blocks.CharBlock(label='Подпись', required=False))), icon='image', label='Фотография', template='content/stream_fields/image.html')), ('wide_image', wagtail.wagtailcore.blocks.StructBlock((('image', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография')), ('caption', wagtail.wagtailcore.blocks.CharBlock(label='Подпись', required=False))), icon='image', label='Широкая фотография', template='content/stream_fields/wide_image.html')), ('left_image', wagtail.wagtailcore.blocks.StructBlock((('image', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография')), ('title', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок', required=False)), ('notes', wagtail.wagtailcore.blocks.ListBlock(wagtail.wagtailcore.blocks.StructBlock((('key', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок')), ('value', wagtail.wagtailcore.blocks.CharBlock(label='Описание')))), label='Подписи'))), icon='image', label='Фотография слева', template='content/stream_fields/left_image.html')), ('left_text', wagtail.wagtailcore.blocks.StructBlock((('title', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок', required=False)), ('notes', wagtail.wagtailcore.blocks.RichTextBlock(editor='tinymce', language='ru'))), label='Текст слева', template='content/stream_field/left_text.html')), ('left_text_gray', wagtail.wagtailcore.blocks.StructBlock((('title', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок', required=False)), ('notes', wagtail.wagtailcore.blocks.RichTextBlock(editor='tinymce', language='ru'))), label='Текст слева на сером фоне', template='content/stream_field/left_text_gray.html')), ('paragraph', wagtail.wagtailcore.blocks.RichTextBlock(editor='tinymce', label='Параграф', language='ru', template='content/stream_fields/paragraph.html')), ('read_also', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница')),))), ('gallery', wagtail.wagtailcore.blocks.ListBlock(content.blocks.ImageBlock, icon='image', label='Галерея', template='content/stream_fields/gallery.html')), ('notes', wagtail.wagtailcore.blocks.ListBlock(wagtail.wagtailcore.blocks.StructBlock((('key', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок')), ('value', wagtail.wagtailcore.blocks.CharBlock(label='Описание')))), label='Подписи', template='content/stream_fields/notes.html')), ('html_field', wagtail.wagtailcore.blocks.TextBlock(help_text='Поле для html, css и js (может использоваться для сложных embed-кодов)', icon='code', label='html врезка', template='content/stream_fields/html_field.html')), ('anchor_field', wagtail.wagtailcore.blocks.static_block.StaticBlock(admin_text='Якорь (передергивает скрипты аналитики и баннеры)', icon='repeat', label='Якорь', template='content/stream_fields/anchor_field.html')), ('box_field', wagtail.wagtailcore.blocks.StructBlock((('title', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок')), ('body', wagtail.wagtailcore.blocks.RichTextBlock(editor='tinymce', label='Содержание', language='ru', required=True))))), ('blockquote', wagtail.wagtailcore.blocks.CharBlock(icon='openquote', label='Цитата', template='content/stream_fields/blockquote.html')))),
        ),
        migrations.AlterField(
            model_name='newspage',
            name='body',
            field=wagtail.wagtailcore.fields.StreamField((('h2', wagtail.wagtailcore.blocks.CharBlock(classname='title', icon='title', label='H2', template='content/stream_fields/h2.html')), ('embed', wagtail.wagtailembeds.blocks.EmbedBlock(icon='link', label='Эмбед')), ('image', wagtail.wagtailcore.blocks.StructBlock((('image', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография')), ('caption', wagtail.wagtailcore.blocks.CharBlock(label='Подпись', required=False))), icon='image', label='Фотография', template='content/stream_fields/image.html')), ('wide_image', wagtail.wagtailcore.blocks.StructBlock((('image', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография')), ('caption', wagtail.wagtailcore.blocks.CharBlock(label='Подпись', required=False))), icon='image', label='Широкая фотография', template='content/stream_fields/wide_image.html')), ('left_image', wagtail.wagtailcore.blocks.StructBlock((('image', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография')), ('title', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок', required=False)), ('notes', wagtail.wagtailcore.blocks.ListBlock(wagtail.wagtailcore.blocks.StructBlock((('key', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок')), ('value', wagtail.wagtailcore.blocks.CharBlock(label='Описание')))), label='Подписи'))), icon='image', label='Фотография слева', template='content/stream_fields/left_image.html')), ('left_text', wagtail.wagtailcore.blocks.StructBlock((('title', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок', required=False)), ('notes', wagtail.wagtailcore.blocks.RichTextBlock(editor='tinymce', language='ru'))), label='Текст слева', template='content/stream_field/left_text.html')), ('left_text_gray', wagtail.wagtailcore.blocks.StructBlock((('title', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок', required=False)), ('notes', wagtail.wagtailcore.blocks.RichTextBlock(editor='tinymce', language='ru'))), label='Текст слева на сером фоне', template='content/stream_field/left_text_gray.html')), ('paragraph', wagtail.wagtailcore.blocks.RichTextBlock(editor='tinymce', label='Параграф', language='ru', template='content/stream_fields/paragraph.html')), ('read_also', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница')),))), ('gallery', wagtail.wagtailcore.blocks.ListBlock(content.blocks.ImageBlock, icon='image', label='Галерея', template='content/stream_fields/gallery.html')), ('notes', wagtail.wagtailcore.blocks.ListBlock(wagtail.wagtailcore.blocks.StructBlock((('key', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок')), ('value', wagtail.wagtailcore.blocks.CharBlock(label='Описание')))), label='Подписи', template='content/stream_fields/notes.html')), ('html_field', wagtail.wagtailcore.blocks.TextBlock(help_text='Поле для html, css и js (может использоваться для сложных embed-кодов)', icon='code', label='html врезка', template='content/stream_fields/html_field.html')), ('anchor_field', wagtail.wagtailcore.blocks.static_block.StaticBlock(admin_text='Якорь (передергивает скрипты аналитики и баннеры)', icon='repeat', label='Якорь', template='content/stream_fields/anchor_field.html')), ('box_field', wagtail.wagtailcore.blocks.StructBlock((('title', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок')), ('body', wagtail.wagtailcore.blocks.RichTextBlock(editor='tinymce', label='Содержание', language='ru', required=True))))), ('blockquote', wagtail.wagtailcore.blocks.CharBlock(icon='openquote', label='Цитата', template='content/stream_fields/blockquote.html')))),
        ),
    ]
