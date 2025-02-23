from django.contrib import admin

# Register your models here.


from django.contrib import admin
from .models import *

@admin.register(AdministrationFeedback)
class AdministrationFeedbackAdmin(admin.ModelAdmin):
    list_display = ('title', 'submitted_by', 'timestamp', 'admin_response')
    list_filter = ('timestamp', 'submitted_by')
    search_fields = ('title', 'description', 'submitted_by__username')

admin.site.register(Lecture)
admin.site.register(Feedback)
