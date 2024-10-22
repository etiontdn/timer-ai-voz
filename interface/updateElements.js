let crel = require("crel");

const rootEl = document.querySelector("main");


function updateTimers (timerState) {
    rootEl.innerHTML = "";
    for (let i = 0; i < timerState.length; i++) {
        let timer = timerState[i];
        let element = crel("div", {class:"timer", name:timer.name}, crel("span", {class: "time"}, "00:00"));
        rootEl.appendChild(element);
    }

    updateTimes(timerState);
}

function updateTimes (timerState) {
    function numFormat(n) {
        if (n >= 10) {
            return n;
        } else {
            return "0"+n;
        }
    }

    function getFormattedTime(current) {
        let minutes = Math.floor(current / 60);
        let seconds = current % 60;
        return numFormat(minutes) + ":" + numFormat(seconds); 
    }
    let timerElements = rootEl.children;
    for (let i = 0; i < timerState.length; i++) {
        let timer = timerState[i];
        if (timer.hasEnded) {
            timerElements[i].firstChild.innerText = "00:00";            
        } else if (!timer.isPaused) {
            timerElements[i].firstChild.innerText = getFormattedTime(timer.currentTime);
        }
    }
}

module.exports = {
    updateTimers,
    updateTimes
}