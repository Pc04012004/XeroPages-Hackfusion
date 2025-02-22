from rest_framework import serializers
from .models import Event, EventBudget, EventSponsorship

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
