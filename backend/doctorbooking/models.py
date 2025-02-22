from django.db import models
from login.models import *
# Create your models here.

class Doctor(models.Model):
    doc = models.ForeignKey(Custom_User, on_delete=models.CASCADE)
    available_start_time = models.TimeField()  # e.g., 10:00 AM
    available_end_time = models.TimeField()    # e.g., 1:00 PM
    available_start_time_afternoon = models.TimeField()  # e.g., 2:00 PM
    available_end_time_afternoon = models.TimeField()    # e.g., 5:00 PM

    def __str__(self):
        return self.name
    
class Appointment(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.student.name} - {self.doctor.name} - {self.date} {self.time}"

class Prescription(models.Model):
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE)
    details = models.TextField()
    bed_rest = models.BooleanField(default=False)

    def __str__(self):
        return f"Prescription for {self.appointment.student.name}"
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
class ClassCoordinator(models.Model):
    department = models.CharField(max_length=100,choices=DEPARTMENT_CHOICES)  # Example: "Computer Science"
    year = models.IntegerField()  # Example: 2 for second-year students
    section = models.CharField(max_length=10, blank=True, null=True)  # Example: "A", "B"
    coordinator_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

    def __str__(self):
        return f"{self.department} - Year {self.year} - Section {self.section} ({self.coordinator_name})"