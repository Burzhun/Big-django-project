import json

from wagtailtinymce.forms import ExternalLinkChooserForm
from wagtail.wagtailadmin.modal_workflow import render_modal_workflow
from wagtail.wagtailadmin.views.chooser import shared_context


def external_link(request):
    initial_data = {
        'url': request.GET.get('link_url', ''),
        'link_text': request.GET.get('link_text', ''),
        'blank_link': request.GET.get('blank_link', False)
    }

    if request.method == 'POST':
        form = ExternalLinkChooserForm(request.POST, initial=initial_data)

        if form.is_valid():
            result = {
                'url': form.cleaned_data['url'],
                'title': form.cleaned_data['link_text'].strip() or form.cleaned_data['url'],
                # If the user has explicitly entered / edited something in the link_text field,
                # always use that text. If not, we should favour keeping the existing link/selection
                # text, where applicable.
                # (Normally this will match the link_text passed in the URL here anyhow,
                # but that won't account for non-text content such as images.)
                'prefer_this_title_as_link_text': ('link_text' in form.changed_data),
                'blank_link': form.cleaned_data['blank_link']
            }

            return render_modal_workflow(
                request,
                None, 'wagtailadmin/chooser/external_link_chosen.js',
                {
                    'result_json': json.dumps(result),
                }
            )
    else:
        if not initial_data['blank_link'] and request.GET.get('link_url') is None:
            initial_data['blank_link'] = True
        form = ExternalLinkChooserForm(initial=initial_data)

    return render_modal_workflow(
        request,
        'wagtailadmin/chooser/external_link.html', 'wagtailadmin/chooser/external_link.js',
        shared_context(request, {
            'form': form,
        })
    )