# models.py

from django.db import models
from django.contrib.auth.models import AbstractUser

class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class Realtor(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, unique=True)
    password = models.CharField(max_length=128)

    def __str__(self):
        return self.username

class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, unique=True)
    password = models.CharField(max_length=128)
    liked_homes = models.ManyToManyField('RealEstate', related_name='user', blank=True)

    def __str__(self):
        return self.username

class RealEstate(BaseModel):
    id = models.AutoField(primary_key=True)
    location = models.CharField(max_length=255)
    hajmi = models.JSONField()
    price = models.CharField(max_length=255)
    rieltor_price = models.CharField(max_length=255)
    description = models.TextField()
    images = models.JSONField()
    video = models.FileField(upload_to='videos/', null=True, blank=True)
    title = models.CharField(max_length=255)
    rieltor = models.ForeignKey(Realtor, on_delete=models.CASCADE)
    liked_users = models.ManyToManyField(User, related_name='liked_real_estates', blank=True)

    def __str__(self):
        return self.title
