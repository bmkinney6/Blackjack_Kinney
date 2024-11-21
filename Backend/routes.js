//Author: Brad Kinney
//Description: Modified routes file for black jack game.
// cd Desktop/Fall\ 2024/Web\ Apps\ /Blackjack_Kinney/Backend
var express = require('express');
var router = express.Router();
//use database manager module
var mydb = require('./dbmgr.js');

//use the url module
const url = require('url');
const {findRec} = require("./dbmgr");

//test variables
var a = 0;
var b = 0;

//Setup database, only need to run this once. Unblock to run once then block this line again
//mydb.setup();
var p1_games = 0;
var p2_games = 0;
//BLACKJACK ROUTES
router.post('/username', function (req, res) {
    console.log("Request body username:", req.body.username);
    mydb
        .findRec(req.body)//find record of the body (returns the result)
        .then((result) => { //if the return is null, I know that I can insert the data.
            if (result) {
                // If username exists, reject the promise with the message
                console.log("Username already exists.");
                return Promise.reject("Username already exists."); // Stop further execution
            }
        })
        .then(()=> {
            // If username doesn't exist, proceed to insert the record
            return mydb.insertRec(req.body);
        })
        .catch((err) => {
            // Handle errors other than the username existing
            if (err !== "Username already exists.") {
                console.error("Error:", err);
                res.status(500).send("An error occurred while processing the request.");
            }
        });
});


router.get('/player1', function (req, res) {
    const { username, status, wallet } = req.query;
    console.log("Received request:", { username, status, wallet });

    if (status === 'gameover') {
        // Check if username exists in the database
        mydb.findRec({ username })
            .then((record) => {
                if (!record) {
                    // Handle case where user doesn't exist
                    console.log("Username not found in the database.");
                    return Promise.reject("User does not exist.");
                }

                const currentHighScore = record.score || 0; // Use 0 if no score exists
                console.log("Current high score:", currentHighScore, "My current score:", p1_games);

                // Update high score if p1_games is higher
                if (p1_games > currentHighScore) {
                    console.log("New high score! Updating...");
                    return mydb.updateData({ username }, { score: p1_games });
                } else {
                    console.log("Score is not a high score. No update required.");
                    return Promise.resolve(); // Graceful exit
                }
            })
            .then(() => {
                if (p1_games > 0) {
                    console.log("Score successfully updated or no changes made.");
                }
                p1_games = 0; // Reset games counter only after successful processing
                console.log("Games played counter reset.");
            })
            .catch((err) => {
                console.error("Error during gameover processing:", err);
            });
    } else {
        // Increment games played count for non-gameover status
        p1_games++;
        console.log("Incremented games played:", p1_games);
    }

    // Send response back
    console.log("Player1 games played:", p1_games);
    res.send("Request processed.");
});


    //count number of rounds played. (reset number after running out of money or resetting the game ->change status to gameover)
    /*
    if gameover:
        - check if the user is in the database (add thm if not)
        - check if they have a better score(most number of rounds played)
        - update the user's score if the current score is better
     */


router.get('/player2', function (req, res) {
    //accept first name, round-status(win,loss,push, gameover), and wallet amount
    //count number of rounds played. (reset number after running out of money or resetting the game ->change status to gameover)
    /*
    if gameover:
        - check if the user is in the database (add thm if not)
        - check if they have a better score(most number of rounds played)
        - update the user's score if the current score is better
     */
});

router.get('/highscores', function (req, res) {
    //respond with a jscon object containing a list of usernames and highscores
    console.log("requesting high scores: ")
    mydb.findAll(10)
        .then((data)=> {
            res.json(data);
        })
        .catch((err) =>{
            res.send(err);
        }); //get top 10 scores
    //will be used to display in index.html. (on load trigger with index.html)

});



//Demo / route to print hello
router.get('/', function (req, res) {
    res.send("Hello a is " + a + ", b  is " + b);
});

//Demo / route to print hello
// router.post('/username', function (req, res) {
//     console.log(req.body);
//     res.send("Hello a is " + a + ", b  is " + b);
// });
//
// //Demo / route to print hello
// router.get('/username', function (req, res) {
//     let myURL = url.parse(req.url, true);
//     console.log(myURL);
//     res.send("Hello we're using a get");
// });

//Demo /p1 route to insert record into the database
router.get('/p1', function (req, res) {
    a++;
    mydb.insertRec({username: 'Player1', 'score': a});
    res.send("Hello Player1! Inserting score b: " + b);
});
//Demo /p2 route to insert a different record into the database
router.get('/p2', function (req, res) {
    b++;
    mydb.insertRec({username: 'Player2', 'score': b});
    res.send("Hello Player2! Inserting score a: " + a);
});
//Demo /p3 route to find a record in the database
router.get('/p3', function (req, res) {
    mydb.findRec();
    res.send("Found 1 record");
});
//Demo /p route to find all records in the database
router.get('/p4', function (req, res) {
    mydb.findAll(0);
    res.send("Finding all records");
});
//Demo /p5 route to update record the database
router.get('/p5', function (req, res) {
    queryData = {username: 'Player1'};
    upData = {'score': 100};
    mydb.updateData(queryData, upData);
    res.send("Updating " + JSON.stringify(queryData) + " score to " + JSON.stringify(upData));
});
//Demo /p6 route to delete collection in the database
router.get('/p6', function (req, res) {
    mydb.deleteCollection();
    res.send("Deleted Collection");
});

module.exports = router;