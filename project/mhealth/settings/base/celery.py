from celery.schedules import crontab

CELERY_BROKER_URL = 'redis://redis:6379/0'
CELERY_RESULT_BACKEND = 'redis://redis:6379/0'
CELERY_TIMEZONE = 'Europe/Moscow'
CELERY_BEAT_SCHEDULE = {
    # 'home_clear_cache': {
    #     'task': 'content.tasks.home_clear_cache',
    #     'schedule': 60,
    #
    # }
}