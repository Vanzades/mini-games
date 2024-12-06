const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const grid = 30; // Ukuran grid per blok
const cols = 10; // Jumlah kolom
const rows = 20; // Jumlah baris

// Papan permainan
let board = Array.from({ length: rows }, () => Array(cols).fill(0));

// Tetrominoes
let tetrominoes = [
    [[1, 1, 1, 1]], // Blok I
    [[1, 0, 0], [1, 1, 1]], // Blok L
    [[0, 0, 1], [1, 1, 1]], // Blok J
    [[1, 1], [1, 1]], // Blok O
    [[1, 1, 0], [0, 1, 1]], // Blok Z
    [[0, 1, 1], [1, 1, 0]], // Blok S
    [[0, 1, 0], [1, 1, 1]] // Blok T
];

let currentTetromino = getRandomTetromino();
let tetrominoX = 3;
let tetrominoY = 0;

// Fungsi untuk mendapatkan tetromino acak
function getRandomTetromino() {
    const randomIndex = Math.floor(Math.random() * tetrominoes.length);
    return tetrominoes[randomIndex];
}

// Fungsi untuk memutar (rotasi) tetromino
function rotateTetromino() {
    let rotatedTetromino = currentTetromino[0].map((_, index) =>
        currentTetromino.map(row => row[index])
    ).reverse();

    if (!isCollision(tetrominoX, tetrominoY, rotatedTetromino)) {
        currentTetromino = rotatedTetromino;
    }
}

// Menggambar tetromino di canvas
function drawTetromino() {
    for (let row = 0; row < currentTetromino.length; row++) {
        for (let col = 0; col < currentTetromino[row].length; col++) {
            if (currentTetromino[row][col]) {
                ctx.fillStyle = 'cyan';
                ctx.fillRect((tetrominoX + col) * grid, (tetrominoY + row) * grid, grid, grid);
                ctx.strokeRect((tetrominoX + col) * grid, (tetrominoY + row) * grid, grid, grid);
            }
        }
    }
}

// Menggambar papan permainan
function drawBoard() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (board[row][col]) {
                ctx.fillStyle = 'blue';
                ctx.fillRect(col * grid, row * grid, grid, grid);
                ctx.strokeRect(col * grid, row * grid, grid, grid);
            }
        }
    }
}

// Memeriksa apakah tetromino dapat bergerak
function isCollision(x, y, tetromino) {
    for (let row = 0; row < tetromino.length; row++) {
        for (let col = 0; col < tetromino[row].length; col++) {
            if (tetromino[row][col] && 
               (board[y + row] && board[y + row][x + col]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

// Tempatkan tetromino di papan permainan
function placeTetromino() {
    for (let row = 0; row < currentTetromino.length; row++) {
        for (let col = 0; col < currentTetromino[row].length; col++) {
            if (currentTetromino[row][col]) {
                board[tetrominoY + row][tetrominoX + col] = 1;
            }
        }
    }
}

// Menghapus baris penuh
function clearFullRows() {
    for (let row = 0; row < rows; row++) {
        if (board[row].every(cell => cell !== 0)) {
            board.splice(row, 1); // Hapus baris
            board.unshift(Array(cols).fill(0)); // Tambahkan baris kosong di atas
        }
    }
}

// Menghapus canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Memperbarui game
function updateGame() {
    clearCanvas();
    drawBoard();
    drawTetromino();

    // Gerakkan tetromino ke bawah jika tidak ada tabrakan
    if (!isCollision(tetrominoX, tetrominoY + 1, currentTetromino)) {
        tetrominoY++;
    } else {
        placeTetromino();
        clearFullRows();
        // Reset posisi tetromino dan dapatkan tetromino baru
        tetrominoY = 0;
        tetrominoX = 3;
        currentTetromino = getRandomTetromino();

        // Jika tetromino baru langsung mengalami tabrakan, game over
        if (isCollision(tetrominoX, tetrominoY, currentTetromino)) {
            alert('Game Over!');
            document.location.reload();
        }
    }
}

// Kontrol keyboard untuk menggerakkan dan memutar tetromino
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && !isCollision(tetrominoX - 1, tetrominoY, currentTetromino)) {
        tetrominoX--;
    } else if (e.key === 'ArrowRight' && !isCollision(tetrominoX + 1, tetrominoY, currentTetromino)) {
        tetrominoX++;
    } else if (e.key === 'ArrowDown') {
        if (!isCollision(tetrominoX, tetrominoY + 1, currentTetromino)) {
            tetrominoY++;
        }
    } else if (e.key === 'ArrowUp') {
        rotateTetromino();
    }
});

setInterval(updateGame, 500); // Memperbarui setiap 500ms
