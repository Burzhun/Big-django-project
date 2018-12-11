import os

if 'PRODUCTION_ENV' in os.environ:
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
else:
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
SERVER_EMAIL = 'noreply@mhealth.ru'
DEFAULT_FROM_EMAIL = 'noreply@mhealth.ru'

EMAIL_HOST = '192.168.0.15'
EMAIL_PORT = 25
