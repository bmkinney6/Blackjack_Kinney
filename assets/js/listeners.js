/////////////////////////////////////////////////////////////////////////////////
//Author: Brad Kinney
//Purpose: Controls the listeners of an MVC blackjack game
/////////////////////////////////////////////////////////////////////////////////
//listeners.js
var gameInPlay = false; //initialize to false because user hasn't started game when js loads
var newgame = true //initialize new game to true


document.getElementById("reset").addEventListener("click", function() {
    gamePlay.reset();//resets the game
    card_deck.resetDiscard(); //resets discard pile
    newgame = true; //player can start a new game!
    addMessage("Board was reset!");
});

document.getElementById('betIncrement').addEventListener('click', function() {
    if (!gameInPlay) { // Cannot bet if in game
        if (blackjack.player.userWallet.getValue() > blackjack.player.userBet) {
            blackjack.player.setUserBet(blackjack.player.userBet + 100); // Increase bet by $10 or some amount
            updateBet(blackjack.player.userBet); // Update the bet display in the view
        } else {
            addMessage("Maximum bet reached!");
        }
    } else {
        addMessage("Cannot increase bet while in a game.");
    }
});

document.getElementById('betDecrement').addEventListener('click', function() {
    if (!gameInPlay) { // cannot bet in game
        if (blackjack.player.userBet > 100) {
            blackjack.player.setUserBet(blackjack.player.userBet - 100); // Decrease bet by $10, minimum bet $100
            updateBet(blackjack.player.userBet); // Update the bet display in the view
        } else {
            addMessage("Minimum bet of $100 reached!");
        }
    } else {
        addMessage("Cannot decrease bet while in a game.");
    }
});

document.getElementById('dealButton').addEventListener('click', function() {
    if (newgame && user.userBet >= 100 ) { //cannot deal cards unless you are starting a new game
        gameInPlay = true //user is now in a game once they deal
        newgame = false// game is not new anymore, prevents user from hitting deal button in game
        blackjack.deal();   // Start dealing cards to the player and dealer
    } else {
        addMessage("Cannot deal card yet! Finish current game or press \"play again\" to reset the board!");
    }
});

document.getElementById('hitButton').addEventListener('click', function() {
    if (gameInPlay && !gamePlay.isGameOver()) { //can only hit in game
        blackjack.hit();  // Deal another card to the player
    } else {
        addMessage("Cannot hit at this time.")
    }
});

document.getElementById('stayButton').addEventListener('click', function() {
    if (gameInPlay && !gamePlay.isGameOver()) { //can only stay if user is in game
        blackjack.dealerplay(); //dealer hits until 17 or busts

    } else {
        addMessage("Cannot stay at this time.")
    }
});

$('#XML').click(function() {
    if (gameInPlay && !gamePlay.isGameOver()) { // only able to press button if in a game
        blackjack.getRemoteAdvice('XML'); //call the function to request data from the server
    } else {
        addMessage("Must be in game to get advice.");
    }
});

$('#JQuery').click(function() {
    if (gameInPlay && !gamePlay.isGameOver()) { // only able to press button if in a game
        blackjack.getRemoteAdvice('JQuery'); //call the function to request data from the server
    } else {
        addMessage("Must be in game to get advice.");
    }
});

$('#FetchAPI').click(function() {
    if (gameInPlay && !gamePlay.isGameOver()) { // only able to press button if in a game
        blackjack.getRemoteAdvice('FetchAPI'); //call the function to request data from the server
    } else {
        addMessage("Must be in game to get advice.");
    }
});


