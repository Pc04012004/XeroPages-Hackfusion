from django import forms
from django.contrib.auth.forms import UserCreationForm as BaseUserCreationForm
from .models import Custom_User


class UserCreationForm(BaseUserCreationForm):
    """A UserCreationForm that allows optional password input."""

    class Meta:
        model = Custom_User
        fields = ("email", "first_name", "last_name", "role")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["password1"].required = False
        self.fields["password2"].required = False
