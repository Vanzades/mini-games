const boardSize = 8;
let board = [];
let score = 0;
let bestScore = localStorage.getItem("bestScore") || 0;
let selectedBlock = null;
let selectedElement = null;

document.getElementById("bestScore").innerText = bestScore;

document.addEventListener("DOMContentLoaded", () => {
  createBoard();
  generateBlocks();
});

function createBoard() {
  const boardEl = document.getElementById("board");
  boardEl.innerHTML = "";
  board = [];
  for (let i = 0; i < boardSize; i++) {
    let row = [];
    for (let j = 0; j < boardSize; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener("dragover", e => e.preventDefault());
      cell.addEventListener("drop", handleDrop);
      boardEl.appendChild(cell);
      row.push({ filled: false, el: cell });
    }
    board.push(row);
  }
}

function generateBlocks() {
  const container = document.getElementById("blockChoices");
  container.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    container.appendChild(createBlock());
  }
}

function createBlock() {
  const patterns = [
    [[1,0],[1,0],[1,1]],
    [[0,1],[0,1],[1,1]],
    [[1,1,1,1]],
    [[1],[1],[1],[1]],
    [[1,1],[1,1]],
    [[1,1,0],[0,1,1]],
    [[0,1,1],[1,1,0]],
    [[0,1,0],[1,1,1]]
  ];

  const shape = patterns[Math.floor(Math.random() * patterns.length)];

  const blockEl = document.createElement("div");
  blockEl.classList.add("block-shape");
  blockEl.style.gridTemplateColumns = `repeat(${shape[0].length}, 20px)`;
  blockEl.draggable = true;
  blockEl.dataset.shape = JSON.stringify(shape);
  blockEl.addEventListener("dragstart", (e) => {
    selectedBlock = shape;
    selectedElement = blockEl;
    e.dataTransfer.setData("text/plain", "");
  });

  shape.forEach(row => {
    row.forEach(cell => {
      const cellEl = document.createElement("div");
      cellEl.classList.add("block-cell");
      if (!cell) cellEl.style.visibility = "hidden";
      cellEl.style.backgroundColor = randomColor();
      blockEl.appendChild(cellEl);
    });
  });

  return blockEl;
}

function handleDrop(e) {
  const row = parseInt(e.target.dataset.row);
  const col = parseInt(e.target.dataset.col);
  if (!selectedBlock) return;

  if (canPlaceBlock(row, col, selectedBlock)) {
    placeBlock(row, col, selectedBlock);
    selectedElement.remove();
    selectedBlock = null;
    selectedElement = null;
    updateScore(true);

    if (document.getElementById("blockChoices").children.length === 0) {
      generateBlocks();
    }
  }
}

function canPlaceBlock(startRow, startCol, shape) {
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j]) {
        const r = startRow + i;
        const c = startCol + j;
        if (r >= boardSize || c >= boardSize || board[r][c].filled) return false;
      }
    }
  }
  return true;
}

function placeBlock(startRow, startCol, shape) {
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j]) {
        const r = startRow + i;
        const c = startCol + j;
        board[r][c].filled = true;
        board[r][c].el.classList.add("filled");
      }
    }
  }
  score += 4;
  document.getElementById("currentScore").innerText = score;
}

function updateScore(fromPlacement = false) {
  let linesCleared = 0;
  for (let i = 0; i < boardSize; i++) {
    if (board[i].every(cell => cell.filled)) {
      linesCleared++;
      for (let j = 0; j < boardSize; j++) {
        board[i][j].filled = false;
        board[i][j].el.classList.remove("filled");
      }
    }
  }
  for (let j = 0; j < boardSize; j++) {
    let colFilled = true;
    for (let i = 0; i < boardSize; i++) {
      if (!board[i][j].filled) colFilled = false;
    }
    if (colFilled) {
      linesCleared++;
      for (let i = 0; i < boardSize; i++) {
        board[i][j].filled = false;
        board[i][j].el.classList.remove("filled");
      }
    }
  }

  if (linesCleared > 0) {
    let points = 0;
    if (linesCleared === 1) points = Math.floor(Math.random() * 50) + 1;
    else if (linesCleared === 2) points = Math.floor(Math.random() * 100) + 50;
    else if (linesCleared === 3) points = Math.floor(Math.random() * 200) + 150;
    else if (linesCleared === 4) points = Math.floor(Math.random() * 200) + 300;
    else if (linesCleared === 5) points = Math.floor(Math.random() * 700) + 800;

    score += points;
    document.getElementById("currentScore").innerText = score;
  }
}

function randomColor() {
  const colors = ["#f44336", "#e91e63", "#9c27b0", "#3f51b5", "#03a9f4", "#009688", "#4caf50", "#ff9800"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function startGame() {
  score = 0;
  document.getElementById("currentScore").innerText = score;
  document.getElementById("gameOver").style.display = "none";
  createBoard();
  generateBlocks();
}

function endGame() {
  document.getElementById("finalScore").innerText = score;
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("bestScore", bestScore);
  }
  document.getElementById("finalBestScore").innerText = bestScore;
  document.getElementById("gameOver").style.display = "flex";
}
