const grid = document.getElementById("grid");
const levelDisplay = document.getElementById("level-display");
const scoreDisplay = document.getElementById("score-display");

const width = 8;
const candyColors = ["red", "yellow", "blue", "green", "purple"];
let board = [];
let score = 0;
let level = 1;
const scoreToNextLevel = 200;

// Initialize board
function createBoard() {
    for (let i = 0; i < width * width; i++) {
        const candy = document.createElement("div");
        candy.classList.add("candy");
        candy.classList.add(getRandomColor());
        candy.setAttribute("draggable", true);
        candy.setAttribute("id", i);
        grid.appendChild(candy);
        board.push(candy);
    }
}

function getRandomColor() {
    return candyColors[Math.floor(Math.random() * candyColors.length)];
}

// Drag and Drop events
let draggedCandy, replacedCandy, draggedCandyId, replacedCandyId;

board.forEach((candy) => {
    candy.addEventListener("dragstart", dragStart);
    candy.addEventListener("dragover", dragOver);
    candy.addEventListener("dragenter", dragEnter);
    candy.addEventListener("drop", dragDrop);
    candy.addEventListener("dragend", dragEnd);
});

function dragStart() {
    draggedCandy = this;
    draggedCandyId = parseInt(this.id);
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragDrop() {
    replacedCandy = this;
    replacedCandyId = parseInt(this.id);

    // Swap candies
    board[draggedCandyId] = replacedCandy;
    board[replacedCandyId] = draggedCandy;

    draggedCandy.id = replacedCandyId;
    replacedCandy.id = draggedCandyId;
}

function dragEnd() {
    checkMatches();
}

// Check for matches
function checkMatches() {
    // Row matches
    for (let i = 0; i < board.length - 2; i++) {
        if (
            board[i].classList.contains("blank") ||
            i % width > width - 3 // Skip edges
        )
            continue;

        const row = [i, i + 1, i + 2];
        const color = board[i].classList[1];
        if (row.every((idx) => board[idx].classList.contains(color))) {
            row.forEach((idx) => {
                board[idx].classList.remove(color);
                board[idx].classList.add("blank");
                score += 10;
            });
        }
    }

    // Column matches
    for (let i = 0; i < board.length - width * 2; i++) {
        const column = [i, i + width, i + width * 2];
        const color = board[i].classList[1];
        if (column.every((idx) => board[idx].classList.contains(color))) {
            column.forEach((idx) => {
                board[idx].classList.remove(color);
                board[idx].classList.add("blank");
                score += 10;
            });
        }
    }

    scoreDisplay.innerText = `Score: ${score}`;
    refillBoard();

    // Check level progression
    if (score >= level * scoreToNextLevel) {
        level++;
        levelDisplay.innerText = `Level: ${level}`;
    }
}

// Refill blank spaces
function refillBoard() {
    for (let i = 0; i < board.length; i++) {
        if (board[i].classList.contains("blank")) {
            const color = getRandomColor();
            board[i].classList.remove("blank");
            board[i].classList.add(color);
        }
    }
}

// Initialize game
createBoard();
