let timerState = [];

class Timer {
    isPaused = false;
    pauseTime = 0;

    constructor(time, name) {
        this.start = Date.now();
        this.end = Date.now() + time * 1000;
        this.name = name;
    }

    get currentTime() {
        if (this.isPaused) {
            return Math.floor(this.pauseTime / 1000);
        }
        return Math.floor((this.end - Date.now()) / 1000);
    }

    get hasEnded() {
        if (this.isPaused) {
            return false;
        } else if (this.end - Date.now() <= 0) {
            return true;
        } else {
            return false;
        }
    }

    pauseTimer() {
        this.isPaused = true;
        this.pauseTime = this.end - Date.now();
    }

    resumeTimer() {
        this.end = Date.now() + this.pauseTime;
        this.isPaused = false;
        this.pauseTime = 0;
    }

    addTime(time) {
        this.end = this.end + time*1000;
    }
}

function createTimer(time, name) {
    let timer = new Timer(time, name);
    timerState.push(timer);
    return timer.start;
}

function moveTimer(timerStart, amount) {
    for (i = 0; i < timerState.length; i++) {
        let timer = timerState[i];
        if (timer.start === timerStart) {
            if (i + amount >= timerState.length) {
                amount = timerState.length - i - 1;
            } else if (i + amount < 0) {
                amount = -i;
            }

            if (amount >= 0) {
                for (let j = i + 1; j <= i + amount; j++) {
                    let temp = timerState[j - 1];
                    timerState[j - 1] = timerState[j]
                    timerState[j] = temp;
                }
                return i + amount;
            } else {
                for (let j = i - 1; j >= i + amount; j--) {
                    let temp = timerState[j + 1];
                    timerState[j + 1] = timerState[j]
                    timerState[j] = temp;
                }
                return i + amount;
            }
        }
    }
}

function moveTimerIndex(index, amount) {
    if (index + amount >= timerState.length) {
        amount = timerState.length - index - 1;
    } else if (index + amount < 0) {
        amount = -index;
    }
    if (amount >= 0) {
        for (let j = index + 1; j <= index + amount; j++) {
            let temp = timerState[j - 1];
            timerState[j - 1] = timerState[j]
            timerState[j] = temp;
        }
        return index + amount;
    } else {
        for (let j = index - 1; j >= index + amount; j--) {
            let temp = timerState[j + 1];
            timerState[j + 1] = timerState[j]
            timerState[j] = temp;
        }
        return index + amount;
    }
}

function swapTimer(timerStart, index) {
    for (i = 0; i < timerState.length; i++) {
        let timer = timerState[i];
        if (timer.start === timerStart) {
            if (timerState[index] !== undefined) {
                let temp = timerState[index];
                timerState[index] = timer;
                timerState[i] = temp;
            }
        }
    }
}

function swapTimerIndex(i1, i2) {
    let timer = timerState[i1];
    timerState[i1] = timerState[i2];
    timerState[i2] = timer;
}

function removeTimer(start) {
    moveTimer(start, 1000);
    timerState.pop();
}

function removeTimerIndex(index) {
    moveTimerIndex(index, 1000);
    timerState.pop();
}

/* lets make self contained tests */
/*
let id = createTimer(10, "first");
let id2 = createTimer(12, "second");
let id3 = createTimer(13, "third");
console.log(JSON.stringify(timerState));

removeTimer(id);

console.log(JSON.stringify(timerState));
*/

module.exports = {
    state: timerState,
    createTimer,
    moveTimer,
    moveTimerIndex,
    swapTimer,
    swapTimerIndex
}