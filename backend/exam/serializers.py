from rest_framework import serializers
from .models import Announcement  # Import the Announcement model

class AnnouncementSerializer(serializers.ModelSerializer):
    """
    Serializer to convert Announcement model data to JSON format.
    """

    class Meta:
        model = Announcement  # Model to serialize
        fields = '_all_'  # Serialize all fields in the Announcement model

