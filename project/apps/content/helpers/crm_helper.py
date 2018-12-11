from django.conf import settings
import requests


def subscribe(email):
    data = {
        'email': email,
        'block_id': settings.CRM_BLOCK_ID,
        'project_id': settings.CRM_PROJECT_ID
    }

    r = requests.post(settings.CRM_SUBSCRIBE_URL, data=data)

    return r.text
