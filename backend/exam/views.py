from django.shortcuts import render

# Create your views here.
from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Announcement
from .serializers import AnnouncementSerializer

class AnnouncementListView(APIView):
    """
    API View to list all announcements.
    - All announcements (common + result) are visible.
    - Access to result PDFs is restricted.
    """

    def get(self, request, *args, **kwargs):
        """Fetch all announcements."""
        announcements = Announcement.objects.all()
        serializer = AnnouncementSerializer(announcements, many=True)

        response_data = []
        for announcement in serializer.data:
            if announcement["announcement_type"] == "result":
                # Restrict PDF access
                if request.user.is_authenticated:
                    if request.user.role == "director" or request.user.department == announcement["department"]:
                        response_data.append(announcement)  # Full access
                    else:
                        announcement["pdf"] = None  # Hide PDF
                        announcement["error"] = "Access denied: You are not authorized to view this result PDF."
                        response_data.append(announcement)
                else:
                    announcement["pdf"] = None  # Hide PDF for unauthenticated users
                    announcement["error"] = "Access denied: Please log in to view this result PDF."
                    response_data.append(announcement)
            else:
                response_data.append(announcement)  # Common announcements are fully visible

        return Response(response_data, status=status.HTTP_200_OK)

class AnnouncementCreateUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """
    API View to:
    - Update an announcement (PUT/PATCH)
    - Delete an announcement (DELETE)
    - Restricted to Examination department only.
    """

    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def has_permission(self, request, view):
        if request.user.department == "Administration" and request.user.role == "examination":
            return True
        return Response({"error": "Access denied: You are not authorized to modify announcements."},
                        status=status.HTTP_403_FORBIDDEN)

class AnnouncementCreateView(generics.CreateAPIView):
    """
    API View to create an announcement.
    - Only examination department can create.
    """

    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        """Ensure only Examination Department can create announcements."""
        if self.request.user.department == "Administration" and self.request.user.role == "examination":
            serializer.save()
        else:
            raise permissions.PermissionDenied("Access denied: Only the Examination Department can create announcements.")

class AnnouncementPDFView(APIView):
    """
    API View to handle secure PDF access.
    """

    def get(self, request, announcement_id):
        try:
            announcement = Announcement.objects.get(id=announcement_id)

            # Check permissions for result PDFs
            if announcement.announcement_type == "result":
                if not request.user.is_authenticated:
                    return Response({"error": "Access denied: Please log in to access this document."},
                                    status=status.HTTP_401_UNAUTHORIZED)

                if request.user.role != "director" and request.user.department != announcement.department:
                    return Response({"error": "Access denied: You are not authorized to view this result PDF."},
                                    status=status.HTTP_403_FORBIDDEN)

            return Response({"pdf_url": announcement.pdf.url}, status=status.HTTP_200_OK)

        except Announcement.DoesNotExist:
            return Response({"error": "Error: Announcement not found."}, status=status.HTTP_404_NOT_FOUND)