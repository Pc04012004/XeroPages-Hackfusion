from django.db import models
from login.models import *
from django.core.validators import MinValueValidator, MaxValueValidator

class ElectionPost(models.Model):    
    user = models.ForeignKey(Custom_User, on_delete=models.CASCADE)
    position = models.CharField(max_length=50, unique=True)
    description = models.TextField()
    date_posted = models.DateTimeField(auto_now_add=True)
    Eligibility = models.TextField()
    candidate_registration_deadline = models.DateTimeField()  # Deadline for candidates to register
    voting_day = models.DateTimeField()  # The day when voting will take place
    dean_approved = models.BooleanField(default=True)
    director_approved = models.BooleanField(default=False)

    def approve_by_dean(self):
        if not self.dean_approved:
            self.dean_approved = True
            self.save()

    def approve_by_director(self):
        if self.dean_approved and not self.director_approved:
            self.director_approved = True
            self.save()

    def __str__(self):
        return f"{self.position} (Posted on: {self.date_posted.strftime('%Y-%m-%d')})"


class Candidate(models.Model):
    user = models.ForeignKey(Custom_User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    registration_number = models.CharField(max_length=50, unique=True)
    department = models.CharField(max_length=100)
    year = models.IntegerField()
    position_applied = models.ForeignKey(ElectionPost, on_delete=models.CASCADE)
    # Eligibility Criteria
    is_cr_or_sic_member = models.BooleanField(default=False)
    attendance_current_semester = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    attendance_previous_year = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    cgpa = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(10)])
    no_backlogs = models.BooleanField(default=True)
    no_disciplinary_actions = models.BooleanField(default=True)
    iut_participation = models.BooleanField(default=False)
    sports_captain_or_coordinator = models.BooleanField(default=False)
    is_hostel_resident = models.BooleanField(default=False)
    proof_document = models.FileField(upload_to='candidate_proofs/', blank=True, null=True)
    manifesto = models.TextField()
    dean_approved = models.BooleanField(default=True)
    director_approved = models.BooleanField(default=False)
    date_applied = models.DateTimeField(auto_now_add=True)

    def approve_by_dean(self):
        if not self.dean_approved:
            self.dean_approved = True
            self.save()

    def approve_by_director(self):
        if self.dean_approved and not self.director_approved:
            self.director_approved = True
            self.save()

    def meets_eligibility(self):
        if self.position_applied.position in ['General Secretary', 'Cultural Secretary', 'Technical Secretary', "Girls' Representative"]:
            return (
                self.is_cr_or_sic_member and
                self.year == 3 and
                self.attendance_current_semester >= 75 and
                self.attendance_previous_year >= 75 and
                self.cgpa >= 6.75 and
                self.no_backlogs and
                self.no_disciplinary_actions and
                (self.is_hostel_resident if self.position_applied.position == "Girls' Representative" else True)
            )
        elif self.position_applied.position == 'Sports Secretary':
            return (
                (self.iut_participation or self.sports_captain_or_coordinator) and
                self.year == 3 and
                self.attendance_current_semester >= 75 and
                self.attendance_previous_year >= 75 and
                self.cgpa >= 6.00 and
                self.no_backlogs and
                self.no_disciplinary_actions
            )
        return False

    def _str_(self):
        return f"{self.name} - {self.position_applied.position}"

class Voter(models.Model):
    user = models.ForeignKey(Custom_User, on_delete=models.CASCADE)
    post= models.ForeignKey(ElectionPost,on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    year = models.IntegerField()
    registration_number = models.CharField(max_length=50)
    verified=models.BooleanField(default=False)

    def _str_(self):
        return f"{self.name} ({self.registration_number})"
    
class VoteCount(models.Model):
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    post = models.ForeignKey(ElectionPost, on_delete=models.CASCADE)  # Track post votes
    vote_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.candidate.user.full_name} - {self.post.position}: {self.vote_count} votes"


class VoterVote(models.Model):
    """
    Tracks which voter has voted for which election post.
    This prevents multiple votes for the same post but allows voting in different posts.
    """
    voter = models.ForeignKey(Voter, on_delete=models.CASCADE)  # Voter who cast the vote
    post = models.ForeignKey(ElectionPost, on_delete=models.CASCADE)  # Post they voted for
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE)  # Candidate they voted for
    timestamp = models.DateTimeField(auto_now_add=True)  # When the vote was cast

    class Meta:
        unique_together = ('voter', 'post')  # Ensures voter can vote only once per post

    def __str__(self):
        return f"{self.voter.name}"
