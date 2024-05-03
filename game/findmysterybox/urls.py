from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('riddle', views.getRiddle), 
    path('quote', views.getQuote)

]