import json
import random
from django.conf import settings
import google.generativeai as genai
import os


api_key_env = settings.API_KEY

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

# Open the states.json file in the project directory
with open("states.json", "r") as f:
    # Load the JSON data from the file
    data = json.load(f)

state = data[random.randint(0, len(data) - 1)]['name']
print("State: "+state)
# Print the JSON data
#print(data)
def send_code_to_api(code):
     # Create a GenerativeModel object
    model = genai.GenerativeModel(model_name="gemini-1.5-pro-latest",
                              generation_config=generation_config,
                              safety_settings=safety_settings)

    # Start a chat conversation
    convo = model.start_chat(history=[])

    # Send a message to the conversation
    message = "Please Gemini, give me the name of only one touristic place in the state of " + state + " in US without emoticons, it can be: Any famous beach, parks, museums, natural parks, historical places, around all United States of America. For example: Times Square / New York, Yellowstone National Park / Wyoming, Miami beach / Florida, Grand Canyon / Arizona, Hollywood boulevard / Los Angeles."
    convo.send_message(message)

    # Get the response from the conversation
    response = convo.last.text

    # Split the response into the place and state
    place, state = response.split(" / ")

    # Return the place and state
    return place, state

