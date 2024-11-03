const cards = [
    'A', 'A', 'B', 'B', 'C', 'C', 'D', 'D',
    'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'
];
let firstCard = null;
let secondCard = null;
let matchedPairs = 0;
let score = 0;
let timer;
let timeRemaining = 60;

function startGame() {
    matchedPairs = 0;
    score = 0;
    timeRemaining = 60;
    updateScore();
    updateTimer();
    createBoard();
    startTimer();
}

function createBoard() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    cards.sort(() => 0.5 - Math.random());

    cards.forEach(cardValue => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = cardValue;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

function flipCard() {
    if (this.classList.contains('flipped') || this.classList.contains('matched')) return;

    this.classList.add('flipped');
    this.textContent = this.dataset.value;

    if (!firstCard) {
        firstCard = this;
    } else {
        secondCard = this;
        checkForMatch();
    }
}

function checkForMatch() {
    if (firstCard.dataset.value === secondCard.dataset.value) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        matchedPairs++;
        score += 10; // Her eşleşme için puan ekle
        updateScore();
        resetCards();
        if (matchedPairs === cards.length / 2) {
            endGame(true);
        }
    } else {
        score -= 5; // Yanlış eşleşme için puan çıkar
        updateScore();
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            firstCard.textContent = '';
            secondCard.classList.remove('flipped');
            secondCard.textContent = '';
            resetCards();
        }, 1000);
    }
}

function resetCards() {
    firstCard = null;
    secondCard = null;
}

function updateScore() {
    document.getElementById('score').textContent = score;
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        timeRemaining--;
        updateTimer();
        if (timeRemaining <= 0) {
            endGame(false);
        }
    }, 1000);
}

function updateTimer() {
    document.getElementById('timer').textContent = timeRemaining;
}

function endGame(success) {
    clearInterval(timer);
    alert(success ? `Tebrikler! Tüm eşleşmeleri buldunuz! Skor: ${score}` : `Süre doldu! Skor: ${score}`);
    saveScore();
    displayScores();
}

function saveScore() {
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.push(score);
    localStorage.setItem('scores', JSON.stringify(scores));
}

function displayScores() {
    const scoreBoard = document.getElementById('scoreBoard');
    scoreBoard.innerHTML = '';
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.sort((a, b) => b - a); // Yüksekten düşüğe sırala

    scores.forEach(score => {
        const li = document.createElement('li');
        li.textContent = score;
        scoreBoard.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', displayScores);
