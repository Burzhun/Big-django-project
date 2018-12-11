from django.shortcuts import render, redirect
from django.views.generic import CreateView
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template import loader
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import Http404, JsonResponse
from django.urls import reverse
from wagtail.wagtailcore.models import Page

from .forms import UserCreationForm, ProfileEditForm, ImageUploadForm
from .models import User
from .choices import COUNTRY_CHOICES
from content.helpers import subscribe, check_captcha
import uuid


# Create your views here.

class RegistrationView(CreateView):
    form_class = UserCreationForm
    template_name = 'registration/user_registration_form.html'
    email_template_name = 'registration/new_user_mail.html'
    success_url = 'registration-done'
    model = User

    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('/')
        return super(RegistrationView, self).get(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('/')

        return super(RegistrationView, self).post(request, *args, **kwargs)

    def send_mail(self, email, activation_code):
        proto = "https" if self.request.is_secure() else "http"
        host = "%s://%s" % (proto, self.request.get_host())

        body = loader.render_to_string(self.email_template_name, {'activation_code': activation_code, 'host': host})

        email = EmailMultiAlternatives(
            "MH: Подтверждение регистрации нового пользователя",
            body,
            settings.DEFAULT_FROM_EMAIL,
            [email]
        )
        email.attach_alternative(body, "text/html")

        email.send()

    def form_valid(self, form):
        obj = form.save(commit=True)
        obj.activation_code = str(uuid.uuid4()).replace('-', '')
        obj.is_active = False
        obj.save()
        self.send_mail(obj.email, obj.activation_code)
        return redirect('registration-done')


def email_confirm(request, code):
    try:
        user = User.objects.get(activation_code=code)
    except User.DoesNotExist:
        return redirect('/')
    subscribe(user.email)  # TODO: in queue
    user.is_active = True
    user.save()
    return redirect('login')


def login_view(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']

        user = User.objects.filter(email=email).first()
        ok_captcha = check_captcha(request)

        if not (user and user.check_password(password) and ok_captcha):
            return render(request, 'registration/login.html', {'error': True}, status=401)

        login(request, user, 'django.contrib.auth.backends.ModelBackend')

        back_url = request.POST.get('backurl', '/')
        return redirect(back_url)

    return render(request, 'registration/login.html')


def logout_view(request):
    logout(request)
    return redirect('/')


def profile_view(request, id):
    id = int(id)
    if request.user.id != id:
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            raise Http404
        return render(request, 'community/profile_base.html', {'user': user})

    if request.user.is_authenticated and request.user.id == id:
        if request.method == 'POST':

            form = ProfileEditForm(request.POST, instance=request.user)

            if form.is_valid():
                form.save()

            return render(request, 'community/profile_edit.html',
                          {'form': form, 'COUNTRY_CHOICES': COUNTRY_CHOICES})

        else:
            form = ProfileEditForm(instance=request.user)
        return render(request, 'community/profile_edit.html', {'form': form, 'COUNTRY_CHOICES': COUNTRY_CHOICES})
    return redirect('login')


def base_profile_view(request):
    if request.user.is_authenticated:
        data = {'url': reverse('profile',  kwargs={'id': request.user.id })}
    else:
        data = {'error': True}
    return JsonResponse(data)


def user_bar_view(request, id):
    try:
        page = Page.objects.get(id=id)
    except Page.DoesNotExist:
        raise Http404
    revision_id = request.GET.get('revision_id')
    if revision_id:
        request.revision_id = revision_id
    return render(request, 'community/user_bar.html',{'page': page})


@login_required
def profile_notify_view(request, id):
    return render(request, 'community/profile_notify.html')


@login_required
def upload_image_view(request):
    form = ImageUploadForm(request.POST, request.FILES, instance=request.user)
    if form.is_valid():
        upload = form.save()
        return JsonResponse({"url":  upload.avatar.url, 'status': 'ok'})

    return JsonResponse({"error": "Ошибка"})