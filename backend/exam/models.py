from django.db import models

# Create your models here.
from django.db import models

from django.db import models
from django.contrib.auth import get_user_model

Custom_User = get_user_model()

# Define department choices
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

class Announcement(models.Model):
    """
    Model to store announcements.
    - department: Stores which department the announcement is for.
    - title: Title of the announcement.
    - announcement_type: Type of announcement (common or result).
    - pdf: Optional file attachment (e.g., exam result PDFs).
    - time: Timestamp when the announcement was created.
    """

    # Announcement types (common announcements or result declarations)
    ANNOUNCEMENT_TYPES = [
        ('common', 'Common Announcement'),
        ('result', 'Result Declaration')
    ]

    department = models.CharField(
        max_length=50, 
        choices=DEPARTMENT_CHOICES,  # Using defined department choices
        null=True, 
        blank=True
    )
    title = models.CharField(max_length=255)
    announcement_type = models.CharField(max_length=10, choices=ANNOUNCEMENT_TYPES)
    pdf = models.FileField(upload_to='announcements/', null=True, blank=True)
    time = models.DateTimeField(auto_now_add=True)  # Automatically sets when the record is created

    def _str_(self):
        return self.title  # Returns the announcement title as a string representation
    
    