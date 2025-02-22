from django.core.mail import send_mail
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import*
from .serializers import *
from login.models import *



# 🔹 Student Representative Views
class RepresentativeStudentView(generics.ListCreateAPIView):
    """
    API for fetching & creating student representatives.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = RepresentativeStudent.objects.all()
    serializer_class = RepresentativeStudentSerializer

class TrackApplicationsView(generics.ListAPIView):
    """
    API to track event budgets and sponsorships.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        budgets = EventBudget.objects.all()
        sponsorships = EventSponsorship.objects.all()

        budget_data = EventBudgetSerializer(budgets, many=True).data
        sponsorship_data = EventSponsorshipSerializer(sponsorships, many=True).data

        return Response({"budgets": budget_data, "sponsorships": sponsorship_data}, status=status.HTTP_200_OK)

class EventView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, *args, **kwargs):
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        name = request.data.get("name")
        event_type = request.data.get("event_type")
        date = request.data.get("date")
        venue = request.data.get("venue")
        description = request.data.get("description", "")
        r_name= request.data.get("r_name")
        f_name = request.data.get("f_name")
        try:
          representative = Custom_User.objects.get(full_name=r_name)
          faculty_coordinator = Custom_User.objects.get(full_name=r_name)
        except Custom_User.DoesNotExist:
          return  Response({"error": "Name Not Correct Or Faculty doesn't exist "}, status=status.HTTP_400_BAD_REQUEST)

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

        send_application_update("event_created", event)
        return Response(EventSerializer(event).data, status=status.HTTP_201_CREATED)
    

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def send_application_update(event_type, instance):
    """Send real-time WebSocket updates"""
    channel_layer = get_channel_layer()
    data = {
        "event": event_type,
        "event_id": instance.id,
        "event_name": instance.event.name,
        "priority_level": instance.priority_level,
    }
    async_to_sync(channel_layer.group_send)(
        "application_updates", {"type": "send_application_update", "data": data}
    )
class EventBudgetView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = EventBudget.objects.all()
    serializer_class = EventBudgetSerializer

    def post(self, request, *args, **kwargs):
        event_id = request.data.get("event")
        budget_amount = request.data.get("budget_amount")
        budget = request.data.get("budget")

        try:
            event = Event.objects.get(pk=event_id)
            if hasattr(event, "eventbudget"):
                return Response({"error": "Budget already exists for this event"}, status=status.HTTP_400_BAD_REQUEST)

            budget = EventBudget.objects.create(event=event, budget_amount=budget_amount, budget=budget)
            budget.save()

            send_application_update("budget_added", budget)
            return Response({"message": "Budget added successfully", "priority_level": budget.priority_level}, status=status.HTTP_201_CREATED)
        except Event.DoesNotExist:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
        
    
class UpdateEventBudgetView(generics.UpdateAPIView):
    """
    API to update an event's budget before final approval.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = EventBudgetSerializer
    queryset = EventBudget.objects.all()

    def patch(self, request, pk, *args, **kwargs):
        try:
            budget = EventBudget.objects.get(pk=pk)
            if not budget.can_edit:
                return Response({"error": "Budget cannot be edited after approval"}, status=status.HTTP_400_BAD_REQUEST)

            budget.budget_amount = request.data.get("budget_amount", budget.budget_amount)
            if "budget" in request.data:
                budget.budget = request.data["budget"]

            budget.save()
            return Response({"message": "Budget updated successfully"}, status=status.HTTP_200_OK)
        except EventBudget.DoesNotExist:
            return Response({"error": "Budget not found"}, status=status.HTTP_404_NOT_FOUND)


class ApproveBudgetByDeanView(generics.UpdateAPIView):
    """
    Dean approves the budget, locking modifications.
    """
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        budget = EventBudget.objects.get(pk=pk)
        budget.approved_by_dean_finance = True
        budget.can_edit = False  # Lock modifications
        budget.save()
        # Update event status
        event = budget.event
        event.status = "UNDER_REVIEW"
        event.save()
        
        subject = "Bed Rest Prescribed"
        message = f"Your budget has be approved by Dean"
        recipient_list = [event.faculty_coordinator.email, event.representative.desig_email]

        send_mail(subject, message, "doctor@college.edu", recipient_list, fail_silently=False)
        
        send_application_update("budget_approved_by_dean", budget)
        return Response({"message": "Budget approved by Dean of Finance"}, status=status.HTTP_200_OK)

class ApproveBudgetByDirectorView(generics.UpdateAPIView):
    """
    Director approves the budget, finalizing it.
    """
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        budget = EventBudget.objects.get(pk=pk)
        budget.approved_by_director = True
        budget.save()
        event=budget.event
        subject = "Bed Rest Prescribed"
        message = f"Your budget has be approved by Dean"
        recipient_list = [event.faculty_coordinator.email, event.representative.desig_email]

        send_mail(subject, message, "doctor@college.edu", recipient_list, fail_silently=False)
        send_application_update("budget_approved_by_director", budget)
        return Response({"message": "Budget approved by Director"}, status=status.HTTP_200_OK)

class RejectBudgetByDeanView(generics.UpdateAPIView):
    """
    Dean rejects the budget and provides comments.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            budget = EventBudget.objects.get(pk=pk)
            budget.dean_finance_comment = request.data.get("comment", "")
            budget.save()
            event=budget.event
            subject = "Bed Rest Prescribed"
            message = f"Your budget has be approved by Dean"
            recipient_list = [event.faculty_coordinator.email, event.representative.desig_email]

            send_mail(subject, message, "doctor@college.edu", recipient_list, fail_silently=False)
            send_application_update("budget_rejected_by_dean", budget)
            return Response(
                {"message": "Budget rejected by Dean of Finance", "comment": budget.dean_finance_comment},
                status=status.HTTP_200_OK
            )
        except EventBudget.DoesNotExist:
            return Response({"error": "Budget not found"}, status=status.HTTP_404_NOT_FOUND)
        
