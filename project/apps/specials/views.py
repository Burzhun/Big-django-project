from django.http import Http404
from django.shortcuts import render
from django.template import TemplateDoesNotExist


def embed_view(request, project_name):
    if not project_name:
        raise Http404
    try:
        return render(request, 'embeds/'+project_name+'/index.html')
    except TemplateDoesNotExist:
        raise Http404