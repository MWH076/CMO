let level = 1,
	maxNumber = 10,
	attempts = 4,
	totalAttempts = 0,
	randomNumber = generateRandomNumber(maxNumber),
	guessedNumbers = [],
	coins = 0,
	hintUsed = false,
	hintMessage = "",
	elapsedTime = 0;

const unlockedAchievements = {
	luckyFirstTry: false,
	quickGuesser: false,
	comebackKing: false
};

const elements = {
	message: document.getElementById("message"),
	submitButton: document.getElementById("submitGuess"),
	log: document.getElementById("log"),
	currentLevel: document.getElementById("currentLevel"),
	currentAttempts: document.getElementById("currentAttempts"),
	maxNumber: document.getElementById("maxNumber"),
	guessedNumbers: document.getElementById("guessedNumbers"),
	timeElapsed: document.getElementById("timeElapsed"),
	pausePlayButton: document.getElementById("pausePlayButton"),
	achievementBadge: document.querySelector(".badge.bg-success.float-end"),
	coins: document.getElementById("coins"),
	hintButton: document.getElementById("hintButton"),
	guessInput: document.getElementById("guessInput")
};

function generateRandomNumber(max) {
	return Math.floor(Math.random() * max) + 1;
}

function updateDashboard() {
	elements.currentLevel.textContent = level;
	elements.currentAttempts.textContent = attempts;
	elements.maxNumber.textContent = maxNumber;
	elements.timeElapsed.textContent = elapsedTime;
	elements.coins.textContent = coins;
	elements.guessedNumbers.textContent = guessedNumbers.length
		? guessedNumbers.join(", ")
		: "Press play to guess";
}

function updateAchievements() {
	if (
		!unlockedAchievements.luckyFirstTry &&
		guessedNumbers.length === 1 &&
		guessedNumbers[0] === randomNumber
	) {
		unlockAchievement("luckyFirstTry");
	}
	if (
		!unlockedAchievements.quickGuesser &&
		elapsedTime <= 10 &&
		guessedNumbers.includes(randomNumber)
	) {
		unlockAchievement("quickGuesser");
	}
	if (
		!unlockedAchievements.comebackKing &&
		attempts === 1 &&
		guessedNumbers.slice(-1)[0] === randomNumber
	) {
		unlockAchievement("comebackKing");
	}

	elements.achievementBadge.textContent = `${
		Object.values(unlockedAchievements).filter(Boolean).length
	}/3`;
}

function unlockAchievement(key) {
	unlockedAchievements[key] = true;
	coins += 20;
	const achievementElement = document.querySelector(
		`.achievement-item[data-achievement='${key}']`
	);
	if (achievementElement)
		achievementElement.classList.add("text-decoration-line-through");
}

function addLogEntry(status) {
	const logDiv = document.createElement("div");
	logDiv.classList.add("border", "rounded", "p-2", "mb-2");
	logDiv.innerHTML = `
        <div><strong>Level:</strong> ${level}</div>
        <div><strong>Number Range:</strong> 1 to ${maxNumber}</div>
        <div><strong>Attempts Given:</strong> ${4 + level - 1}</div>
        <div><strong>Total Attempts Used:</strong> ${totalAttempts}</div>
        <div><strong>Guessed Numbers:</strong> ${
									guessedNumbers.join(", ") || "None"
								}</div>
        <div><strong>Correct Number:</strong> ${randomNumber}</div>
        <div><strong>Status:</strong> ${status}</div>
        <div><strong>Time Elapsed:</strong> ${elapsedTime} s</div>
        <div><strong>Hint Used:</strong> ${hintUsed ? "Yes" : "No"}</div>
        ${hintUsed ? `<div><strong>Hint:</strong> ${hintMessage}</div>` : ""}
    `;
	elements.log.appendChild(logDiv);
	if (elements.log.firstChild.textContent === "No attempts made yet.")
		elements.log.firstChild.remove();
	elements.log.scrollTop = elements.log.scrollHeight;
}

let timerInterval;

function startTimer() {
	timerInterval = setInterval(() => {
		elements.timeElapsed.textContent = ++elapsedTime;
	}, 1000);
}

function stopTimer() {
	clearInterval(timerInterval);
}

function startNewLevel() {
	level++;
	resetGame(10 * level, 4 + level - 1);
}

function restartLevel() {
	resetGame(maxNumber, 4 + level - 1);
}

function resetGame(newMaxNumber, newAttempts) {
	maxNumber = newMaxNumber;
	attempts = newAttempts;
	randomNumber = generateRandomNumber(maxNumber);
	totalAttempts = 0;
	guessedNumbers = [];
	elapsedTime = 0;
	hintUsed = false;
	hintMessage = "";
	elements.hintButton.disabled = true;
	updateDashboard();
}

elements.pausePlayButton.addEventListener("click", togglePlayPause);
elements.submitButton.addEventListener("click", handleGuess);
elements.hintButton.addEventListener("click", handleHint);
document.addEventListener("keydown", (e) => {
	if (e.key === "Enter" && !elements.submitButton.disabled) {
		handleGuess();
	} else if (e.key === "Escape") {
		togglePlayPause();
		elements.guessInput.focus();
	}
});

function togglePlayPause() {
	const isPlaying = elements.pausePlayButton.textContent === "Play";
	elements.pausePlayButton.textContent = isPlaying ? "Pause" : "Play";
	elements.submitButton.disabled = !isPlaying;
	elements.guessInput.disabled = !isPlaying;
	elements.hintButton.disabled = !isPlaying || hintUsed || coins < 10;
	if (isPlaying) startTimer();
	else stopTimer();
}

function handleGuess() {
	const userGuess = parseInt(elements.guessInput.value);
	elements.guessInput.value = "";

	if (isNaN(userGuess) || userGuess < 1 || userGuess > maxNumber) {
		displayMessage("Please enter a valid number within the range.", "orange");
		return;
	}

	if (guessedNumbers.includes(userGuess)) {
		displayMessage("You already guessed that number!", "red");
		return;
	}

	guessedNumbers.push(userGuess);
	totalAttempts++;
	attempts--;

	if (userGuess === randomNumber) {
		winLevel();
	} else if (attempts <= 0) {
		loseLevel();
	} else {
		displayMessage(
			userGuess < randomNumber ? "Too low!" : "Too high!",
			userGuess < randomNumber ? "indigo" : "pink"
		);
		updateDashboard();
	}
}

function displayMessage(text, color) {
	elements.message.innerHTML = `<div class="text-${color}-400">${text}</div>`;
}

function winLevel() {
	stopTimer();
	coins += level * 10;
	updateAchievements();
	addLogEntry("Won");
	startNewLevel();
	displayMessage("New level started! Good luck!", "blue");
	togglePlayPause();
}

function loseLevel() {
	stopTimer();
	updateAchievements();
	addLogEntry("Lost");
	restartLevel();
	displayMessage("Level restarted! Try again!", "blue");
	togglePlayPause();
}

function handleHint() {
	if (hintUsed || coins < 10) return;

	if (
		confirm("Are you sure you want to use a hint? It will cost you 10 coins.")
	) {
		coins -= 10;
		hintUsed = true;
		elements.hintButton.disabled = true;
		hintMessage =
			randomNumber >= 10
				? `The number is between ${Math.max(1, randomNumber - 10)} and ${Math.min(
						maxNumber,
						randomNumber + 10
				  )}`
				: randomNumber % 2 === 0
				? "The number is even."
				: "The number is odd.";
		displayMessage(`Hint: ${hintMessage}`, "blue");
		updateDashboard();
	}
}

updateDashboard();