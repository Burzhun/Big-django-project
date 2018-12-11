import os

if 'PRODUCTION_ENV' in os.environ:
    CACHES = {
        "default": {
            "BACKEND": "django_redis.cache.RedisCache",
            "LOCATION": "redis-cache://redis-cache:6379/0",
            "OPTIONS": {
                "CLIENT_CLASS": "django_redis.client.DefaultClient"
            },

        }
    }
else:
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
        }
    }


CACHES['staticfiles'] = {'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'}
CACHES['select2'] = {
    "BACKEND": "django_redis.cache.RedisCache",
    "LOCATION": "redis://redis:6379/0",
    "OPTIONS": {
        "CLIENT_CLASS": "django_redis.client.DefaultClient"
    },
}
SELECT2_CACHE_BACKEND = 'select2'
