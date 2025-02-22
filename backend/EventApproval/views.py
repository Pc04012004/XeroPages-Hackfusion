from django.shortcuts import render

# Create your views here.
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import *
from .serializers import *

class RepresentativeStudentView(generics.ListCreateAPIView):
    """
    API for managing Student Representatives.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, *args, **kwargs):
        """
        Fetch all student representatives.
        """
        representatives = RepresentativeStudent.objects.all()
        serializer = RepresentativeStudentSerializer(representatives, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """
        Create a new student representative.
        """
        user = request.user
        designation = request.data.get("designation")
        club_name = request.data.get("club_name", None)

        representative = RepresentativeStudent.objects.create(
            user=user, designation=designation, club_name=club_name
        )
        representative.save()

        return Response(RepresentativeStudentSerializer(representative).data, status=status.HTTP_201_CREATED)

class EventView(generics.ListCreateAPIView):
    """
    API for managing Events.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, *args, **kwargs):
        """
        Fetch all events.
        """
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """
        Create a new event.
        """
        name = request.data.get("name")
        event_type = request.data.get("event_type")
        date = request.data.get("date")
        venue = request.data.get("venue")
        description = request.data.get("description", "")
        representative = request.user.representative
        faculty_coordinator = request.user

        event = Event.objects.create(
            name=name,
            event_type=event_type,
            date=date,
            venue=venue,
            description=description,
            representative=representative,
            faculty_coordinator=faculty_coordinator
        )
        event.save()

        return Response(EventSerializer(event).data, status=status.HTTP_201_CREATED)
    
# class ApproveEventByDeanView(generics.UpdateAPIView):
#     """
#     API for Dean to approve events.
#     """
#     permission_classes = [IsAuthenticated]
#     authentication_classes = [JWTAuthentication]

#     def post(self, request, pk, *args, **kwargs):
#         """
#         Approve an event by the Dean.
#         """
#         try:
#             event = Event.objects.get(pk=pk)
#             event.dean_approved = True
#             event.save()
#             return Response({"message": "Event approved by Dean"}, status=status.HTTP_200_OK)
#         except Event.DoesNotExist:
#             return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

# class ApproveEventByDirectorView(generics.UpdateAPIView):
#     """
#     API for Director to approve events.
#     """
#     permission_classes = [IsAuthenticated]
#     authentication_classes = [JWTAuthentication]

#     def post(self, request, pk, *args, **kwargs):
#         """
#         Approve an event by the Director.
#         """
#         try:
#             event = Event.objects.get(pk=pk)
#             event.director_approved = True
#             event.save()
#             return Response({"message": "Event approved by Director"}, status=status.HTTP_200_OK)
#         except Event.DoesNotExist:
#             return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import EventBudget, EventSponsorship
from .serializers import EventBudgetSerializer, EventSponsorshipSerializer
# from .tasks import send_application_update

class ApproveBudgetByDeanView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        budget = EventBudget.objects.get(pk=pk)
        budget.approved_by_dean_finance = True
        budget.save()
        send_application_update("budget_approved_by_dean", budget)
        return Response({"message": "Budget approved by Dean"})

class ApproveBudgetByDirectorView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        budget = EventBudget.objects.get(pk=pk)
        budget.approved_by_director = True
        budget.save()
        send_application_update("budget_approved_by_director", budget)
        return Response({"message": "Budget approved by Director"})
    
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def send_application_update(event_type, instance):
    """Send real-time status updates over WebSockets"""
    channel_layer = get_channel_layer()
    data = {
        "event": event_type,
        "event_id": instance.id,
        "event_name": instance.event.name,
        "approved_by_dean_finance": instance.approved_by_dean_finance,
        "approved_by_director": instance.approved_by_director,
        "priority_level": instance.priority_level,
    }
    async_to_sync(channel_layer.group_send)(
        "application_updates",
        {"type": "send_application_update", "data": data},
    )

class ApproveBudgetByDeanView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk, *args, **kwargs):
        """Dean approves the budget & sends real-time update"""
        try:
            budget = EventBudget.objects.get(pk=pk)
            budget.approved_by_dean_finance = True
            budget.save()
            send_application_update("budget_approved_by_dean", budget)
            return Response({"message": "Budget approved by Dean of Finance"}, status=status.HTTP_200_OK)
        except EventBudget.DoesNotExist:
            return Response({"error": "Budget not found"}, status=status.HTTP_404_NOT_FOUND)

class RejectBudgetByDeanView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated, ]
    
    def post(self, request, pk, *args, **kwargs):
        """Dean rejects the budget & sends real-time update"""
        try:
            budget = EventBudget.objects.get(pk=pk)
            budget.dean_finance_comment = request.data.get("comment", "")
            budget.save()
            send_application_update("budget_rejected_by_dean", budget)
            return Response({"message": "Budget rejected by Dean of Finance", "comment": budget.dean_finance_comment}, status=status.HTTP_200_OK)
        except EventBudget.DoesNotExist:
            return Response({"error": "Budget not found"}, status=status.HTTP_404_NOT_FOUND)
