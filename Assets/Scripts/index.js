let level = 1;
let maxNumber = 10;
let attempts = 4;
let attemptsGiven = attempts;
let totalAttempts = 0;
let randomNumber = Math.floor(Math.random() * maxNumber) + 1;
let guessedNumbers = [];
let timerInterval;
let elapsedTime = 0;
let coins = 0;
let hintUsed = false;
let hintMessage = "";

let unlockedAchievements = {
    luckyFirstTry: false,
    quickGuesser: false,
    comebackKing: false
};
let achievementsUnlocked = 0;

const messageElement = document.getElementById("message");
const submitButton = document.getElementById("submitGuess");
const logElement = document.getElementById("log");
const currentLevelElement = document.getElementById("currentLevel");
const currentAttemptsElement = document.getElementById("currentAttempts");
const maxNumberElement = document.getElementById("maxNumber");
const guessedNumbersElement = document.getElementById("guessedNumbers");
const timeElapsedElement = document.getElementById("timeElapsed");
const pausePlayButton = document.getElementById("pausePlayButton");
const achievementBadge = document.querySelector(".badge.bg-success.float-end");
const coinsElement = document.getElementById("coins");
const hintButton = document.getElementById("hintButton");

function updateDashboard() {
    currentLevelElement.textContent = level;
    currentAttemptsElement.textContent = attempts;
    maxNumberElement.textContent = maxNumber;
    timeElapsedElement.textContent = elapsedTime;
    coinsElement.textContent = coins;
    guessedNumbersElement.textContent = guessedNumbers.length > 0 ? guessedNumbers.join(", ") : "Press play to guess";
}

function updateAchievements() {
    if (
        !unlockedAchievements.luckyFirstTry &&
        guessedNumbers.length === 1 &&
        guessedNumbers[0] === randomNumber
    ) {
        unlockedAchievements.luckyFirstTry = true;
        coins += 20;
    }

    if (
        !unlockedAchievements.quickGuesser &&
        elapsedTime <= 10 &&
        guessedNumbers.includes(randomNumber)
    ) {
        unlockedAchievements.quickGuesser = true;
        coins += 20;
    }

    if (
        !unlockedAchievements.comebackKing &&
        attempts === 1 &&
        guessedNumbers[guessedNumbers.length - 1] === randomNumber
    ) {
        unlockedAchievements.comebackKing = true;
        coins += 20;
    }

    for (let key in unlockedAchievements) {
        if (unlockedAchievements[key]) {
            let achievementElement = document.querySelector(
                `.achievement-item[data-achievement='${key}']`
            );
            if (achievementElement) {
                achievementElement.classList.add("text-decoration-line-through");
            }
        }
    }

    achievementsUnlocked = Object.values(unlockedAchievements).filter(Boolean)
        .length;
    achievementBadge.textContent = `${achievementsUnlocked}/3`;

    updateDashboard();
}

function addLogEntry(
    level,
    totalAttempts,
    attemptsGiven,
    guessedNumbers,
    randomNumber,
    status,
    hintUsed,
    hintMessage
) {
    const logDiv = document.createElement("div");
    logDiv.classList.add("border", "rounded", "p-2", "mb-2");
    logDiv.innerHTML = `
            <div><strong>Level:</strong> ${level}</div>
            <div><strong>Number Range:</strong> 1 to ${maxNumber}</div>
            <div><strong>Attempts Given:</strong> ${attemptsGiven}</div>
            <div><strong>Total Attempts Used:</strong> ${totalAttempts}</div>
            <div><strong>Guessed Numbers:</strong> ${guessedNumbers.join(", ") || "None"
        }</div>
            <div><strong>Correct Number:</strong> ${randomNumber}</div>
            <div><strong>Status:</strong> ${status}</div>
            <div><strong>Time Elapsed:</strong> ${elapsedTime} s</div>
            <div><strong>Hint Used:</strong> ${hintUsed ? "Yes" : "No"}</div>
            ${hintUsed ? `<div><strong>Hint:</strong> ${hintMessage}</div>` : ""
        }
        `;
    logElement.appendChild(logDiv);
    if (logElement.children[0].textContent === "No attempts made yet.") {
        logElement.children[0].remove();
    }
    logElement.scrollTop = logElement.scrollHeight;
}

