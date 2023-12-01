import random

from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext as _
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken

from . import settings
from .models import User, RealEstate, PasswordResetToken
from .models import Realtor

# ! sign in (login) serializer
class SignInSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    email = serializers.EmailField(read_only=True, required=False)
    # phone_number = serializers.CharField()
    password = serializers.CharField(write_only=True)
    username = serializers.CharField()
    tokens = serializers.SerializerMethodField(read_only=True)
    is_realtor = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = (
            'id', 'email', 'password', 'username', 'tokens', 'permissions', 'is_realtor'
        )

    def get_is_realtor(self, obj):
        # Check if the user making the request is a realtor
        request = self.context.get('request')
        if request and request.user.is_authenticated and hasattr(request.user, 'realtor'):
            return True
        return False

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

        is_realtor = hasattr(user, 'realtor')
        return {
            'id': user.id,
            'email': user.email,
            'phone_number': user.phone_number,
            'username': user.username,
            'tokens': user.tokens(),
            'is_realtor': is_realtor,
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

# ! Password reset
class RandomNumberSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def send_verification_email(self, user, random_number):
        subject = 'Verification Code for Password Reset'
        message = f'Your verification code is: {random_number}'
        send_mail(subject, message, settings.EMAIL_HOST_USER, [user.email])

    def create(self, validated_data):
        email = validated_data['email']
        print(email)

        user = User.objects.filter(email=email).first()

        if not user:
            raise serializers.ValidationError("Bu emailda foydalanuvchi topilmadi.")

        # Generate a random 5-digit code
        random_number = str(random.randint(10000, 99999))

        # Save the random number in the database
        password_reset_token = PasswordResetToken.objects.create(
            user=user,
            token=random_number
        )

        # Send an email with the verification code
        self.send_verification_email(user, random_number)

        return {'detail': 'Verification code sent successfully.', 'email': email}

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()
    verification_code = serializers.CharField()
    new_password = serializers.CharField(write_only=True)

    def validate_verification_code(self, value):
        email = self.initial_data.get('email')
        user = User.objects.get(email=email)

        password_reset_token = PasswordResetToken.objects.filter(user=user).order_by('-created_at').first()
        print(password_reset_token.token)

        if not password_reset_token or value != password_reset_token.token:
            raise serializers.ValidationError("Xato kod kiritildi.")

        return value

    def create(self, validated_data):
        email = validated_data['email']
        new_password = validated_data['new_password']
        user = User.objects.get(email=email)

        # Update the user's password
        user.set_password(new_password)
        user.save()

        # Clear the random number after successful password change
        user.random_number = None
        user.save()

        return {'detail': "Parol muvafaqiyatli o'zgartirildi"}

# ! Real Estate Create [POST]
class RealEstateSerializer(serializers.ModelSerializer):
    image1 = serializers.ImageField(required=True)
    image2 = serializers.ImageField(required=True)
    image3 = serializers.ImageField(required=True)
    created_at = serializers.DateTimeField(read_only=True)
    modified_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = RealEstate
        fields = (
            'created_at', 'modified_at',
            'location', 'hajmi', 'price', 'rieltor_price', 'description', 'image1', 'image2', 'image3', 'video', 'title'
        )

    def validate_image_count(self, value):
        if value and len(value) != 3:
            raise serializers.ValidationError("You must provide exactly 3 images.")
        return value

    def validate_video(self, value):
        if value:
            content_type = value.content_type.split('/')[0].lower()
            if content_type != 'video':
                raise serializers.ValidationError("Invalid video file type.")
        return value

    def validate(self, data):
        """
        Validate the data before saving.
        """
        location = data.get('location')
        if not location:
            raise serializers.ValidationError("Lokatsiya kiritilishi kerak")

        description = data.get('description')
        if not description:
            raise serializers.ValidationError("Uy haqida malumot kiritilishi kerak")

        # Ensure that only Realtors can add RealEstate
        request = self.context.get('request')
        # user = request.user if request and request.user.is_authenticated else None
        #
        # if user and user.is_realtor:
        #     return data
        # elif not user:
        #     raise serializers.ValidationError("Iltimos qayta login qiling!")
        # else:
        #     raise serializers.ValidationError("Faqat Realtorlar uy qo'sha oladi")

        return data

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

        # Handle individual image fields
        image1 = self.context['request'].FILES.get('image1')
        image2 = self.context['request'].FILES.get('image2')
        image3 = self.context['request'].FILES.get('image3')

        validated_data['image1'] = image1
        validated_data['image2'] = image2
        validated_data['image3'] = image3

        video = self.context['request'].FILES.get('video')
        if video:
            validated_data['video'] = video

        # Create and return the RealEstate instance
        return RealEstate.objects.create(**validated_data)

# ! Real Estate List [GET]
class RealEstateListSerializer(serializers.ModelSerializer):
    class Meta:
        model = RealEstate
        fields = ('id', 'location', 'hajmi', 'price', 'rieltor_price', 'description',
                  'title', 'image1', 'image2', 'image3', 'video', 'created_at', 'modified_at', 'realtor')


# user getting with token
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'phone_number', 'is_realtor')

