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

let currentScore = 0;
let currentLives = 5;

let count = 3;
let gameArray = [];
let userArray = [];

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
			endGame(); // You will need to implement this later
		}
	}
	nextSequence();
}

function getUserArray(event) {
	const currentPad = event.currentTarget;
	userClick = currentPad.innerText;
	userArray.push(+userClick);

	if (userArray.length >= 7) {
		handleSequenceCompletion();
	}
}

function nextSequence() {
	userArray = [];
	gameArray = [];
	createGameArray();
	// Optionally add delay or effects before starting a new sequence.
}

function endGame() {
	// Logic to end the game, like showing an end screen or resetting the game.
	alert("Game Over! Your score is: " + currentScore);
	location.reload(); // This will refresh the page. Consider a better approach, like resetting game variables and UI.
}

resetBtn.addEventListener("click", function () {
	userArray = [];
	nextSequence();
});

let level = 1;
let soundDelay = 1000; // 1 second for simplicity. Adjust accordingly.

levelBtn.addEventListener("click", function () {
	level++;
	soundDelay *= 0.9; // Reduces delay by 10%.
});

function getUserArray(event) {
	const currentPad = event.currentTarget;
	userClick = currentPad.innerText;

	if (userArray.length < 7) {
		userArray.push(+userClick);
	} else {
	}
}

function setPadListener() {
	pads.forEach(function (pad) {
		pad.addEventListener("click", getUserArray);
	});
}

function createGameArray() {
	for (i = 0; i < 7; i++) {
		let soundNum = Math.trunc(Math.random() * 12) + 1;
		gameArray.push(soundNum);
	}
}

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
	setInterval(function () {
		handleCountdownTimer(count);
	}, 1000);
}

function startGame() {
	startCountdownTimer();
	createGameArray();
	setPadListener();
}

// Event Listeners
startGameBtn.addEventListener("click", function () {
	// menu.style.display = 'none';
	countdown.style.display = "block";
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

function playGameSequence() {
	let index = 0;
	const interval = setInterval(function () {
		pads[gameArray[index] - 1].classList.add("active"); // Assuming 'active' class changes appearance.
		soundsPlayer[gameArray[index] - 1].play();
		setTimeout(() => {
			pads[gameArray[index] - 1].classList.remove("active");
		}, soundDelay / 2); // Half of delay for deactivating.

		index++;
		if (index === gameArray.length) {
			clearInterval(interval);
		}
	}, soundDelay);
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
	// Any other initialization if needed.
}
function startGame() {
	initializeGame();
	startCountdownTimer();
	nextSequence();
}
