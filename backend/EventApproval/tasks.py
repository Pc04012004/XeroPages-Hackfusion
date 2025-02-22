from celery import shared_task
from django.utils.timezone import now
from datetime import timedelta
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import EventBudget, EventSponsorship

@shared_task
def increase_priority():
    """Increases priority level of unattended applications and sends real-time updates"""
    channel_layer = get_channel_layer()
    
    pending_budgets = EventBudget.objects.filter(approved_by_dean_finance=False, approved_by_director=False)
    pending_sponsorships = EventSponsorship.objects.filter(approved_by_dean_finance=False, approved_by_director=False)

    for budget in pending_budgets:
        if now() - budget.created_at > timedelta(days=1):
            budget.priority_level += 1
            budget.save()
            async_to_sync(channel_layer.group_send)(
                "application_updates",
                {"type": "send_application_update", "data": {
                    "event": "priority_updated",
                    "event_id": budget.id,
                    "event_name": budget.event.name,
                    "priority_level": budget.priority_level
                }},
            )

    for sponsorship in pending_sponsorships:
        if now() - sponsorship.created_at > timedelta(days=1):
            sponsorship.priority_level += 1
            sponsorship.save()
            async_to_sync(channel_layer.group_send)(
                "application_updates",
                {"type": "send_application_update", "data": {
                    "event": "priority_updated",
                    "event_id": sponsorship.id,
                    "event_name": sponsorship.event.name,
                    "priority_level": sponsorship.priority_level
                }},
            )

    return "Priority updated for pending applications."
