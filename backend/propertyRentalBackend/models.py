from django.db import models
from django.contrib.auth.models import AbstractUser
from rest_framework_simplejwt.tokens import RefreshToken

class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    phone_number = models.CharField(max_length=15, unique=True)
    liked_homes = models.ManyToManyField('RealEstate', related_name='user', blank=True)
    is_realtor = models.BooleanField(default=False)
    realtor_id = models.OneToOneField('Realtor', on_delete=models.CASCADE, related_name='realtor', null=True, blank=True)

    def __str__(self):
        return self.username

    def tokens(self):
        '''Return access and refresh tokens'''
        refresh = RefreshToken.for_user(self)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }

class Realtor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

    def __str__(self):
        return self.user


class PasswordResetToken(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)
    random_number = models.CharField(max_length=5, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class RealEstate(BaseModel):
    location = models.CharField(max_length=255)
    hajmi = models.JSONField()
    price = models.CharField(max_length=255)
    rieltor_price = models.CharField(max_length=255)
    description = models.TextField()
    images = models.JSONField()
    video = models.FileField(upload_to='videos/', null=True, blank=True)
    title = models.CharField(max_length=255)
    realtor = models.ForeignKey(Realtor, on_delete=models.CASCADE)
    liked_users = models.ManyToManyField(User, related_name='liked_real_estates', blank=True)

    def __str__(self):
        return self.title
