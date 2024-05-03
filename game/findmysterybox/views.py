from django.shortcuts import render, HttpResponse
from dotenv import load_dotenv
from rest_framework.response import Response
from rest_framework.decorators import api_view
import json
import time
import random
from django.conf import settings
import google.generativeai as genai
import os


#Create your views here

'''@api_view(['GET'])

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
'''
# Load environment variables from .env file
load_dotenv()

api_key_env = os.getenv('API_KEY')

genai.configure(api_key=api_key_env)

# Set up the model
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 0,
  "max_output_tokens": 8192,
}

safety_settings = [
  {
    "category": "HARM_CATEGORY_HARASSMENT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_HATE_SPEECH",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
]

model = genai.GenerativeModel(model_name="gemini-1.5-pro-latest",
                              generation_config=generation_config,
                              safety_settings=safety_settings)
# Open the states.json file in the project directory
with open("./findmysterybox/states.json", "r") as f:
    # Load the JSON data from the file
    data = json.load(f)

convo = model.start_chat(history=[
])
#We request to GeminiAPI the place using the state and the riddle based in that location and state
@api_view(['GET'])

def getRiddle(request):
    state = data[random.randint(0, len(data) - 1)]['name']
    messageLocation = "Please Gemini, give me the name of only one touristic place in the state of "+state+" in US without emoticons, it can be: Any famous beach, parks, museums, natural parks, historical places, around all United States of America. For example: Times Square / New York, Yellowstone National Park / Wyoming, Miami beach / Florida, Grand Canyon / Arizona, Hollywood boulevard / Los Angeles."
    convo.send_message(messageLocation)
    response = convo.last.text
    place, state = response.split(" / ")
    time.sleep(5)
    messageRiddle = "You are an expert creating riddlers. Your job is to generate a riddle, without the answer, for a game using these two parameters: 1. Place: "+place+", 2. State: "+state+". The idea is that the user have to guess the place with the riddle that you provide so you can't use in the riddle the exact parameters provided, you can use synonymous. For example: I rise and fall with the lake's gentle breath, A sandy expanse where the wind finds its path. Sculpted by nature, a playground so vast, With whispering dunes that forever will last. Where am I?"
    convo.send_message(messageRiddle)
    riddle = convo.last.text

    time.sleep(5)
    riddle = { 
        'location': place, 
        'state': state,
        'riddle': riddle
        }
    return Response(riddle)

@api_view(['GET'])

def getQuote(request):
    messageQuote = "You are an expert creating fortune cookie messages. Your job is to generate a fortune cookie message, full of wisdom and without emoticons"
    convo.send_message(messageQuote)
    quote = convo.last.text
    time.sleep(10)
    quote = {'message': quote}
    return Response (quote)


def home(request):
    return render(request, "home.html")

