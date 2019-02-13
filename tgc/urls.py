"""tgc URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
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
from . import views

from django.conf import settings
from django.conf.urls import include
from django.conf.urls.static import static

app_name = 'tgc'

urlpatterns = [
	path('', views.initial_formview, name='initform'),
    path('submitformdetails/', views.submitformdetails, name='submitformdetails'),
    path('processcustomeracct/', views.processcustomeracct, name='processcustomeracct'),
    path('processorders/', views.processorders, name='processorders'),
    path('updateorderings/', views.updateorderinGSview, name='updateorderings'),
    path('updateinvoiceings/', views.updateinvoiceinGSview, name='updateinvoiceins'),
    path('updatefittingdatesings/', views.updatefittingdatesinGSview, name='updatefittingdatesings'),
    path('admin/', admin.site.urls),
]

if settings.DEBUG:
    #becos we use -> 'django.contrib.staticfiles' in INSTALLED_APPS settings, so dun need this line
    urlpatterns = urlpatterns + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns = urlpatterns + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)