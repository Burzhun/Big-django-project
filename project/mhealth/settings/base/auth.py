AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'social_core.backends.vk.VKOAuth2',
    'social_core.backends.facebook.FacebookOAuth2',
]

SOCIAL_AUTH_FACEBOOK_KEY = '425955934536313'
SOCIAL_AUTH_FACEBOOK_SECRET = '3a3377620f9c27b616cdfa288f9cd1a1'
SOCIAL_AUTH_FACEBOOK_APP_ACCESS_TOKEN = '425955934536313|VfqP4lNvw9dTRR_lx2X9c0gWBis'
SOCIAL_AUTH_FACEBOOK_SCOPE = ['email']
SOCIAL_AUTH_FACEBOOK_PROFILE_EXTRA_PARAMS = {
  'locale': 'ru_RU',
  'fields': 'id, name, email'
}

SOCIAL_AUTH_VK_OAUTH2_KEY = '6121252'
SOCIAL_AUTH_VK_OAUTH2_SECRET = 'rC5HesSjaWK6jAtQaDXg'
SOCIAL_AUTH_VK_OAUTH2_SCOPE = ['email', 'photo_max']
LOGIN_ERROR_URL = '/'

SOCIAL_AUTH_REDIRECT_IS_HTTPS = True

SOCIAL_AUTH_PIPELINE = (
    # Get the information we can about the user and return it in a simple
    # format to create the user instance later. On some cases the details are
    # already part of the auth response from the provider, but sometimes this
    # could hit a provider API.
    'social_core.pipeline.social_auth.social_details',

    # Get the social uid from whichever service we're authing thru. The uid is
    # the unique identifier of the given user in the provider.
    'social_core.pipeline.social_auth.social_uid',

    # Verifies that the current auth process is valid within the current
    # project, this is where emails and domains whitelists are applied (if
    # defined).
    'social_core.pipeline.social_auth.auth_allowed',

    # Checks if the current social-account is already associated in the site.
    'social_core.pipeline.social_auth.social_user',

    # Make up a username for this person, appends a random string at the end if
    # there's any collision.
    'social_core.pipeline.user.get_username',

    # Send a validation email to the user to verify its email address.
    # 'social_core.pipeline.mail.mail_validation',

    # Associates the current social details with another user account with
    # a similar email address.
    'social_core.pipeline.social_auth.associate_by_email',

    # Create a user account if we haven't found one yet.
    'community.auth_pipelines.create_user',

    'community.auth_pipelines.save_profile',

    # Create the record that associated the social account with this user.
    'social_core.pipeline.social_auth.associate_user',

    # Populate the extra_data field in the social record with the values
    # specified by settings (and the default ones like access_token, etc).
    'social_core.pipeline.social_auth.load_extra_data',

    # Update the user record with any changed info from the auth service.
    'social_core.pipeline.user.user_details'
)
