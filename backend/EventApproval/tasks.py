from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import RepresentativeStudent, Event, EventBudget, EventSponsorship
from .serializers import RepresentativeStudentSerializer, EventSerializer, EventBudgetSerializer, EventSponsorshipSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from celery import shared_task
from django.utils.timezone import now
from datetime import timedelta

# Real-time WebSocket update function
def send_application_update(event_type, instance):
    """Send real-time WebSocket updates"""
    channel_layer = get_channel_layer()
    data = {
        "event": event_type,
        "event_id": instance.id,
        "event_name": instance.name if hasattr(instance, 'name') else instance.event.name,
        "priority_level": getattr(instance, 'priority_level', None),
        "status": getattr(instance, 'status', None),
        "public_visible": getattr(instance, 'public_visible', None),
    }
    async_to_sync(channel_layer.group_send)(
        "application_updates", {"type": "send_application_update", "data": data}
    )

from celery import shared_task
from django.utils.timezone import now
from datetime import timedelta
@shared_task
def increase_priority():
    pending_budgets = EventBudget.objects.filter(approved_by_dean_finance=False)
    pending_sponsorships = EventSponsorship.objects.filter(approved_by_dean_finance=False)

    for budget in pending_budgets:
        if now() - budget.submitted_at > timedelta(days=1):
            budget.priority_level += 1
            budget.save()
            send_application_update("budget_priority_updated", budget)

    for sponsorship in pending_sponsorships:
        if now() - sponsorship.submitted_at > timedelta(days=1):
            sponsorship.priority_level += 1
            sponsorship.save()
            send_application_update("sponsorship_priority_updated", sponsorship)

    return "Priority updated."
