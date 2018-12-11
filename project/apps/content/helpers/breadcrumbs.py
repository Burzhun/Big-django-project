

def get_breadcrumbs(page):
    if not page.get_parent():
        return []

    return get_breadcrumbs(page.get_parent())+[
        (page.title, page.get_url())
    ]