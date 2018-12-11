import itertools
import re

from django.core.management.base import BaseCommand
from content.models import ArticlePage, BlogPage, NewsPage


def get_adult_words():
    with open('/app/apps/content/management/commands/adult_words.txt', 'r') as f:
        return f.read().split(',')


class Command(BaseCommand):
    """
        Обновляет параметр has_adult_content статьи с контентом 18+
    """

    def __init__(self, *args, **kwargs):
        super(Command, self).__init__(*args, **kwargs)
        self.adult_words = get_adult_words()

    def has_adult_words(self, body):
        # Нужно пройтись по массиву добытых слов в функции get_adult_words
        # и проверить тело статьи
        if type(body) is not str:
            body = str(body)
        for word in self.adult_words:
            text = body.replace('\n', ' ').lower()
            if len(re.findall(r'\b%s\b' % word.lower(), text)) > 0:
                return True
        return False

    def detect_adult_article(self, article):
        if self.has_adult_words(article.body.stream_data):
            article.has_adult_content = True
        else:
            article.has_adult_content = False
        article.save()

    def handle(self, *args, **options):
        news = NewsPage.objects.all()
        articles = ArticlePage.objects.all()
        blogs = BlogPage.objects.all()

        for entry in itertools.chain(articles, news, blogs):
            self.detect_adult_article(entry)
