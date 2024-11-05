(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
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
},{"crel":4}],3:[function(require,module,exports){
let timerState = require("./interface/timerState.js");
let updateElements = require("./interface/updateElements.js");
let aiTranslator = require("./recognition/aiTranslator.js");

const fetchPrompt = aiTranslator.fetchPrompt;

timerState.createTimer(100, "Nome");
timerState.createTimer(4, "segundo");



updateElements.updateTimers(timerState.state);
window.setInterval(() => updateElements.updateTimes(timerState.state), 100);

fetchPrompt("timer teste 10 minutos").then((res) => console.log(res));

console.log("Test");
/*var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;


var diagnosticPara = document.querySelector('#reconhecimento');

var testBtn = document.querySelector('button');

function generateNumbers(n) {
  numString = "";
  for (i = 1; i <= n; i++) {
    if (i != n) {
      numString += String(i) + " | ";
    } else {
      numString += String(i);
    }
  }

  return numString;
}

function isTimerValid(strtext) {

  function invalid() {
    return { valid: false, value: null, name: null };
  }

  function getNumberFromSubstring(str, s, e) {
    const subStr = str.substring(s, e);
    console.log(subStr);
    return Number(subStr.match(/\d+/)[0]);
  }

  function clearString(str) {
    let newStr = str;

    newStr = newStr.replace("timer", "");
    newStr = newStr.replace("e meio", "30 S");
    newStr = newStr.replace("um", "1");
    newStr = newStr.replace("meia hora", "30 M");
    newStr = newStr.replaceAll("minutos", "M");
    newStr = newStr.replaceAll("minuto", "M");
    newStr = newStr.replaceAll("segundos", "S");
    newStr = newStr.replaceAll("segundo", "S");

    return newStr;
  }

  const startI = strtext.search("timer");

  if (startI < 0) {
    return invalid();
  }

  let newStr = clearString(strtext.substring(startI));
  console.log(newStr);

  const mI = newStr.search('M');
  const sI = newStr.search('S');

  if (mI < 0 && sI < 0) {
    return invalid();
  }

  let currentI = 0;
  let time = 0;

  if (mI < 0) {
    time = time + getNumberFromSubstring(newStr, currentI, sI);
    currentI = sI + 1;
  } else {
    time = time + 60 * getNumberFromSubstring(newStr, currentI, mI);
    currentI = mI + 1;
    if (sI >= 0 && sI >= mI) {
      time = time + getNumberFromSubstring(newStr, currentI, sI);
      currentI = sI + 1;
    }
  }

  return { valid: true, value: time, name: newStr.substring(currentI) };
}

const nameDOM = document.querySelector("#nome");
const minutosDOM = document.querySelector("#minutos");
const segundosDOM = document.querySelector("#segundos");

localStorage.setItem("startTime", Math.floor(Date.now() / 1000))
let timerID = 0;
function startTimer(timer) {
  window.clearInterval(timerID);
  localStorage.setItem("startTime", Math.floor(Date.now() / 1000));

  let segundos = timer.value;

  timerWorkflow(segundos)
  timerID = window.setInterval(() => timerWorkflow(segundos), 500)

  nameDOM.innerText = timer.name;
}

function timerWorkflow(time) {
  const now = Math.floor(Date.now() / 1000);
  const startTime = localStorage.getItem("startTime");
  const diff = now - startTime;
  console.log(diff);
  let segundos = time - diff;

  if (segundos <= 0) {
    segundos = 0;

    const audio = new Audio('notification.ogg');
    audio.play();
    window.clearInterval(timerID);

  }

  const m = checkTime(Math.floor(segundos / 60));
  const s = checkTime(Math.floor(segundos % 60));

  minutosDOM.innerText = m;
  segundosDOM.innerText = s;
}

function checkTime(i) {
  if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
  return i;
}

function testSpeech() {

  // To ensure case consistency while checking with the returned output text
  diagnosticPara.textContent = '...diagnostic messages';

  let numbersGenerated = generateNumbers(100);
  var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = timer [de] (<number> | um) (minutos | segundos | minuto | segundo) [(e <number> (segundo | segundos))| e meio]; public <number> = ' + numbersGenerated;
  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 10);
  recognition.grammars = speechRecognitionList;
  recognition.lang = 'pt-BR';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = true;

  recognition.start();

  recognition.onresult = function (event) {
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at position 0.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object 
    console.log(event.results);
    var speechResult = event.results[event.results.length - 1][0].transcript.toLowerCase();
    diagnosticPara.textContent = 'Speech received: ' + speechResult + '.';
    console.log('Confidence: ' + event.results[0][0].confidence);


    const timer = isTimerValid(speechResult);
    if (timer.valid) {
      startTimer(timer);
    }
  }

  recognition.onspeechend = function () {
    console.log('ended speech');
  }

  recognition.onerror = function (event) {
    diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error;
  }

  recognition.onaudiostart = function (event) {
    //Fired when the user agent has started to capture audio.
    console.log('SpeechRecognition.onaudiostart');
  }

  recognition.onaudioend = function (event) {
    //Fired when the user agent has finished capturing audio.
    console.log('SpeechRecognition.onaudioend');
  }

  recognition.onend = function (event) {
    //Fired when the speech recognition service has disconnected.
    testSpeech();
    console.log('SpeechRecognition.onend');
  }

  recognition.onnomatch = function (event) {
    //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
    console.log('SpeechRecognition.onnomatch');
  }

  recognition.onsoundstart = function (event) {
    //Fired when any sound — recognisable speech or not — has been detected.
    console.log('SpeechRecognition.onsoundstart');
  }

  recognition.onsoundend = function (event) {
    //Fired when any sound — recognisable speech or not — has stopped being detected.
    console.log('SpeechRecognition.onsoundend');
  }

  recognition.onspeechstart = function (event) {
    //Fired when sound that is recognised by the speech recognition service as speech has been detected.
    console.log('SpeechRecognition.onspeechstart');
  }
  recognition.onstart = function (event) {
    //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
    console.log('SpeechRecognition.onstart');
  }
}

function iniciarLoop() {
  testSpeech();
}

*/
},{"./interface/timerState.js":1,"./interface/updateElements.js":2,"./recognition/aiTranslator.js":5}],4:[function(require,module,exports){
/* Copyright (C) 2012 Kory Nunn
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

NOTE:
This code is formatted for run-speed and to assist compilers.
This might make it harder to read at times, but the code's intention should be transparent. */

// IIFE our function
((exporter) => {
    // Define our function and its properties
    // These strings are used multiple times, so this makes things smaller once compiled
    const func = 'function',
        isNodeString = 'isNode',
        // Helper functions used throughout the script
        isType = (object, type) => typeof object === type,
        // Recursively appends children to given element. As a text node if not already an element
        appendChild = (element, child) => {
            if (child !== null) {
                if (Array.isArray(child)) { // Support (deeply) nested child elements
                    child.map(subChild => appendChild(element, subChild));
                } else {
                    if (!crel[isNodeString](child)) {
                        child = document.createTextNode(child);
                    }
                    element.appendChild(child);
                }
            }
        };
    //
    function crel (element, settings) {
        // Define all used variables / shortcuts here, to make things smaller once compiled
        let args = arguments, // Note: assigned to a variable to assist compilers.
            index = 1,
            key,
            attribute;
        // If first argument is an element, use it as is, otherwise treat it as a tagname
        element = crel.isElement(element) ? element : document.createElement(element);
        // Check if second argument is a settings object
        if (isType(settings, 'object') && !crel[isNodeString](settings) && !Array.isArray(settings)) {
            // Don't treat settings as a child
            index++;
            // Go through settings / attributes object, if it exists
            for (key in settings) {
                // Store the attribute into a variable, before we potentially modify the key
                attribute = settings[key];
                // Get mapped key / function, if one exists
                key = crel.attrMap[key] || key;
                // Note: We want to prioritise mapping over properties
                if (isType(key, func)) {
                    key(element, attribute);
                } else if (isType(attribute, func)) { // ex. onClick property
                    element[key] = attribute;
                } else {
                    // Set the element attribute
                    element.setAttribute(key, attribute);
                }
            }
        }
        // Loop through all arguments, if any, and append them to our element if they're not `null`
        for (; index < args.length; index++) {
            appendChild(element, args[index]);
        }

        return element;
    }

    // Used for mapping attribute keys to supported versions in bad browsers, or to custom functionality
    crel.attrMap = {};
    crel.isElement = object => object instanceof Element;
    crel[isNodeString] = node => node instanceof Node;
    // Expose proxy interface
    if (typeof Proxy != "undefined") {
        crel.proxy = new Proxy(crel, {
            get: (target, key) => {
                !(key in crel) && (crel[key] = crel.bind(null, key));
                return crel[key];
            }
        });
    }
    // Export crel
    exporter(crel, func);
})((product, func) => {
    if (typeof exports === 'object') {
        // Export for Browserify / CommonJS format
        module.exports = product;
    } else if (typeof define === func && define.amd) {
        // Export for RequireJS / AMD format
        define(() => product);
    } else {
        // Export as a 'global' function
        this.crel = product;
    }
});

},{}],5:[function(require,module,exports){
const apiUrl = "http://localhost:3000/interpret";

async function fetchPrompt(text) {
    const req = new Request(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({phrase: text}),
    })
    const res = await window.fetch(req);
    return res.json();
}

module.exports = {
    fetchPrompt
}
},{}]},{},[3]);
