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

# ! sign in (login) serializer
class SignInSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    email = serializers.EmailField(read_only=True, required=False)
    # phone_number = serializers.CharField()
    password = serializers.CharField(write_only=True)
    username = serializers.CharField()
    tokens = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = (
            'id', 'email', 'password', 'username', 'tokens', 'permissions'
        )

    def get_tokens(self, obj):
        user = get_object_or_404(User, username=obj.get('username'))
        return {
            'refresh': user.tokens()['refresh'],
            'access': user.tokens()['access']
        }

    def is_valid(self, *, raise_exception=False):
        return super().is_valid(raise_exception=raise_exception)

    # def validate_phone_number(self, obj: str):
    #     obj = obj.replace(' ', '')
    #     if obj[0] != '+':
    #         raise serializers.ValidationError(_('Telefon raqam `+!` bilan boshlanishi kerak'))
    #     if not obj[1:].isdigit():
    #         raise serializers.ValidationError(_('Telefon raqam raqamlardan iborat bo\lishi kerak!'))
    #     return obj

    def validate(self, attrs):
        username = attrs.get('username', '')
        password = attrs.get('password', '')
        # print(username, password)

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

# ! sign up (register) serializer
class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "__all__"
        )

    email = serializers.EmailField(required=False)
    phone_number = serializers.CharField()
    password = serializers.CharField(write_only=True)
    username = serializers.CharField()
    is_realtor = serializers.BooleanField(default=False)

    def is_valid(self, raise_exception=False):
        return super().is_valid(raise_exception=raise_exception)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
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
        if User.objects.filter(phone_number=obj).exists():
            raise serializers.ValidationError(_("Bu raqam bilan allaqachon ro'yxatdan o'tilgan"))
        return obj

    def validate(self, attrs):
        phone_number = attrs.get('phone_number', '')
        password = attrs.get('password', '')
        username = attrs.get('username', '')
        email = attrs.get('email', '')
        is_realtor = attrs.get('is_realtor', False)

        # Create a new user with the provided fields
        user = User.objects.create_user(
            phone_number=phone_number,
            password=password,
            username=username,
            email=email,
            is_realtor=is_realtor,
        )

        if is_realtor:
            realtor = Realtor.objects.create(user=user)

            user.realtor_id = realtor
            user.save()

        return {
            'id': user.id,
            'email': user.email,
            'phone_number': user.phone_number,
            'username': user.username,
        }

# ! Update User info [PATCH]
class UpdateUserSerializer(serializers.Serializer):
    username = serializers.CharField(required=False)
    phone_number = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance

# ! Real Estate Create [POST]
class RealEstateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RealEstate
        fields = (
            'location', 'hajmi', 'price', 'rieltor_price', 'description', 'images', 'video', 'title'
        )

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
            raise serializers.ValidationError("Iltimos qayta login qiling!")
        else:
            raise serializers.ValidationError("Faqat Realtorlar uy qo'sha oladi")

    def create(self, validated_data):
        """
        Create and return a new RealEstate instance.
        """
        # Extract the Realtor from the request context
        request = self.context.get('request')
        realtor = (
            request.user.realtor if request and request.user.is_authenticated and hasattr(request.user,'realtor') else None
        )

        # Set the Realtor for the RealEstate instance
        validated_data['realtor'] = realtor

        # Create and return the RealEstate instance
        return RealEstate.objects.create(**validated_data)

