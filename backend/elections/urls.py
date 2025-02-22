from django.urls import path
from .views import *

urlpatterns = [
    path("electionposts/", ElectionPostListCreateView.as_view(), name="add-election-post"),
    path("electionposts/<int:pk>/approve/", ApproveElectionPostView.as_view(), name="approve-election-post"),
      # Candidate Registration & Approval
    path("candidates/register/", RegisterCandidateView.as_view(), name="register_candidate"),
    path("candidates/dean_student-approval/<int:pk>/", DeanApprovalView.as_view(), name="dean_approval"),
    path("candidates/director-approval/<int:pk>/", DirectorApprovalView.as_view(), name="director_approval"),
    path("candidates/approved/", ApprovedCandidatesPublicView.as_view(), name="approved_candidates"),
    path("voterRegister/",VoterRegistrationView.as_view()),

       # API for casting a vote (Phase 1: Voting Day)
    path('cast_vote/', cast_vote, name='cast_vote'),

    # API for starting the counting process (Phase 2: Counting Day)
    path('start_counting/', start_counting, name='start_counting'),

    # API for counting votes in chunks of 10 (Phase 2: Counting Day)
    path('count_votes/', count_votes, name='count_votes'),

    # API for fetching the leaderboard (Phase 2: Counting Day)
    path('get_leaderboard/<int:post_id>/', get_leaderboard, name='get_leaderboard'),
  # API to fetch leaderboard
]
