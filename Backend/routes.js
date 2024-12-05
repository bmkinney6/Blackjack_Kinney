//Author: Brad Kinney
//Description: Modified routes file for black jack game.
// cd Desktop/Fall\ 2024/Web\ Apps\ /Blackjack_Kinney/Backend
var express = require('express');
var router = express.Router();
//use database manager module
var mydb = require('./dbmgr.js');

//use the url module
const url = require('url');
const {findRec, insertRec} = require("./dbmgr");

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

    // Call findRec with a callback function
    mydb.findRec({ username: req.body.username }, function(err, result) {
        if (err) {
            // Handle error, e.g., connection failure or other DB issues
            res.status(500).json({ message: "Error finding user", error: err });
        } else if (result) {
            // If result is found, respond with the user data
            console.log("User Found. No need to create new user.")
            res.json({ message: "User found", data: result });
        } else {
            // If no user found, insert a new user record
            mydb.insertRec({ username: req.body.username, score: 0 }, function(err, result) {
                if (err) {
                    // Handle insertion error
                    console.log("Error inserting user.")
                    res.status(500).json({ message: "Error inserting user", error: err });
                } else {
                    // Successfully inserted the new user
                    console.log("User inserted.")
                    res.json({ message: "User inserted", data: result });
                }
            });
        }
    });
});


router.get('/player1', function (req, res) {
    const { username, status, wallet } = req.query;
    console.log("Received request:", { username, status, wallet });

    if (status === 'gameover') {
        var p1_score = p1_games;
        p1_games = 0;
        mydb.findRec({username}, function(err, result) {
            if (err) {
                // Handle error, e.g., connection failure or other DB issues
                res.status(500).json({ message: "Error finding user", error: err });
            } else if (!result) {
                // If no result is found, add user to the database and set their highscore to their score
                console.log("Username not found in the database. Adding user now!");
                mydb.insertRec({username, score: p1_score}, function(err, result) {
                    if (err) {
                        res.status(500).json({ message: "Error inserting user", error: err });
                    }
                    console.log("User inserted! ", result);
                })
            } else {//compare scores and update score if necessary
                const currentHighScore = result.score || 0; // Use 0 if no score exists
                console.log("Current high score:", currentHighScore, "My current score:", p1_score); //display scores in terminal
                if (p1_score > currentHighScore) {
                    console.log("New high score! Updating...");
                    mydb.updateData({ username }, { score: p1_score }, function(err, result) {
                        if (err) {
                            console.log("error updating data: ", err);
                        }
                        else {
                            console.log("data updated: ", result);
                        }
                    });
                } else {
                    console.log("No high score. No need to Update!");
                }
            }
        });

    } else {
        // Increment games played count if the game is not over
        p1_games++;
        console.log("Incremented games played:", p1_games);
    }

    // Send response back
    console.log("Player1 games played:", p1_games);
    res.send("Request processed.");
});

router.get('/player2', function (req, res) {
    const { username, status, wallet } = req.query;
    console.log("Received request:", { username, status, wallet });

    if (status === 'gameover') {
        var p2_score = p2_games;
        p2_games = 0;
        mydb.findRec({username}, function(err, result) {
            if (err) {
                // Handle error, e.g., connection failure or other DB issues
                res.status(500).json({ message: "Error finding user", error: err });
            } else if (!result) {
                // If no result is found, add user to the database and set their highscore to their score
                console.log("Username not found in the database. Adding user now!");
                mydb.insertRec({username, score: p2_score}, function(err, result) {
                    if (err) {
                        res.status(500).json({ message: "Error inserting user", error: err });
                    }
                    console.log("User inserted! ", result);
                })
            } else {//compare scores and update score if necessary
                const currentHighScore = result.score || 0; // Use 0 if no score exists
                console.log("Current high score:", currentHighScore, "My current score:", p2_score); //display scores in terminal
                if (p2_score > currentHighScore) {
                    console.log("New high score! Updating...");
                    mydb.updateData({ username }, { score: p2_score }, function(err, result) {
                        if (err) {
                            console.log("error updating data: ", err);
                        }
                        else {
                            console.log("data updated: ", result);
                        }
                    });
                } else {
                    console.log("No high score. No need to Update!");
                }
            }
        });

    } else {
        // Increment games played count if the game is not over
        p2_games++;
        console.log("Incremented games played:", p2_games);
    }

    // Send response back
    console.log("Player2 games played:", p2_games);
    res.send("Request processed.");
});


router.get('/highscores', function (req, res) {
    console.log("Requesting high scores...");
    mydb.findAll(10, function (err, result){
        if (err) {
            res.status(500).json({ message: "Error finding user", error: err });
        }
        console.log("High scores:", result);
        res.json(result); //return the data as a JSON Object
    })
});



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