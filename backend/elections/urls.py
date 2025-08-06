from django.urls import path
from .views import *

urlpatterns = [
    path("electionposts/", ElectionPostListCreateView.as_view(), name="add-election-post"),#
    path("electionposts/<int:pk>/approve/", ApproveElectionPostView.as_view(), name="approve-election-post"),
      # Candidate Registration & Approval
    path("candidates/register/", RegisterCandidateView.as_view(), name="register_candidate"),
    path("candidates/dean_student-approval/<int:pk>/", DeanApprovalView.as_view(), name="dean_approval"),
    path("candidates/director-approval/<int:pk>/", DirectorApprovalView.as_view(), name="director_approval"),
    path("candidates/approved/", ApprovedCandidatesPublicView.as_view(), name="approved_candidates"),
    path("voterRegister/",VoterRegistrationView.as_view()),

       # API for casting a vote (Phase 1: Voting Day)
    path('cast_vote/', CastVoteView.as_view(), name='cast_vote'),
    path('leaderboard/<int:post_id>/', LeaderboardView.as_view(), name='leaderboard'),
    path('start_counting/', StartCountingView.as_view(), name='start-counting'),
  # API to fetch leaderboard
]
