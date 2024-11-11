
//callback function is the stringify data> if no errors, call the stringify data function
function generateAdvice (userScore, dealerScore, callbackFn) {
    // Check if the scores are valid integers
    const isUserScoreInteger = Number.isInteger(userScore);
    const isDealerScoreInteger = Number.isInteger(dealerScore);
    //validate the data first before generating the advice
    const isUserScoreValid = isUserScoreInteger && userScore >= 1 && userScore <= 21;
    const isDealerScoreValid = isDealerScoreInteger && dealerScore >= 1 && dealerScore <= 11;

    let move = "Hit" //initialize move variable for later use in getting advice
    if (!isUserScoreValid && !isDealerScoreValid) {
        // Both scores are invalid, call the callback function with the error
        callbackFn("Invalid scores provided");
    }
    if (!isUserScoreValid) {
        // If user score is invalid, set it to 14 by default
        userScore = 14;
    }
    if (!isDealerScoreValid) {
        // If dealer score is invalid, set it to 6 by default
        dealerScore = 6;
    }

    //grab userscore and dealerscore and use table to generate correct advice
    if (userScore >=17 && userScore <=21) {
        move = "Stay"
    }
    else if (userScore >=13 && userScore <=16){
        if (dealerScore>=2 && dealerScore <=5) {
            move = "Stay"
        }else {
            move = "Hit"
        }
    }
    else if (userScore >=4 && userScore <=12){
        move = "Hit"
    }

    callbackFn(move); //call the callback function with the correct move
}

//Records and increments counter each time a quote is served
function recordOutcome(result, callbackfn) {
    // Include file handler
    const fs = require('fs');
    // Set up file path
    const path = './gameResults.json';
    // Initialize stats object with default values
    let stats = { wins: 0, losses: 0, pushes: 0 };

    // Read the JSON file to get the current stats
    fs.readFile(path, 'utf8', (err, data) => {
        if (!err && data) {
            try {
                // Parse the JSON data if the file exists and has content
                stats = JSON.parse(data);
            } catch (parseErr) {
                console.error("Error parsing JSON data:", parseErr);
                return callbackfn({ status: "Error", message: "Invalid JSON data" });
            }
        } else if (err && err.code !== 'ENOENT') {
            // If there's an error other than file not found, return an error
            return callbackfn({ status: "Error", message: "Could not read file" });
        }

        // Increment the appropriate outcome counter based on the result
        if (result === 'Win') stats.wins++;
        else if (result === 'Loss') stats.losses++;
        else if (result === 'Push') stats.pushes++;
        else {
            // Return an error for invalid result values
            return callbackfn({ status: "Error", message: "Invalid result value" });
        }

        // Write the updated stats back to the JSON file
        fs.writeFile(path, JSON.stringify(stats, null, 2), (writeErr) => {
            if (writeErr) {
                console.error("Error writing to file:", writeErr);
                return callbackfn({ status: "Error", message: "Could not update stats" });
            }
        });
    });
    // Return the updated stats in the callback
    callbackfn({
        status: "Success",
        content: stats
    });
}


module.exports = {generateAdvice, recordOutcome};


