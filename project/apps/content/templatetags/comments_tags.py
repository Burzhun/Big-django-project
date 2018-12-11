from django import template

register = template.Library()

@register.simple_tag
def can_delete(user, comment):
    if comment.check_permission(user):
    	return "<a onclick='deleteComment("+str(comment.id)+")'>Удалить</a>"

    return ""