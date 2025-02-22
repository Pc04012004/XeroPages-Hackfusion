from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from .models import Facility, Booking
from .serializers import FacilitySerializer, BookingSerializer

# Pagination for booking history
class BookingHistoryPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

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

        # Check for overlapping bookings
        overlapping_bookings = Booking.objects.filter(
            facility=facility,
            start_date__lte=data["end_date"],
            end_date__gte=data["start_date"],
            status="approved"
        ).filter(
            Q(start_time__lt=data["end_time"]) & Q(end_time__gt=data["start_time"])
        )

        if overlapping_bookings.exists():
            return Response({"error": "Facility is already booked during this time"}, status=400)

        # Create booking request
        booking = Booking.objects.create(
            student=user,
            facility=facility,
            start_date=data["start_date"],
            end_date=data["end_date"],
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
class FacilityAvailabilityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, facility_id):
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        if not start_date or not end_date:
            return Response({"error": "start_date and end_date are required"}, status=400)

        # Fetch all approved bookings within the date range
        booked_slots = Booking.objects.filter(
            facility_id=facility_id,
            start_date__lte=end_date,
            end_date__gte=start_date,
            status="approved"
        ).values("start_date", "end_date", "start_time", "end_time")

        return Response({"booked_slots": booked_slots})

# ✅ API to Fetch Recent Booking History (for Students)
class BookingHistoryView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = BookingHistoryPagination

    def get(self, request):
        user = request.user

        if user.role != "student":
            return Response({"error": "Only students can view booking history"}, status=403)

        # Fetch all bookings for the student, sorted by most recent first
        bookings = Booking.objects.filter(student=user).order_by("-start_date", "-start_time")

        # Paginate the results
        paginator = self.pagination_class()
        paginated_bookings = paginator.paginate_queryset(bookings, request)
        serializer = BookingSerializer(paginated_bookings, many=True)

        return paginator.get_paginated_response(serializer.data)

# ✅ API to Show All Facilities Under a User (HOD or Sport Head)
class UserFacilitiesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role == "hod":
            # Fetch facilities managed by the HOD
            facilities = Facility.objects.filter(managed_by=user)
        elif user.role == "sport_head":
            # Fetch sports facilities managed by the Sport Head
            facilities = Facility.objects.filter(facility_type="sports", managed_by=user)
        else:
            return Response({"error": "Unauthorized"}, status=403)

        serializer = FacilitySerializer(facilities, many=True)
        return Response(serializer.data)

# ✅ API to Show All Approved and Rejected Bookings for a Specific User (Student)
class UserBookingHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role != "student":
            return Response({"error": "Only students can view their booking history"}, status=403)

        # Fetch all approved and rejected bookings for the user
        bookings = Booking.objects.filter(
            student=user,
            status__in=["approved", "rejected"]
        ).order_by("-start_date", "-start_time")

        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)