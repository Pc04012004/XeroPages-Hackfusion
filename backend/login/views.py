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
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status, generics
from django.http import JsonResponse
from .models import Custom_User  # Import your custom user model

class login(generics.CreateAPIView): 
    def post(self, request, *args, **kwargs):
        user_email = request.data.get("email")  # Get email
        user_password = request.data.get("pass")  # Get password
        
        try:
            user = Custom_User.objects.get(email=user_email)
        except Custom_User.DoesNotExist:
            return JsonResponse({"comment": "User not found"}, status=404)

# Check password properly
        if user.check_password(user_password):
           return Response({
        "user": {
            "user_id": user.pk,
            "User_name": user.username,
            "email": user.email,
            "role": user.role
        }
    })
        else:
            return JsonResponse({"comment": "Wrong Password"}, status=401)