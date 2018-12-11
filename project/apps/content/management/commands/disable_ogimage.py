import itertools
import requests
from time import sleep
import json
from datetime import datetime

from django.core.management.base import BaseCommand
from django.core.exceptions import ValidationError
from django.conf import settings

from content.models import ArticlePage, NewsPage, BlogPage


class Command(BaseCommand):

    def handle(self, *args, **options):
        news = NewsPage.objects.all()
        blogs = BlogPage.objects.all()
        articles = ArticlePage.objects.all()

        for entry in itertools.chain(news, blogs, articles):
            entry.generate_og_preview_picture = False
            entry.save()
