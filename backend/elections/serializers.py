from rest_framework import serializers
from .models import *
from rest_framework import serializers
from .models import VoteCount

class ElectionPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectionPost
        fields = '__all__'

class CandidateSerializer_d(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = '__all__'
        depth = 1  # ✅ Set to an integer (e.g., 1)


class CandidateSerializer(serializers.ModelSerializer):
    meets_eligibility = serializers.SerializerMethodField()  

    class Meta:
        model = Candidate
        fields = '__all__'  
        read_only_fields = ['dean_approved', 'director_approved']  

    def get_meets_eligibility(self, obj):  
        """Check if the candidate meets eligibility criteria."""
        return obj.meets_eligibility()

    def validate(self, data):  
        """Ensure only eligible candidates can register."""
        if not self.instance:  
            candidate = Candidate(**data)
            if not candidate.meets_eligibility():
                raise serializers.ValidationError("Candidate does not meet eligibility criteria.")
        return data

    def approve_by_dean(self):  
        """Approve candidate by the dean."""
        instance = self.instance
        if not instance:
            raise serializers.ValidationError("Candidate instance is required.")
        if instance.dean_approved:
            raise serializers.ValidationError("Candidate already approved by the dean.")
        instance.dean_approved = True
        instance.save()

    def approve_by_director(self):  
        """Approve candidate by the director (only after dean approval)."""
        instance = self.instance
        if not instance:
            raise serializers.ValidationError("Candidate instance is required.")
        if not instance.dean_approved:
            raise serializers.ValidationError("Dean approval is required before director approval.")
        if instance.director_approved:
            raise serializers.ValidationError("Candidate already approved by the director.")
        instance.director_approved = True
        instance.save()


class VoterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Voter
        fields = '__all__'


class VoteCountSerializer(serializers.ModelSerializer):
    candidate_name = serializers.CharField(source="candidate.user.full_name", read_only=True)
    post_name = serializers.CharField(source="post.position", read_only=True)

    class Meta:
        model = VoteCount
        fields = ['id', 'candidate', 'candidate_name', 'post', 'post_name', 'vote_count']
