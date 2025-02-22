from django.db import models
from login.models import *
# Create your models here.

# ✅ Cheating Record System
class CheatingRecord(models.Model):
    student = models.CharField(max_length=50)
    exam_name = models.CharField(max_length=255)
    action  = models.TextField(blank=True,default="Not Done Yet")
    proof = models.FileField(upload_to="cheating_proofs/", null=True, blank=True)  # Images/PDFs
    date_reported = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student} - {self.exam_name}"
    
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
     if self.anonymous or self.student is None:
        return f"Complaint #{self.id} - Anonymous"
     return f"Complaint #{self.id} - {self.student.username}"
    
    def should_reveal_identity(self):
        """
        Check if the majority of board members have voted to reveal the identity.
        """
        total_votes = self.votes.count()
        if total_votes == 0:
            return False
        reveal_votes = self.votes.filter(vote=True).count()
        return (reveal_votes / total_votes) > 0.5  # More than 50% votes to reveal
    def save(self, *args, **kwargs):
    # Save the instance first to ensure it has a primary key
     super().save(*args, **kwargs)

    # Now check if the identity should be revealed
     if self.should_reveal_identity():
        self.board_approved_identity = True
        # Save again to update the board_approved_identity field
        super().save(*args, **kwargs)
    
class ComplaintVote(models.Model):
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name="votes")
    board_member = models.ForeignKey(Custom_User, on_delete=models.CASCADE)  # Board member who voted
    vote = models.BooleanField(default=True)  # True = Reveal Identity, False = Keep Anonymous

    class Meta:
        unique_together = ('complaint', 'board_member')  # Ensure each board member votes only once

    def __str__(self):
        return f"Vote by {self.board_member.username} on Complaint #{self.complaint.id}"
