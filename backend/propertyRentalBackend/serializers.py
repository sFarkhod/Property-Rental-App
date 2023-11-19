from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password, check_password
from django.db import models
from django.db.models import F
from django.db.models.functions import Concat, Cast
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext as _
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, RealEstate
from .models import Realtor


class SignInSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    email = serializers.EmailField(read_only=True, required=False)
    phone_number = serializers.CharField()
    password = serializers.CharField(write_only=True)
    username = serializers.CharField()
    tokens = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = (
            'id', 'email', 'password', 'username', 'phone_number', 'tokens', 'permissions'
        )

    def get_tokens(self, obj):
        user = get_object_or_404(User, phone_number=obj.get('phone_number'))
        return {
            'refresh': user.tokens()['refresh'],
            'access': user.tokens()['access']
        }

    def is_valid(self, *, raise_exception=False):
        return super().is_valid(raise_exception=raise_exception)

    def validate_phone_number(self, obj: str):
        obj = obj.replace(' ', '')
        if obj[0] != '+':
            raise serializers.ValidationError(_('Telefon raqam `+!` bilan boshlanishi kerak'))
        if not obj[1:].isdigit():
            raise serializers.ValidationError(_('Telefon raqam raqamlardan iborat bo\lishi kerak!'))
        return obj

    def validate(self, attrs):
        username = attrs.get('username', '')
        password = attrs.get('password', '')
        print(username, password)

        user = authenticate(username=username, password=password)
        if not user:
            raise AuthenticationFailed(_('Hisob maʼlumotlari notoʻgʻri, qayta urinib koʻring'))
        if not user.is_active:
            raise AuthenticationFailed(_("Hisob o'chirilgan, administrator bilan bog'laning"))
        return {
            'id': user.id,
            'email': user.email,
            'phone_number': user.phone_number,
            'username': user.username,
            'tokens': user.tokens(),
        }

class SignInRealtorSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    email = serializers.EmailField(read_only=True, required=False)
    phone_number = serializers.CharField()
    password = serializers.CharField(write_only=True)
    username = serializers.CharField()
    tokens = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Realtor
        fields = (
            'id', 'email', 'password', 'username', 'phone_number', 'tokens', 'permissions'
        )

    def get_tokens(self, obj):
        user = get_object_or_404(Realtor, phone_number=obj.get('phone_number'))
        return {
            'refresh': user.tokens()['refresh'],
            'access': user.tokens()['access']
        }
    # def get_tokens(self, realtor):
    #     refresh = RefreshToken.for_user(realtor)
    #     return {
    #         'refresh': str(refresh),
    #         'access': str(refresh.access_token)
    #     }

    def is_valid(self, *, raise_exception=False):
        return super().is_valid(raise_exception=raise_exception)

    def validate_phone_number(self, obj: str):
        obj = obj.replace(' ', '')
        if obj[0] != '+':
            raise serializers.ValidationError(_('Telefon raqam `+!` bilan boshlanishi kerak'))
        if not obj[1:].isdigit():
            raise serializers.ValidationError(_('Telefon raqam raqamlardan iborat bo\lishi kerak!'))
        return obj

    def validate(self, attrs):
        username = attrs.get('username', '')
        password = attrs.get('password', '')

        realtor = Realtor.objects.get(username=username).first()
        if not realtor:
            raise AuthenticationFailed(_('Hisob maʼlumotlari notoʻgʻri, qayta urinib koʻring'))

        if not check_password(password, realtor.password):
            raise AuthenticationFailed(_('Hisob maʼlumotlari notoʻgʻri, qayta urinib koʻring'))

        return {
            'id': realtor.id,
            'email': realtor.email,
            'phone_number': realtor.phone_number,
            'username': realtor.username,
            'tokens': realtor.tokens(),
        }


