    
from rest_framework import serializers
from .models import CheatingRecord, Complaint

# ✅ Cheating Record Serializer
class CheatingRecordSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source="student.name")

    class Meta:
        model = CheatingRecord
        fields = ["id", "student_name", "exam_name", "reason", "proof", "date_reported"]

from rest_framework import serializers
from .models import Complaint

class ComplaintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = '__all__'