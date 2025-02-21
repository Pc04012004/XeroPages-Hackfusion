from django.db import models
from login.models import *
# Create your models here.

# ✅ Cheating Record System
class CheatingRecord(models.Model):
    student = models.ForeignKey(Custom_User, on_delete=models.CASCADE, related_name="cheating_records")
    exam_name = models.CharField(max_length=255)
    reason = models.TextField()
    proof = models.FileField(upload_to="cheating_proofs/", null=True, blank=True)  # Images/PDFs
    date_reported = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.name} - {self.exam_name}"
    
from django.db import models
from django.contrib.auth.models import User

class Complaint(models.Model):
    student = models.ForeignKey(Custom_User, on_delete=models.CASCADE, null=True, blank=True)  # Null for anonymous
    anonymous = models.BooleanField(default=False)  # True = Temporary Anonymous
    text = models.TextField()
    image = models.ImageField(upload_to="complaints/images/", null=True, blank=True)
    video = models.FileField(upload_to="complaints/videos/", null=True, blank=True)
    approved = models.BooleanField(default=False)  # Moderation flag
    board_approved_identity = models.BooleanField(default=False)  # Identity Reveal
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Complaint #{self.id} - {'Anonymous' if self.anonymous else self.student.username}"
