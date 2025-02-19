from dataclasses import field
from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from .models import *

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Custom_User
        fields = '__all__'
