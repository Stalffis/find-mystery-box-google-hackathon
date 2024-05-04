var endGame = false;

$(document).ready(function(){
    $('#exampleModal').modal('show');

    $('#modalButton').click(function(){
        $('#exampleModal2').modal('show');
    });
    /*
    $('#modalButton2').click(function(){
        $('#exampleModal3').modal('show');
    });
    */
    $('#modalButton3').click(function(){
        $('#exampleModal4').modal('show');
    });

    $('#modalButton3').click(function(){
        if (endGame){
            location.reload();
        }
    });
    
});
var selectedState = 'Florida';

async function getRiddle() {
    let response = await fetch('/riddle');
    let data = await response.json();

    var location = data.location;
    var state = data.state;
    var riddle = data.riddle;
    $('#modalText2').text(riddle);


    $('#location').text(location);
    $('#state').text(state);
    //console.log(data); // This will log the JSON object to your console
}

async function getQuote() {
    let response = await fetch('/quote');
    let data = await response.json();

    var quote = data.message
    $('#modalText4').text(quote);
    
    //console.log(data); // This will log the JSON object to your console
}

function compareState(guessState){

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


getRiddle()
//setTimeout(getQuote, 20000);
setTimeout(getQuote, 0);

//console.log("Hello, world!");