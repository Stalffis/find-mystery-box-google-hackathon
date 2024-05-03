from django.urls import path
from . import views

urlpatterns = [
    path('riddle', views.getRiddle), 
    path('quote', views.getQuote)

]