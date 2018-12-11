from . import *

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    },
    'staticfiles': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'
    }
}
SELECT2_CACHE_BACKEND = 'default'