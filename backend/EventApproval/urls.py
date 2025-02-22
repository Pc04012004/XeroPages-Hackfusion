from django.urls import path
from .views import *

urlpatterns = [
    path('representatives/', RepresentativeStudentView.as_view(), name="representative-list-create"),

    # Events
    path('events/', EventView.as_view(), name="event-list-create"),

    # Event Approvals
    # path('events/<int:pk>/approve/dean/', ApproveEventByDeanView.as_view(), name="event-approve-dean"),
    # path('events/<int:pk>/approve/director/', ApproveEventByDirectorView.as_view(), name="event-approve-director"),
    path('approve-budget-dean/<int:pk>/', ApproveBudgetByDeanView.as_view()),
    path('approve-budget-director/<int:pk>/', ApproveBudgetByDirectorView.as_view()),
]