import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ApplicationStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """
        Connect to WebSocket and join a group for real-time updates.
        """
        self.group_name = "application_updates"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        """
        Leave the WebSocket group when disconnected.
        """
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def send_application_update(self, event):
        """
        Receive an update and send it to the WebSocket clients.
        """
        await self.send(text_data=json.dumps(event["data"]))
