
import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import CheatingRecord, Complaint
from .serializers import *

# ✅ Fetch All Cheating Records (Visible to All)
class CheatingRecordListView(APIView):
    def get(self, request):
        records = CheatingRecord.objects.all()
        return Response(CheatingRecordSerializer(records, many=True).data)


# ✅ Add a New Cheating Record (Only Faculty/Admin)
class AddCheatingRecordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Check if the user has the required role (faculty, HOD, or admin)
        # if request.user.role not in ["faculty", "hod", "admin"]:
        #     return Response({"error": "Unauthorized. Only faculty, HOD, or admin can add cheating records."}, status=status.HTTP_403_FORBIDDEN)
        # Pass the request data to the serializer
        serializer = CheatingRecordSerializer(data=request.data)

        if serializer.is_valid():
            # Save the cheating record
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
import logging

logger = logging.getLogger(__name__)

class AddActionToCheatingRecordView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, cheating_record_id):
        try:
            cheating_record = CheatingRecord.objects.get(id=cheating_record_id)
        except CheatingRecord.DoesNotExist:
            logger.error(f"Cheating record with ID {cheating_record_id} not found.")
            return Response({"error": "Cheating record not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = CheatingRecordActionSerializer(cheating_record, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            logger.info(f"Action updated for cheating record ID {cheating_record_id} by user {request.user.username}.")
            return Response(serializer.data, status=status.HTTP_200_OK)
        logger.error(f"Failed to update action for cheating record ID {cheating_record_id}: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class FetchPendingActionCheatingRecordsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Fetch all cheating records where action is "Not Done Yet".
        """
        # Check if the user has the required role (faculty, HOD, or admin)
        if request.user.role not in ["faculty", "hod", "admin"]:
            return Response({"error": "Unauthorized. Only faculty, HOD, or admin can view pending cheating records."}, status=status.HTTP_403_FORBIDDEN)

        # Filter cheating records where action is "Not Done Yet"
        pending_records = CheatingRecord.objects.filter(action="Not Done Yet")

        # Serialize the data
        serializer = CheatingRecordSerializer(pending_records, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)  
from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import Complaint
from .serializers import ComplaintSerializer
from .ai_moderation import moderate_text, moderate_image, moderate_video
import tempfile
UPLOAD_DIR = "D:/hackthon/XeroPages-Hackfusion/temp_uploads/"
os.makedirs(UPLOAD_DIR, exist_ok=True)  # ✅ Ensure directory exists

class ComplaintCreateView(generics.CreateAPIView):
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        text = request.data.get("text", "")
        anonymous = request.data.get("anonymous")
        if anonymous == "true":
            anonymous = True
        else:
             anonymous=False
           
        image = request.FILES.get("image")
        video = request.FILES.get("video")

    # ✅ AI Moderation
        if not moderate_text(text):
           return Response({"error": "Your complaint contains inappropriate text!"}, status=400)

        if image:
            temp_path = os.path.join(UPLOAD_DIR, "temp_image.jpg")
            with open(temp_path, "wb") as temp_file:
               for chunk in image.chunks():
                temp_file.write(chunk)

            if not moderate_image(temp_path):
              return Response({"error": "Inappropriate image detected!"}, status=400)

            
        if video:
            temp_path = os.path.join(UPLOAD_DIR, "temp_video.mp4")  # 🔹 Adjust the file extension if needed
            with open(temp_path, "wb") as temp_file:
               for chunk in video.chunks():
                temp_file.write(chunk)

            if not moderate_video(temp_path):  # 🚀 Call video moderation function
               os.remove(temp_path)  # 🗑 Cleanup
               return Response({"error": "Inappropriate video detected!"}, status=400)    
        # os.remove(temp_path)
    # ✅ Save the Complaint
        complaint = Complaint.objects.create(
             student=request.user ,
             anonymous=anonymous,
             text=text,
             image=image,
             video=video,
          )
        return Response(ComplaintSerializer(complaint).data, status=201)

    # def post(self, request, *args, **kwargs):
    #     text = request.data.get("text", "")
    #     anonymous = request.data.get("anonymous", False)
    #     image = request.FILES.get("image")
    #     video = request.FILES.get("video")
    #     print("0")
    #     # ✅ AI Moderation
    #     if not moderate_text(text):
    #         return Response({"error": "Your complaint contains inappropriate text!"}, status=400)
    #     print("1")
    #     if image:
    #         with open(image.temporary_file_path(), "wb+") as temp_file:
    #             temp_file.write(image.read())
    #         if not moderate_image(temp_file.name):
    #             return Response({"error": "Inappropriate image detected!"}, status=400)

    #     if video:
    #         with open(video.temporary_file_path(), "wb+") as temp_file:
    #             temp_file.write(video.read())
    #         if not moderate_video(temp_file.name):
    #             return Response({"error": "Inappropriate video detected!"}, status=400)

    #     complaint = Complaint.objects.create(
    #         student=request.user if not anonymous else None,
    #         anonymous=anonymous,
    #         text=text,
    #         image=image,
    #         video=video,
    #     )
    #     return Response(ComplaintSerializer(complaint).data, status=201)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Complaint, ComplaintVote
from .serializers import *

class VoteOnComplaintView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, complaint_id):
        """
        Allow board members to vote on revealing the identity of a complaint.
        """
        if request.user.role != "board_member":
            return Response({"error": "Unauthorized. Only board members can vote."}, status=status.HTTP_403_FORBIDDEN)

        try:
            complaint = Complaint.objects.get(id=complaint_id)
        except Complaint.DoesNotExist:
            return Response({"error": "Complaint not found."}, status=status.HTTP_404_NOT_FOUND)

        if ComplaintVote.objects.filter(complaint=complaint, board_member=request.user).exists():
            return Response({"error": "You have already voted on this complaint."}, status=status.HTTP_400_BAD_REQUEST)

        vote = request.data.get("vote", True)  # Default to True (Reveal Identity)
        complaint_vote = ComplaintVote.objects.create(
            complaint=complaint,
            board_member=request.user,
            vote=vote,
        )

        # Check if majority has voted to reveal identity
        if complaint.should_reveal_identity():
            complaint.board_approved_identity = True
            complaint.save()

        return Response(ComplaintVoteSerializer(complaint_vote).data, status=status.HTTP_201_CREATED)

    

class ApprovedComplaintsView(APIView):
    def get(self, request):
        complaints = Complaint.objects.filter(approved=True)
        response_data = []

        for complaint in complaints:
            complaint_data = ComplaintSerializer(complaint).data
            
            # Add media files
            complaint_data["media"] = []
            if complaint.image:
                complaint_data["media"].append(complaint.image.url)
            if complaint.video:
                complaint_data["media"].append(complaint.video.url)

            response_data.append(complaint_data)

        return Response(response_data)


class BoardApproveView(generics.UpdateAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, *args, **kwargs):
        complaint = self.get_object()
        complaint.board_approved_identity = True
        complaint.save()
        return Response({"message": "Identity revealed by board approval!"})