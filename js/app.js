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
let sequenceTimer = null;

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
	console.log("Inside handleSequenceCompletion. Comparing sequences.");

	console.log("Expected sequence:", gameArray);
	console.log("User sequence:", userArray);

	// Only check if the lengths are the same for safety reasons
	if (userArray.length !== gameArray.length) {
		console.log("User input is incomplete.");
		return;
	}

	if (validateUserInput()) {
		console.log("User input is correct. Proceeding to the next sequence.");
		currentScore++;
		currentLives++;
		score.textContent = "Score = " + currentScore;
		lives.textContent = "Lives = " + currentLives;

		resetGameTimer();
		nextSequence();
	} else {
		console.log(
			"User input is incorrect. Reducing life and proceeding to the next sequence."
		);
		currentLives--;
		lives.textContent = "Lives = " + currentLives;

		if (currentLives <= 0) {
			endGame();
		} else {
			resetGameTimer();
			nextSequence();
		}
	}
}

function endGame() {
	stopGameTimer(); // Stop the timer
	alert("Game Over! Your score is: " + currentScore);
	location.reload();
}
function resetGameTimer() {
	timeLeft = 5;
}

let isSequencePlaying = false;

function playGameSequence() {
	isSequencePlaying = true;
	let index = 0;
	const interval = setInterval(function () {
		if (index === gameArray.length) {
			clearInterval(interval);
			isSequencePlaying = false;
			setTimeout(() => {
				startGameTimer();
				startUserInputTimer(); // Start the user input timer
			}, soundDelay);
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
	for (let i = 0; i < 4; i++) {
		let soundNum = Math.trunc(Math.random() * 12) + 1;
		gameArray.push(soundNum);
	}
}

function nextSequence() {
	if (sequenceTimer) clearTimeout(sequenceTimer); // Clear any lingering timers
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

function resetGameTimer() {
	timeLeft = 8;
	if (gameTimerID) {
		clearInterval(gameTimerID); // Clear previous timer if any
	}
	timer.textContent = `Time = ${String(Math.floor(timeLeft / 60)).padStart(
		2,
		"0"
	)}:${String(timeLeft % 60).padStart(2, "0")}`;
}

startGameBtn.addEventListener("click", () => {
	initializeGame();
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
		console.log(
			"startUserInputTimer's timeout is triggering handleSequenceCompletion."
		);
		handleSequenceCompletion();
	}, soundDelay * gameArray.length + 8000);
}

function handleUserInput() {
	console.log("Handling user input. Current clicked sequence:", userArray);
	if (userArray.length === gameArray.length) {
		console.log("User sequence completed. Calling handleSequenceCompletion.");
		clearTimeout(sequenceTimer); // Clear the timer
		console.log("handleUserInput is triggering handleSequenceCompletion.");
		handleSequenceCompletion();
	}
}

function getUserArray(event) {
	if (userArray.length >= gameArray.length) {
		console.log("User array is full. Ignoring extra clicks.");
		return;
	}

	const currentPad = event.currentTarget;
	const userClick = currentPad.innerText;
	userArray.push(+userClick);

	console.log("Clicked sequence after a pad click:", userArray);

	handleUserInput();
}
function handleSequenceCompletion() {
	console.log("Inside handleSequenceCompletion. Comparing sequences.");
	console.log("Expected sequence:", gameArray);
	console.log("User sequence:", userArray);

	if (validateUserInput()) {
		console.log(
			"User input is correct. Adding to the score and proceeding to the next sequence."
		);
		currentScore++;
		score.textContent = "Score = " + currentScore;

		// Optionally, if you want to add a life upon a correct sequence, you can uncomment the line below
		// currentLives++;
	} else {
		console.log(
			"User input is incorrect. Reducing a life and proceeding to the next sequence."
		);
		currentLives--;
		lives.textContent = "Lives = " + currentLives;

		if (currentLives <= 0) {
			endGame();
			return;
		}
	}

	nextSequence();
}

// pads.forEach((pad, index) => {
// 	pad.addEventListener("click", getUserArray);
// });
