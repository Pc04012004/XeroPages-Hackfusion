import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

app = Celery('backend')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# Schedule priority escalation task
app.conf.beat_schedule = {
    "increase-priority-daily": {
        "task": "app.tasks.increase_priority",
        "schedule": crontab(hour=0, minute=0),  # Runs every day at midnight
    }
}

@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
