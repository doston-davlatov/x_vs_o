const menuScreen = document.getElementById("menuScreen");
const aiMenu = document.getElementById("aiMenu");
const gameWrapper = document.getElementById("gameWrapper");

const btnRef = document.querySelectorAll(".button-option");
const popupRef = document.querySelector(".popup");
const newgameBtn = document.getElementById("new-game");
const restartBtn = document.getElementById("restart");
const msgRef = document.getElementById("message");

let winningPattern = [
  [0, 1, 2], [0, 3, 6], [2, 5, 8],
  [6, 7, 8], [3, 4, 5], [1, 4, 7],
  [0, 4, 8], [2, 4, 6],
];

let xTurn = true;
let count = 0;
let gameMode = "friend";

function showAIMenu() {
  menuScreen.classList.add("hide");
  aiMenu.classList.remove("hide");
}

function backToMainMenu() {
  aiMenu.classList.add("hide");
  menuScreen.classList.remove("hide");
}

function startGame(mode) {
  gameMode = mode;
  menuScreen.classList.add("hide");
  aiMenu.classList.add("hide");
  gameWrapper.classList.remove("hide");
  enableButtons();
}

// ==== O‘yin logikasi ====

const disableButtons = () => {
  btnRef.forEach((el) => (el.disabled = true));
  popupRef.classList.remove("hide");
};

const enableButtons = () => {
  btnRef.forEach((el) => {
    el.innerText = "";
    el.disabled = false;
  });
  popupRef.classList.add("hide");
  count = 0;
  xTurn = true;
};

const winFunction = (letter) => {
  disableButtons();
  msgRef.innerHTML = `🎉<br> ' ${letter} ' G'alaba qozondi`;
};

const drawFunction = () => {
  disableButtons();
  msgRef.innerHTML = "😎<br> Durang";
};

const winChecker = () => {
  for (let pattern of winningPattern) {
    let [a, b, c] = [btnRef[pattern[0]], btnRef[pattern[1]], btnRef[pattern[2]]];
    if (a.innerText && a.innerText === b.innerText && a.innerText === c.innerText) {
      winFunction(a.innerText);
      return true;
    }
  }
  return false;
};

// X / O bosish logikasi
btnRef.forEach((el) => {
  el.addEventListener("click", () => {
    if (el.innerText !== "") return;

    if (gameMode === "friend") {
      el.innerText = xTurn ? "X" : "O";
      el.style.color = "#ffffff";
      xTurn = !xTurn;
    } else {
      el.innerText = "X";
      el.disabled = true;
      setTimeout(() => makeAIMove(), 500); // AI harakati
    }

    count++;
    if (count === 9 && !winChecker()) {
      drawFunction();
    } else {
      winChecker();
    }
  });
});

const makeAIMove = () => {
  if (gameMode === "easy") {
    let available = [...btnRef].filter((b) => b.innerText === "");
    let random = available[Math.floor(Math.random() * available.length)];
    if (random) {
      random.innerText = "O";
      random.disabled = true;
      count++;
      if (count === 9 && !winChecker()) drawFunction();
      else winChecker();
    }
  }
};

// restart
newgameBtn.addEventListener("click", enableButtons);
restartBtn.addEventListener("click", enableButtons);
