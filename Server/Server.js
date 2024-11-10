//cd Desktop/Fall\ 2024/Web\ Apps\ /Blackjack_Kinney/Server
//load HTTP module
const http = require('http');
const url = require('url');
//load blackjack advice module
const getadvice = require('./Blackjackadvice.js');

//set up server
const hostname = '127.0.0.1';
const port = 3000;

//create server fhdaf
const server = http.createServer((req, res) => {
    //setup response headers
    res.statusCode = 200;
    //set CORS header
    res.setHeader('Access-Control-Allow-Origin', '*');
    //set output type header
    res.setHeader('Content-Type', 'application/json');

    //parse the url for data sent
    const parsedUrl = url.parse(req.url, true);
    console.log('request: ', parsedUrl);
    const userscore = parseInt(parsedUrl.query.userscore, 10);
    const dealerscore = parseInt(parsedUrl.query.dealerscore, 10);

    //create call back function to format output
    let myfunc = function(advice) {
        if (!res.writableEnded) {
            res.end(JSON.stringify({
                "status": "Success",
                "content": {
                    "User's Score": userscore,
                    "Dealer's Score": dealerscore,
                    "Advice": advice
                }
            }));
        }
    };
    //get advice
    getadvice.generateAdvice(userscore, dealerscore, myfunc);
});

//start server listening
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});