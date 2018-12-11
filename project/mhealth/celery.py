from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', "mhealth.settings")
app = Celery('mhealth')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()

from django.apps import apps


@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))



