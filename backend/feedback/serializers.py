from rest_framework import serializers
from .models import Lecture, Feedback

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['clarity_rating', 'pace_rating', 'engagement_rating', 'comments', 'timestamp']

class LectureSerializer(serializers.ModelSerializer):
    feedbacks = FeedbackSerializer(many=True, read_only=True)

    class Meta:
        model = Lecture
        fields = ['id', 'title', 'instructor', 'department', 'year', 'start_time', 'end_time', 'date', 'feedbacks']

from rest_framework import serializers
from .models import AdministrationFeedback

class AdministrationFeedbackSerializer(serializers.ModelSerializer):
    submitted_by = serializers.StringRelatedField()  # Show username of the submitter

    class Meta:
        model = AdministrationFeedback
        fields = ['id', 'title', 'description', 'submitted_by', 'timestamp', 'admin_response']