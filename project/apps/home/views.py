from django.http import HttpResponse
from django.shortcuts import render


def google_index_view(request):
    return HttpResponse("google-site-verification: google63e6e4540db3adc8.html", content_type="text/plain")


def robots_view(request):
    return HttpResponse(
        '''User-Agent: *\nHost: https://mhealth.ru
        ''', content_type="text/plain")


def ads_view(request):
    return HttpResponse(
        '''google.com, pub-9944678326497194, DIRECT, f08c47fec0942fa0''', content_type="text/plain")


def yandex_verification(request):
    return HttpResponse(
        '''
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body>Verification: 4111d8aca73f15ad</body>
</html>

        '''
    )


def rtb_1(request):
    return render(request, 'home/RTB1.html')


def rtb_2(request):
    return render(request, 'home/RTB2.html')


def iframe_view(request):
    return render(request, 'home/iframe_page.html')