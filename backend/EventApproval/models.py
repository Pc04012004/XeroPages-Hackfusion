from django.db import models
from django.contrib.auth.models import User
from login.models import *
# Representative Model
class RepresentativeStudent(models.Model):
    DESIGNATION_CHOICES = [
        ("TECHNICAL_SECRETARY", "Technical Secretary"),
        ("GENERAL_SECRETARY", "General Secretary"),
        ("CULTURAL_SECRETARY", "Cultural Secretary"),
        ("SPORTS_SECRETARY", "Sports Secretary"),
        ("CLUB_PRESIDENT", "Club President"),
    ]
    student = models.OneToOneField(Custom_User, on_delete=models.CASCADE)
    designation = models.CharField(max_length=50, choices=DESIGNATION_CHOICES)



# Event Model
class Event(models.Model):
    EVENT_TYPES = [("TECHNICAL", "Technical"), ("CULTURAL", "Cultural"), ("SPORTS", "Sports")]
    name = models.CharField(max_length=255)
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    date = models.DateField()
    venue = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    representative = models.ForeignKey(RepresentativeStudent, on_delete=models.CASCADE)
    faculty_coordinator = models.ForeignKey(FacultyProfile, on_delete=models.CASCADE)
    approved_by_dean = models.BooleanField(default=False)
    approved_by_director = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

# Budget & Sponsorship Model
class EventBudget(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    budget_file = models.FileField(upload_to='budgets/')
    approved_by_dean_finance = models.BooleanField(default=False)
    approved_by_director = models.BooleanField(default=False)
    priority_level = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

class EventSponsorship(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    sponsorship_file = models.FileField(upload_to='sponsorships/')
    approved_by_dean_finance = models.BooleanField(default=False)
    approved_by_director = models.BooleanField(default=False)
    priority_level = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
