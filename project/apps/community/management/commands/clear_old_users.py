from django.core.management.base import BaseCommand, CommandError
from community.models import User


class Command(BaseCommand):

    def handle(self, *args, **options):
        users = User.objects.all()
        for user in users:
            if not user.password:
                try:
                    print(user.email)
                    user.set_password(User.objects.make_random_password())
                    user.save()
                except UnicodeEncodeError:
                    pass



