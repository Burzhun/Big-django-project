from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.contrib.staticfiles.templatetags.staticfiles import static
from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone
from django.contrib.auth.hashers import check_password
from django_resized import ResizedImageField
from datetime import date
from uuid import uuid4
import hashlib

from .choices import COUNTRY_CHOICES


def generate_file_name(instance, filename, date=date.today()):
    ext = filename.split('.')[-1]
    filename = "%s.%s" % (str(uuid4()).replace('-', ''), ext)

    if not type(instance) is str:
        instance = instance.__class__.__name__.lower()
    return 'images/'+instance+'/{y}/{m}/{d}/{filename}'.format(**{
        'y': date.year,
        'm': date.month,
        'd': date.day,
        'filename': filename
    })


def check_old_password(password, encoded, setter):
    if password is None or encoded is None:
        return False

    is_correct = False
    _password = encoded[:8]+password
    password_hash = hashlib.md5(_password.encode('utf-8')).hexdigest()

    if password_hash == encoded[8:]:
        is_correct = True
        setter(password, reset_old_password=True)

    return is_correct
    

class User(AbstractUser):
    GENDER_MALE = 2
    GENDER_FEMALE = 1
    GENDER_DEFAULT = 0

    HAS_CHILDREN_YES = 0
    HAS_CHILDREN_NO = 1
    HAS_CHILDREN_DEFAULT = 2

    GENDER_CHOICES = (
        (GENDER_MALE, 'Мужской'),
        (GENDER_FEMALE, 'Женский'),
        (GENDER_DEFAULT, 'Не указано')
    )
    HAS_CHILDREN_CHOICES = (
        (HAS_CHILDREN_YES, 'Да'),
        (HAS_CHILDREN_NO, 'Нет'),
        (HAS_CHILDREN_DEFAULT, 'Не указано')
    )
    username = models.CharField(
        _('username'),
        max_length=150,
        null=True,
        blank=True,
        error_messages={
            'unique': _("A user with that username already exists."),
        },
    )
    email = models.EmailField(
        _('email address'),
        unique=True,
        error_messages={
            'unique': _("A user with that email already exists."),
        },
    )
    first_name = models.CharField(_('first name'), max_length=50, blank=True)
    last_name = models.CharField(_('last name'), max_length=50, blank=True)

    is_public_email = models.BooleanField(
        verbose_name='Показывыть email другим пользователям',
        default=False
    )
    is_public_b_date = models.BooleanField(
        verbose_name='Показывыть дату рождения другим пользователям',
        default=False
    )
    is_public_has_children_choices = models.BooleanField(
        verbose_name='Показывыть другим пользователям имеются ли дети',
        default=False
    )

    has_children = models.SmallIntegerField(
        verbose_name='Есть ли дети',
        choices=HAS_CHILDREN_CHOICES,
        default=HAS_CHILDREN_DEFAULT,
    )
    b_date = models.DateField(
        verbose_name='Дата рождения',
        null=True,
        blank=True,
    )
    gender = models.SmallIntegerField(
        choices=GENDER_CHOICES,
        verbose_name='Пол',
        default=GENDER_DEFAULT
    )
    avatar = ResizedImageField(
        size=[180, 180],
        upload_to=generate_file_name,
        blank=True,
        null=True,
        verbose_name='Аватар'
    )
    country = models.IntegerField(
        choices=COUNTRY_CHOICES,
        verbose_name='Страна',
        default=1
    )
    city = models.CharField(
        verbose_name='Город',
        null=True,
        blank=True,
        max_length=150
    )
    notes = models.CharField(
        verbose_name='О себе',
        null=True,
        blank=True,
        max_length=1000
    )

    old_password_hash = models.CharField(
        max_length=40,
        null=True,
        blank=True
    )

    activation_code = models.CharField(
        'Код активации',
        null=True,
        blank=True,
        max_length=32,
        db_index=True
    )
    old_id = models.IntegerField(
        null=True,
        blank=True
    )
    rules = models.BooleanField(
        'Принял условия',
        default=True
    )
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'username']

    def get_avatar(self):
        return self.avatar.url if self.avatar else static('img/no_avatar.png')

    def full_name(self):
        if self.first_name or self.last_name:
            return self.first_name + ' ' + self.last_name
        else:
            return self.email

    def check_password(self, raw_password):
        """
        Return a boolean of whether the raw_password was correct. Handles
        hashing formats behind the scenes.
        """
        def setter(raw_password, reset_old_password=False):
            self.set_password(raw_password)
            # Password hash upgrades shouldn't be considered password changes.
            self._password = None
            self.save(update_fields=["password"])
            if reset_old_password:
                self.old_password_hash = None
                self.save(update_fields=["old_password_hash"])

        return check_password(raw_password, self.password, setter) or \
                check_old_password(raw_password, self.old_password_hash, setter)


class Comment(models.Model):
    name = models.CharField(
        verbose_name='Имя',
        blank=True,
        null=True,
        max_length=150
    )
    text = models.TextField(
        verbose_name='Текст комментария'
    )
    author = models.ForeignKey(
        User,
        verbose_name='Автор',
        null=True,
        blank=True
    )
    parent_comment = models.ForeignKey(
        'community.Comment',
        verbose_name='Родительский комментарий',
        on_delete=models.CASCADE,
        related_name='child_comments',
        null=True,
        blank=True,
    )
    article = models.ForeignKey(
        'content.ArticlePage', 
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='comments'
    )
    news = models.ForeignKey(
        'content.NewsPage',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='comments'
    )
    blog = models.ForeignKey(
        'content.BlogPage',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='comments'
    )
    expert_answer = models.ForeignKey(
        'experts.AnswerPage',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='comments'
    )
    issue = models.ForeignKey(
        'content.IssuePage',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='comments'
    )
    event = models.ForeignKey(
        'content.EventPage',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='comments'
    )
    kamasutra = models.ForeignKey(
        'specials.KamasutraPage',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='comments'
    )
    old_id = models.IntegerField(
        null=True,
        blank=True
    )
    created_date = models.DateTimeField(
        default=timezone.now,
        verbose_name='Дата создания',
        db_index=True
    )

    def __str__(self):
        return self.text[:10]+'...'

    def content_type(self):
        return self.article or self.news or self.blog

    def check_permission(self, user):
        """
        TODO: поменять на принадлежность праву или группе прав
        """
        if self.author == user or user.is_superuser:
            return True
        return False

    class Meta:
        verbose_name='Комментарий'
        verbose_name_plural='Комментарии'


class Rating(models.Model):
    author = models.ForeignKey(
        'community.User',
        verbose_name='Автор',
        on_delete=models.CASCADE,
        related_name='ratings'
    )
    val = models.SmallIntegerField(
        verbose_name='Рейтинг',
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text='Значение от 1 до 5'
    )

    page = models.ForeignKey(
        'wagtailcore.Page',
        verbose_name='Страница',
        on_delete=models.CASCADE,
        related_name='ratings'
    )
    created_date = models.DateTimeField(
        verbose_name='Дата создания',
        default=timezone.now,
        blank=True
    )
    updated_date = models.DateTimeField(
        verbose_name='Дата обновления',
        null=True,
        blank=True
    )

    def save(self, *args, **kwargs):
        self.updated_date = timezone.now()
        super(Rating, self).save(*args, **kwargs)

    def __str__(self):
        return self.author.full_name()

    class Meta:
        verbose_name = 'Рейтинг'
        verbose_name_plural = 'Рейтинги'
        unique_together = (
            ('author', 'page')
        )
