// Modal window --- Instructions---
const modalOpen = document.querySelectorAll(".modal-open");
const modalClose = document.querySelectorAll(".modal-close");
const modal = document.querySelector(".modal-wrapper");

modalOpen.forEach(modalO =>
	modalO.addEventListener("click", () => {
		modal.classList.add("show");
	})
);
modalClose.forEach(modalC =>
	modalC.addEventListener("click", () => {
		modal.classList.remove("show");
	})
);

// Update and display current year in footer
document
	.querySelector(".date")
	.appendChild(document.createTextNode(new Date().getFullYear()));

// !!!!!!!Game code below!!!!!!!!!!

// Element Selectors
const menu = document.querySelector("#menu");
const countdown = document.querySelector("#countdown-container");
const startGameBtn = document.querySelector("#start-game-btn");
const levelBtn = document.querySelector("#level");
const resetBtn = document.querySelector("#reset");
const score = document.querySelector("#score");
const timer = document.querySelector("#timer");
const lives = document.querySelector("#lives");
const countdownTimer = document.querySelector("#countdown");
const soundsPlayer = document.querySelectorAll(".sound");
const pads = document.querySelectorAll(".cell");

// Initial Settings
score.textContent = "Score = 0";
timer.textContent = "Time = 00:00:00";
lives.textContent = "Lives = 5";

let currentScore = 0;
let currentLives = 5;
let count = 3;
let gameArray = [];
let userArray = [];
let level = 1;
let soundDelay = 1000;

// Functions
function validateUserInput() {
	for (let i = 0; i < gameArray.length; i++) {
		if (gameArray[i] !== userArray[i]) {
			return false;
		}
	}
	return true;
}

function handleSequenceCompletion() {
	if (validateUserInput()) {
		currentScore++;
		score.textContent = "Score = " + currentScore;
	} else {
		currentLives--;
		lives.textContent = "Lives = " + currentLives;
		if (currentLives <= 0) {
			endGame();
		}
	}
	nextSequence();
}

function endGame() {
	alert("Game Over! Your score is: " + currentScore);
	location.reload();
}

function playGameSequence() {
	let index = 0;
	const interval = setInterval(function () {
		if (index === gameArray.length) {
			clearInterval(interval);
			return;
		}

		let padIndex = gameArray[index] - 1;

		if (padIndex >= 0 && padIndex < pads.length) {
			pads[padIndex].classList.add("active");
			soundsPlayer[padIndex].play();

			setTimeout(() => {
				if (padIndex >= 0 && padIndex < pads.length) {
					// Adding this check for safety
					pads[padIndex].classList.remove("active");
				}
			}, soundDelay / 2);
		}

		index++;
	}, soundDelay);
}

function createGameArray() {
	for (let i = 0; i < 7; i++) {
		let soundNum = Math.trunc(Math.random() * 12) + 1;
		gameArray.push(soundNum);
	}
}

function nextSequence() {
	userArray = [];
	gameArray = [];
	createGameArray();
	playGameSequence();
}

function initializeGame() {
	currentScore = 0;
	currentLives = 5;
	level = 1;
	soundDelay = 1000;
	score.textContent = "Score = " + currentScore;
	lives.textContent = "Lives = " + currentLives;
}

function getUserArray(event) {
	const currentPad = event.currentTarget;
	const userClick = currentPad.innerText;
	if (userArray.length < 7) {
		userArray.push(+userClick);
	}
	if (userArray.length === 7) {
		handleSequenceCompletion();
	}
}

function startCountdownTimer() {
	const interval = setInterval(function () {
		if (count === 0) {
			clearInterval(interval);
			countdown.style.display = "none"; // Hide countdown
			menu.style.display = "none"; // Hide menu
			// Add logic to show the game area, if it's hidden
			nextSequence();
		} else {
			countdownTimer.innerText = count;
			count--;
		}
	}, 1000);
}

function setPadListener() {
	pads.forEach(pad => {
		pad.addEventListener("click", getUserArray);
	});
}

// Event Listeners
startGameBtn.addEventListener("click", () => {
	countdown.style.display = "block";
	startCountdownTimer();
});

resetBtn.addEventListener("click", () => {
	userArray = [];
	nextSequence();
});

levelBtn.addEventListener("click", () => {
	level++;
	soundDelay *= 0.9;
});

window.addEventListener("load", () => {
	pads.forEach((pad, index) => {
		pad.addEventListener("click", () => {
			soundsPlayer[index].currentTime = 0;
			soundsPlayer[index].play();
		});
	});

	// Preload sounds
	soundsPlayer.forEach(sound => {
		sound.load();
	});
});
