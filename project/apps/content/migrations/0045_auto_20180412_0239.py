# -*- coding: utf-8 -*-
# Generated by Django 1.11.10 on 2018-04-12 02:39
from __future__ import unicode_literals

import content.models
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import taggit.managers
import wagtail.wagtailcore.blocks
import wagtail.wagtailcore.blocks.static_block
import wagtail.wagtailcore.fields
import wagtail.wagtailcore.models
import wagtail.wagtailembeds.blocks
import wagtail.wagtailimages.blocks
import wagtail.wagtailimages.models
import wagtail.wagtailsearch.index


class Migration(migrations.Migration):

    dependencies = [
        ('wagtailcore', '0040_page_draft_title'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('taggit', '0002_auto_20150616_2121'),
        ('content', '0044_tagindex_body'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomImage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255, verbose_name='title')),
                ('file', models.ImageField(height_field='height', upload_to=wagtail.wagtailimages.models.get_upload_to, verbose_name='file', width_field='width')),
                ('width', models.IntegerField(editable=False, verbose_name='width')),
                ('height', models.IntegerField(editable=False, verbose_name='height')),
                ('created_at', models.DateTimeField(auto_now_add=True, db_index=True, verbose_name='created at')),
                ('focal_point_x', models.PositiveIntegerField(blank=True, null=True)),
                ('focal_point_y', models.PositiveIntegerField(blank=True, null=True)),
                ('focal_point_width', models.PositiveIntegerField(blank=True, null=True)),
                ('focal_point_height', models.PositiveIntegerField(blank=True, null=True)),
                ('file_size', models.PositiveIntegerField(editable=False, null=True)),
                ('collection', models.ForeignKey(default=wagtail.wagtailcore.models.get_root_collection_id, on_delete=django.db.models.deletion.CASCADE, related_name='+', to='wagtailcore.Collection', verbose_name='collection')),
                ('tags', taggit.managers.TaggableManager(blank=True, help_text=None, through='taggit.TaggedItem', to='taggit.Tag', verbose_name='tags')),
                ('uploaded_by_user', models.ForeignKey(blank=True, editable=False, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL, verbose_name='uploaded by user')),
            ],
            options={
                'abstract': False,
            },
            bases=(wagtail.wagtailsearch.index.Indexed, models.Model),
        ),
        migrations.CreateModel(
            name='CustomRendition',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('filter_spec', models.CharField(db_index=True, max_length=255)),
                ('file', models.ImageField(height_field='height', upload_to=wagtail.wagtailimages.models.get_rendition_upload_to, width_field='width')),
                ('width', models.IntegerField(editable=False)),
                ('height', models.IntegerField(editable=False)),
                ('focal_point_key', models.CharField(blank=True, default='', editable=False, max_length=16)),
                ('image', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='renditions', to='content.CustomImage')),
            ],
        ),
        migrations.AlterField(
            model_name='articlepage',
            name='body',
            field=wagtail.wagtailcore.fields.StreamField((('h2', wagtail.wagtailcore.blocks.CharBlock(classname='title', icon='title', label='H2', template='content/stream_fields/h2.html')), ('embed', wagtail.wagtailembeds.blocks.EmbedBlock(icon='link', label='Эмбед')), ('image', wagtail.wagtailcore.blocks.StructBlock((('image', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография')), ('caption', wagtail.wagtailcore.blocks.CharBlock(label='Подпись', required=False))), icon='image', label='Фотография', template='content/stream_fields/image.html')), ('left_image', wagtail.wagtailcore.blocks.StructBlock((('image', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография')), ('title', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок', required=False)), ('notes', wagtail.wagtailcore.blocks.ListBlock(wagtail.wagtailcore.blocks.StructBlock((('key', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок')), ('value', wagtail.wagtailcore.blocks.CharBlock(label='Описание')))), label='Подписи'))), icon='image', label='Фотография слева', template='content/stream_fields/left_image.html')), ('paragraph', wagtail.wagtailcore.blocks.RichTextBlock(editor='tinymce', label='Параграф', language='ru', template='content/stream_fields/paragraph.html')), ('read_also', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница')),))), ('gallery', wagtail.wagtailcore.blocks.ListBlock(content.blocks.ImageBlock, icon='image', label='Галерея', template='content/stream_fields/gallery.html')), ('notes', wagtail.wagtailcore.blocks.ListBlock(wagtail.wagtailcore.blocks.StructBlock((('key', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок')), ('value', wagtail.wagtailcore.blocks.CharBlock(label='Описание')))), label='Подписи', template='content/stream_fields/notes.html')), ('html_field', wagtail.wagtailcore.blocks.TextBlock(help_text='Поле для html, css и js (может использоваться для сложных embed-кодов)', icon='code', label='html врезка', template='content/stream_fields/html_field.html')), ('anchor_field', wagtail.wagtailcore.blocks.static_block.StaticBlock(admin_text='Якорь (передергивает скрипты аналитики и баннеры)', icon='repeat', label='Якорь', template='content/stream_fields/anchor_field.html')), ('box_field', wagtail.wagtailcore.blocks.StructBlock((('title', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок')), ('body', wagtail.wagtailcore.blocks.RichTextBlock(editor='tinymce', label='Содержание', language='ru', required=True))))), ('blockquote', wagtail.wagtailcore.blocks.CharBlock(icon='openquote', label='Цитата', template='content/stream_fields/blockquote.html')))),
        ),
        migrations.AlterField(
            model_name='blogpage',
            name='body',
            field=wagtail.wagtailcore.fields.StreamField((('h2', wagtail.wagtailcore.blocks.CharBlock(classname='title', icon='title', label='H2', template='content/stream_fields/h2.html')), ('embed', wagtail.wagtailembeds.blocks.EmbedBlock(icon='link', label='Эмбед')), ('image', wagtail.wagtailcore.blocks.StructBlock((('image', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография')), ('caption', wagtail.wagtailcore.blocks.CharBlock(label='Подпись', required=False))), icon='image', label='Фотография', template='content/stream_fields/image.html')), ('left_image', wagtail.wagtailcore.blocks.StructBlock((('image', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография')), ('title', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок', required=False)), ('notes', wagtail.wagtailcore.blocks.ListBlock(wagtail.wagtailcore.blocks.StructBlock((('key', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок')), ('value', wagtail.wagtailcore.blocks.CharBlock(label='Описание')))), label='Подписи'))), icon='image', label='Фотография слева', template='content/stream_fields/left_image.html')), ('paragraph', wagtail.wagtailcore.blocks.RichTextBlock(editor='tinymce', label='Параграф', language='ru', template='content/stream_fields/paragraph.html')), ('read_also', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница')),))), ('gallery', wagtail.wagtailcore.blocks.ListBlock(content.blocks.ImageBlock, icon='image', label='Галерея', template='content/stream_fields/gallery.html')), ('notes', wagtail.wagtailcore.blocks.ListBlock(wagtail.wagtailcore.blocks.StructBlock((('key', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок')), ('value', wagtail.wagtailcore.blocks.CharBlock(label='Описание')))), label='Подписи', template='content/stream_fields/notes.html')), ('html_field', wagtail.wagtailcore.blocks.TextBlock(help_text='Поле для html, css и js (может использоваться для сложных embed-кодов)', icon='code', label='html врезка', template='content/stream_fields/html_field.html')), ('anchor_field', wagtail.wagtailcore.blocks.static_block.StaticBlock(admin_text='Якорь (передергивает скрипты аналитики и баннеры)', icon='repeat', label='Якорь', template='content/stream_fields/anchor_field.html')), ('box_field', wagtail.wagtailcore.blocks.StructBlock((('title', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок')), ('body', wagtail.wagtailcore.blocks.RichTextBlock(editor='tinymce', label='Содержание', language='ru', required=True))))), ('blockquote', wagtail.wagtailcore.blocks.CharBlock(icon='openquote', label='Цитата', template='content/stream_fields/blockquote.html')))),
        ),
        migrations.AlterField(
            model_name='eventpage',
            name='body',
            field=wagtail.wagtailcore.fields.StreamField((('h2', wagtail.wagtailcore.blocks.CharBlock(classname='title', icon='title', label='H2', template='content/stream_fields/h2.html')), ('embed', wagtail.wagtailembeds.blocks.EmbedBlock(icon='link', label='Эмбед')), ('image', wagtail.wagtailcore.blocks.StructBlock((('image', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография')), ('caption', wagtail.wagtailcore.blocks.CharBlock(label='Подпись', required=False))), icon='image', label='Фотография', template='content/stream_fields/image.html')), ('left_image', wagtail.wagtailcore.blocks.StructBlock((('image', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография')), ('title', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок', required=False)), ('notes', wagtail.wagtailcore.blocks.ListBlock(wagtail.wagtailcore.blocks.StructBlock((('key', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок')), ('value', wagtail.wagtailcore.blocks.CharBlock(label='Описание')))), label='Подписи'))), icon='image', label='Фотография слева', template='content/stream_fields/left_image.html')), ('paragraph', wagtail.wagtailcore.blocks.RichTextBlock(editor='tinymce', label='Параграф', language='ru', template='content/stream_fields/paragraph.html')), ('read_also', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница')),))), ('gallery', wagtail.wagtailcore.blocks.ListBlock(content.blocks.ImageBlock, icon='image', label='Галерея', template='content/stream_fields/gallery.html')), ('notes', wagtail.wagtailcore.blocks.ListBlock(wagtail.wagtailcore.blocks.StructBlock((('key', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок')), ('value', wagtail.wagtailcore.blocks.CharBlock(label='Описание')))), label='Подписи', template='content/stream_fields/notes.html')), ('html_field', wagtail.wagtailcore.blocks.TextBlock(help_text='Поле для html, css и js (может использоваться для сложных embed-кодов)', icon='code', label='html врезка', template='content/stream_fields/html_field.html')), ('anchor_field', wagtail.wagtailcore.blocks.static_block.StaticBlock(admin_text='Якорь (передергивает скрипты аналитики и баннеры)', icon='repeat', label='Якорь', template='content/stream_fields/anchor_field.html')), ('box_field', wagtail.wagtailcore.blocks.StructBlock((('title', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок')), ('body', wagtail.wagtailcore.blocks.RichTextBlock(editor='tinymce', label='Содержание', language='ru', required=True))))), ('blockquote', wagtail.wagtailcore.blocks.CharBlock(icon='openquote', label='Цитата', template='content/stream_fields/blockquote.html')))),
        ),
        migrations.AlterField(
            model_name='issuepage',
            name='body',
            field=wagtail.wagtailcore.fields.StreamField((('h2', wagtail.wagtailcore.blocks.CharBlock(classname='title', icon='title', label='H2', template='content/stream_fields/h2.html')), ('embed', wagtail.wagtailembeds.blocks.EmbedBlock(icon='link', label='Эмбед')), ('image', wagtail.wagtailcore.blocks.StructBlock((('image', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография')), ('caption', wagtail.wagtailcore.blocks.CharBlock(label='Подпись', required=False))), icon='image', label='Фотография', template='content/stream_fields/image.html')), ('left_image', wagtail.wagtailcore.blocks.StructBlock((('image', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография')), ('title', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок', required=False)), ('notes', wagtail.wagtailcore.blocks.ListBlock(wagtail.wagtailcore.blocks.StructBlock((('key', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок')), ('value', wagtail.wagtailcore.blocks.CharBlock(label='Описание')))), label='Подписи'))), icon='image', label='Фотография слева', template='content/stream_fields/left_image.html')), ('paragraph', wagtail.wagtailcore.blocks.RichTextBlock(editor='tinymce', label='Параграф', language='ru', template='content/stream_fields/paragraph.html')), ('read_also', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница')),))), ('gallery', wagtail.wagtailcore.blocks.ListBlock(content.blocks.ImageBlock, icon='image', label='Галерея', template='content/stream_fields/gallery.html')), ('notes', wagtail.wagtailcore.blocks.ListBlock(wagtail.wagtailcore.blocks.StructBlock((('key', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок')), ('value', wagtail.wagtailcore.blocks.CharBlock(label='Описание')))), label='Подписи', template='content/stream_fields/notes.html')), ('html_field', wagtail.wagtailcore.blocks.TextBlock(help_text='Поле для html, css и js (может использоваться для сложных embed-кодов)', icon='code', label='html врезка', template='content/stream_fields/html_field.html')), ('anchor_field', wagtail.wagtailcore.blocks.static_block.StaticBlock(admin_text='Якорь (передергивает скрипты аналитики и баннеры)', icon='repeat', label='Якорь', template='content/stream_fields/anchor_field.html')), ('box_field', wagtail.wagtailcore.blocks.StructBlock((('title', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок')), ('body', wagtail.wagtailcore.blocks.RichTextBlock(editor='tinymce', label='Содержание', language='ru', required=True))))), ('blockquote', wagtail.wagtailcore.blocks.CharBlock(icon='openquote', label='Цитата', template='content/stream_fields/blockquote.html')))),
        ),
        migrations.AlterField(
            model_name='newspage',
            name='body',
            field=wagtail.wagtailcore.fields.StreamField((('h2', wagtail.wagtailcore.blocks.CharBlock(classname='title', icon='title', label='H2', template='content/stream_fields/h2.html')), ('embed', wagtail.wagtailembeds.blocks.EmbedBlock(icon='link', label='Эмбед')), ('image', wagtail.wagtailcore.blocks.StructBlock((('image', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография')), ('caption', wagtail.wagtailcore.blocks.CharBlock(label='Подпись', required=False))), icon='image', label='Фотография', template='content/stream_fields/image.html')), ('left_image', wagtail.wagtailcore.blocks.StructBlock((('image', wagtail.wagtailimages.blocks.ImageChooserBlock(label='Фотография')), ('title', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок', required=False)), ('notes', wagtail.wagtailcore.blocks.ListBlock(wagtail.wagtailcore.blocks.StructBlock((('key', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок')), ('value', wagtail.wagtailcore.blocks.CharBlock(label='Описание')))), label='Подписи'))), icon='image', label='Фотография слева', template='content/stream_fields/left_image.html')), ('paragraph', wagtail.wagtailcore.blocks.RichTextBlock(editor='tinymce', label='Параграф', language='ru', template='content/stream_fields/paragraph.html')), ('read_also', wagtail.wagtailcore.blocks.StructBlock((('page', wagtail.wagtailcore.blocks.PageChooserBlock(label='Страница')),))), ('gallery', wagtail.wagtailcore.blocks.ListBlock(content.blocks.ImageBlock, icon='image', label='Галерея', template='content/stream_fields/gallery.html')), ('notes', wagtail.wagtailcore.blocks.ListBlock(wagtail.wagtailcore.blocks.StructBlock((('key', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок')), ('value', wagtail.wagtailcore.blocks.CharBlock(label='Описание')))), label='Подписи', template='content/stream_fields/notes.html')), ('html_field', wagtail.wagtailcore.blocks.TextBlock(help_text='Поле для html, css и js (может использоваться для сложных embed-кодов)', icon='code', label='html врезка', template='content/stream_fields/html_field.html')), ('anchor_field', wagtail.wagtailcore.blocks.static_block.StaticBlock(admin_text='Якорь (передергивает скрипты аналитики и баннеры)', icon='repeat', label='Якорь', template='content/stream_fields/anchor_field.html')), ('box_field', wagtail.wagtailcore.blocks.StructBlock((('title', wagtail.wagtailcore.blocks.CharBlock(label='Заголовок')), ('body', wagtail.wagtailcore.blocks.RichTextBlock(editor='tinymce', label='Содержание', language='ru', required=True))))), ('blockquote', wagtail.wagtailcore.blocks.CharBlock(icon='openquote', label='Цитата', template='content/stream_fields/blockquote.html')))),
        ),
        migrations.AlterUniqueTogether(
            name='customrendition',
            unique_together=set([('image', 'filter_spec', 'focal_point_key')]),
        ),
    ]
