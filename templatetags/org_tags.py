from django import template
from django.template import loader
from django.core.urlresolvers import reverse
from django.contrib.auth.models import User
from django.contrib.staticfiles.templatetags import staticfiles
from django.conf import settings
from mapstory.models import Organization

import re

register = template.Library()

