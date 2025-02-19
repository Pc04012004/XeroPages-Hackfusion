import random
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from .forms import UserCreationForm
from .models import Custom_User, UploadedCSV
import csv
from django.contrib import admin, messages
from django.contrib.auth.hashers import make_password
from django.http import HttpResponseRedirect
from django.urls import path
from django.shortcuts import render
User = get_user_model()
def generate_random_username():
    """Generate a random username."""
    adjectives = ["Silly", "Wacky", "Funky", "Goofy", "Jolly"]
    nouns = ["Penguin", "Banana", "Noodle", "Cactus", "Marshmallow"]
    return f"{random.choice(adjectives)}{random.choice(nouns)}{random.randint(100, 999)}"

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
            if obj.role == "student":
                obj.username = generate_random_username()
            else:
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


class UploadedCSVAdmin(admin.ModelAdmin):
    list_display = ("filename", "uploaded_at")
    ordering = ("-uploaded_at",)

    def process_csv(self, request, object_id):
        """Process uploaded CSV and create users"""
        uploaded_csv = UploadedCSV.objects.get(id=object_id)

        with open(uploaded_csv.file.path, "r", encoding="utf-8") as file:
            reader = csv.reader(file)
            created_count = 0
            skipped_count = 0

            for row in reader:
                first_name, last_name, email, role = row

                if not email.endswith("@college.edu"):
                    messages.warning(request, f"Skipped: {email} is not a valid college email.")
                    skipped_count += 1
                    continue  

                if Custom_User.objects.filter(email=email).exists():
                    messages.warning(request, f"Skipped: {email} already exists.")
                    skipped_count += 1
                    continue  
 
                username=generate_random_username()
                random_password = get_random_string(12)
                user = Custom_User.objects.create(
                    email=email,
                    first_name=first_name,
                    last_name=last_name,
                    role=role,
                    username=email.split("@")[0],
                    password=make_password(random_password ),
                )

                send_mail(
                    "Your College Account",
                    f"Hello {first_name},\nYour temporary password is: {random_password}\nPlease reset it after logging in.",
                    "admin@college.edu",
                    [email],
                    fail_silently=False,
                )

                created_count += 1

            messages.success(request, f"CSV processed! Created: {created_count}, Skipped: {skipped_count}")
            return HttpResponseRedirect(request.META.get("HTTP_REFERER"))

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path("<int:object_id>/process/", self.admin_site.admin_view(self.process_csv), name="process_csv"),
        ]
        return custom_urls + urls

admin.site.register(UploadedCSV, UploadedCSVAdmin)