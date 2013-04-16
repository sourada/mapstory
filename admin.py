from mapstory.models import *
from django import forms
from django.contrib.contenttypes.models import ContentType
from django.contrib import admin
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.core.urlresolvers import reverse
from django.contrib.auth.admin import UserAdmin
import csv


def export_as_csv_action(description="Export selected objects as CSV file",
                         fields=None, exclude=None, query_factory=None):
    """
    This function returns an export csv action
    'fields' and 'exclude' work like in django ModelForm
    'header' is whether or not to output the column names as the first row
    """
    def export_as_csv(modeladmin, request, queryset):
        """
        Generic csv export admin action.
        based on http://djangosnippets.org/snippets/1697/

        queryset is an iterable returning an object
        with attributes or no-arg callables matching the field names
        """
        if query_factory:
            queryset = query_factory(queryset)

        opts = modeladmin.model._meta
        field_names = set([field.name for field in opts.fields])
        if fields:
            fieldset = set(fields)
            field_names = field_names & fieldset
        elif exclude:
            excludeset = set(exclude)
            field_names = field_names - excludeset

        response = HttpResponse(mimetype='text/csv')
        response['Content-Disposition'] = 'attachment; filename=%s.csv' % unicode(opts).replace('.', '_')
        writer = csv.DictWriter(response, field_names)
        writer.writeheader()

        for obj in queryset:
            writer.writerow(dict(zip(field_names,[unicode(getattr(obj, field)).encode("utf-8","replace") for field in field_names])))
        return response
    export_as_csv.short_description = description
    return export_as_csv

admin.site.add_action(export_as_csv_action())


class ResourceForm(forms.ModelForm):
    text = forms.CharField(widget=forms.Textarea)
    class Meta:
        model = Resource
        
class ResourceAdmin(admin.ModelAdmin):
    list_display = 'id','name','order'
    list_display_links = 'id',
    list_editable = 'name','order'
    form = ResourceForm
    ordering = ['order',]

class SectionForm(forms.ModelForm):
    text = forms.CharField(widget=forms.Textarea)
    class Meta:
        model = Section

class SectionAdmin(admin.ModelAdmin):
    list_display = 'id','name','order'
    list_display_links = 'id',
    list_editable = 'name','order'
    form = SectionForm
    ordering = ['order',]
    
class VideoLinkForm(forms.ModelForm):
    text = forms.CharField(widget=forms.Textarea)
    class Meta:
        model = VideoLink

class VideoLinkAdmin(admin.ModelAdmin):
    list_display = 'id','name','title','href','publish','location'
    list_display_links = 'id',
    list_editable = 'name','title','publish','href','location'
    form = VideoLinkForm
    
class ContactDetailAdmin(admin.ModelAdmin):
    pass

#@hack the UserAdmin to enable sorting by date_joined
UserAdmin.list_display += ('date_joined',)

admin.site.register(VideoLink, VideoLinkAdmin)
admin.site.register(Section, SectionAdmin)
admin.site.register(ContactDetail, ContactDetailAdmin)
admin.site.register(Resource, ResourceAdmin)
admin.site.register(Topic)
