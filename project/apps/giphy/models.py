import os

from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.conf import settings
from taggit.managers import TaggableManager

from wagtail.wagtailcore.models import CollectionMember
from wagtail.wagtailsearch import index


def get_upload_to(instance, filename):
    """
    Взято с wagtailimages/models.py

    Obtain a valid upload path for an gif (image) file.

    This needs to be a module-level function so that it can be referenced within migrations,
    but simply delegates to the `get_upload_to` method of the instance, so that AbstractImage
    subclasses can override it.
    """
    return instance.get_upload_to(filename)


class AbstractGiphy(CollectionMember, index.Indexed, models.Model):
    title = models.CharField(max_length=255, verbose_name=_('title'))
    file = models.FileField(
        verbose_name=_('file'), upload_to=get_upload_to,
    )
    created_at = models.DateTimeField(verbose_name=_('created at'), auto_now_add=True, db_index=True)
    uploaded_by_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, verbose_name=_('uploaded by user'),
        null=True, blank=True, editable=False, on_delete=models.SET_NULL
    )

    tags = TaggableManager(help_text=None, blank=True, verbose_name=_('tags'))
    file_size = models.PositiveIntegerField(null=True, editable=False)

    def get_file_size(self):
        if self.file_size is None:
            try:
                self.file_size = self.file.size
            except OSError:
                # File doesn't exist
                return

            self.save(update_fields=['file_size'])

        return self.file_size

    def get_upload_to(self, filename):
        folder_name = 'giphy'
        filename = self.file.field.storage.get_valid_name(filename)

        created_at = self.file.created_at
        return os.path.join(folder_name, '{y}/{m}/{d}/{filename}'.format(**{
            'y': created_at.year,
            'm': created_at.month,
            'd': created_at.day,
            'filename': filename
        }))

    def __str__(self):
        return self.title

    search_fields = CollectionMember.search_fields + [
        index.SearchField('title', partial_match=True, boost=10),
        index.RelatedFields('tags', [
            index.SearchField('name', partial_match=True, boost=10),
        ]),
        index.FilterField('uploaded_by_user'),
    ]

    class Meta:
        abstract = True


class Giphy(AbstractGiphy):
    pass

