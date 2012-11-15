from django import template
from django.template import loader
from django.core.urlresolvers import reverse
from django.contrib.auth.models import User
from django.contrib.staticfiles.templatetags import staticfiles
from django.conf import settings
from mapstory.models import Org

import re

register = template.Library()

@register.tag
def edit_widget(parser, token):
    try:
        tokens = token.split_contents()
        tokens.pop(0)
        part_name = tokens.pop(0)
    except ValueError:
        raise template.TemplateSyntaxError, "%r tag requires a single argument" % token.contents.split()[0]
    return EditWidgetNode(part_name)

_widget_button = "<a href='#%s' class='edit-btn btn btn-small'>%s</a>"

class EditWidgetNode(template.Node):
    def __init__(self, part_name):
        self.part_name = part_name
    def render(self, context):
        if not context['can_edit']: return ""
        return _widget_button % (self.part_name,'Edit')