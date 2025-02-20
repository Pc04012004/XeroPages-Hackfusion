from rest_framework import generics, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import ElectionPost
from .serializers import ElectionPostSerializer
from login.permissions import  IsDirector,IsDean_s
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

class ElectionPostListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated,IsDean_s]
    authentication_classes = [JWTAuthentication]

    
    def get(self, request, *args, **kwargs):
        """
        Fetch all election posts.
        """
        election_posts = ElectionPost.objects.all()
        serializer = ElectionPostSerializer(election_posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """
        Allow only the Dean to create an election post.
        """
        position = request.data.get("position")
        description = request.data.get("description")
        eligibility = request.data.get("eligibility")
        candidate_registration_deadline = request.data.get("candidate_registration_deadline")
        voting_day = request.data.get("voting_day")

        # # Ensure only the Dean can create an election post
        # if not request.user.role == 'dean':
        #     return Response({"error": "Only the Dean can create election posts."}, status=status.HTTP_403_FORBIDDEN)

        if ElectionPost.objects.filter(position=position).exists():
            election_post = ElectionPost.objects.get(position=position)
            return Response(ElectionPostSerializer(election_post).data, status=status.HTTP_200_OK)
        else:
            new_election_post = ElectionPost.objects.create(
                user=request.user,  # Assigning the logged-in user
                position=position,
                description=description,
                Eligibility=eligibility,
                candidate_registration_deadline=candidate_registration_deadline,
                voting_day=voting_day
            )
            new_election_post.save()

            return Response(ElectionPostSerializer(new_election_post).data, status=status.HTTP_201_CREATED)


class ApproveElectionPostView(generics.GenericAPIView):
    """
    Only the Director can approve election posts.
    """
    permission_classes = [IsAuthenticated,IsDirector]
    authentication_classes = [JWTAuthentication]

    def post(self, request, pk, *args, **kwargs):
        election_post = get_object_or_404(ElectionPost, pk=pk)

        if election_post.dean_approved and not election_post.director_approved:
            election_post.approve_by_director()
            return Response({"message": "Election post approved by Director"}, status=status.HTTP_200_OK)
        return Response({"error": "Election post must be approved by Dean first."}, status=status.HTTP_400_BAD_REQUEST)
