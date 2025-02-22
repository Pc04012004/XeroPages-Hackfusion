from django.shortcuts import render
from django.core.mail import send_mail
# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *
from datetime import datetime, timedelta
from login.models import *
class DoctorView(APIView):
    """
    Fetch details of all doctors.
    """
    def get(self, request, *args, **kwargs):
        # Fetch all doctors
        doctors = Doctor.objects.all()

        # Serialize the doctor data
        serializer = DoctorSerializer(doctors, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class DoctorAvailableSlotsView(APIView):
    """
    Fetch available slots for a doctor.
    """
    def get(self, request, doctor_id, *args, **kwargs):
        try:
            doctor = Doctor.objects.get(id=doctor_id)
        except Doctor.DoesNotExist:
            return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)

        # Calculate available slots
        slots = self.calculate_available_slots(doctor)
        return Response(slots, status=status.HTTP_200_OK)

    def calculate_available_slots(self, doctor):
        """
        Calculate available slots for a doctor.
        """
        slots = []
        start_time = doctor.available_start_time
        end_time = doctor.available_end_time
        afternoon_start_time = doctor.available_start_time_afternoon
        afternoon_end_time = doctor.available_end_time_afternoon

        # Morning slots
        current_time = datetime.combine(datetime.today(), start_time)
        while current_time.time() < end_time:
            slots.append(current_time.strftime("%H:%M"))
            current_time += timedelta(minutes=30)  # 30-minute slots

        # Afternoon slots
        current_time = datetime.combine(datetime.today(), afternoon_start_time)
        while current_time.time() < afternoon_end_time:
            slots.append(current_time.strftime("%H:%M"))
            current_time += timedelta(minutes=30)

        return {"available_slots": slots}
    
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import JWTAuthentication
from django.utils.timezone import now
class BookAppointmentView(APIView):
    """
    Book an appointment for a student.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request, *args, **kwargs):
        student_id = request.user.id
        doctor_id = request.data.get("doctor_id")
        date = request.data.get("date")
        time = request.data.get("time")

        try:
            s = Custom_User.objects.get(id=student_id)
            student= p=StudentProfile.objects.get(user=s)
            doctor = Doctor.objects.get(id=doctor_id)
        except (Custom_User.DoesNotExist, Doctor.DoesNotExist):
            return Response({"error": "Student or Doctor not found"}, status=status.HTTP_404_NOT_FOUND)

        # Check if slot is available
        if not self.is_slot_available(doctor, date, time):
            return Response({"error": "Slot not available"}, status=status.HTTP_400_BAD_REQUEST)

        # Create appointment
        appointment = Appointment.objects.create(
            student=student,
            doctor=doctor,
            date=date,
            time=time,
        )
        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def is_slot_available(self, doctor, date, time):
        """
        Check if the slot is available.
        """
        existing_appointments = Appointment.objects.filter(doctor=doctor, date=date, time=time)
        return not existing_appointments.exists()
    from django.core.mail import send_mail

class CreatePrescriptionView(APIView):
    """
    Add a prescription and send emails if bed rest is prescribed.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request, *args, **kwargs):
        appointment_id = request.data.get("appointment_id")
        details = request.data.get("details")
        bed_rest = request.data.get("bed_rest", False)

        try:
            appointment = Appointment.objects.get(id=appointment_id)
        except Appointment.DoesNotExist:
            return Response({"error": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)

        # Create prescription
        prescription = Prescription.objects.create(
            appointment=appointment,
            details=details,
            bed_rest=bed_rest,
        )
        serializer = PrescriptionSerializer(prescription)
        # Send emails if bed rest is prescribed
        if bed_rest:
            student = appointment.student
            subject = "Bed Rest Prescribed"
            message = f"Dear {student.full_name},\n\nYou have been prescribed bed rest. Please take care.\n\nRegards,\nCollege Doctor"
            recipient_list = [student.email,]
            send_mail(subject, message, "doctor@college.edu", recipient_list, fail_silently=False)
            class_coordinator = ClassCoordinator.objects.filter(
                department=student.department, year=student.year_of_study, section=student.section
            ).first()
            if class_coordinator:
                subject = f"Health Notification: {student.full_name} from {student.department} - Year {student.year_of_study} - Section {student.section}"
                message = f"""
                Dear {class_coordinator.coordinator_name},

                A {student.full_name} from {student.department}, Year {student.year_of_study}, Section {student.section} has been marked as Sick.

                Doctor's Notes:
                {details}

                Date Reported: {now().strftime("%Y-%m-%d %H:%M")}

                Please take the necessary actions.

                Regards,
                Health Monitoring System
                """
                send_mail(subject, message, "admin@yourwebsite.com", [class_coordinator.email],fail_silently=False)
                
        return Response(serializer.data, status=status.HTTP_201_CREATED)