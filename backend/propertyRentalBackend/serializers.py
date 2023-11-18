from django.contrib.auth import authenticate
from django.db import models
from django.db.models import F
from django.db.models.functions import Concat, Cast
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext as _
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed

from . models import User

class SignInSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    email = serializers.EmailField(read_only=True, required=False)
    phone_number = serializers.CharField()
    password = serializers.CharField(write_only=True)
    username = serializers.CharField(read_only=True)
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
        phone_number = attrs.get('phone_number', '')
        password = attrs.get('password', '')
        print(phone_number, password)
        all_users = User.objects.all()

        # Print phone numbers
        for user in all_users:
            print(user.phone_number)
        user = authenticate(phone_number=phone_number, password=password)
        if not user:
            raise AuthenticationFailed(_('Hisob maʼlumotlari notoʻgʻri, qayta urinib koʻring'))
        if not user.is_active:
            raise AuthenticationFailed(_("Hisob o'chirilgan, administrator bilan bog'laning"))
        return {
            'id': user.id,
            'email': user.email,
            'tokens': user.tokens(),
            'phone_number': user.phone_number,
            'username': user.username,
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
            # 'id': user.id,
            'email': user.email,
            'phone_number': user.phone_number,
            'username': user.username,
        }