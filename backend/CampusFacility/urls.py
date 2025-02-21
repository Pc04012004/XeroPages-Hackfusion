from django.urls import path
from .views import (
    FacilityListView, FacilityBookingView, PendingApprovalsView,
    ApproveRejectBookingView, SecurityVerificationView, FacilityAvailabilityView
)

urlpatterns = [
    path("facilities/", FacilityListView.as_view(), name="facility-list"),
    path("book-facility/", FacilityBookingView.as_view(), name="facility-book"),
    path("bookings/pending-approvals/", PendingApprovalsView.as_view(), name="pending-approvals"),
    path("bookings/<int:booking_id>/approve-reject/", ApproveRejectBookingView.as_view(), name="approve-reject"),
    path("bookings/security-verification/", SecurityVerificationView.as_view(), name="security-verification"),
    path("facilities/<int:facility_id>/availability/<str:date>/", FacilityAvailabilityView.as_view(), name="facility-availability"),
]
