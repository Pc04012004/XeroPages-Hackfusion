from django.urls import path
from .views import *

urlpatterns = [
    path('api/faculty/lectures/', FacultyLecturesView.as_view(), name='faculty-lectures'),
    path('api/lectures/<int:lecture_id>/feedback/', LectureFeedbackView.as_view(), name='lecture-feedback'),
    path('api/lectures/<int:lecture_id>/submit-feedback/', SubmitFeedbackView.as_view(), name='submit-feedback'),
    path('api/lectures/by-date-time/', FetchLecturesByDateTimeView.as_view(), name='lectures-by-date-time'),
    path('api/lectures/previous/', FetchPreviousLecturesView.as_view(), name='previous-lectures'),

    path('api/administration-feedback/submit/', SubmitAdministrationFeedbackView.as_view(), name='submit-administration-feedback'),
    path('api/administration-feedback/all/', FetchAllAdministrationFeedbackView.as_view(), name='all-administration-feedback'),
    path('api/administration-feedback/<int:feedback_id>/admin-response/', AdminResponseView.as_view(), name='admin-response'),
]
