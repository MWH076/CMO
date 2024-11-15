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
	comebackKing: false,
	lazyGuessAward: false,
	grandmaSpeed: false,
	soCloseYetSoFar: false
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
	achievementBadge: document.getElementById("unlockedAchievements"),
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
	const achievementConditions = [
		{
			key: "luckyFirstTry",
			condition: () =>
				guessedNumbers.length === 1 && guessedNumbers[0] === randomNumber
		},
		{
			key: "quickGuesser",
			condition: () => elapsedTime <= 10 && guessedNumbers.includes(randomNumber)
		},
		{
			key: "turboToddler",
			condition: () => elapsedTime <= 5 && guessedNumbers.includes(randomNumber)
		},
		{
			key: "comebackKing",
			condition: () =>
				attempts === 1 && guessedNumbers.slice(-1)[0] === randomNumber
		},
		{ key: "lazyGuessAward", condition: () => hintUsed },
		{
			key: "grandmaSpeed",
			condition: () => elapsedTime > 30 && guessedNumbers.includes(randomNumber)
		},
		{
			key: "afkModeActivated",
			condition: () => elapsedTime > 120 && guessedNumbers.includes(randomNumber)
		},
		{
			key: "soCloseYetSoFar",
			condition: () => Math.abs(guessedNumbers.slice(-1)[0] - randomNumber) === 1
		}
	];

	achievementConditions.forEach(({ key, condition }) => {
		if (!unlockedAchievements[key] && condition()) {
			unlockAchievement(key);
		}
	});

	elements.achievementBadge.textContent = `${Object.values(unlockedAchievements).filter(Boolean).length
		}/${Object.keys(unlockedAchievements).length}`;
}

function unlockAchievement(key) {
	unlockedAchievements[key] = true;
	coins += 20;
	const achievementElement = document.querySelector(
		`.achievement-item[data-achievement='${key}']`
	);
	if (achievementElement) achievementElement.classList.add("bg-green-500");
}

function addLogEntry(status) {
	const row = document.createElement("tr");

	row.innerHTML = `
        <td>${level}</td>
        <td>1 to ${maxNumber}</td>
        <td>${totalAttempts} / ${4 + level - 1}</td>
        <td>${guessedNumbers.join(", ") || "None"}</td>
        <td>${randomNumber}</td>
        <td>${elapsedTime} s</td>
        <td>${status === "Won"
			? '<span class="badge badge-lg badge-dot"><i class="bg-success"></i>Won</span>'
			: '<span class="badge badge-lg badge-dot"><i class="bg-danger"></i>Lost</span>'
		}</td>
        <td>${hintUsed ? "Yes" : "No"}</td>
        <td>${hintUsed ? hintMessage : ""}</td>
    `;

	elements.log.querySelector("tbody").appendChild(row);
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
	coins += 5;
	updateAchievements();
	addLogEntry("Won");
	startNewLevel();
	displayMessage("New level started! Good luck!", "blue");
	togglePlayPause();
}

function loseLevel() {
	stopTimer();
	coins -= 5;
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

		hintMessage = generateHint();
		displayMessage(`Hint: ${hintMessage}`, "blue");
		updateDashboard();
	}
}

function generateHint() {
	const hintType = Math.floor(Math.random() * 4);
	let hint = "";

	switch (hintType) {
		case 0:
			const offset = Math.floor(maxNumber / 3);
			const lowerBound = Math.max(
				1,
				randomNumber - Math.floor(Math.random() * offset)
			);
			const upperBound = Math.min(
				maxNumber,
				randomNumber + Math.floor(Math.random() * offset)
			);
			hint = `The number is between ${lowerBound} and ${upperBound}.`;
			break;

		case 1:
			hint = randomNumber % 2 === 0 ? "The number is even." : "The number is odd.";
			break;

		case 2:
			if (randomNumber % 3 === 0) {
				hint = "The number is divisible by 3.";
			} else if (randomNumber % 5 === 0) {
				hint = "The number is divisible by 5.";
			} else {
				hint = "The number is not divisible by 3 or 5.";
			}
			break;

		case 3:
			hint =
				randomNumber <= maxNumber / 2
					? "The number is closer to the start of the range."
					: "The number is closer to the end of the range.";
			break;
	}
	return hint;
}

updateDashboard();
