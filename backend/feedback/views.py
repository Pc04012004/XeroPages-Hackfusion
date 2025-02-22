from django.shortcuts import render
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import AdministrationFeedback
from .serializers import *
from .models import *
from login.models import *


class FacultyLecturesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Fetch the logged-in faculty's profile
        faculty_profile = FacultyProfile.objects.get(user=request.user)
        lectures = Lecture.objects.filter(instructor=faculty_profile)
        serializer = LectureSerializer(lectures, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class LectureFeedbackView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, lecture_id):
        # Fetch the lecture
        lecture = Lecture.objects.get(id=lecture_id)
        # Ensure the lecture belongs to the logged-in faculty
        faculty_profile = FacultyProfile.objects.get(user=request.user)
        if lecture.instructor != faculty_profile:
            return Response({"error": "You do not have permission to view this lecture."}, status=status.HTTP_403_FORBIDDEN)
        # Fetch all feedback for this lecture
        feedbacks = lecture.feedbacks.all()
        serializer = FeedbackSerializer(feedbacks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class SubmitFeedbackView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, lecture_id):
        lecture = Lecture.objects.get(id=lecture_id)
        serializer = FeedbackSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(lecture=lecture)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FetchLecturesByDateTimeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        date = request.query_params.get('date')
        time = request.query_params.get('time')

        lectures = Lecture.objects.filter(date=date)
        if time:
            lectures = lectures.filter(start_time__lte=time, end_time__gte=time)

        serializer = LectureSerializer(lectures, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class FetchPreviousLecturesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        current_time = timezone.now()
        lectures = Lecture.objects.filter(end_time__lt=current_time)
        serializer = LectureSerializer(lectures, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class SubmitAdministrationFeedbackView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AdministrationFeedbackSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(submitted_by=request.user)  # Link feedback to the logged-in user
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class FetchAllAdministrationFeedbackView(APIView):
    def get(self, request):
        feedbacks = AdministrationFeedback.objects.all()
        serializer = AdministrationFeedbackSerializer(feedbacks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class AdminResponseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, feedback_id):
        feedback = AdministrationFeedback.objects.get(id=feedback_id)
        admin_response = request.data.get('admin_response')
        if not admin_response:
            return Response({"error": "Admin response is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        feedback.admin_response = admin_response
        feedback.save()
        return Response(AdministrationFeedbackSerializer(feedback).data, status=status.HTTP_200_OK)