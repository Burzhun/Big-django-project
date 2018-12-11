from django.core.management.base import BaseCommand, CommandError
from content.models import ArticlePage, ArticleIndex, NewsPage


class Command(BaseCommand):
    def handle(self, *args, **options):
        rubrics = ArticleIndex.objects.live()
        for rubric in rubrics:
            parent = rubric.get_parent()

            if rubric.title != parent.title:
                continue

            children = rubric.get_children()
            for child in children:
                new_child = NewsPage.objects.filter(pk=child.pk).first()
                if not new_child:
                    try:
                        new_child = ArticlePage.objects.get(pk=child.pk)
                    except ArticlePage.DoesNotExist:
                        continue
                try:
                    parent = ArticleIndex.objects.get(pk=parent.pk)
                except ArticleIndex.DoesNotExist:
                    continue

                print('move %i ' % child.id)
                new_child.rubric = parent
                new_child.save()
                new_child.move(parent, 'last-child')




