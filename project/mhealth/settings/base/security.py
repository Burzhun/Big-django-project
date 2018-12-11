
ALLOWED_HOSTS = [
    '127.0.0.1',
    'localhost',
    'mhealth.ru',
    'new.mhealth.ru',
    'dev.mhealth.ru',
    'stage.mhealth.ru',
    'local.moscowtimes.org',
    '.review.moscowtimes.org'
]

SECRET_KEY = '3f6h%1b5@rrgvv*c92hsjo68i8bxc9#^!64k%arhd+iad=r-uf'

# AUTH_PASSWORD_VALIDATORS = [
#     {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
#     {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
#     {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
#     {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'}
# ]

SECURE_PROXY_SSL_HEADER = ('HTTP_X_HTTPS', 'on')