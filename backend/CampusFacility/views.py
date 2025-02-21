from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Facility, Booking
from .serializers import FacilitySerializer, BookingSerializer

# ✅ API to Fetch Facilities (for students)
class FacilityListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        facilities = Facility.objects.filter(availability_status=True)
        return Response(FacilitySerializer(facilities, many=True).data)


# ✅ API to Book a Facility (Students)
class FacilityBookingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if user.role != "student":
            return Response({"error": "Only students can book facilities"}, status=403)

        data = request.data
        facility = Facility.objects.get(id=data["facility_id"])

        # Create booking request
        booking = Booking.objects.create(
            student=user,
            facility=facility,
            date=data["date"],
            start_time=data["start_time"],
            end_time=data["end_time"],
            reason=data["reason"],
            status="pending"
        )
        return Response(BookingSerializer(booking).data, status=201)


# ✅ API to Fetch Pending Approvals (For HODs and Sport Head)
class PendingApprovalsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role not in ["hod", "sport_head"]:
            return Response({"error": "Unauthorized"}, status=403)

        if user.role == "hod":
            pending_bookings = Booking.objects.filter(
                facility__department=user.department, status="pending"
            )
        elif user.role == "sport_head":
            pending_bookings = Booking.objects.filter(
                facility__facility_type="sports", status="pending"
            )

        return Response(BookingSerializer(pending_bookings, many=True).data)


# ✅ API to Approve/Reject a Booking
class ApproveRejectBookingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, booking_id):
        try:
            user = request.user
            booking = Booking.objects.get(id=booking_id)

            if user.role not in ["hod", "sport_head"]:
                return Response({"error": "Unauthorized"}, status=403)

            if user.role == "hod" and booking.facility.department != user.department:
                return Response({"error": "You can only approve your department's bookings"}, status=403)

            if user.role == "sport_head" and booking.facility.facility_type != "sports":
                return Response({"error": "You can only approve sports bookings"}, status=403)

            action = request.data.get("action")  # "approve" or "reject"

            if action == "approve":
                booking.status = "approved"
                booking.approver = user
            elif action == "reject":
                booking.status = "rejected"
            else:
                return Response({"error": "Invalid action"}, status=400)

            booking.save()
            return Response(BookingSerializer(booking).data)

        except Booking.DoesNotExist:
            return Response({"error": "Booking not found"}, status=404)


# ✅ API for Security Guard to View Final Approved Bookings
class SecurityVerificationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "security":
            return Response({"error": "Unauthorized"}, status=403)

        approved_bookings = Booking.objects.filter(status="approved")
        return Response(BookingSerializer(approved_bookings, many=True).data)


# ✅ API to Fetch Free and Booked Slots
from django.db.models import Q

class FacilityAvailabilityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, facility_id, date):
        booked_slots = Booking.objects.filter(
            facility_id=facility_id,
            date=date,
            status="approved"
        ).values("start_time", "end_time")

        return Response({"booked_slots": booked_slots})
