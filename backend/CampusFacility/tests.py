from django.test import TestCase
from login.models import *

from django.db import models
from django.contrib.auth.models import AbstractUser


# Facility Model (Includes Assigned Approver)
class Facility(models.Model):
    name = models.CharField(max_length=255, unique=True)
    capacity = models.IntegerField()
    rules = models.TextField()
    is_available = models.BooleanField(default=True)
    approver = models.ForeignKey(Custom_User, on_delete=models.SET_NULL, null=True, blank=True, related_name="managed_facilities")

    def __str__(self):
        return self.name

# Booking Model (Request submitted by students, approved by assigned authority)
class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    student = models.ForeignKey(Custom_User, on_delete=models.CASCADE, related_name="bookings")
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name="bookings")
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    purpose = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    approver = models.ForeignKey(Custom_User, on_delete=models.SET_NULL, null=True, blank=True, related_name="approved_bookings")

    def __str__(self):
        return f"{self.student.username} - {self.facility.name} ({self.date})"

# Notification Model
class Notification(models.Model):
    user = models.ForeignKey(Custom_User, on_delete=models.CASCADE, related_name="notifications")
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username}"
