from __future__ import absolute_import, unicode_literals

from django.shortcuts import render


def search(request):
    q = request.GET.get('q')
    template_name = 'search/search.html'
    if request.user_agent.is_mobile:
        template_name = 'search/mobile/search.html'
    return render(request, template_name, { 'q': q })
