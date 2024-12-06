const gameArea = document.getElementById('gameArea');
const playerCar = document.getElementById('playerCar');
const scoreDisplay = document.getElementById('score');

let gameSpeed = 5;
let level = 1;
let gameInterval;
let obstacles = [];

function startGame() {
    gameInterval = setInterval(updateGame, 20);
    createObstacle();
    document.addEventListener('keydown', movePlayer);
}

function updateGame() {
    moveObstacles();
    checkCollision();
    increaseDifficulty();
}

function movePlayer(event) {
    let leftPosition = playerCar.offsetLeft;

    if (event.key === 'ArrowLeft' && leftPosition > 0) {
        playerCar.style.left = leftPosition - 20 + 'px';
    } else if (event.key === 'ArrowRight' && leftPosition < (gameArea.offsetWidth - playerCar.offsetWidth)) {
        playerCar.style.left = leftPosition + 20 + 'px';
    }
}

function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = Math.random() * (gameArea.offsetWidth - 50) + 'px';
    gameArea.appendChild(obstacle);
    obstacles.push(obstacle);
}

function moveObstacles() {
    obstacles.forEach((obstacle, index) => {
        let topPosition = obstacle.offsetTop;

        if (topPosition > gameArea.offsetHeight) {
            obstacle.remove();
            obstacles.splice(index, 1);
            createObstacle();
        } else {
            obstacle.style.top = topPosition + gameSpeed + 'px';
        }
    });
}

function checkCollision() {
    obstacles.forEach(obstacle => {
        let obstacleRect = obstacle.getBoundingClientRect();
        let playerRect = playerCar.getBoundingClientRect();

        if (
            playerRect.left < obstacleRect.right &&
            playerRect.right > obstacleRect.left &&
            playerRect.top < obstacleRect.bottom &&
            playerRect.bottom > obstacleRect.top
        ) {
            endGame();
        }
    });
}

function increaseDifficulty() {
    if (obstacles.length % 10 === 0) {
        gameSpeed += 1;
        level += 1;
        scoreDisplay.innerText = 'Level: ' + level;
    }
}

function endGame() {
    clearInterval(gameInterval);
    alert('Game Over! Kamu mencapai Level ' + level);
    window.location.reload();
}

startGame();
