const achievements = [
    {
        id: 'luckyFirstTry',
        name: 'Lucky First Try',
        description: 'Awarded for guessing the correct number on the first attempt.',
        icon: '<i class="ph ph-clover"></i>',
        condition: function () {
            return guessedNumbers.length === 1 && guessedNumbers[0] === randomNumber;
        },
        unlockedAt: null
    },
    {
        id: 'quickGuesser',
        name: 'Quick Guesser',
        description: 'Complete a level in under 10 seconds.',
        icon: '<i class="ph ph-clock-countdown"></i>',
        condition: function () {
            return elapsedTime <= 10 && guessedNumbers.includes(randomNumber);
        },
        unlockedAt: null
    },
    {
        id: 'turboToddler',
        name: 'Turbo Toddler',
        description: 'Complete a level in under 5 seconds.',
        icon: '<i class="ph ph-baby"></i>',
        condition: function () {
            return elapsedTime <= 5 && guessedNumbers.includes(randomNumber);
        },
        unlockedAt: null
    },
    {
        id: 'comebackKing',
        name: 'Comeback King',
        description: 'Win a level after being down to just one remaining attempt.',
        icon: '<i class="ph ph-crown-simple"></i>',
        condition: function () {
            return attempts === 1 && guessedNumbers.slice(-1)[0] === randomNumber;
        },
        unlockedAt: null
    },
    {
        id: 'lazyGuessAward',
        name: 'The ‘I’m Too Lazy to Guess’ Award',
        description: 'Use your first hint to get a little help on your guessing journey.',
        icon: '<i class="ph ph-moon-stars"></i>',
        condition: function () {
            return hintUsed;
        },
        unlockedAt: null
    },
    {
        id: 'grandmaSpeed',
        name: 'Grandma Speed',
        description: 'Complete a level in more than 30 seconds.',
        icon: '<i class="ph ph-clock-clockwise"></i>',
        condition: function () {
            return elapsedTime > 30 && guessedNumbers.includes(randomNumber);
        },
        unlockedAt: null
    },
    {
        id: 'soCloseYetSoFar',
        name: 'So Close, Yet So Far',
        description: 'Make a guess that is off by only one number.',
        icon: '<i class="ph ph-smiley-x-eyes"></i>',
        condition: function () {
            return Math.abs(guessedNumbers.slice(-1)[0] - randomNumber) === 1;
        },
        unlockedAt: null
    },
    {
        id: 'afkModeActivated',
        name: 'AFK Mode Activated',
        description: 'Complete a level in more than 2 minutes.',
        icon: '<i class="ph ph-keyboard"></i>',
        condition: function () {
            return elapsedTime > 120 && guessedNumbers.includes(randomNumber);
        },
        unlockedAt: null
    }
];