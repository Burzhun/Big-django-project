from .models import generate_file_name, User
from django.core.files.base import ContentFile
from social_core.pipeline.user import USER_FIELDS
import requests
import logging

logger = logging.getLogger(__name__)


def create_user(strategy, details, backend, user=None, *args, **kwargs):
    if user:
        return {'is_new': False}

    fields = dict((name, kwargs.get(name, details.get(name)))
                  for name in backend.setting('USER_FIELDS', USER_FIELDS))
    if not fields:
        return

    if not fields.get('email'):
        fields['email'] = kwargs['response']['id'] + '@' + backend.name + '.social'
    user = strategy.create_user(**fields)
    user.set_password(User.objects.make_random_password())
    return {
        'is_new': True,
        'user': user
    }


def save_profile(backend, user, response, is_new=False, *args, **kwargs):
    if backend.name == 'facebook':
        if response.get('gender'):
            user.gender = User.GENDER_MALE if response.get('gender') == 'male' else User.GENDER_FEMALE
        if is_new or not user.avatar:
            url = 'http://graph.facebook.com/{0}/picture?type=large'.format(response['id'])
            try:
                r = requests.get(url=url)
                r.raise_for_status()
            except requests.HTTPError:
                pass
            else:
                if kwargs['details'].get('email'):
                    user.email = kwargs['details'].get('email')
                    user.save()
                user.avatar.save(
                    '{0}_fb.jpg'.format(response['id']),
                    ContentFile(r.content),
                    save=True
                )

    elif backend.name == 'vk-oauth2':
        if is_new or not user.avatar:
            try:
                access_token = '97b946b297b946b297b946b29f97e42196997b997b946b2cec88e8daa0bc5833d37d6cd'
                url = 'https://api.vk.com/method/users.get?'
                url += 'v=5&user_id={0}&fields=photo_max&access_token={1}'.format(response['id'], access_token)
                r = requests.get(
                    url=url
                ).json()

                r = requests.get(url=r['response'][0]['photo_max'])
                r.raise_for_status()
            except requests.HTTPError:
                pass
            else:
                user.avatar.save(
                    '{0}_vk.jpg'.format(response['id']),
                    ContentFile(r.content),
                    save=True
                )

    user.save()
