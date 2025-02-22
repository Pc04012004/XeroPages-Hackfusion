from django.db import models
from login.models import *
# Create your models here.
class Lecture(models.Model):
    title = models.CharField(max_length=200)
    instructor = models.ForeignKey(FacultyProfile, on_delete=models.CASCADE)
    department = models.CharField(max_length=100)
    year = models.CharField(max_length=100)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    date=models.DateField()
    def __str__(self):
        return f"{self.title} - {self.instructor}"

class Feedback(models.Model):
    lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE, related_name='feedbacks')
    clarity_rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])  # 1-5 scale
    pace_rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])     # 1-5 scale
    engagement_rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)]) # 1-5 scale
    comments = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback for {self.lecture.title}"
    
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class AdministrationFeedback(models.Model):
    title = models.CharField(max_length=200)  # Short title for the feedback
    description = models.TextField()  # Detailed feedback
    submitted_by = models.ForeignKey(Custom_User, on_delete=models.CASCADE, related_name='admin_feedbacks')
    timestamp = models.DateTimeField(auto_now_add=True)
    admin_response = models.TextField(blank=True, null=True)  # Admin's short response

    def __str__(self):
        return f"Feedback: {self.title} (Submitted by: {self.submitted_by.username})"

