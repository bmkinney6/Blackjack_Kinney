/////////////////////////////////////////////////////////////////////////////////
//Author: Brad Kinney
//Purpose: Controls the View of an MVC blackjack game
/////////////////////////////////////////////////////////////////////////////////
//view.js
//addMessage(msg) – adds a given text (msg) to the message div.


//check if a class has a given class
function hasClass(element, className) { return element.classList.contains(className);}

//adds a given class to an element if it does not have the class. Does nothing otherwise.
function addClass(element, className) {
    if (element.classList)	//if element has a class list
        element.classList.add(className);	//add class
    else if (!hasClass(element, className))	//else check if it doesn't have the class
        element.className += " " + className;
}
//removeClass(element, className) – removes a given class from an element if the class has it. Does nothing otherwise.
function removeClass(element, className) {
    if (element.classList)
        element.classList.remove(className);
}

//adds message to the message board
function addMessage(msg, type) {
    var messageDiv = document.getElementById("messagediv"); //access the message div in html

    // Create a new span for the message
    var messageSpan = document.createElement('span');
    messageSpan.className = 'message ' + type; // Set a class depending on the message type
    messageSpan.innerHTML = msg;

    // Prepend the message span to the message div so it appears at the top
    if (messageDiv !== null) {
        messageDiv.insertBefore(messageSpan, messageDiv.firstChild);  // With flex-direction: column, this shows at the top
    }

    // Scroll to the top to ensure the latest message is visible (if auto-scrolling is desired)
    messageDiv.scrollTop = 0;
}

//clearMessages – Removes all messages from the message div.
function clearMessages() {
    const messageDiv = document.getElementById("messagediv");
    if (messageDiv != null) {
        messageDiv.innerHTML = ''; //clear the message board
    }
}

// Set the username in a specific part of the game page
function setUsername(userName) {
    const usernameDiv = document.getElementById("usernameDiv");
    if (usernameDiv !== null) {
        usernameDiv.innerHTML = "User: "+userName; // Set the username
    }
}

// Resets the game view (e.g., the game board)
function resetView() {
    var gameBoard = document.getElementById("player1");
    if (gameBoard !== null) {
        gameBoard.innerHTML = ''; // Clears the player board if not already
    }
    var gameBoard = document.getElementById("Dealer_mat");
    if (gameBoard !== null) {
        gameBoard.innerHTML = ''; // Clears the dealer board if not already
    }
    clearMessages(); // Reset messages too
}

//hide a div given the div's ID
function hideDiv(divID) {
    var userDiv = document.getElementById(divID);
    if (userDiv !== null)
        userDiv.style.display = "none";
}

// Show a dealt card for the dealer with the option of displaying it faceup
function showDealerCard(dealer, facedown) {
    // Retrieve the last dealt card from the player's hand (assuming last added is the latest)
    const lastCard = dealer.cards[dealer.cards.length - 1];

    // Check if lastCard is valid
    if (!lastCard) {
        console.error('No card found in user hand.');
        return;
    }

    // If the card should be facedown, use a specific class for facedown cards, otherwise reference using suit and rank
    let cardClass = facedown ? 'facedown' : lastCard.suit + lastCard.rank;

    // Create a new div to represent the dealt card
    var cardDiv = document.createElement('div');
    cardDiv.classList.add('card_deck'); // Generic class for styling cards
    cardDiv.id = cardClass; // Set the ID to match the card's suit and rank, e.g., "H10", "D1" for Hearts 10, Diamonds Ace

    // Get the player's area to append the card (assuming an element with id 'playerCards' or 'dealerCards' exists)
    var playerArea = document.getElementById( 'Dealer_mat');

    // Append the card to the player’s area
    if (playerArea !== null) {
        playerArea.appendChild(cardDiv);
    }
    showdealerScore();
}

// Show a dealt card for a given player, this will always be faceup so no need for 2nd parameter.
//I realize the code for the two function are nearly identical, but I could not get it to work when it was together in
// one function.
function showPlayerCard(player) {
    // Retrieve the last dealt card from the player's hand (assuming last added is the latest)
    const lastCard = player.userhand.cards[player.userhand.cards.length - 1];

    // Check if lastCard is valid
    if (!lastCard) {
        console.error('No card found in user hand.');
        return;
    }

    // reference using suit and rank
    let cardClass = lastCard.suit + lastCard.rank;

    // Create a new div to represent the dealt card
    var cardDiv = document.createElement('div');
    cardDiv.classList.add('card_deck'); // Generic class for styling cards
    cardDiv.id = cardClass; // Set the ID to match the card's suit and rank, e.g., "H10", "D1"

    // Get the player's area to append the card (assuming an element with id 'playerCards' or 'dealerCards' exists)
    var playerArea = document.getElementById('player1');

    // Append the card to the player’s area
    if (playerArea !== null) {
        playerArea.appendChild(cardDiv);
    }
    showScore(); //update score on board
}

// Update the bet displayed in the view
function updateBet(bet) {
    var betDiv = document.getElementById("BetAmount");
    if (betDiv !== null) {
        betDiv.innerHTML= "Bet amount: $" + bet; // Update the bet value
    }
}

//show players money on the display
function getPlayer_money(money) {
    var betDiv = document.getElementById("player_money");
    if (betDiv !== null) {
        betDiv.innerHTML = "Money: $" + money;
    }
}

//shows how many cards are left in the deck
function showCardsLeft(left) {
    var betDiv = document.getElementById("cards_left");
    if (betDiv !== null) {
        betDiv.innerHTML = "Cards left: " + left;
    }
}

//shows how many cards are left in the discard pile
function showDiscard() {
    var betDiv = document.getElementById("discard_pile");
    if (betDiv !== null) {
        betDiv.innerHTML = "Discard pile: " + blackjack.carddeck.getDiscard();
    }
}

//shows the player score as they draw new cards
function showScore() {
    var betDiv = document.getElementById("playerscore");
    if (betDiv !== null) {
        betDiv.innerHTML = "Player 1: " + blackjack.player.userhand.getScore();
    }
}

function showdealerScore() {
    var betDiv = document.getElementById("dealer_mat_text");
    if (betDiv !== null) {
        betDiv.innerHTML = "Dealer: " + blackjack.dealer.getScore();
    }
}