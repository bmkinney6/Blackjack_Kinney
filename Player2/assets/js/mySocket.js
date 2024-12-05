/////////////////////////////////////////////////////////////////////////////////
//Author: Nnamdi Nwanze
//Purpose: Demonstrate bidirectional sockets
/////////////////////////////////////////////////////////////////////////////////
//mySocket.js
var myURL = "http://127.0.0.1:3000";
let username = "User" + Math.floor(Math.random() * 1000);
showUsername(username);

//connect to socket
var socket = io(myURL, {secure: true});
$.ajax({
    url: myURL,
    type: 'GET',
    success: function (data) {
        socket.emit('emit_from_here');
    }
});
//show number of players example use
socket.on('broadcast', function (data) {
    showNumberOfPlayers(data.description);
});
//show button was clicked example use
socket.on('clicked', function (data) {
    showButtonClicked();
});

// Emit player moves
function BroadcastMove(playerMove) {
    socket.emit('playerMove', playerMove);
}

// Listen for board updates
socket.on('updateBoard', (data) => {
    updateMiniBoard(data);
});

function updateMiniBoard(data) {
    // Update the mini board with the other player's data
    BroadcastPlayerCard(data);
}


