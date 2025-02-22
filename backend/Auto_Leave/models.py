from django.db import models
from login.models import*
# Create your models here..
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
# class HealthRecord(models.Model):
#     full_name=models.CharField(max_length=20,default="not found")
#     department = models.CharField(max_length=100,choices=DEPARTMENT_CHOICES)  # Example: "Computer Science"
#     year = models.IntegerField()  # Example: 2 for second-year students
#     section = models.CharField(max_length=10, blank=True, null=True)
#     status = models.CharField(max_length=20)
#     doctor_notes = models.TextField()
#     date_reported = models.DateTimeField(auto_now_add=True)

class LeaveRequest(models.Model):
    student = models.ForeignKey(Custom_User, on_delete=models.CASCADE)
    reason = models.TextField()
    departure_time = models.DateTimeField()
    return_time = models.DateTimeField()
    proof=models.ImageField(upload_to='leave_proof/', null=True, blank=True)
    reject=models.BooleanField(default=False)
    hod_approval = models.BooleanField(default=False)
    warden_approval = models.BooleanField(default=False)
    security_verification = models.BooleanField(default=False)
    final_status = models.BooleanField(default=False)

class ClassCoordinator(models.Model):
    department = models.CharField(max_length=100,choices=DEPARTMENT_CHOICES)  # Example: "Computer Science"
    year = models.IntegerField()  # Example: 2 for second-year students
    section = models.CharField(max_length=10, blank=True, null=True)  # Example: "A", "B"
    coordinator_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

    def __str__(self):
        return f"{self.department} - Year {self.year} - Section {self.section} ({self.coordinator_name})"


