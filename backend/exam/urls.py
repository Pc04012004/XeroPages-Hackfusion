from django.urls import path
from .views import (
    AnnouncementListView,
    AnnouncementCreateUpdateDeleteView,
    AnnouncementCreateView,
    AnnouncementPDFView
)

urlpatterns = [
    path('announcements/', AnnouncementListView.as_view(), name='announcement-list'),
    path('announcements/create/', AnnouncementCreateView.as_view(), name='announcement-create'),
    path('announcements/<int:pk>/', AnnouncementCreateUpdateDeleteView.as_view(), name='announcement-detail'),
    path('announcements/<int:announcement_id>/pdf/', AnnouncementPDFView.as_view(), name='announcement-pdf'),
]
