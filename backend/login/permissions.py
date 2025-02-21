from rest_framework.permissions import BasePermission

# class IsStudent(BasePermission):
#     """Allows access only to students."""
#     def has_permission(self, request, view):
#         return request.user.is_authenticated and request.user.role == 'Student'

# class IsFaculty(BasePermission):
#     """Allows access only to faculty members."""
#     def has_permission(self, request, view):
#         return request.user.is_authenticated and request.user.role == 'Faculty'

# class IsHOD(BasePermission):
#     """Allows access only to HODs."""
#     def has_permission(self, request, view):
#         return request.user.is_authenticated and request.user.role == 'Head of Department'

# class IsDean_s(BasePermission):
#     """Allows access only to Deans."""
#     def has_permission(self, request, view):
#         return request.user.is_authenticated and request.user.role == 'Dean of Student'
    
# class IsDean_f(BasePermission):
#     """Allows access only to Deans."""
#     def has_permission(self, request, view):
#         return request.user.is_authenticated and request.user.role == 'Dean of Finance'
# class IsDirector(BasePermission):
#     """Allows access only to directors."""
#     def has_permission(self, request, view):
#         return request.user.is_authenticated and request.user.role == 'Director'


from rest_framework.permissions import BasePermission

class IsStudent(BasePermission):
    """Allows access only to students."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'student'

class IsFaculty(BasePermission):
    """Allows access only to faculty members."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'faculty'

class IsHOD(BasePermission):
    """Allows access only to HODs."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'hod'

class IsDean_s(BasePermission):
    """Allows access only to Deans."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'dean_student'
    
class IsDean_f(BasePermission):
    """Allows access only to Deans."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'dean_finance'

class IsDirector(BasePermission):
    """Allows access only to directors."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'director'
    
class IsDoctor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'doctor'

class IsSecurity(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'security'

class IsWarden(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'warden'
