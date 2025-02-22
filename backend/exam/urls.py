from django.urls import path
from .views import (
    AnnouncementListView,
    AnnouncementCreateView,
    AnnouncementUpdateDeleteView,
    AnnouncementPDFView
)

urlpatterns = [
    path('api/announcements/', AnnouncementListView.as_view(), name='announcement-list'),
    path('api/announcements/create/', AnnouncementCreateView.as_view(), name='announcement-create'),
    path('api/announcements/<int:pk>/', AnnouncementUpdateDeleteView.as_view(), name='announcement-update-delete'),
    path('api/announcements/<int:announcement_id>/pdf/', AnnouncementPDFView.as_view(), name='announcement-pdf'),
]