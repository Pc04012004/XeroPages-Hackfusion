from django.urls import path
from .views import *

urlpatterns = [
    path("electionposts/", ElectionPostListCreateView.as_view(), name="add-election-post"),
    path("electionposts/<int:pk>/approve/", ApproveElectionPostView.as_view(), name="approve-election-post"),
      # Candidate Registration & Approval
    path("candidates/register/", RegisterCandidateView.as_view(), name="register_candidate"),
    path("candidates/dean-approval/<int:pk>/", DeanApprovalView.as_view(), name="dean_approval"),
    path("candidates/director-approval/<int:pk>/", DirectorApprovalView.as_view(), name="director_approval"),
    path("candidates/approved/", ApprovedCandidatesPublicView.as_view(), name="approved_candidates"),

    path("voterRegister",VoterRegistrationView.as_view()),
    path("vote/", CastVoteView.as_view(), name="cast-vote"), 
    path("vote/", CastVoteView.as_view(), name="cast-vote"),  # API to cast a vote
    path("leaderboard/", LeaderboardView.as_view(), name="leaderboard"),  # API to fetch leaderboard
]
