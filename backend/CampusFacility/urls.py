from django.urls import path
from .views import (
    FacilityListView,
    FacilityBookingView,
    PendingApprovalsView,
    ApproveRejectBookingView,
    SecurityVerificationView,
    FacilityAvailabilityView,
    BookingHistoryView,
    UserFacilitiesView,
    UserBookingHistoryView,
)

urlpatterns = [
    path('facilities/', FacilityListView.as_view(), name='facility-list'),#
    path('book-facility/', FacilityBookingView.as_view(), name='book-facility'),#
    path('pending-approvals/', PendingApprovalsView.as_view(), name='pending-approvals'),#
    path('approve-reject-booking/<int:booking_id>/', ApproveRejectBookingView.as_view(), name='approve-reject-booking'),#
    path('security-verification/', SecurityVerificationView.as_view(), name='security-verification'),#
    path('facility-availability/<int:facility_id>/', FacilityAvailabilityView.as_view(), name='facility-availability'),#
    path('booking-history/', BookingHistoryView.as_view(), name='booking-history'),#
    path('user-facilities/', UserFacilitiesView.as_view(), name='user-facilities'),#pending
    path('user-booking-history/', UserBookingHistoryView.as_view(), name='user-booking-history'),#pending
]
