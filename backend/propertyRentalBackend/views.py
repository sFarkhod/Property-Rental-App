from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404
from django.utils.crypto import get_random_string
from django.utils.http import urlsafe_base64_decode
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import login as auth_login, logout as auth_logout


from .models import User, PasswordResetToken, RealEstate
from .permissions import IsRealtor
from .serializers import SignInSerializer, SignUpSerializer, RealEstateSerializer, UpdateUserSerializer, \
    PasswordResetSerializer, RandomNumberSerializer, RealEstateListSerializer, UserSerializer


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

# ! for sending password reset code
@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request(request):
    if request.method == 'POST':
        serializer = RandomNumberSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm(request):
    if request.method == 'POST':

        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'detail': 'Password reset successful.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ! real estate create
@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsRealtor])
def create_real_estate(request):
    if request.method == 'POST':
        serializer = RealEstateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ! list of real estates
@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def list_real_estates(request):
    # Get query parameters
    location = request.query_params.get('location', None)
    title = request.query_params.get('search', None)

    # Filter real estates based on location and search title
    queryset = RealEstate.objects.all()
    if location:
        queryset = queryset.filter(location=location)
    if title:
        queryset = queryset.filter(title__icontains=title)

    # Serialize the filtered data
    serializer = RealEstateListSerializer(queryset, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)

# ! real estate by id
@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_real_estate(request, pk):
    real_estate = get_object_or_404(RealEstate, pk=pk)
    serializer = RealEstateSerializer(real_estate)
    return Response(serializer.data, status=status.HTTP_200_OK)

# edit given real estate
@api_view(['PATCH'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsRealtor])
def update_real_estate(request, real_estate_id):
    real_estate = RealEstate.objects.get(id=real_estate_id)

    # Check if the user updating the real estate is the one who added it
    if request.user == real_estate.realtor.user:
        serializer = RealEstateSerializer(real_estate, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'detail': 'You do not have permission to update this real estate.'}, status=status.HTTP_403_FORBIDDEN)

# delete given real estate
@api_view(['DELETE'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def delete_real_estate(request, real_estate_id):
    real_estate = RealEstate.objects.get(id=real_estate_id)

    # Check if the user deleting the real estate is the one who added it
    if request.user == real_estate.realtor.user:
        real_estate.delete()
        return Response({'detail': 'Real estate deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
    else:
        return Response({'detail': 'You do not have permission to delete this real estate.'}, status=status.HTTP_403_FORBIDDEN)


# getting user with token
@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_user_data(request):
    user_serializer = UserSerializer(request.user)
    return Response(user_serializer.data, status=status.HTTP_200_OK)