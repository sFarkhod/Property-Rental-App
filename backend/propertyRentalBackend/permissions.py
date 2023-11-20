from rest_framework import permissions


class IsRealtor(permissions.BasePermission):
    edit_methods = ("PUT", "PATCH")

    def has_permission(self, request, view):
        if request.user.is_authenticated and request.user.is_realtor:
            return True
