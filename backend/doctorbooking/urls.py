from django.urls import path
from .views import *

urlpatterns = [
    path('doctors/', DoctorView.as_view(), name='doctor-details'),
    path('doctors/available-slots/<int:doctor_id>/', DoctorAvailableSlotsView.as_view(), name='available-slots'),
    path('appointments/book/', BookAppointmentView.as_view(), name='book-appointment'),
    path('prescriptions/create/', CreatePrescriptionView.as_view(), name='create-prescription'),
]