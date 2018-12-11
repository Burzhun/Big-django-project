from django.conf import settings
from ipware import get_client_ip
import requests


def check_captcha(request):
    response = request.POST.get('g-recaptcha-response')
    if not response:
        return False
    secret = settings.G_CAPTCHA_SECRET
    remoteip, is_routable = get_client_ip(request)
    r = requests.post(
        settings.G_CAPTCHA_URL,
        data={
            'response': response,
            'secret': secret,
            'remoteip': remoteip
        }
    ).json()

    if r['success'] is True:
        return True

    return False
