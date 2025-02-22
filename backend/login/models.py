
import os
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

    def create_user(self, email, full_name ,role, password=None, **extra_fields):
        print("2")
        if not email:
            raise ValueError("The Email field is required.")
        
        email = self.normalize_email(email)
        username = generate_random_username()  # Generate a username

        # Generate a random password if not provided
        if not password:
            password = generate_random_password()

        user = self.model(
            email=email,
            username=username,
            full_name=full_name,
            role=role,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, full_name, role, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, full_name, role, password, **extra_fields)


class Custom_User(AbstractUser):
    """Custom User model using email instead of username."""
    DEPARTMENT_CHOICES = [
        ('Admin', 'Administration'),
        ('CSE', 'Computer Science and Engineering'),
        ('ECE', 'Electronics and Communication Engineering'),
        ('EEE', 'Electrical and Electronics Engineering'),
        ('ME', 'Mechanical Engineering'),
        ('CE', 'Civil Engineering'),
        ('IT', 'Information Technology'),
        ('Mathematics', 'Mathematics'),
    ]


    ROLE_CHOICES = [
        ("student", "Student"),
        ("faculty", "Faculty"),
        ("hod", "Head of Department"),
        ("sport_head", "Sport Head"),
        ("dean_student", "Dean of Student"),
        ("dean_finance", "Dean of Finance"),
        ("director", "Director"),
        ("doctor", "Doctor"),
        ("warden", "Warden"),
        ("security","Security Guard"),
        ("board_member","Board Member"),
        ("admin", "Admin"),
    ]

    email = models.EmailField(unique=True)  # Required
    full_name = models.CharField(max_length=30,default="empty")
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    department = models.CharField(
        max_length=50,
        choices=DEPARTMENT_CHOICES,
        default='Admin'
    )

    username = models.CharField(max_length=150, unique=True, blank=True, null=True)  # Auto-generated

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name", "role"]

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

class UploadedCSV(models.Model):
    file = models.FileField(upload_to="csv_uploads/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def filename(self):
        return os.path.basename(self.file.name)

    def __str__(self):
        return f"CSV File: {self.filename()} - {self.uploaded_at}"


class StudentProfile(models.Model):
    user = models.OneToOneField(Custom_User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255)
    dob = models.DateField()
    email = models.EmailField(unique=True)
    phone_no = models.CharField(max_length=15)
    section= models.CharField(max_length=15,choices=[('B', 'B'), ('A', 'A')])
    registration_no = models.CharField(max_length=100, unique=True)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')])
    address = models.CharField(max_length=255)
    course = models.CharField(max_length=50)
    department = models.CharField(max_length=100)
    year_of_study = models.IntegerField()
    parent_email=models.EmailField(unique=True,default="not found")
    Parent_phone_no = models.CharField(max_length=15,default="not found")
    hostel_status = models.BooleanField()
    profile_picture = models.ImageField(upload_to='profiles/students/', null=True, blank=True)
    
    def __str__(self):
        return self.full_name

class FacultyProfile(models.Model):
    user = models.OneToOneField(Custom_User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    dob = models.DateField()
    email = models.EmailField(unique=True)
    phone_no = models.CharField(max_length=15)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')])
    address = models.CharField(max_length=255)
    profile_picture = models.ImageField(upload_to='profiles/faculty/', null=True, blank=True)
    designation = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    qualification = models.CharField(max_length=255)
    years_of_experience = models.IntegerField()
    faculty_coordinator = models.CharField(max_length=100,default="None")
 
    def __str__(self):
        return self.name