function startTimer() {
    timerInterval = setInterval(() => {
        elapsedTime++;
        timeElapsedElement.textContent = elapsedTime;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function startNewLevel() {
    level++;
    maxNumber = 10 * level;
    attempts = 4 + level - 1;
    attemptsGiven = attempts;
    randomNumber = Math.floor(Math.random() * maxNumber) + 1;
    totalAttempts = 0;
    guessedNumbers = [];
    elapsedTime = 0;
    hintUsed = false;
    hintMessage = "";
    hintButton.disabled = true;
    updateDashboard();
}

function restartLevel() {
    attempts = 4 + level - 1;
    attemptsGiven = attempts;
    randomNumber = Math.floor(Math.random() * maxNumber) + 1;
    totalAttempts = 0;
    guessedNumbers = [];
    elapsedTime = 0;
    hintUsed = false;
    hintMessage = "";
    hintButton.disabled = true;
    updateDashboard();
}

pausePlayButton.addEventListener("click", function () {
    if (pausePlayButton.textContent === "Play") {
        pausePlayButton.textContent = "Pause";
        submitButton.disabled = false;
        document.getElementById("guessInput").disabled = false;
        hintButton.disabled = hintUsed || coins < 10;
        startTimer();
    } else {
        pausePlayButton.textContent = "Play";
        submitButton.disabled = true;
        document.getElementById("guessInput").disabled = true;
        hintButton.disabled = true;
        stopTimer();
    }
});

submitButton.addEventListener("click", function () {
    const guessInput = document.getElementById("guessInput");
    const userGuess = parseInt(guessInput.value);
    guessInput.value = "";

    if (isNaN(userGuess)) {
        messageElement.innerHTML =
            '<div class="text-orange-400">Please enter a valid number.</div>';
        return;
    }

    if (userGuess < 1 || userGuess > maxNumber) {
        messageElement.innerHTML = `<div class="text-orange-400">Your guess must be between 1 and ${maxNumber}.</div>`;
    } else {
        guessedNumbers.push(userGuess);
        if (userGuess === randomNumber) {
            totalAttempts++;
            stopTimer();
            coins += level * 10;
            updateAchievements();
            addLogEntry(
                level,
                totalAttempts,
                attemptsGiven,
                guessedNumbers,
                randomNumber,
                "Won",
                hintUsed,
                hintMessage
            );
            startNewLevel();
            messageElement.innerHTML =
                '<div class="text-blue-400">New level started! Good luck!</div>';
            pausePlayButton.textContent = "Play";
            submitButton.disabled = true;
            document.getElementById("guessInput").disabled = true;
            hintButton.disabled = true;
        } else {
            attempts--;
            totalAttempts++;
            updateDashboard();
            if (attempts <= 0) {
                messageElement.innerHTML =
                    '<div class="text-red-400">Out of attempts! Restarting the level...</div>';
                stopTimer();
                updateAchievements();
                addLogEntry(
                    level,
                    totalAttempts,
                    attemptsGiven,
                    guessedNumbers,
                    randomNumber,
                    "Lost",
                    hintUsed,
                    hintMessage
                );
                restartLevel();
                messageElement.innerHTML =
                    '<div class="text-blue-400">Level restarted! Try again!</div>';
                pausePlayButton.textContent = "Play";
                submitButton.disabled = true;
                document.getElementById("guessInput").disabled = true;
                hintButton.disabled = true;
            } else {
                messageElement.innerHTML = userGuess < randomNumber ? 
                `<div class="text-indigo-400">Too low!</div>` : 
                `<div class="text-pink-400">Too high!</div>`;
            }
        }
    }
});

hintButton.addEventListener("click", function () {
    if (hintUsed) {
        hintButton.disabled = true;
        return;
    }
    if (coins < 10) {
        messageElement.innerHTML =
            '<div class="text-orange-400">Not enough coins to use a hint.</div>';
        return;
    }
    let confirmHint = confirm(
        "Are you sure you want to use a hint? It will cost you 10 coins."
    );
    if (confirmHint) {
        coins -= 10;
        hintUsed = true;
        hintButton.disabled = true;
        updateDashboard();
        if (maxNumber - randomNumber >= 10) {
            hintMessage = `The number is less than ${randomNumber + 10}.`;
        } else if (randomNumber - 1 >= 10) {
            hintMessage = `The number is greater than ${randomNumber - 10}.`;
        } else {
            hintMessage =
                randomNumber % 2 === 0 ? "The number is even." : "The number is odd.";
        }
        messageElement.innerHTML = `<div class="text-blue-400">Hint: ${hintMessage}</div>`;
    }
});

updateDashboard();