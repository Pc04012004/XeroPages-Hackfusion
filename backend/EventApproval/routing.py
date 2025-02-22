from django.urls import path
from .consumers import ApplicationStatusConsumer

websocket_urlpatterns = [
    path("ws/status/", ApplicationStatusConsumer.as_asgi()),
]
