"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("auth/",include('login.urls')),
    path("election/",include('elections.urls')),
    path("leave/",include('Auto_Leave.urls')),
    path("campusfacility/",include('CampusFacility.urls')),
    path("complaints/",include('Complaints.urls')),
    path("event/",include('EventApproval.urls')),
    path("exam/",include('exam.urls')),
    path("feedback/",include('feedback.urls'))
]
