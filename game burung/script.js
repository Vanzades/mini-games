const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set game variables
let birdY = 150;
let birdVelocity = 0;
const gravity = 0.3;  // Kurangi gravitasi dari 0.6 menjadi 0.3
const jump = -7;      // Sesuaikan kecepatan lompat menjadi -7

let pipes = [];
let pipeWidth = 50;
let pipeGap = 150;
let pipeSpeed = 1.5;  // Kurangi kecepatan pipa dari 2 menjadi 1.5
let pipeSpawnInterval = 120;  // Tingkatkan interval spawn dari 90 menjadi 120
let frames = 0;

let isGameOver = false;
let score = 0;

// Event listener for jumping
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !isGameOver) {
        birdVelocity = jump;
    }
});

// Fungsi untuk memulai ulang permainan
function resetGame() {
    birdY = 150;
    birdVelocity = 0;
    pipes = [];
    frames = 0;
    score = 0;
    isGameOver = false;
    loop(); // Mulai ulang loop game
}

// Menggambar burung
function drawBird() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(50, birdY, 15, 0, Math.PI * 2);
    ctx.fill();
}

// Menggambar rintangan (pipa)
function drawPipes() {
    pipes.forEach(pipe => {
        ctx.fillStyle = 'green';
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight); // Bagian atas pipa
        ctx.fillRect(pipe.x, pipe.topHeight + pipeGap, pipeWidth, canvas.height - pipe.topHeight - pipeGap); // Bagian bawah pipa
    });
}

// Update posisi pipa dan tambahkan pipa baru
function updatePipes() {
    if (frames % pipeSpawnInterval === 0) {
        let topHeight = Math.random() * (canvas.height - pipeGap - 100) + 50;
        pipes.push({ x: canvas.width, topHeight: topHeight });
    }

    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;
    });

    pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0); // Hapus pipa yang sudah keluar dari layar
}

// Memeriksa tabrakan antara burung dan pipa
function checkCollision() {
    pipes.forEach(pipe => {
        if (50 + 15 > pipe.x && 50 - 15 < pipe.x + pipeWidth) {
            if (birdY - 15 < pipe.topHeight || birdY + 15 > pipe.topHeight + pipeGap) {
                isGameOver = true;
            }
        }
    });

    if (birdY + 15 > canvas.height || birdY - 15 < 0) {
        isGameOver = true;
    }
}

// Menggambar skor
function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

// Loop game utama
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!isGameOver) {
        // Update game
        birdVelocity += gravity;
        birdY += birdVelocity;
        updatePipes();
        checkCollision();
        drawBird();
        drawPipes();
        drawScore();

        // Hitung skor
        pipes.forEach(pipe => {
            if (pipe.x + pipeWidth === 50) {
                score++;
            }
        });

        frames++;
        requestAnimationFrame(loop);
    } else {
        // Game over screen
        ctx.fillStyle = 'red';
        ctx.font = '48px Arial';
        ctx.fillText('Game Over', canvas.width / 4, canvas.height / 2);
        ctx.font = '24px Arial';
        ctx.fillText('Tekan "Spasi" untuk mulai ulang', canvas.width / 8, canvas.height / 2 + 50);

        // Restart game when space is pressed
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                resetGame();
            }
        });
    }
}

// Mulai loop game
loop();
