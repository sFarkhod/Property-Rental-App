from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import login as auth_login, logout as auth_logout


from .serializers import SignInSerializer, SignUpSerializer, SignUpRealtorSerializer, RealEstateSerializer, \
    SignInRealtorSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def sign_up_user(request):
    if request.method == 'POST':
        serializer = SignUpSerializer(data=request.data)
        if serializer.is_valid():
            # serializer.save()
            # Token.objects.create(user=serializer.instance)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def sign_up_realtor(request):
    if request.method == 'POST':
        serializer = SignUpRealtorSerializer(data=request.data)
        if serializer.is_valid():
            # realtor = serializer.save()
            # Token.objects.create(user=realtor)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    if request.method == 'POST':
        serializer = SignInSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_realtor(request):
    if request.method == 'POST':
        serializer = SignInRealtorSerializer(data=request.data)
        if serializer.is_valid():
            realtor = serializer.validated_data
            auth_login(request, realtor)
            return Response(realtor, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def logout(request):
    auth_logout(request)
    return Response({'detail': 'Successfully logged out.'}, status=status.HTTP_200_OK)


# saving to database written here in the views
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