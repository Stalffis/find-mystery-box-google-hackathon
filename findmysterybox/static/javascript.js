var endGame = false;
var state = null;
var map;
var marker;
var GeminiTry = 0;

//Handling Error Array
const handling_error = [
    {
      "State": "Florida",
      "Riddle": "Where rockets kiss the sky, and dreams ignite,\nA place of wonder, bathed in starry night.\nFootprints of giants on moonlit dust reside,\nExploring the cosmos, with science as guide.\n\n",
      "Place": "Kennedy Space Center Visitor Complex",
      "Quote": "The journey of a thousand miles begins with a single step, but don't forget to enjoy the scenery along the way."
    },
    {
      "State": "New York",
      "Riddle": "A green oasis in a city that never sleeps,\nWhere towering giants watch as the world creeps.\nHorse-drawn carriages and boats on the lake,\nA haven for artists, for dreamers to take.\n\n",
      "Place": "Central Park",
      "Quote": "Kindness is like a boomerang; it always returns."
    },
    {
      "State": "California",
      "Riddle": "Granite giants pierce the sky so blue,\nWaterfalls cascade, a breathtaking view.\nSequoia stands tall, with stories untold,\nIn this valley of wonder, where nature unfolds.\n",
      "Place": "Yosemite National Park",
      "Quote": "A calm sea never made a skilled sailor; embrace life's challenges."
    }
   ]
   // Get a random index from the array only for handling errors
    const randomIndex = Math.floor(Math.random() * (handling_error.length-1));

$(document).ready(function(){
    $('#exampleModal').modal('show');
});

function initMap(){
    map = new google.maps.Map(document.getElementById("map"),{
        center: { lat: 37.09024, lng: -95.712891 },
        zoom: 5,
    })
    geocoder = new google.maps.Geocoder();

    marker = new google.maps.Marker({
        map,
    });
    map.addListener("click", (e) => {
        //console.log(e.latLng)
        geocode({ location: e.latLng });
    });

    map.addListener("click", (mapsMouseEvent) => {
        var json = mapsMouseEvent.latLng.toJSON()
        var text = json.lat + ', ' + json.lng;

    });
}

$('#modalButton').click(function(){
    $('#exampleModal2').modal('show');
});

$('#modalButton3').click(function(){
    $('#exampleModal4').modal('show');
});

$('#modalButton3').click(function(){
    if (endGame){
        location.reload();
    }
});
async function getRiddle() {
  try {
    const response = await fetch('/riddle');
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
  
    const data = await response.json();
    var location = data.location;
    state = data.state;
    console.log(state)
    var riddle = data.riddle;
    riddle = riddle.slice(0, riddle.length - 12);

    $('#modalText2').text('"'+riddle+'"');
    $('#modalText2final').text("Where am I?");

    $('#location').text(location);
    $('#state').text(state);
    //console.log(data); // This will log the JSON object to your console
    GeminiTry = 0
  } catch (error) {
    console.log('There was a problem with your fetch operation (getting the riddle): ' + error.message);
    GeminiTry++
    if (GeminiTry < 2){
        setTimeout(getRiddle, 5000);
    }
    else{
        let randomRiddle = handling_error[randomIndex].Riddle;
        let location = handling_error[randomIndex].Place;
        state = handling_error[randomIndex].State;

        $('#modalText2').text('"'+randomRiddle+'"');
        $('#modalText2final').text("Where am I?");
        $('#location').text(location);
        $('#state').text(state);

    }
  }
}

async function getQuote() {
    try {
        const response = await fetch('/quote');
        
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        let data = await response.json();
      
        var quote = data.message
        $('#modalText4').text(quote);
        GeminiTry = 0;
      } catch (error) {
        console.log('There was a problem with your fetch operation (getting the quote): ' + error.message);
        GeminiTry++;
        if (GeminiTry < 2){
            setTimeout(getQuote, 5000);
        }
        else{
            let randomQuote = handling_error[randomIndex].Quote;
            $('#modalText4').text(randomQuote);
        }
      }
    }

getRiddle()
setTimeout(getQuote, 10000);
//setTimeout(getQuote, 0);

function compareState(guessState, state){

    console.log(guessState);
    $('#exampleModalLabel3').text('Wrong 🥺🥺');
    $('#state').text(state);
    $('#modalButton3').text('Play again');
    endGame = true;
    if(guessState == state){
        $('#exampleModalLabel3').text('Correct! 🥳🥳');
        $('#modalButton3').text('Open the mystery box');
        endGame = false;
    }
    $('#exampleModal3').modal('show');

}

function geocode(request) {
    geocoder
    .geocode(request)
    .then((result) => {
    const { results } = result;
    let size;
    marker.setPosition(results[0].geometry.location);
    marker.setMap(map);
    //console.log('Aqui hay un array', results)
    size = results.length;
    if (size>=2 && results[size-1].formatted_address == "United States") {
        guessState = results[size-2];
        guessState = guessState.formatted_address.split(",");
        guessState = guessState[0]
        compareState(guessState, state)
        //console.log(guessState)
    }
    else{
        alert("You are outside the US, the mystery box is not there...😩");
    }
    })
    .catch((e) => {
    alert("Geocode was not successful for the following reason: " + e);
    });
}


window.initMap = initMap
