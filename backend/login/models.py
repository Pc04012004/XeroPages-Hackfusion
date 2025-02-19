# import random
# import string
# from django.contrib.auth.models import AbstractUser
# from django.db import models
# def generate_funny_username():
#     adjectives = ["Silly", "Wacky", "Funky", "Goofy", "Jolly", "Bouncy", "Zany", "Loopy"]
#     nouns = ["Penguin", "Banana", "Noodle", "Cactus", "Marshmallow", "Dolphin", "Unicorn", "Pancake"]
#     return  f"{random.choice(adjectives)}{random.choice(nouns)}{random.randint(100, 999)}"

# def generate_random_password(length=10):
#     characters = string.ascii_letters + string.digits
#     return ''.join(random.choice(characters) for _ in range(length))

# # class Custom_User(AbstractUser):
# #     ROLE_CHOICES = [
# #         ('student', 'Student'),
# #         ('faculty', 'Faculty'),
# #         ('hod', 'Head of Department'),
# #         ('dean_student', 'Dean of Student'),
# #         ('dean_finance', 'Dean of Finance'),
# #         ('director', 'Director'),
# #         ('admin', 'Admin'),
# #     ]
# #     email = models.EmailField(unique=True)
# #     role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    
# #     def __str__(self):
# #         return f"{self.username} - {self.role}"
# # class Custom_User(AbstractUser):
# #     ROLE_CHOICES = [
# #         ('student', 'Student'),
# #         ('faculty', 'Faculty'),
# #         ('hod', 'Head of Department'),
# #         ('dean_student', 'Dean of Student'),
# #         ('dean_finance', 'Dean of Finance'),
# #         ('director', 'Director'),
# #         ('admin', 'Admin'),
# #     ]

# #     username = models.CharField(max_length=50, unique=True, blank=True, null=True)  # Auto-generated
# #     email = models.EmailField(unique=True)  # Required
# #     first_name = models.CharField(max_length=30)
# #     last_name = models.CharField(max_length=30)
# #     role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')

# #     USERNAME_FIELD = "email"
# #     REQUIRED_FIELDS = ["first_name", "last_name", "role"]

# #     def save(self, *args, **kwargs):
# #         if not self.username:  # Auto-generate username for students
# #             if self.role == "student":
# #                 self.username = generate_funny_username()
# #             else:
# #                 self.username = self.email.split('@')[0]  # Use email prefix for non-students

# #         if not self.password:  # Generate random password
# #             password = generate_random_password()
# #             self.set_password(password)

# #         super().save(*args, **kwargs)

# #     def __str__(self):
# #         return f"{self.email} - {self.role}"
# from django.contrib.auth.models import AbstractUser, BaseUserManager
# from django.db import models
# import random
# import string

# class UserManager(BaseUserManager):
#     def create_user(self, email, first_name, last_name, role, password=None, **extra_fields):
#         if not email:
#             raise ValueError('The Email field must be set')
        
#         # Generate a random username
#         username = ''.join(random.choices(string.ascii_lowercase + string.digits, k=10))
        
#         # Generate a random password if not provided
#         if not password:
#             password = ''.join(random.choices(string.ascii_letters + string.digits, k=12))
        
#         email = self.normalize_email(email)
#         user = self.model(
#             email=email,
#             username=username,
#             first_name=first_name,
#             last_name=last_name,
#             role=role,
#             **extra_fields
#         )
#         user.set_password(password)
#         user.save(using=self._db)
#         return user

#     def create_superuser(self, email, first_name, last_name, role, password=None, **extra_fields):
#         extra_fields.setdefault('is_staff', True)
#         extra_fields.setdefault('is_superuser', True)
#         return self.create_user(email, first_name, last_name, role, password, **extra_fields)

# class Custom_User(AbstractUser):
#     email = models.EmailField(unique=True)
#     first_name = models.CharField(max_length=30)
#     last_name = models.CharField(max_length=30)
#     role = models.CharField(max_length=50)
    
#     # Remove the username field
#     username = models.CharField(max_length=150, unique=True, blank=True)
    
#     USERNAME_FIELD = 'email'
#     REQUIRED_FIELDS = ['first_name', 'last_name', 'role']
    
#     objects = UserManager()

import random
import string
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


def generate_random_username():
    """Generate a random username."""
    adjectives = ["Silly", "Wacky", "Funky", "Goofy", "Jolly"]
    nouns = ["Penguin", "Banana", "Noodle", "Cactus", "Marshmallow"]
    return f"{random.choice(adjectives)}{random.choice(nouns)}{random.randint(100, 999)}"


def generate_random_password(length=12):
    """Generate a secure random password."""
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choice(characters) for _ in range(length))


class CustomUserManager(BaseUserManager):
    """Custom manager for our Custom_User model."""

    # def create_user(self, email, first_name, last_name, role, password=None, **extra_fields):
    #     print("2")
    #     if not email:
    #         raise ValueError("The Email field is required.")
        
    #     email = self.normalize_email(email)
    #     username = generate_random_username()  # Generate a username

    #     # Generate a random password if not provided
    #     if not password:
    #         password = generate_random_password()

    #     user = self.model(
    #         email=email,
    #         username=username,
    #         first_name=first_name,
    #         last_name=last_name,
    #         role=role,
    #         **extra_fields
    #     )
    #     user.set_password(password)
    #     user.save(using=self._db)
    #     return user

    def create_superuser(self, email, first_name, last_name, role, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, first_name, last_name, role, password, **extra_fields)


class Custom_User(AbstractUser):
    """Custom User model using email instead of username."""

    ROLE_CHOICES = [
        ("student", "Student"),
        ("faculty", "Faculty"),
        ("hod", "Head of Department"),
        ("dean_student", "Dean of Student"),
        ("dean_finance", "Dean of Finance"),
        ("director", "Director"),
        ("admin", "Admin"),
    ]

    email = models.EmailField(unique=True)  # Required
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)

    username = models.CharField(max_length=150, unique=True, blank=True, null=True)  # Auto-generated

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name", "role"]

    objects = CustomUserManager()

    # def save(self, *args, **kwargs):
    #     """Auto-generate a username and password if missing."""
    #     print("1")
    #     if not self.username:
    #         self.username = generate_random_username()

    #     if not self.password:
    #         password = generate_random_password()
    #         self.set_password(password)

    #     super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.email} - {self.role}"
