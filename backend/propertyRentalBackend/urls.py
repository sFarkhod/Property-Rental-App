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
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

from propertyRentalBackend.views import sign_up_user, sign_up_realtor, login_view, create_real_estate, login_realtor, \
    logout

urlpatterns = [
    path('admin/', admin.site.urls),
    path('sign-up/user/', sign_up_user, name='sign-up-user'),
    path('sign-up/realtor/', sign_up_realtor, name='sign-up-realtor'),
    # path('login/', login_view, name='login'),
    path('login/user/', login_view, name='login'),
    path('login/realtor/', login_realtor, name='login-realtor'),
    path('logout/', logout, name='logout'),
    path('create_real_estate/', create_real_estate, name='create_real_estate'),
]
