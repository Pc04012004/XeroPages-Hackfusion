from django.urls import path
from .views import ApproveElectionPostView,ElectionPostListCreateView

urlpatterns = [
    path("electionposts/", ElectionPostListCreateView.as_view(), name="add-election-post"),
    path("electionposts/<int:pk>/approve/", ApproveElectionPostView.as_view(), name="approve-election-post"),
]
