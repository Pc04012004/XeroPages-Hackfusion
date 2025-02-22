from rest_framework import generics, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import ElectionPost
from .serializers import *
from login.permissions import  IsDirector,IsDean_s
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

class ElectionPostListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
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



class RegisterCandidateView(generics.ListCreateAPIView):
    """
    API for candidates to register.
    - Only eligible candidates can register.
    - Returns a list of all registered candidates.
    """
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer
    permission_classes = [IsAuthenticated]  # User must be logged in

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            candidate = serializer.save()
            return Response({"message": "Candidate registered successfully!", "candidate": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeanApprovalView(generics.ListAPIView, generics.UpdateAPIView):
    """
    API for the Dean to view and approve candidates.
    - Dean can see all registered candidates.
    - Dean can approve candidates.
    """
    queryset = Candidate.objects.filter(dean_approved=False)
    serializer_class = CandidateSerializer
    permission_classes = [IsDean_s]

    def update(self, request, *args, **kwargs):
        candidate = get_object_or_404(Candidate, pk=kwargs["pk"])
        
        if candidate.dean_approved:
            return Response({"error": "Candidate already approved by the Dean."}, status=status.HTTP_400_BAD_REQUEST)

        candidate.approve_by_dean()
        return Response({"message": "Candidate approved by the Dean!"}, status=status.HTTP_200_OK)


class DirectorApprovalView(generics.ListAPIView, generics.UpdateAPIView):
    """
    API for the Director to view and approve candidates.
    - Director can see all registered candidates.
    - Director can approve candidates (only if approved by Dean first).
    """
    queryset = Candidate.objects.filter(dean_approved=True)
    serializer_class = CandidateSerializer
    permission_classes = [IsDirector]

    def update(self, request, *args, **kwargs):
        candidate = get_object_or_404(Candidate, pk=kwargs["pk"])
        
        if not candidate.dean_approved:
            return Response({"error": "Dean approval is required first."}, status=status.HTTP_400_BAD_REQUEST)
        if candidate.director_approved:
            return Response({"error": "Candidate already approved by the Director."}, status=status.HTTP_400_BAD_REQUEST)

        candidate.approve_by_director()
        return Response({"message": "Candidate approved by the Director!"}, status=status.HTTP_200_OK)


class ApprovedCandidatesPublicView(generics.ListAPIView):
    """
    API to view all fully approved candidates.
    - Publicly accessible.
    """
    queryset = Candidate.objects.filter(dean_approved=True, director_approved=True)
    serializer_class = CandidateSerializer_d


from rest_framework import generics, status, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Voter, ElectionPost
from .serializers import VoterSerializer
from login.permissions import IsStudent

class VoterRegistrationView(generics.ListCreateAPIView):
    """
    API for voter registration:
    - Only students can register.
    - Prevents duplicate registrations for the same post.
    - Fetches all registered voters (GET request).
    """

    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, *args, **kwargs):
        """
        Fetch all registered voters.
        """
        voters = Voter.objects.all()
        serializer = VoterSerializer(voters, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """
        Register a student as a voter.
        """
        if request.user.role != 'student':
            return Response({"error": "Only students can register as voters."}, status=status.HTTP_403_FORBIDDEN)

        election_post_id = request.data.get("post")
        name = request.data.get("name")
        department = request.data.get("department")
        year = request.data.get("year")
        registration_number = request.data.get("registration_number")

        # Check if the user has already registered for this post
        existing_voter = Voter.objects.filter(user=request.user, post=election_post_id).first()
        if existing_voter:
            return Response(
                {"error": f"You have already registered as a voter for the post '{existing_voter.post.title}'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate ElectionPost
        election_post = get_object_or_404(ElectionPost, pk=election_post_id)

        # Optional: Ensure registration number is unique across all voters
        # if Voter.objects.filter(registration_number=registration_number).exists():
        #     return Response({"error": "This registration number is already in use."}, status=status.HTTP_400_BAD_REQUEST)

        # Create and save voter record
        voter = Voter.objects.create(
            user=request.user,
            post=election_post,
            name=name,
            department=department,
            year=year,
            registration_number=registration_number
        )
        voter.save()

        return Response(VoterSerializer(voter).data, status=status.HTTP_201_CREATED)

    
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import VoteCount, Candidate, ElectionPost, Voter, VoterVote
from .serializers import VoteCountSerializer
import redis
from django.conf import settings
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import VoteCount, Candidate, ElectionPost, Voter, VoterVote
from .serializers import VoteCountSerializer

from rest_framework import generics, status, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import VoteCount, Candidate, ElectionPost, Voter, VoterVote
from .serializers import VoteCountSerializer
from .redis_leaderboard import RedisLeaderboard  # Import the class

leaderboard = RedisLeaderboard()  # Create one instance to use across views

# class CastVoteView(generics.CreateAPIView):
#     permission_classes = [permissions.IsAuthenticated, IsStudent]
#     serializer_class = VoteCountSerializer

#     def post(self, request, *args, **kwargs):
#         candidate_id = request.data.get("candidate")
#         candidate = get_object_or_404(Candidate, id=candidate_id)
#         post = candidate.position_applied 

#         voter = Voter.objects.filter(user=request.user).first()
#         if not voter:
#             return Response({"error": "You are not registered as a voter."}, status=status.HTTP_403_FORBIDDEN)

#         if VoterVote.objects.filter(voter=voter, post=post).exists():
#             return Response({"error": "You have already voted for this post."}, status=status.HTTP_403_FORBIDDEN)

#         VoterVote.objects.create(voter=voter, post=post, candidate=candidate)

#         # Update VoteCount in the database
#         vote_count, created = VoteCount.objects.get_or_create(candidate=candidate, post=post)
#         vote_count.vote_count += 1
#         vote_count.save()

#         # Update Redis leaderboard
#         leaderboard.add_vote(candidate.user.full_name)

#         return Response(
#             {"message": f"Vote successfully cast for {candidate.user.full_name} in {post.position}."},
#             status=status.HTTP_201_CREATED
#         )
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
redis_client = redis.StrictRedis.from_url(settings.CACHES['default']['LOCATION'])
@csrf_exempt
def cast_vote(request):
    if request.method == 'POST':
        post_id = request.POST.get('post_id')
        candidate_id = request.POST.get('candidate_id')

        post = get_object_or_404(ElectionPost, id=post_id)
        candidate = get_object_or_404(Candidate, id=candidate_id)

        # Check if the election is in the voting phase
        if post.phase != 'voting':
            return JsonResponse({'error': 'Voting is not allowed at this time.'}, status=400)

        # Record the vote (anonymous)
        VoterVote.objects.create(post=post, candidate=candidate)

        return JsonResponse({'message': 'Vote cast successfully!'})
    return JsonResponse({'error': 'Invalid request method.'}, status=400)

@csrf_exempt
def start_counting(request):
    if request.method == 'POST':
        post_id = request.POST.get('post_id')
        post = get_object_or_404(ElectionPost, id=post_id)

        # Switch to counting phase
        post.phase = 'counting'
        post.save()

        # Initialize Redis for counting
        redis_leaderboard_key = f'leaderboard:post:{post_id}'
        redis_client.delete(redis_leaderboard_key)  # Clear previous leaderboard

        # Fetch all votes for the post
        votes = VoterVote.objects.filter(post=post)
        candidates = Candidate.objects.filter(position_applied=post)

        # Count votes in chunks of 10
        for candidate in candidates:
            vote_count = votes.filter(candidate=candidate).count()
            floor_count = (vote_count // 10) * 10  # Nearest lower multiple of 10
            redis_client.zadd(redis_leaderboard_key, {candidate.name: floor_count})

        return JsonResponse({'message': 'Counting started! Leaderboard initialized.'})
    return JsonResponse({'error': 'Invalid request method.'}, status=400)

@csrf_exempt
def count_votes(request):
    if request.method == 'POST':
        post_id = request.POST.get('post_id')
        post = get_object_or_404(ElectionPost, id=post_id)

        # Ensure the election is in the counting phase
        if post.phase != 'counting':
            return JsonResponse({'error': 'Counting is not allowed at this time.'}, status=400)

        # Fetch all votes for the post
        votes = VoterVote.objects.filter(post=post)
        candidates = Candidate.objects.filter(position_applied=post)

        # Update leaderboard in chunks of 10
        redis_leaderboard_key = f'leaderboard:post:{post_id}'
        for candidate in candidates:
            vote_count = votes.filter(candidate=candidate).count()
            floor_count = (vote_count // 10) * 10  # Nearest lower multiple of 10

            # Check if the leaderboard needs to be updated
            redis_last_key = f'last_displayed:post:{post_id}:candidate:{candidate.id}'
            last_displayed = redis_client.get(redis_last_key)
            last_displayed = int(last_displayed) if last_displayed else 0

            if floor_count > last_displayed:
                redis_client.zadd(redis_leaderboard_key, {candidate.name: floor_count})
                redis_client.set(redis_last_key, floor_count)

        return JsonResponse({'message': 'Votes counted and leaderboard updated!'})
    return JsonResponse({'error': 'Invalid request method.'}, status=400)

def get_leaderboard(request, post_id):
    redis_key = f'leaderboard:post:{post_id}'
    leaderboard = redis_client.zrange(redis_key, 0, -1, withscores=True, desc=True)
    formatted_leaderboard = {name.decode('utf-8'): int(score) for name, score in leaderboard}
    return JsonResponse({'leaderboard': formatted_leaderboard})
# class LeaderboardView(generics.ListAPIView):
#     permission_classes = [permissions.AllowAny]

#     def get(self, request, *args, **kwargs):
#         post_id = self.request.query_params.get("post_id")
#         if not post_id:
#             return Response({"error": "Post ID is required"}, status=status.HTTP_400_BAD_REQUEST)

#         # Fetch leaderboard data from Redis
#         data = leaderboard.get_leaderboard()

#         return Response(
#             [{"candidate": candidate, "votes": int(votes)} for candidate, votes in data],
#             status=status.HTTP_200_OK
#         )

# class CastVoteView(generics.CreateAPIView):
#     """
#     API for students to cast votes securely.
#     - Allows voting in multiple posts.
#     - Prevents multiple votes for the same post.
#     """
#     permission_classes = [permissions.IsAuthenticated, IsStudent]
#     authentication_classes = [JWTAuthentication]
#     serializer_class = VoteCountSerializer

#     def post(self, request, *args, **kwargs):
#         candidate_id = request.data.get("candidate")

#         # Check if the candidate exists
#         candidate = get_object_or_404(Candidate, id=candidate_id)
#         post = candidate.post  # Get the election post

#         # Check if the student is registered as a voter
#         voter = Voter.objects.filter(user=request.user).first()
#         if not voter:
#             return Response({"error": "You are not registered as a voter."}, status=status.HTTP_403_FORBIDDEN)

#         # Check if the voter has already voted for this post
#         if VoterVote.objects.filter(voter=voter, post=post).exists():
#             return Response({"error": "You have already voted for this post. You cannot vote again."}, status=status.HTTP_403_FORBIDDEN)

#         # Create a vote record for the voter in this post
#         VoterVote.objects.create(voter=voter, post=post, candidate=candidate)

#         # Check if VoteCount exists; if not, create it
#         vote_count, created = VoteCount.objects.get_or_create(candidate=candidate, post=post)

#         # Increment the vote count
#         vote_count.vote_count += 1
#         vote_count.save()

#         return Response(
#             {"message": f"Vote successfully cast for {candidate.user.full_name} in {post.position}. You cannot vote again for this post."},
#             status=status.HTTP_201_CREATED
#         )
