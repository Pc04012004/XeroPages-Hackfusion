
import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import CheatingRecord, Complaint
from .serializers import CheatingRecordSerializer, ComplaintSerializer

# ✅ Fetch All Cheating Records (Visible to All)
class CheatingRecordListView(APIView):
    def get(self, request):
        records = CheatingRecord.objects.all()
        return Response(CheatingRecordSerializer(records, many=True).data)


# ✅ Add a New Cheating Record (Only Faculty/Admin)
class AddCheatingRecordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role not in ["faculty", "hod", "admin"]:
            return Response({"error": "Unauthorized"}, status=403)

        serializer = CheatingRecordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
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
        anonymous = request.data.get("anonymous", False)
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
             student=request.user if not anonymous else None,
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

class ApprovedComplaintsView(APIView):
    def get(self, request):
        complaints = Complaint.objects.filter(is_approved=True, is_blocked=False)
        response_data = []
        for complaint in complaints:
            complaint_data = ComplaintSerializer(complaint).data
            complaint_data["media"] = [media.file.url for media in complaint.media.all() if media.is_safe]
            response_data.append(complaint_data)


class BoardApproveView(generics.UpdateAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, *args, **kwargs):
        complaint = self.get_object()
        complaint.board_approved_identity = True
        complaint.save()
        return Response({"message": "Identity revealed by board approval!"})