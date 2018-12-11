from __future__ import absolute_import, unicode_literals

import json
import giphy_client
import ast

from django.http import Http404
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

from wagtail.utils.pagination import paginate
from wagtail.wagtailadmin.modal_workflow import render_modal_workflow
from wagtail.wagtailadmin.utils import popular_tags_for_model
from wagtail.wagtailcore.models import Collection
from wagtail.wagtailadmin.forms import SearchForm

from giphy import get_giphy_model


def get_chooser_context(request):
    """Helper function to return common template context variables for the main chooser view"""

    collections = Collection.objects.all()
    if len(collections) < 2:
        collections = None

    return {
        'searchform': SearchForm(),
        'is_searching': False,
        'query_string': None,
        'will_select_format': request.GET.get('select_format'),
        'popular_tags': popular_tags_for_model(get_giphy_model()),
        'collections': collections,
    }


def chooser(request):
    Giphy = get_giphy_model()

    # TODO: пока нет смысла проверять права (код взят с wagtailimages), но лучше потом включить
    # if permission_policy.user_has_permission(request.user, 'add'):
    #     ImageForm = get_image_form(Image)
    #     uploadform = ImageForm(user=request.user)
    # else:
    #     uploadform = None

    giphy_items = Giphy.objects.order_by('-created_at')

    # TODO: пока нет смысла добавлять хуки как это сделано с картинками (код взят с wagtailimages)
    # # allow hooks to modify the queryset
    # for hook in hooks.get_hooks('construct_image_chooser_queryset'):
    #     images = hook(images, request)

    if (
            'q' in request.GET or 'p' in request.GET or 'tag' in request.GET or
            'collection_id' in request.GET
    ):

        # this request is triggered from search, pagination or 'popular tags';
        # we will just render the results.html fragment
        collection_id = request.GET.get('collection_id')
        if collection_id:
            giphy_items = giphy_items.filter(collection=collection_id)

        searchform = SearchForm(request.GET)
        if searchform.is_valid():
            q = searchform.cleaned_data['q']
            api_instance = giphy_client.DefaultApi()
            api_key = settings.GIPHY_API_KEY
            limit = 99
            offset = int(request.GET.get('p', 0)) * 12
            rating = 'R'
            lang = 'en'
            fmt = 'json'
            try:
                api_response = api_instance.gifs_search_get(api_key, q, limit=limit, offset=offset, rating=rating,
                                                            lang=lang, fmt=fmt)
                giphy_items = api_response.data
            except giphy_client.rest.ApiException:
                raise Http404

            is_searching = True
        else:
            is_searching = False
            q = None

            tag_name = request.GET.get('tag')
            if tag_name:
                giphy_items = giphy_items.filter(tags__name=tag_name)

        # Pagination
        paginator, giphy_items = paginate(request, giphy_items, per_page=12)

        return render(request, "giphy/chooser/results.html", {
            'paginator': paginator,
            'giphy_items': giphy_items,
            'is_searching': is_searching,
            'query_string': q,
            'will_select_format': request.GET.get('select_format')
        })
    else:
        paginator, giphy_items = paginate(request, giphy_items, per_page=12)

        context = get_chooser_context(request)
        context.update({
            'gifs': giphy_items,
        })
        return render_modal_workflow(
            request, 'giphy/chooser/chooser.html', 'giphy/chooser/chooser.js', context
        )

@csrf_exempt
def gif_chosen(request):
    # В попап с гифками после клика на гифку происходит запрос сюда
    # Нужно вернуть информацию о гифке и закрыть модальное окно
    # так как сейчас мы будем использовать embed-ссылки, скачивать гифку не нужно
    # TODO: но именно в этом месте и нужно это делать в будущем
    # Получить адрес до гифки и разместить в файловой системе,
    # записав путь в модель content.CustomImage (получить от get_image_model())

    # приходит тот самый json, который возвращает gifs_search_get для каждой гифки
    gif_json = json.dumps(ast.literal_eval(request.POST.get('json')))

    # В шаблоне рендерится js, который должен вызвать функцию giphyChosen,
    # которая, в свою очередь, описана в giphy/static/giphy-chooser в responses
    return render_modal_workflow(
        request, None, 'giphy/chooser/gif_chosen.js',
        {'gif_json': gif_json}
    )
