let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;
let gameMode = '';

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

const buttons = document.querySelectorAll('.button-option');
const restartBtn = document.getElementById('restart');
const newGameBtn = document.getElementById('new-game');
const messageElement = document.getElementById('message');
const popup = document.querySelector('.popup');
const gameWrapper = document.getElementById('gameWrapper');
const menuScreen = document.getElementById('menuScreen');
const aiMenu = document.getElementById('aiMenu');

function startGame(mode) {
    gameMode = mode;
    gameActive = true;
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    buttons.forEach(button => {
        button.textContent = '';
        button.disabled = false;
    });
    menuScreen.classList.add('hide');
    aiMenu.classList.add('hide');
    gameWrapper.classList.remove('hide');
    popup.classList.add('hide');
    if (gameMode !== 'friend' && currentPlayer === 'O') {
        makeAIMove();
    }
}

function showAIMenu() {
    menuScreen.classList.add('hide');
    aiMenu.classList.remove('hide');
}

function handleButtonClick(event) {
    if (!gameActive) return;
    const button = event.target;
    if (button.classList.contains('button-option')) {
        const index = Array.from(buttons).indexOf(button);
        if (gameBoard[index] === '') {
            gameBoard[index] = currentPlayer;
            button.textContent = currentPlayer;
            button.disabled = true;
            if (checkWin()) {
                if (gameMode !== 'friend' && currentPlayer === 'X') {
                    showResult('Voy, siz g\'alaba qozondingiz.Qiyin darajada o\'ynashga harakat qiling!');
                } else {
                    showResult(`${currentPlayer} yutdi!`);
                }
            } else if (gameBoard.every(cell => cell !== '')) {
                showResult("Durrang!");
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                if (gameMode !== 'friend' && currentPlayer === 'O') {
                    makeAIMove();
                }
            }
        }
    }
}

function checkWin() {
    return winningCombinations.some(combination => {
        return combination.every(index => gameBoard[index] === currentPlayer);
    });
}

function showResult(message) {
    if (messageElement) {
        messageElement.textContent = message;
    }
    if (popup) {
        popup.classList.remove('hide');
    }
    gameActive = false;
}

function makeAIMove() {
    let move;
    if (gameMode === 'easy') {
        move = getRandomMove();
    } else if (gameMode === 'medium') {
        move = getMediumMove();
    } else if (gameMode === 'difficult') {
        move = getBestMove();
    }
    if (move !== -1) {
        gameBoard[move] = 'O';
        buttons[move].textContent = 'O';
        buttons[move].disabled = true;
        if (checkWin()) {
            showResult("Yutqazdingiz! Su'niy intellekt hattoki ko‘z yumib ham yutdi! 😂");
        } else if (gameBoard.every(cell => cell !== '')) {
            showResult("Durrang!");
        } else {
            currentPlayer = 'X';
        }
    }
}

function getRandomMove() {
    const emptyCells = gameBoard.reduce((acc, cell, index) => {
        if (cell === '') acc.push(index);
        return acc;
    }, []);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)] || -1;
}

function getMediumMove() {
    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = 'O';
            if (checkWin()) {
                gameBoard[i] = '';
                return i;
            }
            gameBoard[i] = '';
        }
    }
    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = 'X';
            if (checkWin()) {
                gameBoard[i] = '';
                return i;
            }
            gameBoard[i] = '';
        }
    }
    return getRandomMove();
}

function getBestMove() {
    let bestScore = -Infinity;
    let move = -1;
    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = 'O';
            let score = minimax(gameBoard, 0, false);
            gameBoard[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    if (checkWinner('O')) return 10 - depth;
    if (checkWinner('X')) return depth - 10;
    if (board.every(cell => cell !== '')) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner(player) {
    return winningCombinations.some(combination => {
        return combination.every(index => gameBoard[index] === player);
    });
}

// Event listeners with error checking
function setupEventListeners() {
    const gameContainer = document.querySelector('.container');
    if (gameContainer) {
        gameContainer.addEventListener('click', handleButtonClick);
    } else {
        console.error('Game container not found');
    }

    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            if (gameWrapper && menuScreen) {
                gameWrapper.classList.add('hide');
                menuScreen.classList.remove('hide');
                popup.classList.add('hide');
            } else {
                console.error('gameWrapper or menuScreen not found');
            }
        });
    } else {
        console.error('Restart button not found');
    }

    if (newGameBtn) {
        newGameBtn.addEventListener('click', () => {
            if (gameWrapper && menuScreen && popup) {
                gameWrapper.classList.add('hide');
                menuScreen.classList.remove('hide');
                popup.classList.add('hide');
                gameBoard = ['', '', '', '', '', '', '', '', ''];
                buttons.forEach(button => {
                    button.textContent = '';
                    button.disabled = false;
                });
                gameActive = false;
                gameMode = '';
                currentPlayer = 'X';
            } else {
                console.error('gameWrapper, menuScreen, or popup not found');
            }
        });
    } else {
        console.error('New game button not found');
    }
}

document.addEventListener('DOMContentLoaded', setupEventListeners);