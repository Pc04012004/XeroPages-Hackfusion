    
from rest_framework import serializers
from .models import CheatingRecord, Complaint

class CheatingRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheatingRecord
        fields = ['id', 'student', 'exam_name', 'action', 'proof', 'date_reported']

    def validate_proof(self, value):
        """
        Validate the uploaded file to ensure it's an image or PDF.
        """
        if value:
            valid_mime_types = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
            if value.content_type not in valid_mime_types:
                raise serializers.ValidationError("Only JPEG, PNG, GIF images, and PDFs are allowed.")
        return value
from rest_framework import serializers
from .models import CheatingRecord

class CheatingRecordActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheatingRecord
        fields = ['action']  # Only allow updating the `action` field

class CheatingRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheatingRecord
        fields = ['id', 'student', 'exam_name', 'action', 'proof', 'date_reported']
class CheatingRecordActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheatingRecord
        fields = ['action']  # Only allow updating the `action` field

from rest_framework import serializers
from .models import Complaint


from rest_framework import serializers
from .models import ComplaintVote

class ComplaintVoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplaintVote
        fields = ['id', 'complaint', 'board_member', 'vote']

class ComplaintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = "__all__"

    def to_representation(self, instance):
        """
        Conditionally reveal the student's identity.
        """
        data = super().to_representation(instance)
        if not instance.board_approved_identity and instance.anonymous:
            data['student'] = None  # Hide student identity
        return data