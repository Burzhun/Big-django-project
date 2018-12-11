import os

TEMPLATES = [{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [
        os.path.join(PROJECT_DIR, 'templates'),
    ],
    'OPTIONS': {
        'debug': DEBUG,
        'context_processors': [
            'django.template.context_processors.debug',
            'django.template.context_processors.request',
            'django.contrib.auth.context_processors.auth',
            'django.contrib.messages.context_processors.messages',
            'wagtail.contrib.settings.context_processors.settings',
            'wagtailmenus.context_processors.wagtailmenus',
        ],
        'loaders': [
            ('django.template.loaders.cached.Loader', [
                'django.template.loaders.filesystem.Loader',
                'django.template.loaders.app_directories.Loader',
            ]),
        ]
    },
}]

if DEBUG:
    TEMPLATES[0]['OPTIONS']['loaders'] = (
        'django.template.loaders.filesystem.Loader',
        'django.template.loaders.app_directories.Loader',
    )