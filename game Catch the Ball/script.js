const platform = document.getElementById("platform");
const ball = document.getElementById("ball");
const scoreDisplay = document.getElementById("score");
const game = document.getElementById("game");

let platformX = 150;
let ballX = Math.random() * 360;
let ballY = 0;
let score = 0;
let ballSpeed = 3;

// Update platform position on arrow key press
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" && platformX > 0) {
        platformX -= 20;
    } else if (e.key === "ArrowRight" && platformX < 300) {
        platformX += 20;
    }
    platform.style.left = platformX + "px";
});

// Game loop
function gameLoop() {
    ballY += ballSpeed;

    // Check if ball hits the platform
    if (ballY >= 580 && ballX >= platformX && ballX <= platformX + 100) {
        ballY = 0;
        ballX = Math.random() * 360;
        score += 1;
        ballSpeed += 0.2; // Increase difficulty
        scoreDisplay.textContent = `Score: ${score}`;
    }

    // Reset ball if missed
    if (ballY > 600) {
        alert(`Game Over! Your score: ${score}`);
        ballY = 0;
        ballX = Math.random() * 360;
        score = 0;
        ballSpeed = 3;
        scoreDisplay.textContent = `Score: ${score}`;
    }

    ball.style.top = ballY + "px";
    ball.style.left = ballX + "px";

    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
