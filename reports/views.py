from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required, user_passes_test
from mapstory.admin import export_via_model


@login_required
@user_passes_test(lambda u: u.is_superuser)
def generate_user_report(req):
    return export_via_model(
        User,
        req,
        User.objects.all(),
        exclude=[
            'password',
            'is_active',
            'is_superuser',
            'id'
        ]
    )
