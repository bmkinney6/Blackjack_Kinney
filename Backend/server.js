//Author: Brad Kinney
//Description: This demo app demonstrates the use of modules, routes and database operations using the Express.js framework

var express = require('express');
var routes = require('./routes.js');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

//Get access to request body for POST requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Apply CORS to allow cross-origin access
app.use(cors());

//use routes module for the username, players, and highscores
app.use('/', routes);


//Listen for connections on port 3000
app.listen(port, () => console.log("Server running on port: "+port));