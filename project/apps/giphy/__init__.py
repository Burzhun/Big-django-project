from __future__ import absolute_import, unicode_literals
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured


def get_giphy_model_string():
    """
    Взято с wagtailimages/__init__.py

    Get the dotted ``app.Model`` name for the giphy (image) model as a string.
    Useful for developers making Wagtail plugins that need to refer to the
    image model, such as in foreign keys, but the model itself is not required.
    """
    return getattr(settings, 'GIPHY_MODEL', 'giphy.Giphy')


def get_giphy_model():
    """
    Взято с wagtailimages/__init__.py

    Get the image model from the ``GIPHY_MODEL`` setting.
    Useful for developers making Wagtail plugins that need the giphy (image) model.
    Defaults to the standard :class:`~giphy.models.Image` model
    if no custom model is defined.
    """
    from django.apps import apps
    model_string = get_giphy_model_string()
    try:
        return apps.get_model(model_string)
    except ValueError:
        raise ImproperlyConfigured("GIPHY_MODEL must be of the form 'app_label.model_name'")
    except LookupError:
        raise ImproperlyConfigured(
            "GIPHY_MODEL refers to model '%s' that has not been installed" % model_string
        )
