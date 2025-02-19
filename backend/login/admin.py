
# from django.core.mail import send_mail
# from .models import generate_random_password
# from django.contrib import admin
# from django.contrib.auth.admin import UserAdmin
# from django.contrib.auth.forms import UserCreationForm, UserChangeForm
# from .models import Custom_User

# class CustomUserCreationForm(UserCreationForm):
#     class Meta:
#         model = Custom_User
#         fields = ('email', 'first_name', 'last_name', 'role')

# class CustomUserChangeForm(UserChangeForm):
#     class Meta:
#         model = Custom_User
#         fields = ('email', 'first_name', 'last_name', 'role')

# class CustomUserAdmin(UserAdmin):
#     add_form = CustomUserCreationForm
#     form = CustomUserChangeForm

#     fieldsets = (
#         (None, {'fields': ('email', 'password')}),
#         ('Personal Info', {'fields': ('first_name', 'last_name', 'role')}),
#         ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
#     )
#     add_fieldsets = (
#         (None, {
#             'classes': ('wide',),
#             'fields': ('email', 'first_name', 'last_name', 'role', 'password1', 'password2'),
#         }),
#     )
#     list_display = ('email', 'first_name', 'last_name', 'role', 'is_staff')
#     search_fields = ('email', 'first_name', 'last_name')
#     ordering = ('email',)

#     def save_model(self, request, obj, form, change):
#         if not obj.pk:  # New user
#             password = generate_random_password()
#             obj.set_password(password)  # Hash password

#             # Send email
#             send_mail(
#                 "Your Account Details",
#                 f"Hello {obj.first_name},\n\nYour account has been created.\n\n"
#                 f"Username: {obj.username}\nPassword: {password}\n\nPlease login and change your password.",
#                 "admin@example.com",
#                 [obj.email],
#                 fail_silently=False,
#             )

#         super().save_model(request, obj, form, change)

#     search_fields = ("email", "first_name", "last_name")
#     ordering = ("email",)

# admin.site.register(Custom_User, CustomUserAdmin)
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from .forms import UserCreationForm

User = get_user_model()


class UserAdmin(admin.ModelAdmin):
    """Custom UserAdmin that generates a password and emails it to the user."""

    add_form = UserCreationForm
    list_display = ("email", "first_name", "last_name", "role", "is_staff", "is_active")
    search_fields = ("email", "first_name", "last_name")
    ordering = ("email",)
    fieldsets  = (
        (None, {"fields": ("email", "first_name", "last_name", "role")}),
        ("Permissions", {"fields": ("is_staff", "is_active")}),
    )

    def save_model(self, request, obj, form, change):
        print(3)
        if not change:  # Only generate a password for new users
            random_password = get_random_string(12)  # Generate a random password
            obj.set_password(random_password)  # Set the password
            obj.username = obj.email.split("@")[0]  # Use email prefix as username

            # Send email with login details
            send_mail(
                "Your New Account Details",
                f"Hello {obj.first_name},\n\nYour account has been created.\n\n"
                f"Username: {obj.username}\n"
                f"Password: {random_password}\n\n"
                "Please log in and change your password.",
                "admin@yourwebsite.com",
                [obj.email],
                fail_silently=False,
            )
            print(4)

        super().save_model(request, obj, form, change)


# Register the model in the Django Admin
admin.site.register(User, UserAdmin)
