const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

// Game variables
let balls = [
    { x: canvas.width / 2, y: canvas.height - 30, dx: 4, dy: -4, radius: 10 }
];
let paddleHeight = 10;
let paddleWidth = 100;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

// Bricks
const brickRowCountBase = 3;
const brickColumnCountBase = 5;
let bricks = [];
let level = 1;

// Score
let score = 0;
let totalBricks = 0;

// Event listeners
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

// Initialize bricks
function initBricks() {
    let brickRowCount = brickRowCountBase + level - 1;
    let brickColumnCount = brickColumnCountBase + level - 1;
    bricks = [];
    totalBricks = 0;

    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            if (Math.random() > 0.3) { // Randomize bricks
                bricks[c][r] = { x: 0, y: 0, status: 1 };
                totalBricks++;
            } else {
                bricks[c][r] = { status: 0 }; // Empty brick
            }
        }
    }
}

// Draw bricks
function drawBricks() {
    const brickWidth = 75;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 35;

    for (let c = 0; c < bricks.length; c++) {
        for (let r = 0; r < bricks[c].length; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#ffeb3b";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Draw paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight - 10, paddleWidth, paddleHeight);
    ctx.fillStyle = "#1e90ff";
    ctx.fill();
    ctx.closePath();
}

// Draw balls
function drawBalls() {
    balls.forEach((ball) => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#ff7f50";
        ctx.fill();
        ctx.closePath();
    });
}

// Draw score and level
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(`Score: ${score}`, 8, 20);
    ctx.fillText(`Level: ${level}`, 8, 40);
}

// Update game elements
function update() {
    // Ball movement
    balls.forEach((ball, index) => {
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Ball collision with walls
        if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
            ball.dx = -ball.dx;
        }
        if (ball.y - ball.radius < 0) {
            ball.dy = -ball.dy;
        } else if (ball.y + ball.radius > canvas.height) {
            // Remove ball if it falls off screen
            balls.splice(index, 1);
        }

        // Ball collision with paddle
        if (
            ball.y + ball.radius > canvas.height - paddleHeight - 10 &&
            ball.x > paddleX &&
            ball.x < paddleX + paddleWidth
        ) {
            ball.dy = -ball.dy;
        }

        // Ball collision with bricks
        for (let c = 0; c < bricks.length; c++) {
            for (let r = 0; r < bricks[c].length; r++) {
                let b = bricks[c][r];
                if (b.status === 1) {
                    if (
                        ball.x > b.x &&
                        ball.x < b.x + 75 &&
                        ball.y > b.y &&
                        ball.y < b.y + 20
                    ) {
                        ball.dy = -ball.dy;
                        b.status = 0;
                        score++;
                        totalBricks--;
                        if (totalBricks === 0) {
                            nextLevel();
                        }
                    }
                }
            }
        }
    });

    // Paddle movement
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    // Game over condition
    if (balls.length === 0) {
        alert("Game Over! Try Again.");
        document.location.reload();
    }
}

// Advance to next level
function nextLevel() {
    level++;
    balls.push({ x: canvas.width / 2, y: canvas.height - 30, dx: 4 + level, dy: -4 - level, radius: 10 });
    paddleWidth = Math.max(50, paddleWidth - 10); // Shrink paddle width
    initBricks();
}

// Draw game
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBalls();
    drawPaddle();
    drawScore();
    update();
    requestAnimationFrame(draw);
}

// Start game
initBricks();
draw();
