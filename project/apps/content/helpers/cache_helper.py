from django.utils import timezone
from django.core.exceptions import FieldError
from banners.models import Banner, ScriptItem
import hashlib


def prefix_key(prefix, models, page=1, is_mobile=False, count=5, prefix_func=None, qs_func=None):
    if not prefix_func:
        prefix_func = lambda x: str(x.last_published_at)
    if not qs_func:
        def qs_func(page):
            qs = page.objects.live()
            try:
                return qs.filter(published_at__lte=timezone.now()).order_by('-published_at')
            except FieldError:
                return qs.order_by('-last_published_at')
    querysets = map(
        lambda model: qs_func(model)[:count],
        models
    )
    pages = []
    for qs in querysets:
        pages += list(qs)

    hash_string = ''.join(map(prefix_func, pages))
    hash_string += 'p' + str(page)
    hash_string += 'm1' if is_mobile else 'm0'

    banners = Banner.objects.all().order_by('-last_modifed_date')[:5]
    hash_string += ''.join([str(item.last_modifed_date) for item in banners])
    scripts = ScriptItem.objects.all().order_by('-last_modifed_date')[:5]
    hash_string += ''.join([str(item.last_modifed_date) for item in scripts])

    hash = hashlib.md5(hash_string.encode())

    return prefix + '_' + hash.hexdigest()
