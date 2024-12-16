const choices = ["✊", "✋", "✌️"];
const playerScoreElement = document.getElementById("player-score");
const botScoreElement = document.getElementById("bot-score");
const resultDisplay = document.getElementById("result-display");
const playerChoiceDisplay = document.getElementById("player-choice");
const botChoiceDisplay = document.getElementById("bot-choice");

let playerScore = 0;
let botScore = 0;

// Handle player choice
document.querySelectorAll(".choice").forEach((button) => {
    button.addEventListener("click", () => {
        const playerChoice = button.innerText;
        const botChoice = getBotChoice();

        playerChoiceDisplay.textContent = playerChoice;
        botChoiceDisplay.textContent = botChoice;

        const result = determineWinner(playerChoice, botChoice);
        displayResult(result);
    });
});

// Get random bot choice
function getBotChoice() {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

// Determine winner
function determineWinner(player, bot) {
    if (player === bot) {
        return "draw";
    }

    if (
        (player === "✊" && bot === "✌️") ||
        (player === "✋" && bot === "✊") ||
        (player === "✌️" && bot === "✋")
    ) {
        playerScore++;
        return "player";
    } else {
        botScore++;
        return "bot";
    }
}

// Display result and update scores
function displayResult(result) {
    if (result === "player") {
        resultDisplay.textContent = "You Win! 🎉";
        resultDisplay.style.color = "#4CAF50";
    } else if (result === "bot") {
        resultDisplay.textContent = "Bot Wins! 🤖";
        resultDisplay.style.color = "#F44336";
    } else {
        resultDisplay.textContent = "It's a Draw! 🤝";
        resultDisplay.style.color = "#FFC107";
    }

    playerScoreElement.textContent = playerScore;
    botScoreElement.textContent = botScore;
}
