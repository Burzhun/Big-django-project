from django.core.management.base import BaseCommand
from content.models import BlogPage, NewsPage, ArticlePage
import itertools
from content.tasks import generate_preview_picture

class Command(BaseCommand):

    def handle(self, *args, **options):
        generate_preview_picture(450)

