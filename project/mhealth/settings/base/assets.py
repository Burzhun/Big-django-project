import os

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.11/howto/static-files/

STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'pipeline.finders.PipelineFinder',
]

STATICFILES_DIRS = [
    os.path.join(PROJECT_DIR, 'static'),
    os.path.join(PROJECT_DIR, '..', 'frontend'),
]

STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATIC_URL = '/static/'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

STATICFILES_STORAGE = 'pipeline.storage.PipelineCachedStorage'

PIPELINE = {
    'JAVASCRIPT': {
        'vendor': {
            'source_filenames': (
                'vendors/jquery/jquery-3.3.1.min.js',
                'vendors/bootstrap-3.3.7/js/bootstrap.js',
                'vendors/colorbox/jquery.colorbox-min.js',
                'vendors/idangerous.swiper/idangerous.swiper.js',
                'vendors/slick/slick.min.js',
                'vendors/bootstrap-modal/bootstrap-modal.js',
                'vendors/bootstrap-datetimepicker/js/bootstrap-datepicker.min.js',
                'vendors/bootstrap-datetimepicker/locales/bootstrap-datepicker.ru.min.js',
            ),
            'output_filename': 'assets/js/vendor.js',
        },
        'main': {
            'source_filenames': (
                'js/components/*.js',
            ),
            'output_filename': 'assets/js/main.js',
        },

        'vendor_mobile': {
            'source_filenames': (
                'vendors/jquery/jquery-2.1.1.min.js',
                'vendors/idangerous.swiper/idangerous.swiper.js',
                'vendors/jquery.mobile-1.4.5/jquery.mobile-1.4.5.min.js',
                'vendors/slick/slick.min.js',
            ),
            'output_filename': 'assets/js/mobile/vendor.js',
        },

        'main_mobile': {
            'source_filenames': (
                'js/mobile/components/*.js',
                'js/components/load_more.js',
                'js/components/csrf.js',
                'js/components/share.js',
                'js/components/gallery.js',
                'js/components/reload_emulator.js',
                'js/components/anchor.js',
                'js/components/links.js',
                'js/components/poll.js',
            ),
            'output_filename': 'assets/js/mobile/main.js',
        }
    },
    'STYLESHEETS': {
        'vendor': {
            'source_filenames': (
                'vendors/colorbox/colorbox.css',
                'vendors/slick/slick.css',
                'vendors/idangerous.swiper/idangerous.swiper.css',
                'vendors/bootstrap-datetimepicker/css/bootstrap-datepicker3.min.css',
            ),
            'output_filename': 'assets/css/vendor.css',
        },
        'main': {
            'source_filenames': (

                'css/normalize.css',
                'css/styles.css',
                'css/fonts.css',
                'css/components/*.css',
            ),
            'output_filename': 'assets/css/main.css',
        },

        'vendor_mobile': {
            'source_filenames': (
                'vendors/slick/slick.css',
                'vendors/idangerous.swiper/idangerous.swiper.css',
                'vendors/jquery.mobile-1.4.5/jquery.mobile-1.4.5.min.css',
            ),
            'output_filename': 'assets/css/mobile/vendor.css',
        },

        'main_mobile': {
            'source_filenames': (
                'css/components/load_more.css',
                'css/components/poll.css',
                'css/fonts.css',
                'css/mobile.css',
            ),
            'output_filename': 'assets/css/mobile/main.css',
        }
    },
    'JS_COMPRESSOR': None,
    'CSS_COMPRESSOR': None,
    'DISABLE_WRAPPER': True
}
