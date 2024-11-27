$.get('http://localhost:3000/highscores', function(data) {
    // Ensure that data is an array and iterate over it to display each score
    console.log("getting scores");
    var table = document.getElementById("LeaderBoard"); //access the message div in html

    //Clear the table everytime it loads to prevent scores being added everytime on load
    table.innerHTML = '';
    data.forEach(record=> {
        // Make sure scoreRecord has 'username' and 'score'
        const row = document.createElement("tr");

        const usernameCell = document.createElement("td");
        usernameCell.textContent = record.username;
        row.appendChild(usernameCell);

        const scoreCell = document.createElement("td");
        scoreCell.textContent = record.score;
        row.appendChild(scoreCell);

        table.appendChild(row);
    });

}).fail(function() {
    console.log("Error retrieving scores.");
});

