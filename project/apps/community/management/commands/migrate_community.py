from django.core.management.base import BaseCommand, CommandError
from django.utils.text import slugify
from django.db.models import Q
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.db.utils import IntegrityError, DataError
from wagtail.wagtailimages import get_image_model
from django.db import connections

from content.management.commands.migrate_content import Downloader
from community.choices import CITY_CHOICES
from social_django.models import UserSocialAuth
from datetime import datetime
import MySQLdb
import requests
import json
import phpserialize
import pytz
from subprocess import call

User = get_user_model()


class UserImporter:

    def __init__(self, external_user, social_auth=None):
        self.external_user = external_user
        self.social_auth = social_auth

    def run(self):
        if 'avatar' in self.external_user:
            self.external_user["avatar"] = Downloader(
                self.external_user["avatar"],
                'user',
                self.external_user['date_joined']
            ).download()

        try:
            user = User(**self.external_user)
            user.save()
            if self.social_auth:
                self.social_auth['user'] = user
                social_auth = UserSocialAuth(**self.social_auth)
                social_auth.save()
            print(user.id)
        except IntegrityError:
            print('error')
        except DataError:
            print('error data')


class Command(BaseCommand):
    help = 'Перенос пользователей со старой базы данных'

    CONTENT_TABLE_NAME = 'b_iblock_element'
    USER_TABLE_NAME = 'b_user'
    FILE_TABLE_NAME = 'b_file'
    UTS_USER_TABLE_NAME = 'b_uts_user'
    BLOG_USER_TABLE_NAME = 'b_blog_user'
    SOCIAL_TABLE_NAME = 'b_socialservices_user'

    UPLOAD_URL = 'http://www.mhealth.ru/upload'
    CITY_CHOICES = dict(CITY_CHOICES)

    def unserialize(self, value):
        if not value:
            return {}
        return phpserialize.loads(value.encode('utf-8'), decode_strings=True)

    def handle(self, *args, **options):
        # User.objects.exclude(email='yu.yunusov@moscowtimes.org').delete()
        # call(['rm', '-rf', '/app/media/images/user'])

        c = connections['mysql'].cursor()

        c.execute('''
            select u.ID, u.LOGIN, u.PASSWORD, u.NAME, u.LAST_NAME, u.EMAIL,
            u.PERSONAL_GENDER, u.PERSONAL_BIRTHDAY, u.PERSONAL_COUNTRY, u.PERSONAL_NOTES,
            u.PERSONAL_CITY,uts.UF_SHOW_IN_PROFILE,  uts.UF_HAS_BABY, CONCAT(a.SUBDIR, '/', a.FILE_NAME),
            u.DATE_REGISTER, su.XML_ID, su.EXTERNAL_AUTH_ID, uts.UF_RULES
            from b_user as u
            
            LEFT JOIN b_uts_user as uts ON u.ID = uts.VALUE_ID
            LEFT JOIN (
                select  bu.USER_ID, f.SUBDIR, f.FILE_NAME from b_blog_user as bu
                left join b_file as f on bu.AVATAR=f.ID
            ) as a on a.USER_ID=u.ID
            LEFT JOIN b_socialservices_user as su on su.USER_ID=u.ID
            where u.DATE_REGISTER > '2006-08-01 17:56:34' and u.ACTIVE='Y' and u.EMAIL<>'yu.yunusov@moscowtimes.org' and u.EMAIL != '' and not u.EMAIL like '%antipickup.ru' 
            ORDER BY u.DATE_REGISTER asc
        ''')

        keys = [
            'old_id', 'username', 'old_password_hash', 'first_name', 'last_name', 'email',
            'gender', 'b_date', 'country', 'notes', 'city', 'uf_public', 'has_children',
            'avatar', 'date_joined', 'uid', 'provider', 'rules'
        ]

        def row_convert(row):
            result = dict(zip(keys, row))
            for item in list(result.keys()):
                if not result[item]:
                    del result[item]

            if 'uf_public' in result:
                try:
                    result['uf_public'] = list(self.unserialize(result['uf_public']).values())
                    result['is_public_has_children_choices'] = 'UF_HAS_BABY' in result['uf_public']
                    result['is_public_email'] = 'EMAIL' in result['uf_public']
                    result['is_public_b_date'] = 'PERSONAL_BIRTHDAY' in result['uf_public']
                except ValueError:
                    pass
                del result['uf_public']

            # if 'has_children' in result:
            #     if result['has_children'] == '10':
            #         result['has_children'] = User.HAS_CHILDREN_YES
            #     elif result['has_children'] == '11':
            #         result['has_children'] = User.HAS_CHILDREN_NO
            #     elif result['has_children'] == '12':
            #         result['has_children'] = User.HAS_CHILDREN_SOON
            if 'gender' in result:
                if result['gender'] == 'M':
                    result['gender'] = User.GENDER_MALE
                elif result['gender'] == 'F':
                    result['gender'] = User.GENDER_FEMALE
            if 'avatar' in result:
                result['avatar'] = self.UPLOAD_URL + '/' + result['avatar']
            if 'city' in result:
                if result['city'].isdigit():
                    try:
                        result['city'] = self.CITY_CHOICES[result['city']]
                    except KeyError:
                        pass

            if 'country' in result:
                result['country'] = int(result['country'])
            if 'date_joined' in result:
                result['date_joined'] = pytz.utc.localize(result['date_joined'])
            if 'notes' in result:
                result['notes'] = result['notes'][0:1000]
            if 'rules' in result:
                result['rules'] = result['rules'] is True
            result['social_auth'] = None
            if 'provider' in result and 'uid' in result:
                result['provider'] = 'vk-oauth2' if result['provider'] == 'VKontakte' else result['provider'].lower()
                result['social_auth'] = {'provider': result['provider'], 'uid': result['uid']}
            if 'provider' in result:
                del result['provider']
            if 'uid' in result:
                del result['uid']

            return result

        external_users = list(map(row_convert, c))

        for user in external_users:
            social_auth = user['social_auth']
            del user['social_auth']
            UserImporter(user, social_auth).run()
