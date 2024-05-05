var endGame = false;
var state = null;
var map;
var marker;
var GeminiTry = 0;

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
    setTimeout(getRiddle, 5000);
  }
}

async function getQuote() {
    try {
        const response = await fetch('/quote');

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
      
        var quote = data.message
        $('#modalText4').text('"'+quote.slice(0, -2)+'"');
        GeminiTry = 0
      } catch (error) {
        console.log('There was a problem with your fetch operation (getting the quote): ' + error.message);
        GeminiTry++
        setTimeout(getQuote, 5000);
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
