/////////////////////////////////////////////////////////////////////////////////
//Author: Brad Kinney
//Purpose: Sets up the Models of an MVC blackjack game
/////////////////////////////////////////////////////////////////////////////////
//models.js
//setup variables for global use

const suits = ["H","S","C","D"];	//allowable suits
const maxCardsPerSuit = 13;		//max cards per suit
const minimumBet = 100;
//card object defining setters and getters
var card = {
    _rank:0,
    _suit: '',

    //sets rank of card
    setRank: function (value) { this.rank = value; },
    //gets rank of card
    getRank: function () { return this.rank; },
    //sets suit of card
    setSuit: function (value) { this.suit = value; },
    //gets suit of card
    getSuit: function () { return this.suit; },
    //gets value of card
    getValue: function () {
        if (this.rank > 10) {
            return 10; // Face cards (Jack, Queen, King) are worth 10
        } else if (this.rank === 1) {
            return 11; // Ace can be 11 or 1 (default to 11 for now)
        } else {
            return this.rank;
        }
    }
};

//object to define a card deck
var card_deck = {
    deck: [],
    discard_deck: [], //put used cards in here
    cardsleft: 0,
    standardDeckSize: 52,
    //creates 52 cards (four suits: Hearts, Clubs, Spades, Diamonds, 13 each (Ace, 2-10, Jack, Queen, King))
    initialize: function () {
        this.deck = []; //clear the deck first if you reinitialize
        for (let i = 0;i < suits.length ;i++) { //cycles through the suits
            for (let j = 1;j < maxCardsPerSuit +1;j++) { //cycles through the values
                let tempcard = Object.create(card); //creates new card object to be stored
                tempcard.setSuit(suits[i]);
                tempcard.setRank(j);
                this.deck.push(tempcard);
            }
        }
        this.cardsleft = this.deck.length;
    },

    shuffle: function(deck) {
        for (let i = deck.length -1; i > 0; i--) { //start from end of deck and swap card with random card in the deck
            const num = Math.floor(Math.random() * (i+1)); //generates a random number between 0 and i in the deck
            [deck[i], deck[num]] = [deck[num], deck[i]]; //swaps the cards
        }
    },

    dealCard: function() {
        // If there are less than 16 cards left, shuffle the discard pile back into the deck
        if (this.cardsleft <= 16) {
            while (this.discard_deck.length > 0) {// Add the discard pile cards back into the deck
                let temp = this.discard_deck.pop(); // Take 1 card out of discard pile
                this.deck.push(temp); // Put it back into the deck pile
            }
            this.shuffle(this.deck); // Shuffle the deck with discard cards reinserted
            this.cardsleft = this.deck.length;
            addMessage("Cards Shuffled!")

            // Show updated discard pile and cards left
            showDiscard();
            showCardsLeft(this.getNumCardsLeft);
        }
        const card = this.deck.pop(); //take a card out of the deck
        this.cardsleft -=1;
        showCardsLeft(this.getNumCardsLeft()); //update the screen right away to show new number of cards in deck
        return card;
    },
    getNumCardsLeft: function() {
        return this.cardsleft;
    },

    getDiscard: function() {
        return this.discard_deck.length;
    },
    resetDiscard: function() { //resets the discard pile (used when resetting the game)
        this.discard_deck.length = 0;
        showDiscard();
    }
};

//object defining a players hand
var hand = {
    cards: [],
    score: 0,
    aceHighScore: 0,
    firstcard: 0,

    addCard: function(card) {
        this.cards.push(card); //adds the card to the hand of the player
        this.setScore(card.getValue()); //add the score of the card
    },

    //setscore uses some of Prof. Nwanze's code
    setScore: function(value) {
        this.score += value;
        this.aceHighScore += value; //used to keep track of aces score in hand
        if ((value=== 1) && (this.aceHighScore <= 11)) { //add another 10 if the ace score will be less than 21 to maximize score
            this.aceHighScore += 10;
        }
        else {//otherwise use the ace as a 1
            this.aceHighScore = this.score;
        }
    },

    getScore: function() {
        return this.aceHighScore>this.score? this.aceHighScore:this.score;
    },

    reset: function() {
        // Move all cards from hand to discard deck
        while (this.cards.length > 0) {
            const card = this.cards.pop();// Remove card from hand
            blackjack.carddeck.discard_deck.push(card); // Add it to the discard pile
        }
        this.score = 0; //reset the score
        showDiscard(card_deck.getDiscard()); //update the discard count
        resetView(); //clears dealer board and the player board, as well as the messages board

    }

};

