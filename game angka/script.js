let randomNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;

document.getElementById('guessBtn').addEventListener('click', function () {
    let guess = parseInt(document.getElementById('guessInput').value);
    attempts++;

    if (guess === randomNumber) {
        document.getElementById('message').textContent = `Selamat! Kamu menebak dengan benar dalam ${attempts} percobaan.`;
        document.getElementById('guessBtn').disabled = true;  // Matikan tombol setelah menang
    } else if (guess > randomNumber) {
        document.getElementById('message').textContent = 'Tebakan terlalu tinggi!';
    } else if (guess < randomNumber) {
        document.getElementById('message').textContent = 'Tebakan terlalu rendah!';
    }

    document.getElementById('attempts').textContent = `Jumlah percobaan: ${attempts}`;
});
