from django.shortcuts import render, HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view


#Create your views here

@api_view(['GET'])

def getRiddle(request):
    riddle = {
        'location': 'Miami Beach',   
        'state': 'Florida',
        'message': 'This is a riddle'  
        }
    return Response (riddle)

@api_view(['GET'])

def getQuote(request):
    quote = {'message': 'This is a motivational quote'}
    return Response (quote)

def home(request):
    return render(request, "home.html")

