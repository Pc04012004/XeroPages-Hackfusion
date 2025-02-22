from rest_framework import generics, status
from rest_framework.response import Response
from django.core.mail import send_mail
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import LeaveRequest
from .serializers import LeaveRequestSerializer
from login.models import *


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
        Student submits a leave request with an optional proof file.
        """
        reason = request.data.get("reason")
        departure_time = request.data.get("departure_time")
        return_time = request.data.get("return_time")
        proof = request.FILES.get("proof")  # Handle file upload

        leave_request = LeaveRequest.objects.create(
            student=request.user,
            reason=reason,
            departure_time=departure_time,
            return_time=return_time,
            proof=proof,  # Save the uploaded file
        )
        leave_request.save()

        serializer = LeaveRequestSerializer(leave_request)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


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
            student=StudentProfile.objects.get(user=request.user.id)
            subject = f"Leave Approved for {student.full_name}"
            message = f"""
            Dear student,

            Your leave has been granted by HOD.
            
            Reason: {leave_request.reason}
            Departure: {leave_request.departure_time}
            Return: {leave_request.return_time}

            Regards,
            College Administration
            """
            send_mail(subject, message, "omwasu20@gmail.com", [student.email])
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
            student=StudentProfile.objects.get(user=request.user.id)
            subject = f"Leave Approved for {student.full_name}"
            message = f"""
            Dear student,

            Your leave has been granted by Warden.
            
            Reason: {leave_request.reason}
            Departure: {leave_request.departure_time}
            Return: {leave_request.return_time}

            Regards,
            College Administration
            """
            send_mail(subject, message, "omwasu20@gmail.com", [student.email])
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

            Your child {student.full_name} has been granted leave and left the hostel for Home.
            Reason: {leave_request.reason}
            Departure: {leave_request.departure_time}
            Return: {leave_request.return_time}

            Regards,
            College Administration
            """
            send_mail(subject, message, "omwasu20@gmail.com", [profile.parent_email])

        return Response({"message": "Security verified leave, student is allowed to exit."}, status=status.HTTP_200_OK)
