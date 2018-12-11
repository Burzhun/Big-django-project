from django.http import HttpResponse, Http404
from django.shortcuts import render, redirect,render_to_response
from django.utils import timezone
from wagtail.contrib.modeladmin.views import ChooseParentView
from wagtail.wagtailcore.models import PageRevision

from .models import ArticleIndex, ArticlePage, NewsPage, IssueIndex, IssuePage, EventPage, BlogIndex, BlogCategory
from home.models import HomePage
from content.helpers import subscribe


class ContentChooseParentView(ChooseParentView):
    def get(self, request, *args, **kwargs):
        if self.model_name != 'articlepage' and self.model_name != 'newspage':
            return super(ContentChooseParentView, self).get(request, *args, **kwargs)

        article_index = ArticleIndex.objects.filter(live=True).first()

        return redirect(self.url_helper.get_action_url(
            'add', self.app_label, self.model_name, article_index.pk))


def subscription_view(request):
    last_issue = IssuePage.objects.live().order_by('-published_at').first()
    if not last_issue:
        raise Http404
    return render(request, 'content/subscription.html', {'last_issue': last_issue})


def subscribe_email(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        if not email:
            return HttpResponse('error')

        subscribe(email)  # TODO: in queue

        return HttpResponse('ok')
    return redirect('/')


def news_redirect_view(request, rubric, sub_rubric, slug):
    try:
        news = NewsPage.objects.get(slug=slug, rubric__slug=rubric)
        return redirect(news.get_url())
    except NewsPage.DoesNotExist:
        pass
    return Http404


def redirect_view(request, rubric, sub_rubric, old_id):
    article = ArticlePage.objects.filter(old_id=old_id, rubric__slug__in=(rubric, sub_rubric)).first()
    if not article:
        article = NewsPage.objects.filter(old_id=old_id, rubric__slug__in=(rubric, sub_rubric)).first()
    if not article:
        raise Http404

    return redirect('/'+article.get_parent().slug+'/'+article.slug)


def issue_redirect_view(request, slug):
    if not slug:
        raise Http404

    issue_index = IssueIndex.objects.live().first()
    if not issue_index:
        raise Http404

    try:
        issue = IssuePage.objects.live().descendant_of(issue_index).get(slug=slug, published_at__lte=timezone.now())
    except IssuePage.DoesNotExist:
        raise Http404

    return redirect(issue.get_url())


def events_redirect_view(request, old_id):
    if not old_id:
        raise Http404
    try:
        event = EventPage.objects.get(old_id=old_id)
        if event.slug != str(old_id):
            return redirect(EventPage.objects.get(old_id=old_id).get_url())
        else:
            return event.serve(request)
    except EventPage.DoesNotExist:
        raise Http404


def blog_redirect_view(request):
    try:
        blog = BlogCategory.objects.get(title='Блог редакции', live=True)
    except BlogCategory.DoesNotExist:
        raise Http404
    index = BlogIndex.objects.first()
    return redirect(index.get_url()+blog.slug)


def php_redirect(request):
    return redirect(request.path.replace('.php', ''))


def get_revision_log(request):
    user_id = request.GET.get('user_id')
    if not request.user.is_authenticated or not request.user.is_superuser or not user_id:
        raise Http404

    revisions = PageRevision.objects.filter(user__id=user_id).order_by('-created_at')

    result = ''
    for revision in revisions:
        result += str([revision.page.id, revision.page.title, revision.created_at.strftime('%H:%M %d.%m.%y')]) + '\n'
    return HttpResponse(result)
