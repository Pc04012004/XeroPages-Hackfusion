from django.db import models
from login.models import*
# Create your models here..

class HealthRecord(models.Model):
    department = models.CharField(max_length=100)  # Example: "Computer Science"
    year = models.IntegerField()  # Example: 2 for second-year students
    section = models.CharField(max_length=10, blank=True, null=True)
    status = models.CharField(max_length=20)
    doctor_notes = models.TextField()
    date_reported = models.DateTimeField(auto_now_add=True)

class LeaveRequest(models.Model):
    student = models.ForeignKey(Custom_User, on_delete=models.CASCADE)
    reason = models.TextField()
    departure_time = models.DateTimeField()
    return_time = models.DateTimeField()
    reject=models.BooleanField(default=False)
    hod_approval = models.BooleanField(default=False)
    warden_approval = models.BooleanField(default=False)
    security_verification = models.BooleanField(default=False)
    final_status = models.BooleanField(default=False)

class ClassCoordinator(models.Model):
    department = models.CharField(max_length=100)  # Example: "Computer Science"
    year = models.IntegerField()  # Example: 2 for second-year students
    section = models.CharField(max_length=10, blank=True, null=True)  # Example: "A", "B"
    coordinator_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

    def __str__(self):
        return f"{self.department} - Year {self.year} - Section {self.section} ({self.coordinator_name})"