class EventSponsorshipView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = EventSponsorshipSerializer

    def get_queryset(self):
        event_id = self.kwargs["pk"]
        return EventSponsorship.objects.filter(event__id=event_id)
    
class AddSponsorshipView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = EventSponsorshipSerializer

    def post(self, request, *args, **kwargs):
        event_id = request.data.get("event")
        sponsor_name = request.data.get("sponsor_name")
        amount = request.data.get("amount")
        sponsorship_document = request.FILES.get("sponsorship_document")

        try:
            event = Event.objects.get(pk=event_id)
            sponsorship = EventSponsorship.objects.create(event=event, sponsor_name=sponsor_name, amount=amount,
                                                          sponsorship_document=sponsorship_document)
            sponsorship.save()

            send_application_update("sponsorship_added", sponsorship)
            return Response({"message": "Sponsorship added successfully", "priority_level": sponsorship.priority_level}, status=status.HTTP_201_CREATED)
        except Event.DoesNotExist:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)


def send_application_update(event_type, instance):
    """Send real-time WebSocket updates"""
    channel_layer = get_channel_layer()
    data = {
        "event": event_type,
        "event_id": instance.id,
        "event_name": instance.name,
        "status": instance.status,
        "public_visible": instance.public_visible,
    }
    async_to_sync(channel_layer.group_send)(
        "application_updates", {"type": "send_application_update", "data": data}
    )

class ApproveEventByDeanView(generics.UpdateAPIView):
    """
    Dean of Students approves the event after budget approval.
    """
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            event = Event.objects.get(pk=pk)
            
            if not event.eventbudget.approved_by_dean_finance:
                return Response({"error": "Budget must be approved first"}, status=status.HTTP_400_BAD_REQUEST)

            event.approved_by_dean = True
            event.status = "APPROVED_BY_DEAN"
            event.save()
            subject = "Bed Rest Prescribed"
            message = f"Your event has be approved by Dean"
            recipient_list = [event.faculty_coordinator.email, event.representative.desig_email]

            send_mail(subject, message, "doctor@college.edu", recipient_list, fail_silently=False)   
            send_application_update("event_approved_by_dean", event)
            return Response({"message": "Event approved by Dean of Students"}, status=status.HTTP_200_OK)
        except Event.DoesNotExist:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

class ApproveEventByDirectorView(generics.UpdateAPIView):
    """
    Director gives the final approval, making the event public.
    """
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            event = Event.objects.get(pk=pk)

            if not event.approved_by_dean:
                return Response({"error": "Dean approval required before final approval"}, status=status.HTTP_400_BAD_REQUEST)

            event.approved_by_director = True
            event.status = "FINAL_APPROVAL"
            event.public_visible = True  # Make event public
            event.save()
            subject = "Bed Rest Prescribed"
            message = f"Your budget has be approved by Director"
            recipient_list = [event.faculty_coordinator.email, event.representative.desig_email]

            send_mail(subject, message, "doctor@college.edu", recipient_list, fail_silently=False)
            send_application_update("event_final_approved", event)
            return Response({"message": "Event approved by Director, now public"}, status=status.HTTP_200_OK)
        except Event.DoesNotExist:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)




class AddEventExpenseView(generics.CreateAPIView):
    """
    API to add small expenses during the event.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = EventExpenseSerializer

    def post(self, request, *args, **kwargs):
        event_id = request.data.get("event")
        description = request.data.get("description")
        amount = request.data.get("amount")

        try:
            event = Event.objects.get(pk=event_id)
            expense = EventExpense.objects.create(event=event, description=description, amount=amount)
            expense.save()

            return Response({"message": "Expense added successfully"}, status=status.HTTP_201_CREATED)
        except Event.DoesNotExist:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

class ListEventExpensesView(generics.ListAPIView):
    """
    API to list all expenses for a specific event.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = EventExpenseSerializer

    def get_queryset(self):
        event_id = self.kwargs["pk"]
        return EventExpense.objects.filter(event__id=event_id)

class GenerateExpenseReportView(generics.RetrieveAPIView):
    """
    API to generate a final expense report for an event.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        event_id = self.kwargs["pk"]
        try:
            event = Event.objects.get(pk=event_id)
            budget = EventBudget.objects.get(event=event)
            expenses = EventExpense.objects.filter(event=event)

            total_budget = budget.budget_amount
            total_expenses = sum(expense.amount for expense in expenses)
            remaining_budget = total_budget - total_expenses

            report = {
                "event_name": event.name,
                "total_budget": total_budget,
                "total_expenses": total_expenses,
                "remaining_budget": remaining_budget,
                "expenses": EventExpenseSerializer(expenses, many=True).data
            }

            return Response(report, status=status.HTTP_200_OK)
        except Event.DoesNotExist:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
        except EventBudget.DoesNotExist:
            return Response({"error": "Budget not found for this event"}, status=status.HTTP_404_NOT_FOUND)