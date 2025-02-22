from django.urls import path
from .views import *

urlpatterns = [
    path("submit-complaint/", ComplaintCreateView.as_view(), name="submit-complaint"),
    path("complaints/", ApprovedComplaintsView.as_view(), name="approved-complaints"),
]
