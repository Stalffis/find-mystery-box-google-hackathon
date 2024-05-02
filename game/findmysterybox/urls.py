from django.urls import path
from . import views

urlpatterns = [
    path('riddles', views.getRiddle), 
    path('quotes', views.getQuote)

]