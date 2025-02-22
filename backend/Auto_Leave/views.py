from rest_framework import serializers, generics, permissions, status
from rest_framework.response import Response
from django.core.mail import send_mail
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import *
from.serializers import *
from login.permissions import *

# Create your views here.
from django.core.mail import send_mail
from django.utils.timezone import now
from rest_framework.response import Response
from rest_framework import status, generics
from .models import HealthRecord, ClassCoordinator
from .serializers import HealthRecordSerializer

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.core.mail import send_mail
from django.utils.timezone import now
from .models import HealthRecord, ClassCoordinator
from .serializers import HealthRecordSerializer

class HealthRecordListCreateView(generics.ListCreateAPIView):
    """
    API to fetch all health records and add a new one.
    Only authenticated users can access this.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, *args, **kwargs):
        """
        Fetch all health records.
        """
        health_records = HealthRecord.objects.all()
        serializer = HealthRecordSerializer(health_records, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """
        Allow users to create a new health record.
        If the student is marked as 'Sick', an email is sent to the class coordinator.
        """
        full_name = request.data.get("full_name")
        department = request.data.get("department")
        year = request.data.get("year")
        section = request.data.get("section")
        status_text = request.data.get("status")  # "Sick", "Healthy", etc.
        doctor_notes = request.data.get("doctor_notes")

        # Check if an existing health record exists
        existing_record = HealthRecord.objects.filter(
            department=department, year=year, section=section, status=status_text
        ).first()

        if existing_record:
            return Response(HealthRecordSerializer(existing_record).data, status=status.HTTP_200_OK)

        # Create a new health record
        new_health_record = HealthRecord.objects.create(
            full_name=full_name,
            department=department,
            year=year,
            section=section,
            status=status_text,
            doctor_notes=doctor_notes,
        )
        new_health_record.save()

        # If student is marked "Sick", notify the class coordinator
        if status_text.lower() == "sick":
            class_coordinator = ClassCoordinator.objects.filter(
                department=department, year=year, section=section
            ).first()

            if class_coordinator:
                subject = f"Health Notification: {full_name} from {department} - Year {year} - Section {section}"
                message = f"""
                Dear {class_coordinator.coordinator_name},

                A {full_name} from {department}, Year {year}, Section {section} has been marked as Sick.

                Doctor's Notes:
                {doctor_notes}

                Date Reported: {now().strftime("%Y-%m-%d %H:%M")}

                Please take the necessary actions.

                Regards,
                Health Monitoring System
                """
                send_mail(subject, message, "admin@yourwebsite.com", [class_coordinator.email],fail_silently=False)

        return Response(HealthRecordSerializer(new_health_record).data, status=status.HTTP_201_CREATED)
  
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.core.mail import send_mail
from .models import LeaveRequest, Custom_User
from .serializers import LeaveRequestSerializer


class LeaveRequestView(generics.ListCreateAPIView):
    """
    API for students to request leave.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, *args, **kwargs):
        """
        Fetch all leave requests for the logged-in student.
        """
        leave_requests = LeaveRequest.objects.filter(student=request.user)
        serializer = LeaveRequestSerializer(leave_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """
        Student submits a leave request.
        """
        reason = request.data.get("reason")
        departure_time = request.data.get("departure_time")
        return_time = request.data.get("return_time")

        leave_request = LeaveRequest.objects.create(
            student=request.user,
            reason=reason,
            departure_time=departure_time,
            return_time=return_time,
        )
        leave_request.save()

        return Response(LeaveRequestSerializer(leave_request).data, status=status.HTTP_201_CREATED)


# class HODUnapprovedLeaveView(generics.ListAPIView):
#     """
#     API for HOD to fetch all unapproved leave requests.
#     """
#     permission_classes = [IsAuthenticated]
#     authentication_classes = [JWTAuthentication]

#     def get(self, request, *args, **kwargs):
#         leave_requests = LeaveRequest.objects.filter(hod_approval=False)
#         serializer = LeaveRequestSerializer(leave_requests, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

class HODUnapprovedLeaveView(generics.ListAPIView):
    """
    API for HOD to fetch all unapproved leave requests for their department.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, *args, **kwargs):
        # Check if the user is an HOD
        if request.user.role != "hod":
            return Response({"error": "Access Denied. Only HODs can access this."}, status=status.HTTP_403_FORBIDDEN)

        # Fetch only students from the HOD's department
        leave_requests = LeaveRequest.objects.filter(
            student__department=request.user.department,  # Filter by HOD's department
            hod_approval=False
        )
        
        serializer = LeaveRequestSerializer(leave_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class HODApprovalView(generics.UpdateAPIView):
    """
    API for HOD to approve or reject leave (only for students in their department).
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def put(self, request, *args, **kwargs):
        leave_id = kwargs.get("pk")
        action = request.data.get("action")  # Approve or Reject

        try:
            leave_request = LeaveRequest.objects.get(id=leave_id)
        except LeaveRequest.DoesNotExist:
            return Response({"error": "Leave request not found."}, status=status.HTTP_404_NOT_FOUND)

        # Ensure HOD can only approve/reject requests from their department
        if request.user.role != "hod" or leave_request.student.department != request.user.department:
            return Response({"error": "You can only manage leave requests from your department."}, status=status.HTTP_403_FORBIDDEN)

        if action == "approve":
            leave_request.hod_approval = True
            leave_request.save()
            return Response({"message": "Leave approved by HOD."}, status=status.HTTP_200_OK)

        elif action == "reject":
            leave_request.delete()
            return Response({"message": "Leave request rejected by HOD."}, status=status.HTTP_200_OK)

        return Response({"error": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)



class WardenUnapprovedLeaveView(generics.ListAPIView):
    """
    API for Warden to fetch all unapproved leave requests (only those approved by HOD).
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, *args, **kwargs):
        leave_requests = LeaveRequest.objects.filter(hod_approval=True, warden_approval=False)
        serializer = LeaveRequestSerializer(leave_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class WardenApprovalView(generics.UpdateAPIView):
    """
    API for Warden to approve or reject leave.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def put(self, request, *args, **kwargs):
        leave_id = kwargs.get("pk")
        action = request.data.get("action")  # Accept or Reject

        try:
            leave_request = LeaveRequest.objects.get(id=leave_id)
        except LeaveRequest.DoesNotExist:
            return Response({"error": "Leave request not found."}, status=status.HTTP_404_NOT_FOUND)

        if not leave_request.hod_approval:
            return Response({"error": "HOD must approve first."}, status=status.HTTP_400_BAD_REQUEST)

        if action == "approve":
            leave_request.warden_approval = True
            leave_request.save()
            return Response({"message": "Warden approved the leave."}, status=status.HTTP_200_OK)

        elif action == "reject":
            leave_request.delete()
            return Response({"message": "Leave request rejected by Warden."}, status=status.HTTP_200_OK)

        return Response({"error": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)


class SecurityPendingLeaveView(generics.ListAPIView):
    """
    API for Security to fetch all fully approved leave requests.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, *args, **kwargs):
        leave_requests = LeaveRequest.objects.filter(hod_approval=True, warden_approval=True, security_verification=False)
        serializer = LeaveRequestSerializer(leave_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SecurityVerificationView(generics.UpdateAPIView):
    """
    API for Security Guard to verify leave and allow exit.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def put(self, request, *args, **kwargs):
        leave_id = kwargs.get("pk")

        try:
            leave_request = LeaveRequest.objects.get(id=leave_id)
        except LeaveRequest.DoesNotExist:
            return Response({"error": "Leave request not found."}, status=status.HTTP_404_NOT_FOUND)

        if not leave_request.hod_approval or not leave_request.warden_approval:
            return Response({"error": "Leave must be approved by HOD and Warden first."}, status=status.HTTP_400_BAD_REQUEST)

        leave_request.security_verification = True
        leave_request.final_status = True  # Mark leave as fully approved
        leave_request.save()

        # Send Email to Parents after final approval
        student = leave_request.student
        profile = StudentProfile.objects.get(user=student)
        print(profile)
        if profile.parent_email:
            subject = f"Leave Approved for {student.full_name} {student.last_name}"
            message = f"""
            Dear Parent,

            Your child {student.full_name} has been granted leave.

            Reason: {leave_request.reason}
            Departure: {leave_request.departure_time}
            Return: {leave_request.return_time}

            Regards,
            College Administration
            """
            send_mail(subject, message, "omwasu20@gmail.com", [profile.parent_email])

        return Response({"message": "Security verified leave, student is allowed to exit."}, status=status.HTTP_200_OK)
