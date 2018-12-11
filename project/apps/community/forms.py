from django.contrib.auth import password_validation
from django.conf import settings
from django import forms
from .models import User
from .choices import COUNTRY_CHOICES
from django_resized.forms import ResizedImageField
from .fields import ReCaptchaField
from .widgets import ReCaptchaWidget


class UserCreationForm(forms.ModelForm):
    """
    A form that creates a user, with no privileges, from the given username and
    password.
    """
    error_messages = {
        'password_mismatch': "Неверное подтверждение пароля",
        'uf_rules_is_not_accepted': "Вы должны принять лицензионное соглашение",
    }
    password1 = forms.CharField(
        label="Пароль",
        min_length=6,
        strip=False,
        widget=forms.PasswordInput,
    )
    password2 = forms.CharField(
        label="Подтвердите пароль",
        min_length=6,
        widget=forms.PasswordInput,
        strip=False,
        help_text="Пароль должен быть не менее 6 символов",
    )
    email = forms.EmailField(
        label="Email",
        required=True,
    )
    first_name = forms.CharField(
        label="Имя",
        strip=False,
        required=True,
    )
    last_name = forms.CharField(
        label="Фамилия",
        strip=False,
        required=True,
    )
    uf_rules = forms.BooleanField(
        label="Условия",
        required=False
    )
    captcha = ReCaptchaField(widget=ReCaptchaWidget)

    class Meta:
        model = User
        fields = ("username", "email", "password1", "password2", "first_name", "last_name")

    def __init__(self, *args, **kwargs):
        super(UserCreationForm, self).__init__(*args, **kwargs)

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError(
                self.error_messages['password_mismatch'],
                code='password_mismatch',
            )
        self.instance.username = self.cleaned_data.get('username')
        password_validation.validate_password(self.cleaned_data.get('password2'), self.instance)
        return password2

    def clean_uf_rules(self):
        uf_rules = self.cleaned_data.get("uf_rules")
        if not uf_rules:
            raise forms.ValidationError(
                self.error_messages['uf_rules_is_not_accepted'],
                code='uf_rules_is_not_accepted',
            )
        return uf_rules

    def is_valid(self, *args, **kwargs):
        return super(UserCreationForm, self).is_valid(*args, **kwargs)

    def save(self, commit=True):
        user = super(UserCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class ProfileEditForm(forms.ModelForm):
    error_messages = {
        'password_mismatch': "Неверное подтверждение пароля",
    }

    password1 = forms.CharField(
        label="Новый пароль",
        min_length=6,
        required=False,
        strip=False,
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
    )
    password2 = forms.CharField(
        label="Повтор пароля",
        min_length=6,
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
        required=False,
        strip=False,
        help_text="Пароль должен быть не менее 6 символов",
    )
    email = forms.EmailField(
        label="Email",
        required=True,
        widget=forms.EmailInput(attrs={'class': 'form-control'})
    )
    first_name = forms.CharField(
        label="Имя",
        strip=False,
        required=True,
        widget=forms.TextInput(attrs={'class': 'form-control'})
    )
    last_name = forms.CharField(
        label="Фамилия",
        strip=False,
        required=True,
        widget=forms.TextInput(attrs={'class': 'form-control'})
    )
    is_public_email = forms.BooleanField(
        required=False,
        widget=forms.CheckboxInput(),
        label="Показывать другим пользователям"
    )
    is_public_b_date = forms.BooleanField(
        required=False,
        widget=forms.CheckboxInput(),
        label="Показывать другим пользователям"
    )
    is_public_has_children = forms.BooleanField(
        required=False,
        widget=forms.CheckboxInput(),
        label="Показывать другим пользователям"
    )
    has_children = forms.ChoiceField(
        choices=User.HAS_CHILDREN_CHOICES,
        required=True,
        label='Есть ли дети',
        widget=forms.Select(attrs={'class': 'form-control chosen-select '})
    )
    b_date = forms.DateField(
        required=False,
        input_formats=['%d.%m.%Y'],
        widget=forms.DateInput(attrs={
            'class': 'form-control datepicker ',
            'data-date-format': "dd.mm.yyyy",
            'data-date-end-date': "30.01.2005",
        }),
        label='Дата рождения'

    )
    gender = forms.ChoiceField(
        label='Пол',
        choices=User.GENDER_CHOICES,
        required=True,
        widget=forms.Select(attrs={'class': 'form-control chosen-select '})
    )
    country = forms.ChoiceField(
        required=False,
        choices=COUNTRY_CHOICES,
        label='Страна',
        widget=forms.Select(attrs={
            'class': 'form-control chosen-select ',
            'data-placeholder': "Выбери страну..."
        })
    )
    city = forms.CharField(
        label='Город',
        required=False,
        widget=forms.TextInput(attrs={'class': 'form-control'})
    )
    notes = forms.CharField(
        required=False,
        label='О себе',
        widget=forms.Textarea(attrs={'class': 'form-control'})

    )

    class Meta:
        model = User
        fields = (
            "username", "email", "password1", "password2", "first_name",
            "last_name", "is_public_email", "is_public_b_date", "is_public_has_children_choices",
            "b_date", "gender", "country", "city", "notes"
        )

    def __init__(self, *args, **kwargs):
        super(ProfileEditForm, self).__init__(*args, **kwargs)

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2:
            if password1 != password2:
                raise forms.ValidationError(
                    self.error_messages['password_mismatch'],
                    code='password_mismatch',
                )
            password_validation.validate_password(self.cleaned_data.get('password2'), self.instance)
        return password2

    def is_valid(self, *args, **kwargs):
        return super(ProfileEditForm, self).is_valid(*args, **kwargs)

    def save(self, commit=True):
        user = super(ProfileEditForm, self).save(commit=False)
        if self.cleaned_data["password1"]:
            user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class ImageUploadForm(forms.ModelForm):
    avatar = forms.ImageField(required=True)

    class Meta:
        model = User
        fields = ('avatar', )