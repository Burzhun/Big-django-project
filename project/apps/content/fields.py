from wagtail.wagtailcore import blocks
from wagtail.wagtailembeds.blocks import EmbedBlock

from content.blocks import (
    Banner, GroupBlock, HeadlinesBlock, ExpertBlock,
    SpecialBlock, ReadAlso, ImageBlock, NoteBlock, ImageNotesBlock, LeftText, BoxBlock,
    PollBlock, BigSideImageBlock
)
from giphy.blocks import GiphyChooserBlock


class PageBodyStreamField(blocks.StreamBlock):
    group_1 = blocks.StructBlock([
        ('standart_1', GroupBlock(label='Материал 1 (стандартный)')),
        ('headlines', HeadlinesBlock()),
        ('standart_2', GroupBlock(label='Материал 2 (стандартный)'))
    ],
        label='Три блока с главными материалами',
        icon="cog",
        template='content/groups/group_1.html'
    )

    group_2 = blocks.StructBlock([
        ('standart_1', GroupBlock(label='Материал 1 (стандартный)')),
        ('standart_2', GroupBlock(label='Материал 2 (стандартный)')),
        ('standart_3', GroupBlock(label='Материал 3 (стандартный)'))
    ],
        label='Три блока',
        icon="cog",
        template='content/groups/group_2.html'
    )

    group_3 = blocks.StructBlock([
        ('standart_1', GroupBlock(label='Материал 1 (стандартный)')),
        ('expert', ExpertBlock()),
        ('standart_2', GroupBlock(label='Материал 3 (стандартный)'))
    ],
        label='Три блока с советом эксперта',
        icon="cog",
        template='content/groups/group_3.html'
    )

    special_field = blocks.ListBlock(
        SpecialBlock(),
        label='Спецпроекты',
        icon='view',
        template="content/stream_fields/special_field.html"
    )
    banner = Banner(template="content/stream_fields/banner.html")

    mobile_banner = Banner(template="content/stream_fields/banner.html")


class ContentStreamField(blocks.StreamBlock):
    h2 = blocks.CharBlock(
        icon="title",
        classname="title",
        label='H2',
        template='content/stream_fields/h2.html'
    )
    embed = EmbedBlock(label='Эмбед', icon="link")
    image = ImageBlock(
        icon="image",
        label='Фотография',
        template='content/stream_fields/image.html'
    )
    wide_image = ImageBlock(
        icon="image",
        label='Широкая фотография',
        template='content/stream_fields/wide_image.html'
    )
    left_image = ImageNotesBlock(
        icon="image",
        label='Фотография слева',
        template='content/stream_fields/left_image.html'
    )
    left_text = LeftText(
        template='content/stream_fields/left_text.html',
        label='Текст слева'
    )
    left_text_gray = LeftText(
        template='content/stream_fields/left_text_gray.html',
        label='Текст слева на сером фоне'
    )
    paragraph = blocks.RichTextBlock(
        editor='tinymce',
        language='ru',
        label='Параграф',
        template='content/stream_fields/paragraph.html'
    )
    read_also = ReadAlso()
    gallery = blocks.ListBlock(
        ImageBlock,
        label='Галерея',
        icon="image",
        template='content/stream_fields/gallery.html'
    )
    notes = blocks.ListBlock(
        NoteBlock(),
        label='Подписи',
        template='content/stream_fields/notes.html',
    )

    html_field = blocks.TextBlock(
        label='html врезка',
        help_text='Поле для html, css и js (может использоваться для сложных embed-кодов)',
        template='content/stream_fields/html_field.html',
        icon='code'
    )
    anchor_field = blocks.StaticBlock(
        admin_text='Якорь (передергивает скрипты аналитики и баннеры)',
        icon="repeat",
        label="Якорь",
        template='content/stream_fields/anchor_field.html',
    )
    box_field = BoxBlock()
    blockquote = blocks.CharBlock(
        label='Цитата',
        template='content/stream_fields/blockquote.html',
        icon='openquote'
    )
    poll = PollBlock()

    giphy_block = GiphyChooserBlock(help_text='Поиск гифок', template='content/stream_fields/giphy.html')

    big_side_image = BigSideImageBlock()


    simple_quote_1 = blocks.TextBlock(
        required=True,
        label="Простая цитата 1",
        template="content/stream_fields/simple_quote_1.html",
        icon="openquote"
    )
    simple_quote_2 = blocks.TextBlock(
        required=True,
        label="Простая цитата 2",
        template="content/stream_fields/simple_quote_2.html",
        icon="openquote"
    )

