from rest_framework import serializers
from .models import Facility, Booking

class FacilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Facility
        fields = "__all__"

class BookingSerializer(serializers.ModelSerializer):
    facility_name = serializers.ReadOnlyField(source="facility.name")
    student_name = serializers.ReadOnlyField(source="student.name")
    approver_name = serializers.ReadOnlyField(source="approver.name")

    class Meta:
        model = Booking
        fields = [
            "id", "student_name", "facility_name", "start_date","end_date", "start_time", "end_time",
            "reason", "status", "approver_name"
            ]
