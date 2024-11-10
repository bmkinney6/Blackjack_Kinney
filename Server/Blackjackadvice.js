
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
        // Both scores are invalid
        callbackFn(null, null, "Invalid scores provided");

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

    callbackFn(userScore, dealerScore, move); //call the callback function with the correct move
}
function generateRecord(outcome, callbackFn) {

}


module.exports = {generateAdvice};







//Records and increments counter each time a quote is served
function countQuotes(quoteData, callbackfn) {
    //include file handler
    const fs = require('fs');
    //setup file path
    const path = './count.txt';
    //initialize counter
    let count = 1;
    let mycallback = function(err, data) {
        //if there's an error
        if (err) {
            console.error(err);
            //create a file by writing to it
            fs.writeFile(path, count, function(err, data) {
                if (err) {
                    console.error(err);
                    quoteData['served'] = count;
                    callbackfn(quoteData);
                }
            });
            return count;
        }
        //increment counter
        count = Number(data) + 1;
        fs.writeFile(path, count.toString(), function(err, data) {
            //if there's an error, log it in response
            if (err) {
                console.error(err);
                quoteData['error'] = "Error occured";
                callbackfn(quoteData);
            }
        });
        //update response
        quoteData['served'] = count;
        callbackfn(quoteData);
    }
    //read file
    fs.readFile(path, mycallback);
}
