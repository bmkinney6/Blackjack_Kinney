/////////////////////////////////////////////////////////////////////////////////
//Author: Nnamdi Nwanze
//Purpose: Demonstrate bidirectional sockets
/////////////////////////////////////////////////////////////////////////////////
//mySocket.js
var myURL = "http://127.0.0.1:3000";
let username = "User" + Math.floor(Math.random() * 1000);

//connect to socket
var socket = io(myURL, {secure: true});
$.ajax({
    url: myURL,
    type: 'GET',
    success: function (data) {
        socket.emit('emit_from_here');
    }
});

socket.on('serverTest', (data) => {
    console.log(data.message);
});
//show number of players example use WORKS DONT  TOUCH
socket.on('broadcast', function (data) {
	addMessage("Player Joined!");
    console.log("player joined.")
});
socket.on('scored', function(score){
    showSocketScore(score.score);
});

socket.on('player_moved', function(card){
    console.log("player 1 moved!");
    playersocketcard(card.card);
});
socket.on('dealer_moved', function(card){
    console.log("dealer 1 moved!");
    dealersocketcard(card.card);
});


