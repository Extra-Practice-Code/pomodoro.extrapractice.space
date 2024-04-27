const pomoDuration = 25 * 60; // 25 minutes
const shortBreakDuration = 5 * 60; // 5 minutes
const longBreakDuration = 15 * 60; // 15 minutes

// Elements
const timerElement = document.getElementById('timer');
const minuteText = timerElement.querySelector('.minute-text');
const tomatoGrid = timerElement.querySelector('.tomato-grid');
const timerSound = document.getElementById('timerSound');
const startPomoButton = document.getElementById('startPomo');
const startShortBreakButton = document.getElementById('startShortBreak');
const startLongBreakButton = document.getElementById('startLongBreak');
const soundOption = document.getElementById('soundOption');
const notificationOption = document.getElementById('notificationOption');

// State
let intervalId;
let currentSessionType = 'pomo';  // 'pomo', 'shortBreak', 'longBreak'

function setupTomatoes(count, tomatoType) {
    tomatoGrid.innerHTML = ''; // Clear previous tomatoes
    for (let i = 0; i < count; i++) {
        const tomato = document.createElement('div');
        tomato.classList.add('tomato');
        tomato.style.backgroundImage = `url('images/${tomatoType}-tomato.png')`;
        tomato.style.opacity = 0; // start with hidden tomato
        tomatoGrid.appendChild(tomato);
    }
}

function fadeInTomatoes(duration) {
    const tomatoes = tomatoGrid.querySelectorAll('.tomato');
    tomatoes.forEach((tomato, index) => {
        setTimeout(() => {
            tomato.style.transition = 'opacity 0.5s';
            tomato.style.opacity = 1;
        }, (duration / tomatoes.length) * index * 1000);
    });
}

function updateTitle(time) {
    const title = currentSessionType === 'pomo' ? 'focus mode' : 'break mode';
    document.title = `${time} - ${title}`;
}

function notifyUser(message) {
    if (!("Notification" in window)) {
        console.log("This browser does not support system notifications");
    } else if (Notification.permission === "granted" && notificationOption.checked) {
        new Notification(message);
    } else if (Notification.permission !== "denied" && notificationOption.checked) {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification(message);
            }
        });
    }
}

function playSound() {
    if (soundOption.checked) {
        timerSound.play();
    }
}

function startTimer(duration, tomatoType, sessionType) {
    clearInterval(intervalId);
    currentSessionType = sessionType;
    setupTomatoes(duration / 60, tomatoType);
    fadeInTomatoes(duration);
    let timer = duration, minutes, seconds;

    timerElement.className = sessionType === 'pomo' ? 'timer red' : 'timer green';

    // Update the display immediately before starting the interval
    updateTimerDisplay(timer);

    intervalId = setInterval(() => {
        timer--;
        updateTimerDisplay(timer);

        if (timer < 0) {
            clearInterval(intervalId);
            notifyUser(sessionType === 'pomo' ? '🍅 pomodoro complete. take a break' : '🟢 break is over');
            playSound();
            if (sessionType === 'pomo') {
                startTimer(shortBreakDuration, 'green', 'shortBreak');
            } else if (sessionType === 'shortBreak') {
                startTimer(pomoDuration, 'red', 'pomo');
            } else if (sessionType === 'longBreak') {
                startTimer(pomoDuration, 'red', 'pomo');
            }
        }
    }, 1000);
}

function updateTimerDisplay(timer) {
    let minutes = parseInt(timer / 60, 10);
    let seconds = parseInt(timer % 60, 10);
    seconds = seconds < 10 ? "0" + seconds : seconds;
    let time = minutes + ":" + seconds;
    minuteText.textContent = time;
    updateTitle(time);
}

startPomoButton.addEventListener('click', () => {
    startTimer(pomoDuration, 'red', 'pomo');
});

startShortBreakButton.addEventListener('click', () => {
    startTimer(shortBreakDuration, 'green', 'shortBreak');
});

startLongBreakButton.addEventListener('click', () => {
    startTimer(longBreakDuration, 'green', 'longBreak');
});

// Add this event listener for the notifications option
document.getElementById('notificationOption').addEventListener('change', function() {
    if (this.checked) {
        checkAndRequestNotificationPermission();
    }
});

function checkAndRequestNotificationPermission() {
    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
        alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
        console.log("Notification permission already granted.");
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("Notification permission granted.");
            } else {
                console.log("Notification permission denied.");
            }
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupTomatoes(pomoDuration / 60, 'red');
    checkAndRequestNotificationPermission(); // Ensure notification permissions are handled on load
});