class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'email', 'password', 'username', 'phone_number',
        )

    email = serializers.EmailField(required=False)
    phone_number = serializers.CharField()
    password = serializers.CharField(write_only=True)
    username = serializers.CharField()

    def is_valid(self, raise_exception=False):
        return super().is_valid(raise_exception=raise_exception)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists() or Realtor.objects.filter(username=value).exists():
            raise serializers.ValidationError("Bu nomdagi foydalanuvchi allaqachon ro'yxatdan o'tgan.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Bu email bilan allaqachon ro'yxatdan o'tilgan")
        return value

    def validate_phone_number(self, obj: str):
        obj = obj.replace(' ', '')
        if obj[0] != '+':
            raise serializers.ValidationError(_('Telefon raqam `+!` bilan boshlanishi kerak'))
        if not obj[1:].isdigit():
            raise serializers.ValidationError(_('Telefon raqam raqamlardan iborat bo\lishi kerak!'))
        return obj

    def validate(self, attrs):
        phone_number = attrs.get('phone_number', '')
        password = attrs.get('password', '')
        username = attrs.get('username', '')
        email = attrs.get('email', '')

        # Create a new user with the provided fields
        user = User.objects.create_user(
            phone_number=phone_number,
            password=password,
            username=username,
            email=email,
        )

        return {
            'id': user.id,
            'email': user.email,
            'phone_number': user.phone_number,
            'username': user.username,
        }


class SignUpRealtorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Realtor
        fields = (
            'email', 'password', 'username', 'phone_number',
        )

    email = serializers.EmailField(required=False)
    phone_number = serializers.CharField()
    password = serializers.CharField(write_only=True)
    username = serializers.CharField()

    def is_valid(self, raise_exception=False):
        return super().is_valid(raise_exception=raise_exception)

    def validate_username(self, value):
        if Realtor.objects.filter(username=value).exists() or User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Bu nomdagi foydalanuvchi allaqachon ro'yxatdan o'tgan.")
        return value

    def validate_email(self, value):
        if Realtor.objects.filter(email=value).exists():
            raise serializers.ValidationError("Bu email bilan allaqachon ro'yxatdan o'tilgan")
        return value

    def validate_phone_number(self, obj: str):
        obj = obj.replace(' ', '')
        if obj[0] != '+':
            raise serializers.ValidationError(_('Telefon raqam `+!` bilan boshlanishi kerak'))
        if not obj[1:].isdigit():
            raise serializers.ValidationError(_('Telefon raqam raqamlardan iborat bo\lishi kerak!'))
        return obj

    def validate(self, attrs):
        phone_number = attrs.get('phone_number', '')
        password = attrs.get('password', '')
        username = attrs.get('username', '')
        email = attrs.get('email', '')

        hashed_password = make_password(password)

        # Create a new realtor with the provided fields
        realtor = Realtor.objects.create(
            phone_number=phone_number,
            password=hashed_password,
            username=username,
            email=email,
        )

        return {
            'id': realtor.id,
            'email': realtor.email,
            'phone_number': realtor.phone_number,
            'username': realtor.username,
        }
class RealEstateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RealEstate
        fields = '__all__'

    def validate(self, data):
        """
        Validate the data before saving.
        """
        location = data.get('location')
        if not location:
            raise serializers.ValidationError("Location field cannot be empty.")

        description = data.get('description')
        if not description:
            raise serializers.ValidationError("Description field cannot be empty.")

        # Ensure that only Realtors can add RealEstate
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None

        if user and user.is_realtor:
            return data
        elif not user:
            raise serializers.ValidationError("Authentication required to add RealEstate.")
        else:
            raise serializers.ValidationError("Faqat Rieltorlar uy qo'sha oladi.")

    def create(self, validated_data):
        """
        Create and return a new RealEstate instance.
        """
        # Extract the Realtor from the request context
        request = self.context.get('request')
        rieltor = request.user.realtor if request and request.user.is_authenticated and hasattr(request.user, 'realtor') else None

        # Add the Realtor to the validated data before saving
        validated_data['rieltor'] = rieltor

        # Create and return the RealEstate instance
        return RealEstate.objects.create(**validated_data)


