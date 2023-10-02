// Modal window --- Instructions---
const modalOpen = document.querySelectorAll(".modal-open");
const modalClose = document.querySelectorAll(".modal-close");
const modal = document.querySelector(".modal-wrapper");

modalOpen.forEach(modalO => modalO.addEventListener("click", () => {
  modal.classList.add("show");
}));
modalClose.forEach(modalC => modalC.addEventListener("click", () => {
  modal.classList.remove("show");
}));

// Update and display current year in footer
document
  .querySelector(".date")
  .appendChild(document.createTextNode(new Date().getFullYear()));

// !!!!!!!Game code below!!!!!!!!!!

const menu = document.querySelector("#menu");
const countdown = document.querySelector("#countdown-container");
const game = document.querySelector("#game");
const startGameBtn = document.querySelector("#start-game-btn");
// const startBtn = document.querySelector('#start-btn');
const levelBtn = document.querySelector("#level");
const resetBtn = document.querySelector("#reset");
const score = document.querySelector("#score");
const timer = document.querySelector("#timer");
const lives = document.querySelector("#lives");
const countdownTimer = document.querySelector("#countdown");
const soundsPlayer = document.querySelectorAll(".sound");
const pads = document.querySelectorAll(".cell");

score.textContent = "Score = 0";
timer.textContent = "Time = 00:00:00";
lives.textContent = "Lives = 5";

let count = 3;
let gameArray = [];
let userArray = [];

function getUserArray(event) {
  const currentPad = event.currentTarget;
  userClick = currentPad.innerText;
  // console.log(userClick);
  // console.log(userArray);
  if (userArray.length < 7) {
    userArray.push(+userClick)
    // console.log(userArray);
    // console.log('click');
  } else {
    // gridCont.style.visibility = 'hidden';
    console.log('This needs to leave loop and stop playing sounds');
  }
};

function setPadListener() {
  pads.forEach(function (pad) {
    pad.addEventListener('click', getUserArray);
});
};

function createGameArray() {
	for (i = 0; i < 7; i++){
		let soundNum = Math.trunc(Math.random()*12) + 1
		gameArray.push(soundNum);
	};
};

function endCountdown() {
  countdown.style.display = "none";
  menu.style.display = "none";
  /*game.style.display = "block";*/
}

function handleCountdownTimer() {
  if (count === 0) {
    clearInterval(timer);
    endCountdown();
  } else {
    countdownTimer.innerText = count;
    count--;
  }
}

function startCountdownTimer() {
  setInterval(function() { handleCountdownTimer(count); }, 1000);
}

function startGame() {
  startCountdownTimer();
  createGameArray();
  setPadListener();
}

// Event Listeners
startGameBtn.addEventListener('click', function () {
  // menu.style.display = 'none';
  countdown.style.display = 'block';
  // game.style.display = 'none';
  startGame();
});

// load sounds for the pads 
window.addEventListener("load", () => {

  pads.forEach((pad, index) => {
      pad.addEventListener("click", function () {
          soundsPlayer[index].currentTime = 0;
          soundsPlayer[index].play();
      });
  });
});
