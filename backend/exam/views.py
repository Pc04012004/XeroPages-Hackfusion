from django.shortcuts import render

# Create your views here.
from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Announcement
from .serializers import AnnouncementSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Announcement
from .serializers import AnnouncementSerializer

class AnnouncementListView(APIView):
    """
    API View to list all announcements.
    - General announcements are visible to all authenticated users.
    - Result announcements are visible only to students from the same department.
    """

    def get(self, request, *args, **kwargs):
        """Fetch all announcements."""
        announcements = Announcement.objects.all()
        serializer = AnnouncementSerializer(announcements, many=True)

        response_data = []
        for announcement in serializer.data:
            if announcement["announcement_type"] == "result":
                # Restrict result announcements to same department
                if request.user.is_authenticated and request.user.department == announcement["department"]:
                    response_data.append(announcement)  # Full access
                else:
                    announcement["pdf"] = None  # Hide PDF
                    announcement["error"] = "Access denied: You are not authorized to view this result PDF."
                    response_data.append(announcement)
            else:
                # General announcements are visible to all authenticated users
                if request.user.is_authenticated:
                    response_data.append(announcement)
                else:
                    announcement["error"] = "Access denied: Please log in to view this announcement."
                    response_data.append(announcement)

        return Response(response_data, status=status.HTTP_200_OK)

from rest_framework import generics, permissions
from .models import Announcement
from .serializers import AnnouncementSerializer

class AnnouncementCreateView(generics.CreateAPIView):
    """
    API View to create an announcement.
    - Only Exam Controller can create announcements.
    """

    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        """Ensure only Exam Controller can create announcements."""
        if self.request.user.role == "exam_controller":
            serializer.save()
        else:
            raise permissions.PermissionDenied("Access denied: Only the Exam Controller can create announcements.")
        
class AnnouncementUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """
    API View to:
    - Update an announcement (PUT/PATCH)
    - Delete an announcement (DELETE)
    - Restricted to Exam Controller only.
    """

    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def has_permission(self, request, view):
        if request.user.role == "exam_controller":
            return True
        return Response({"error": "Access denied: You are not authorized to modify announcements."},
                        status=status.HTTP_403_FORBIDDEN)
    
class AnnouncementUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """
    API View to:
    - Update an announcement (PUT/PATCH)
    - Delete an announcement (DELETE)
    - Restricted to Exam Controller only.
    """

    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def has_permission(self, request, view):
        if request.user.role == "exam_controller":
            return True
        return Response({"error": "Access denied: You are not authorized to modify announcements."},
                        status=status.HTTP_403_FORBIDDEN)
    
class AnnouncementPDFView(APIView):
    """
    API View to handle secure PDF access for result announcements.
    """

    def get(self, request, announcement_id):
        try:
            announcement = Announcement.objects.get(id=announcement_id)

            # Check permissions for result PDFs
            if announcement.announcement_type == "result":
                if not request.user.is_authenticated:
                    return Response({"error": "Access denied: Please log in to access this document."},
                                    status=status.HTTP_401_UNAUTHORIZED)

                if request.user.department != announcement.department:
                    return Response({"error": "Access denied: You are not authorized to view this result PDF."},
                                    status=status.HTTP_403_FORBIDDEN)

            return Response({"pdf_url": announcement.pdf.url}, status=status.HTTP_200_OK)

        except Announcement.DoesNotExist:
            return Response({"error": "Error: Announcement not found."}, status=status.HTTP_404_NOT_FOUND)