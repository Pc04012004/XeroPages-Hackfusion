from rest_framework import serializers
from django.contrib.auth.models import User
from .models import ElectionPost

class ElectionPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectionPost
        fields = '__all__'

# class CandidateSerializer(serializers.ModelSerializer):
#     meets_eligibility = serializers.ReadOnlyField()

#     class Meta:
#         model = Candidate
#         fields = '__all__'

# class VoterSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Voter
#         fields = '__all__'
