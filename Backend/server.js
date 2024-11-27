//Author: Brad Kinney
//Description: This demo app demonstrates the use of modules, routes and database operations using the Express.js framework
var express = require('express');
var routes = require('./routes.js');
const cors = require('cors');
const io = require("socket.io")(http, {cors: {origin: "*", methods: ["GET", "POST"]}});
const bodyParser = require('body-parser');
const app = express();
var http = require('http').Server(app);
const port = 3000;

//Get access to request body for POST requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Apply CORS to allow cross-origin access
app.use(cors());

//use routes module for the username, players, and highscores
app.use('/', routes);

var users = 0;
io.on('connection', function (socket) {
    //increment number of users
    users++;
    //broadcast number of users when users connect
    io.sockets.emit('broadcast', {description: users + ' users are here!'});
    //listen for and broadcast clicks
    socket.on('clicks', function(clicks){
        console.log("clicked "+clicks+" times");
        io.sockets.emit('clicked', {data: clicks});
    });
    //broadcast number of users when users disconnect
    socket.on('disconnect', function () {
        users--;
        io.sockets.emit('broadcast', {description: users + ' users  are here!'});
    });
});

//Listen for connections on port 3000
app.listen(port, () => console.log("Server running on port: "+port));