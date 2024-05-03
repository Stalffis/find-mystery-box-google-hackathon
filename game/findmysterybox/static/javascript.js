$(document).ready(function(){
    $('#exampleModal').modal('show');

    $('#modalButton').click(function(){
        $('#exampleModal2').modal('show');
    });

    $('#modalButton2').click(function(){
        $('#exampleModal3').modal('show');
    });

    $('#modalButton3').click(function(){
        $('#exampleModal4').modal('show');
    });
});

async function getRiddle() {
    let response = await fetch('/riddle');
    let data = await response.json();

    var location = data.location
    var state = data.state
    var riddle = data.message
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

setTimeout(getRiddle, 2000);
setTimeout(getQuote, 12000);





//console.log("Hello, world!");