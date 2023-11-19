from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import login as auth_login, logout as auth_logout

from .serializers import SignInSerializer, SignUpSerializer, RealEstateSerializer, UpdateUserSerializer


# ! sign up (register)
@api_view(['POST'])
@permission_classes([AllowAny])
def sign_up(request):
    if request.method == 'POST':
        serializer = SignUpSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ! sign in (login)
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    if request.method == 'POST':
        serializer = SignInSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ! logout
@api_view(['POST'])
def logout(request):
    auth_logout(request)
    return Response({'detail': 'Successfully logged out.'}, status=status.HTTP_200_OK)

# ! update user profile
@api_view(['PATCH'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def update_user(request):
    if request.method == 'PATCH':
        serializer = UpdateUserSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            serializer.update(request.user, serializer.validated_data)
            return Response({'detail': 'User details updated successfully.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ! real estate create
@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def create_real_estate(request):
    if request.method == 'POST':
        serializer = RealEstateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
