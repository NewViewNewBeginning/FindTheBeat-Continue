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

let currentScore = 0;
let currentLives = 5;
let count = 3;
let gameArray = [];
let userArray = [];
let level = 1;
let soundDelay = 1000;
let timeLeft = 10;
let gameTimerID = null;

score.textContent = "Score = 0";
timer.textContent = "Time = 00:00";
lives.textContent = "Lives = 5";

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
		nextSequence();
	} else {
		currentLives--;
		lives.textContent = "Lives = " + currentLives;
		if (currentLives <= 0) {
			endGame();
		} else {
			nextSequence(); // start the next sequence even if the player got it wrong
		}
	}
}

function endGame() {
	stopGameTimer(); // Stop the timer
	alert("Game Over! Your score is: " + currentScore);
	location.reload();
}
function resetGameTimer() {
	timeLeft = 10;
}

let isSequencePlaying = false;

function playGameSequence() {
	isSequencePlaying = true;
	let index = 0;
	const interval = setInterval(function () {
		if (index === gameArray.length) {
			clearInterval(interval);
			isSequencePlaying = false;
			setTimeout(startGameTimer, soundDelay);
			return;
		}

		let padIndex = gameArray[index] - 1;

		if (padIndex >= 0 && padIndex < pads.length) {
			pads[padIndex].classList.add("active");
			soundsPlayer[padIndex].play();

			setTimeout(() => {
				if (padIndex >= 0 && padIndex < pads.length) {
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
	resetGameTimer();
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

let gameTimer;
let startTime;

function startGameTimer() {
	if (gameTimerID) {
		clearInterval(gameTimerID); // Clear previous timer if any
	}

	gameTimerID = setInterval(function () {
		// Format time as MM:SS
		const minutes = Math.floor(timeLeft / 60);
		const seconds = timeLeft % 60;
		timer.textContent = `Time = ${String(minutes).padStart(2, "0")}:${String(
			seconds
		).padStart(2, "0")}`;

		if (timeLeft <= 0) {
			clearInterval(gameTimerID); // Stop the timer
			currentLives--;
			lives.textContent = "Lives = " + currentLives;
			if (currentLives <= 0) {
				endGame();
			} else {
				nextSequence(); // start the next sequence even if time's up
			}
		} else {
			timeLeft--;
		}
	}, 1000);
}

function stopGameTimer() {
	clearInterval(gameTimer);
}

function startCountdownTimer() {
	const interval = setInterval(function () {
		if (count === 0) {
			clearInterval(interval);
			countdown.style.display = "none"; // Hide countdown
			menu.style.display = "none"; // Hide menu
			startGameTimer(); // Start game timer here
			nextSequence();
		} else {
			countdownTimer.innerText = count;
			count--;
		}
	}, 1000);
}

function resetGameTimer() {
	timeLeft = 10;
	if (gameTimerID) {
		clearInterval(gameTimerID); // Clear previous timer if any
	}
	timer.textContent = `Time = ${String(Math.floor(timeLeft / 60)).padStart(
		2,
		"0"
	)}:${String(timeLeft % 60).padStart(2, "0")}`;
}

startGameBtn.addEventListener("click", () => {
	countdown.style.display = "block";
	initializeGame();
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

	soundsPlayer.forEach(sound => {
		sound.load();
	});
});

function startUserInputTimer() {
	sequenceTimer = setTimeout(function () {
		handleSequenceCompletion();
	}, soundDelay * gameArray.length + 10000);
}

function handleUserInput() {
	if (userArray.length === gameArray.length) {
		clearTimeout(sequenceTimer);
		handleSequenceCompletion();
	}
}

function getUserArray(event) {
	if (isSequencePlaying) return; // Do nothing if sequence is currently playing

	const currentPad = event.currentTarget;
	userClick = currentPad.innerText;
	userArray.push(+userClick);
	handleUserInput();
}
