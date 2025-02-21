
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import CheatingRecord, Complaint, ComplaintModeration
from .serializers import CheatingRecordSerializer, ComplaintSerializer, ComplaintModerationSerializer

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
    

