from django.db import models
from login.models import *

class Facility(models.Model):
    FACILITY_TYPES = [
        ("academic", "Academic"),
        ("sports", "Sports"),
        ("general", "General"),
    ]
    
    name = models.CharField(max_length=255, unique=True)
    facility_type = models.CharField(max_length=20, choices=FACILITY_TYPES)
    department = models.CharField(max_length=100, null=True, blank=True)  # Only for academic facilities
    managed_by = models.ForeignKey(
        Custom_User, on_delete=models.SET_NULL, null=True, blank=True, related_name="managed_facilities"
    )  # HOD or Sport Head
    availability_status = models.BooleanField(default=True)  # True = Available

    def __str__(self):
        return self.name

class Booking(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    student = models.ForeignKey(Custom_User, on_delete=models.CASCADE, related_name="bookings")
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name="bookings")
    start_date = models.DateField()
    end_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    approver = models.ForeignKey(
        Custom_User, on_delete=models.SET_NULL, null=True, blank=True, related_name="approved_bookings"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student} - {self.facility} ({self.start_date} to {self.end_date})"
