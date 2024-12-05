//Author: Brad Kinney
//Description: This demo app demonstrates the use of modules, routes and database operations using the Express.js framework
var express = require('express');
var routes = require('./routes.js');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
var http = require('http').Server(app);
const io = require("socket.io")(http, {cors: {origin: "*", methods: ["GET", "POST"]}});
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
    console.log("New User!")



    socket.on('scores', function(score){
        console.log("New Score: ", score);
        io.sockets.emit('scored', {score: score});
    });
    //broadcast number of users when users disconnect
    socket.on('disconnect', function () {
        users--;
        io.sockets.emit('broadcast', {description: users + ' users  are here!'});
        console.log("User left.");
    });
});

//Listen for connections on port 3000
http.listen(port, () => console.log("Server running on port: "+port));