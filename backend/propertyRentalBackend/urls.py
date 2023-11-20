"""
URL configuration for propertyRentalBackend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from propertyRentalBackend.views import sign_up, login, logout, create_real_estate, update_user, password_reset_request, \
    password_reset_confirm

urlpatterns = [
    path('admin/', admin.site.urls),
    path('sign-up/', sign_up, name='sign-up'),
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('update-user/', update_user, name='update-user'),
    path('password-reset-request/', password_reset_request, name='password-reset-request'),
    # path('password-reset-confirm/<str:uidb64>/<str:random_number>/', password_reset_confirm,
    #      name='password-reset-confirm'),
    path('password-reset-confirm/', password_reset_confirm,
         name='password-reset-confirm'),
    path('create-real-estate/', create_real_estate, name='create-real-estate'),
]
