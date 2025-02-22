from django.urls import path
from .views import *

urlpatterns = [
    # path("health-records/", HealthRecordListCreateView.as_view(), name="health_records"),
    path("leave-requests/", LeaveRequestView.as_view(), name="leave_requests"),
    path("leave-requests/unapproved/hod/", HODUnapprovedLeaveView.as_view(), name="hod_unapproved_leaves"),
    path("leave-requests/<int:pk>/hod-approve/", HODApprovalView.as_view(), name="hod_approval"),
    path("leave-requests/unapproved/warden/", WardenUnapprovedLeaveView.as_view(), name="warden_unapproved_leaves"),
    path("leave-requests/<int:pk>/warden-approve/", WardenApprovalView.as_view(), name="warden_approval"),
    path("leave-requests/pending/security/", SecurityPendingLeaveView.as_view(), name="security_pending_leaves"),
    path("leave-requests/<int:pk>/security-verify/", SecurityVerificationView.as_view(), name="security_verification"), #put request give action = reject or approve
]
