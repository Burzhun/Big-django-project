from django.core.management.base import BaseCommand
from django.core.cache import cache


class Command(BaseCommand):

    def handle(self, *args, **options):
        cache.delete_pattern('*home_page*')
        cache.delete_pattern('*blog_index*')
        cache.delete_pattern('*article_index*')
        cache.delete_pattern('*page_id*')
        print('removed')
