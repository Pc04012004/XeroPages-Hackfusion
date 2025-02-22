from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import csv
from rest_framework import generics
# import matplotlib.pyplot as plt
from login.serializers import CommentSerializer
# from .serializers import *
from .models import *
# Create your views here.

from django.db import transaction
from rest_framework.decorators import api_view

from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.db import transaction
# Create your views here.
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import generics, status
from django.contrib.auth import authenticate
from .models import Custom_User,StudentProfile,FacultyProfile
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import get_object_or_404 

class LoginView(generics.CreateAPIView):
    def post(self, request, *args, **kwargs):
        user_email = request.data.get("email")
        user_password = request.data.get("password")

        try:
            user = Custom_User.objects.get(email=user_email)
        except Custom_User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        if user.check_password(user_password):
            refresh = RefreshToken.for_user(user)
            return Response({
                "user": {
                    "user_id": user.pk,
                    "username": user.username,
                    "email": user.email,
                    "role": user.role
                },
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh)
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Wrong password"}, status=401)

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()  # ✅ Add token to blacklist
            return Response({"message": "Logged out successfully"})
        except Exception:
            return Response({"error": "Invalid token"}, status=400)

class ChangePasswordView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]  # Ensure user is logged in

    def post(self, request, *args, **kwargs):
        user = request.user  # Authenticated user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        # Step 1: Validate old password
        if not old_password or not user.check_password(old_password):
            return Response({"error": "Incorrect old password"}, status=status.HTTP_400_BAD_REQUEST)

        # Step 2: Validate new password strength
        try:
            validate_password(new_password, user)
        except ValidationError as e:
            return Response({"error": e.messages}, status=status.HTTP_400_BAD_REQUEST)

        # Step 3: Update the password securely
        user.set_password(new_password)
        user.save()

        return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)
    

from rest_framework.permissions import IsAuthenticated
from .permissions import IsStudent, IsFaculty, IsHOD, IsDean_f,IsDean_s, IsDirector
from .serializers import StudentProfileSerializer, FacultyProfileSerializer


# class StudentProfile(generics.ListCreateAPIView):
#     permission_classes = [IsAuthenticated, IsStudent]
#     authentication_classes = [JWTAuthentication] 
    
#     def get(self, request, *args, **kwargs):   
#         data = Custom_User.objects.get(email=self.request.user)
#         queryset = StudentProfile.objects.get(user=data)
#         serializer = StudentProfileSerializer(queryset, many=True)
#         return JsonResponse({"StudentProfile":serializer.data}, safe=False)

class CreateStudentProfileView(generics.CreateAPIView):
    """API to create a new student profile."""
    permission_classes = [IsAuthenticated, IsStudent]
    authentication_classes = [JWTAuthentication]
    serializer_class = StudentProfileSerializer

    def post(self, request, *args, **kwargs):
        """Handles profile creation only if it doesn't exist already."""
        user = self.request.user

        # Check if the profile already exists
        if StudentProfile.objects.filter(user=user).exists():
            return Response(
                {"error": "Profile already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate and create profile
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  

# class UpdateStudentProfile(generics.RetrieveUpdateDestroyAPIView):
#     """Allows only students to update their own profile. Faculty, HOD, Deans, and Director are restricted."""
#     authentication_classes = [JWTAuthentication]
#     permission_classes = [IsAuthenticated, IsStudent]  # Only students are allowed
#     serializer_class = StudentProfileSerializer

#     def get_object(self):
#         """Ensure students can only update their own profile."""
#         return get_object_or_404(StudentProfile, user=self.request.user)  
class StudentProfileDetailView(generics.RetrieveUpdateDestroyAPIView):
    """API to retrieve, update, and delete the student's profile."""
    permission_classes = [IsAuthenticated, IsStudent]
    authentication_classes = [JWTAuthentication]
    serializer_class = StudentProfileSerializer

    def get_object(self):
        """Retrieve the profile of the currently authenticated student."""
        user = self.request.user
        return get_object_or_404(StudentProfile, user=user)

    def delete(self, request, *args, **kwargs):
        """Delete the profile only if it exists."""
        profile = self.get_object()
        profile.delete()
        return Response({"message": "Profile deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

class FacultyProfileView(generics.ListCreateAPIView):
    """
    Faculty can view their profile and create a new one.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    serializer_class = FacultyProfileSerializer

    def get_queryset(self):
        """Return the profile of the currently authenticated faculty user."""
        return FacultyProfile.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        """Create a faculty profile only if it does not exist."""
        if FacultyProfile.objects.filter(user=request.user).exists():
            return Response({"error": "Profile already exists"}, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)


class UpdateFacultyProfile(generics.RetrieveUpdateAPIView):
    """
    Allows only faculty members to update their own profile.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsFaculty]
    serializer_class = FacultyProfileSerializer

    def get_object(self):
        """Ensure faculty can only update their own profile."""
        return get_object_or_404(FacultyProfile, user=self.request.user)
