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

const levelSelector = document.getElementById("levelSelector");
const startGameBtn = document.querySelector("#startGame");
const resetBtn = document.querySelector("#reset");
const score = document.querySelector("#score");
const timer = document.querySelector("#timer");
const lives = document.querySelector("#lives");
const soundsPlayer = document.querySelectorAll(".sound");
const pads = document.querySelectorAll(".cell");
let playSequenceInterval;

let currentScore = 0;
let currentLives = 5;
let timeLeft = 10;
let gameArray = [];
let userArray = [];
let gameTimerID = null;
let sequenceTimer = null;
let selectedLevel = parseInt(levelSelector.value, 10);

score.textContent = "Score = 0";
timer.textContent = "Time = 00:10";
lives.textContent = "Lives = 5";

function validateUserInput() {
	for (let i = 0; i < gameArray.length; i++) {
		if (gameArray[i] !== userArray[i]) {
			return false;
		}
	}
	return true;
}

function initializeGame() {
	currentScore = 0;
	currentLives = 5;
	selectedLevel = parseInt(levelSelector.value, 10);
	score.textContent = "Score = " + currentScore;
	lives.textContent = "Lives = " + currentLives;
	nextSequence();
}

function createGameArray() {
	let numTones = selectedLevel + 1;
	gameArray = [];
	for (let i = 0; i < numTones; i++) {
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

function playGameSequence() {
	let index = 0;
	playSequenceInterval = setInterval(function () {
		if (index === gameArray.length) {
			clearInterval(playSequenceInterval);
			setTimeout(() => {
				startGameTimer();
				startUserInputTimer();
			}, 1000);
			return;
		}
		let padIndex = gameArray[index] - 1;
		pads[padIndex].classList.add("active");
		soundsPlayer[padIndex].play();

		setTimeout(() => {
			pads[padIndex].classList.remove("active");
		}, 500);
		index++;
	}, 1000);
}

function startGameTimer() {
	clearInterval(gameTimerID);
	gameTimerID = setInterval(function () {
		const minutes = Math.floor(timeLeft / 60);
		const seconds = timeLeft % 60;
		timer.textContent = `Time = ${String(minutes).padStart(2, "0")}:${String(
			seconds
		).padStart(2, "0")}`;
		if (timeLeft <= 0) {
			clearInterval(gameTimerID);
			currentLives--;
			lives.textContent = "Lives = " + currentLives;
			if (currentLives <= 0) {
				endGame();
			} else {
				nextSequence();
			}
		} else {
			timeLeft--;
		}
	}, 1000);
}

function resetGameTimer() {
	timeLeft = 10; // Adjust as necessary based on game difficulty
	timer.textContent = `Time = 00:${String(timeLeft).padStart(2, "0")}`;
}

function endGame() {
	clearInterval(gameTimerID);
	alert("Game Over! Your score is: " + currentScore);
	location.reload();
}

function handleSequenceCompletion() {
	if (validateUserInput()) {
		currentScore += selectedLevel;
		score.textContent = "Score = " + currentScore;
	} else {
		currentLives--;
		lives.textContent = "Lives = " + currentLives;
		if (currentLives <= 0) {
			endGame();
			return;
		}
	}
	nextSequence();
}

function startUserInputTimer() {
	sequenceTimer = setTimeout(
		handleSequenceCompletion,
		1000 * gameArray.length + 8000
	);
}

function handleUserInput(event) {
	const currentPad = event.currentTarget;
	const userClick = currentPad.innerText;
	userArray.push(+userClick);
	if (userArray.length === gameArray.length) {
		clearTimeout(sequenceTimer);
		handleSequenceCompletion();
	}
}

startGameBtn.addEventListener("click", initializeGame);
resetBtn.addEventListener("click", () => {
	resetValues();
});

function resetValues() {
	isSequencePlaying = false;
	clearInterval(gameTimerID);
	clearTimeout(sequenceTimer);
	clearInterval(playSequenceInterval);
	currentScore = 0;
	currentLives = 5;
	selectedLevel = parseInt(levelSelector.value, 10);
	userArray = [];
	gameArray = [];
	score.textContent = "Score = 0";
	lives.textContent = "Lives = 5";
	resetGameTimer();
}

pads.forEach(pad => {
	pad.addEventListener("click", handleUserInput);
});

soundsPlayer.forEach(sound => {
	sound.load();
});

window.addEventListener("load", () => {
	pads.forEach((pad, index) => {
		pad.addEventListener("click", () => {
			soundsPlayer[index].currentTime = 0;
			soundsPlayer[index].play();
		});
	});
});
