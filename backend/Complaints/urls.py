from django.urls import path
from .views import *

urlpatterns = [
    path('cheating-record-list/', CheatingRecordListView.as_view(), name='cheating-record-list'),
    path('add-cheating-record/', AddCheatingRecordView.as_view(), name='add-cheating-record'),
    path('cheating-records/<int:cheating_record_id>/add-action/', AddActionToCheatingRecordView.as_view(), name='add-action-to-cheating-record'),
    path('cheating-records/pending-actions/', FetchPendingActionCheatingRecordsView.as_view(), name='fetch-pending-action-cheating-records'),
    
    path('api/complaints/<int:complaint_id>/vote/', VoteOnComplaintView.as_view(), name='vote-on-complaint'),
    path("submit-complaint/", ComplaintCreateView.as_view(), name="submit-complaint"),
    path("complaints/", ApprovedComplaintsView.as_view(), name="approved-complaints"),
]