//accounting model object for a player
var wallet = {
    value: 0,

    setValue: function(amount) {
        this.value = amount; //sets the value to the amount passed in
    },

    getValue: function() {
        return this.value; //returns value of player's wallet
    },

    addValue: function(amount) {
        this.value += amount; //adds the amount to the value when user wins hand
        getPlayer_money(this.getValue());
    },

    decrementValue: function(amount) {
        this.value -= amount; //subtracts value when the user loses the hand
        getPlayer_money(this.getValue());

    }
};

//model for defining a user in the game
var user = {
    userhand: Object.create(hand), //creates hand for the user to store cards
    userBet: 100,
    userWallet: Object.create(wallet), //creates wallet for the user to store money

    setUserBet: function(amount) {
        this.userBet = amount;
    },
    getUserBet: function() {
        return this.userBet;
    },

    initialize: function () {
        this.userWallet.setValue(1000); //initialize the users wallet to 1000
    }
};

//blackjack game model
var blackjack = {
    carddeck: Object.create(card_deck), //creates deck for the game
    dealer: Object.create(hand), //creates a hand for the dealer
    player: Object.create(user), //creates a player for the user (has hand in the user object)
    dealersHitLimit: 16,
    //Initializes a blackjack game (creates a deck, shuffles the deck, gets the users's chips ready)
    initialize: function () {
        this.carddeck.initialize(); //creates the deck for the game
        this.carddeck.shuffle(this.carddeck.deck); //shuffles the newly made deck to start the game
        this.player.initialize(); //initialize wallet to 1000 dollars
    },

    deal: function() {
        this.player.userhand.addCard(this.carddeck.dealCard()); //add the first card to the player hand
        showPlayerCard(this.player);//shows the player card on the board
        this.dealer.addCard(this.carddeck.dealCard()); //add the first card to the dealer hand
        showDealerCard(this.dealer, false); //second card always dealt face down (will flip later)
        this.dealer.firstcard = this.dealer.cards[1]; //keep track of dealers first card for advice server
        console.log(this.dealer.firstcard);
        this.player.userhand.addCard(this.carddeck.dealCard()); //add the second card to the player hand
        showPlayerCard(this.player);
        this.dealer.addCard(this.carddeck.dealCard()); //add the second card to the dealer hand
        showDealerCard(this.dealer, true); //second card always dealt face down (will flip later)
        showCardsLeft(this.carddeck.getNumCardsLeft()); //get cards left after initial deal
        showdealerScore();
        gamePlay.isGameOver(); //check to see if the player wins after the initial deal
    },

    hit: function() {
        if(this.player.userhand.getScore() < 21) { //if the players score is < 21, allow them to hit
            this.player.userhand.addCard(this.carddeck.dealCard()); //deals player card into their hand object
            showPlayerCard(this.player);//shows the new card on the table
            showCardsLeft(this.carddeck.getNumCardsLeft()); //show new number cards left in deck
            if (blackjack.didPlayerBust()) {
                gamePlay.outcome = "Lose"
                addMessage("Player busted! Wait for board to clear to play again!");
                blackjack.player.userWallet.decrementValue(blackjack.player.getUserBet()); //decrease wallet if player loses
                getPlayer_money(this.player.userWallet.value); //show the new value
                gamePlay.NewRound(); //get board ready for new round
            } else if (blackjack.didPlayerGetTwentyOne()) {
                gamePlay.outcome = "Win"
                addMessage("You hit 21! Wait for board to clear to play again!");
                blackjack.player.userWallet.addValue(blackjack.player.getUserBet());//add wallet if player wins
                getPlayer_money(this.player.userWallet.value); //show the new value
                gamePlay.NewRound(); //get board ready for new round
            }
        }

    },

    didPlayerBust: function() {
        return this.player.userhand.getScore() > 21;
    },

    didPlayerGetTwentyOne: function() {
        return this.player.userhand.getScore() === 21;
    },

    dealerplay: function() { //function for the automatic dealer play once the player stands
        hideDiv('facedown');// hideDiv('facedown');//hide the div that is facedown so i can display it faceup in dealerplay function
        addMessage("Dealer's Turn");
        showDealerCard(this.dealer, false); //flip the second card that was initially dealt
        while (this.dealer.getScore() < 17) { //dealer hits until 17
            this.dealer.addCard(this.carddeck.dealCard()); //add the card to dealer's hand object
            showDealerCard(this.dealer, false); //show the card
        }
        //Compare scores after the dealer is done dealing
        if(this.dealer.getScore() > 21 || this.player.userhand.getScore() > this.dealer.getScore()) {
            addMessage("You Win! Wait for board to clear to play again!")
            gamePlay.outcome = "Win";
            this.player.userWallet.addValue(this.player.userBet); //add bet value to wallet if they win the hand
            getPlayer_money(this.player.userWallet.value); //show the new value
            gamePlay.NewRound();
            return true;
        } else if(this.dealer.getScore() === this.player.userhand.getScore()){
            addMessage("Push! Wait for board to clear to play again!")
            gamePlay.outcome = "Push";
            gamePlay.NewRound();
            return true;
        } else{
            addMessage("You lose! Wait for board to clear to play again!")
            gamePlay.outcome = "Lose";
            this.player.userWallet.decrementValue(this.player.userBet); //otherwise, subtract it
            getPlayer_money(this.player.userWallet.value);
            gamePlay.NewRound();
            return true;
        }

    },

    getRemoteAdvice: function(type) {
        //get scores so they can be sent to the server for advice
        const userScore = blackjack.player.userhand.getScore();
        const dealerScore = blackjack.dealer.cards[1].getValue();
        const url = `http://127.0.0.1:3000/?userscore=${userScore}&dealerscore=${dealerScore}`;

        if(type==='XML') {
            const xhr = new XMLHttpRequest(); //new xhr object to make the request
            xhr.open('GET', url);
            xhr.send();
            console.log(xhr);
            xhr.onreadystatechange = function () {
                if (xhr.status !== 200) { //if there is an error, catch the error-> instruct user to try again
                    addMessage(`Error ${xhr.status}: ${xhr.statusText} please try again.`);
                    console.log("Error. Please try again.");
                } else { //otherwise return the advice for the user
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        myData = JSON.parse(xhr.responseText);
                        const advice = myData.content.Advice;
                        addMessage(`XML Advice: ` + advice);
                        blackjack.Trigger_Action(advice); //function will call the function to hit or stay based on the advice given
                    }
                }
            }
        } else if (type ==='FetchAPI') {
            const myFetchParams = {
                method: 'GET',
                mode: 'cors',//using cors to allow different origin calls
                referrerPolicy: 'origin',
                cache: 'default'
            };

            let myFetchRequestURL = new Request(url);

            fetch(myFetchRequestURL,myFetchParams)
                .then(response => {
                    return response.json(); //get the response back in the form of JSON object
                })
                .then(data => { //then, parse the data to extract the advice.
                    const advice = data.content.Advice;
                    addMessage("Fetch API advice: " + advice)
                    this.Trigger_Action(advice);//make the move based on the advice given
                })
                .catch(err => { //if there is an error, instruct the user to hit the button again.
                    console.log("Error");
                    addMessage("Fetch API error, please try again!")
                    console.log(err);
                });
        } else if (type==="JQuery") {
            $.get(url, function(data) { //request the data with jquery
                const advice = data.content.Advice; //parse the data for the advice section, and sa
                addMessage("JQuery Advice: " + advice);
                blackjack.Trigger_Action(advice);//make the move based on the advice given
            }).fail(function() {
                console.error("jquery error");
                addMessage("JQuery error, please try again.")
            })
        }

    },
    //function is used to call the right function call based on the advice from the server.
    Trigger_Action: function(advice) {
        if (advice === "Hit") {
            blackjack.hit();  // Call the hit function if the hit advice is given
        } else if (advice === "Stay") {
            blackjack.dealerplay();  // Call the stay function if the stay advice is given
        }
    }
};

