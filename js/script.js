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
    const title = currentSessionType === 'pomo' ? 'Time to focus!' : 'Time for a break!';
    document.title = `${time} - ${title}`;
}

function notifyUser(message) {
    if (Notification.permission === 'granted' && notificationOption.checked) {
        new Notification(message);
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

    intervalId = setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        seconds = seconds < 10 ? "0" + seconds : seconds;
        const time = minutes + ":" + seconds;
        minuteText.textContent = time;
        updateTitle(time);

        if (--timer < 0) {
            clearInterval(intervalId);
            notifyUser(sessionType === 'pomo' ? 'Pomodoro complete! Take a break.' : 'Break is over! Time to focus.');
            playSound();
            if (sessionType === 'pomo') {
                startTimer(shortBreakDuration, 'green', 'shortBreak'); // Start a short break
            } else if (sessionType === 'shortBreak') {
                startTimer(pomoDuration, 'red', 'pomo'); // Start a Pomodoro
            } else if (sessionType === 'longBreak') {
                startTimer(pomoDuration, 'red', 'pomo'); // Start a Pomodoro
            }
        }
    }, 1000);
}

startPomoButton.addEventListener('click', () => {
    startTimer(pomoDuration, 'red', 'pomo');
});

startShortBreakButton.addEventListener('click', () => {
    startTimer(shortBreakDuration, 'green', 'shortBreak');
});

startLongBreakButton.addEventListener('click', () => {
    startTimer(longBreakDuration, 'green', 'longBreak'); // Fixed the 15-minute timer
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupTomatoes(pomoDuration / 60, 'red');
    requestNotificationPermission();
});
