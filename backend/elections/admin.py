from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register(ElectionPost)
admin.site.register(Candidate)
admin.site.register(Voter)
admin.site.register(VoterVote)