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
    desig_email = models.EmailField(unique=True,default="none")
    designation = models.CharField(max_length=50, choices=DESIGNATION_CHOICES)


class Event(models.Model):
    """Model for Events"""
    EVENT_STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("UNDER_REVIEW", "Under Review"),
        ("APPROVED_BY_DEAN", "Approved by Dean"),
        ("FINAL_APPROVAL", "Final Approval"),
        ("REJECTED", "Rejected"),
    ]

    name = models.CharField(max_length=200)
    event_type = models.CharField(max_length=100)
    date = models.DateField()
    venue = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    representative = models.ForeignKey(RepresentativeStudent, on_delete=models.CASCADE)
    faculty_coordinator = models.ForeignKey(FacultyProfile, on_delete=models.CASCADE, related_name="coordinated_events")
    approved_by_dean = models.BooleanField(default=False)
    approved_by_director = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=EVENT_STATUS_CHOICES, default="PENDING")
    public_visible = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class EventBudget(models.Model):
    """Model for Event Budgets"""
    event = models.OneToOneField(Event, on_delete=models.CASCADE, related_name="eventbudget")
    budget_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    budget = models.TextField()
    approved_by_dean_finance = models.BooleanField(default=False)
    approved_by_director = models.BooleanField(default=False)
    priority_level = models.IntegerField(default=0)
    can_edit = models.BooleanField(default=True)  # Allows editing until approval

    def __str__(self):
        return f"Budget for {self.event.name} - ₹{self.budget_amount}"


class EventSponsorship(models.Model):
    """Model for Event Sponsorships"""
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="sponsorships")
    sponsor_name = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    sponsorship_details = models.TextField(default="none")

    def __str__(self):
        return f"{self.sponsor_name} - ₹{self.amount} for {self.event.name}"
    
class EventExpense(models.Model):
    """Model for tracking small expenses during the event"""
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="expenses")
    description = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.description} - ₹{self.amount} for {self.event.name}"