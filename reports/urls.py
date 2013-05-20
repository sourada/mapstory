from django.conf.urls.defaults import patterns, url
from django.views.generic.simple import direct_to_template


urlpatterns = patterns(
    'mapstory.reports.views',

    url(r"^build-reports",
        direct_to_template, {"template": "reports/build_reports.html"}),

    url(r"^generate-user-report",
        'generate_user_report',
        name="generate_user_report")

)
