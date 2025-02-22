from rest_framework import serializers
from .models import RepresentativeStudent, Event, EventBudget, EventSponsorship

class RepresentativeStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = RepresentativeStudent
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

class EventBudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventBudget
        fields = '__all__'

class EventSponsorshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventSponsorship
        fields = '__all__'
