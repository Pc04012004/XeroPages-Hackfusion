from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    # 🔹 Student Representative APIs
    path("representatives/", RepresentativeStudentView.as_view(), name="representative-list"),

    # 🔹 Event Management APIs
    path("events/", EventView.as_view(), name="event-list-create"),
    
    # 🔹 Budget Management APIs
    path("event-budget/", EventBudgetView.as_view(), name="add-event-budget"),  # Add budget
    path("event-budget/<int:pk>/", UpdateEventBudgetView.as_view(), name="update-event-budget"),  # Update budget
    path("budget-approve/dean/<int:pk>/", ApproveBudgetByDeanView.as_view(), name="approve-budget-dean"),  # Approve by Dean
    path("budget-approve/director/<int:pk>/", ApproveBudgetByDirectorView.as_view(), name="approve-budget-director"),  # Approve by Director
    path("budget-reject/dean/<int:pk>/", RejectBudgetByDeanView.as_view(), name="reject-budget-dean"),  # Reject budget

    # 🎯 Event Sponsorship URLs
    path("event-sponsorship/", AddSponsorshipView.as_view(), name="add-sponsorship"),  # Add sponsorship
    path("event-sponsorship/<int:event_id>/", EventSponsorshipView.as_view(), name="get-sponsorships"),  # Fetch sponsorships of an event

    # 🎯 Event Approval URLs
    path("event-approve/dean/<int:pk>/", ApproveEventByDeanView.as_view(), name="approve-event-dean"),  # Approve event by Dean
    path("event-approve/director/<int:pk>/", ApproveEventByDirectorView.as_view(), name="approve-event-director"),  # Approve event by Director (Final Approval)
    path("track-applications/", TrackApplicationsView.as_view(), name="track-applications"),
]
