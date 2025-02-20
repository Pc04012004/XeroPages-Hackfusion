from django.urls import path
from .views import LoginView
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("logout/", views.LogoutView.as_view(), name="logout"),
    path('studentProfile/',views.CreateStudentProfileView.as_view()),
    path('StudentProfileDetail/',views.StudentProfileDetailView.as_view()),
    path('faculty/profile/', views.FacultyProfileView.as_view(), name='faculty-profile'),
    path('faculty/profile/update/', views.UpdateFacultyProfile.as_view(), name='faculty-profile-update'), 
    
]
