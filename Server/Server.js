//cd Desktop/Fall\ 2024/Web\ Apps\ /Blackjack_Kinney/Server
//load HTTP module and URL module
const http = require('http');
const url = require('url');
//load blackjack advice module
const getadvice = require('./Blackjackadvice.js');

//set up server
const hostname = '127.0.0.1';
const port = 3000;

//create server
const server = http.createServer((req, res) => {
    //setup response headers
    res.statusCode = 200;
    //set CORS header
    res.setHeader('Access-Control-Allow-Origin', '*');
    //set output type header
    res.setHeader('Content-Type', 'application/json');

    //parse the url for data sent, including userscore, dealerscore, and outcome
    const parsedUrl = url.parse(req.url, true);
    console.log('request: ', parsedUrl);
    const userscore = parseInt(parsedUrl.query.userscore, 10);
    const dealerscore = parseInt(parsedUrl.query.dealerscore, 10);
    const result = parsedUrl.query.outcome

    //create call back function to format output
    let myfunc = function(advice) {
        if (!res.writableEnded) {
            res.end(JSON.stringify({
                "status": "Success",
                "content": {
                    "User's Score": userscore, //send back scores and advice
                    "Dealer's Score": dealerscore,
                    "Advice": advice
                }
            }));
        }
    };
    //create call back function to format output for score tracking
    let myfunc1 = function(response) {
        if (!res.writableEnded) {
            res.end(JSON.stringify({
                "status": "Success",
                "content": response
            }));
        }
    };
    //get advice
    getadvice.generateAdvice(userscore, dealerscore, myfunc);
    getadvice.recordOutcome(result, myfunc1);
});


//start server listening
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});