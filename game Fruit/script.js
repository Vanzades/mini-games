const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

// Game variables
let basket = { x: canvas.width / 2 - 50, y: canvas.height - 50, width: 100, height: 30 };
let fruits = [];
let fruitRadius = 15;
let fruitSpeed = 2;
let score = 0;
let level = 1;
let isGameOver = false;

// Controls
document.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    basket.x = e.clientX - rect.left - basket.width / 2;
});

// Spawn a new fruit
function spawnFruit() {
    const x = Math.random() * (canvas.width - fruitRadius * 2) + fruitRadius;
    fruits.push({ x, y: 0 });
}

// Draw basket
function drawBasket() {
    ctx.fillStyle = "#ff5733";
    ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
}

// Draw fruits
function drawFruits() {
    ctx.fillStyle = "#f1c40f";
    fruits.forEach((fruit) => {
        ctx.beginPath();
        ctx.arc(fruit.x, fruit.y, fruitRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });
}

// Update game state
function updateGame() {
    if (isGameOver) return;

    // Move fruits
    fruits.forEach((fruit) => {
        fruit.y += fruitSpeed;

        // Check if fruit is caught
        if (
            fruit.y + fruitRadius >= basket.y &&
            fruit.x >= basket.x &&
            fruit.x <= basket.x + basket.width
        ) {
            score += 10;
            fruits.splice(fruits.indexOf(fruit), 1);
        }

        // Check if fruit hits the ground
        if (fruit.y - fruitRadius > canvas.height) {
            isGameOver = true;
        }
    });

    // Level up
    if (score >= level * 50) {
        level++;
        fruitSpeed += 0.5;
    }
}

// Draw game info
function drawInfo() {
    document.getElementById("score-display").innerText = `Score: ${score}`;
    document.getElementById("level-display").innerText = `Level: ${level}`;
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBasket();
    drawFruits();
}

// Game loop
function gameLoop() {
    updateGame();
    draw();
    drawInfo();
    if (isGameOver) {
        ctx.fillStyle = "red";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2);
        return;
    }
    requestAnimationFrame(gameLoop);
}

// Start game
setInterval(spawnFruit, 1000); // Spawn a new fruit every second
gameLoop();
