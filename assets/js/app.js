/////////////////////////////////////////////////////////////////////////////////
//Author: Brad Kinney
//Purpose: Create a blackjack game using objects and an MVC design
/////////////////////////////////////////////////////////////////////////////////
//app.js
var gamePlay = {
    Blackjack: Object.create(blackjack),
    outcome: '',
    username: '',

    getUsername: function() {
        const params = new URLSearchParams(window.location.search); //gets the query string with the data in the URL
        const username = params.get('username') //Grabs the username information
        return username;
    },

    playGame: function() {
        this.Blackjack.player.initialize(); //initialize the player
        this.Blackjack.initialize(); //initialize the game
        this.username = this.getUsername();
        setUsername(this.username); //display the username
        //make post request to username to add username and initialized score
        // $.post("http://localhost:3000/username", {username: this.username}, function(result) {
        //     console.log(result)
        // });
        getPlayer_money(this.Blackjack.player.userWallet.getValue()); //display the initial bank value
        showCardsLeft(this.Blackjack.carddeck.getNumCardsLeft()); //show initial cards left
        updateBet(this.Blackjack.player.userBet) //display the minimum bet value of 100

    },

    // Method to check if the game is over
    isGameOver: function() {
        // The game ends if the player's score is greater than 21 (bust) or if the dealer finishes its play
        if (this.Blackjack.didPlayerBust()) {
            this.outcome = "Lose";
            this.Blackjack.player.userWallet.decrementValue(this.Blackjack.player.userBet); //decrement wallet if player busts
            getPlayer_money(this.Blackjack.player.userWallet.value); //update the players wallet
            blackjack.player.userBet = 100; //reset the bet to 100
            this.NewRound(); //call a new round of betting if player wins
            return true;
        } else if (this.Blackjack.didPlayerGetTwentyOne()) {
            this.outcome = "Win";
            addMessage("Congratulations! You got Blackjack!"); //message that the user won because they never hit causing the check later.
            this.Blackjack.player.userWallet.addValue(this.Blackjack.player.userBet); //increase the value to their wallet if they win
            getPlayer_money(this.Blackjack.player.userWallet.value); //show the updated value to the player
            blackjack.player.userBet = 100;
            this.NewRound(); //call a new round of betting if player wins
            return true;
        }

        return false; // Game is not over yet
    },
    NewRound: function() {
        var delayInMilliseconds = 6000;
        setTimeout(function() { //delay board reset so player has time to see result before the next round
            gameInPlay = false;
            if (blackjack.player.userWallet.getValue() === 0) {
                this.outcome = "gameover";
                addMessage("You are out of money! board is fully resetting.")
                gamePlay.reportOutcome(); //report outcome for gameover
                setTimeout(function() {gamePlay.reset()}, 4000);//reset the game completely if player runs out of money
            } else {
                blackjack.player.userhand.reset(); //reset hand at end of round
                blackjack.dealer.reset(); //reset dealer hand at the end of the deal
                newgame = true //flip sign that indicates player wants to play again, will allow player to deal more cards
                addMessage("New Round! Pick your bet, and deal!.")
                gamePlay.reportOutcome();
                showScore();
                showdealerScore();
            }
        }, delayInMilliseconds);

    },
    // Method to reset the game
    reset: function() {
        // Reset the game state
        this.outcome = "gameover";
        gamePlay.reportOutcome();//report that the game has been reset
        this.Blackjack.player.userhand.reset(); // Reset the player's hand
        this.Blackjack.dealer.reset(); // Reset the dealer's hand
        this.Blackjack.carddeck.resetDiscard(); // clear the discard deck for a full restart


        // Reset the message div and any other UI elements (bet, score, etc.)
        this.Blackjack.player.userWallet.setValue(1000); // Reset wallet if necessary
        this.Blackjack.player.userBet = 100; //reset the players bet automatically to the minimun
        clearMessages(); //clears the messages from the board
        showScore(); //show the reset score
        showdealerScore();
        resetView(); // Resets the UI to the default state

        // Start a new game
        this.playGame();
    },
    reportOutcome: function() {
        const result = gamePlay.outcome;
        const url = `http://127.0.0.1:3000/player1?username=${this.username}&status=${result}&wallet=${this.Blackjack.player.userWallet.value}`;

        $.get(url, function(data) {
            console.log(data)
        })
        // $.get(url, function(data) { //request the data with jquery
        //     const wins = data.content.wins;
        //     const losses = data.content.losses;
        //     const pushes = data.content.pushes;
        //     addMessage(`Wins: ${wins}, Losses: ${losses}, Pushes: ${pushes}`);
        // }).fail(function() {
        //     console.error("jquery error");
        //     addMessage("JQuery error, could not retrieve record.")
        // })

    }
};

//start a blackjack game
gamePlay.playGame();

