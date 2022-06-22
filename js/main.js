// timer
class Stopwatch {
    constructor(display) {
        this.running = false;
        this.display = display;
        this.reset();
        this.print(this.times);
    }

    reset() {
        this.times = [0, 0, 0];
    }

    start() {
        if (!this.time) this.time = performance.now();
        if (!this.running) {
            this.running = true;
            requestAnimationFrame(this.step.bind(this));
        }
    }

    stop() {
        this.running = false;
        this.time = null;
    }

    step(timestamp) {
        if (!this.running) return;
        this.calculate(timestamp);
        this.time = timestamp;
        this.print();
        requestAnimationFrame(this.step.bind(this));
    }

    calculate(timestamp) {
        var diff = timestamp - this.time;
        // Hundredths of a second are 100 ms
        this.times[2] += diff / 10;
        // Seconds are 100 hundredths of a second
        if (this.times[2] >= 100) {
            this.times[1] += 1;
            this.times[2] -= 100;
        }
        // Minutes are 60 seconds
        if (this.times[1] >= 60) {
            this.times[0] += 1;
            this.times[1] -= 60;
        }
        // Something special happends when we get to one minute
        if (this.times[0] == 1) {
            this.stop();
            getResults();
        }
    }

    print() {
        this.display.innerText = this.format(this.times);
    }

    format(times) {
        return `${pad0(times[0], 2)}:${pad0(times[1], 2)}`;
    }
}

function pad0(value, count) {
    var result = value.toString();
    for (; result.length < count; --count)
        result = '0' + result;
    return result;
}

function getResults() {
    document.querySelector('input').disabled = true;
    var totAnswered = document.querySelectorAll('tr').length;
    document.querySelector('.text-success').innerHTML = totAnswered + " palabras";
}

let chart = document.querySelector('.answer-table');

function add2Chart(word) {
    var row = chart.insertRow();
    var cell = row.insertCell();
    cell.classList.add('align-middle');
    cell.innerHTML = word;
    cell = row.insertCell();
    cell.classList.add('fs-2');
    cell.classList.add('no-select');
    cell.classList.add('align-middle');
    cell.innerHTML = word;
}

// stopwatch
let stopwatch = new Stopwatch(document.querySelector('.stopwatch'));
let firstChar = true;

// braille display word
let words = ['perro', 'pastor', 'braille', 'puntos', 'ceguera', 'ciego', 'libro', 'poder', 'puntos', 'bastones', 'vidente', 'signo'];
words = words.sort(() => Math.random() - 0.5)
let index = 0;

window.addEventListener('DOMContentLoaded', (event) => {
    // display the first one
    let brailleWord = document.querySelector('.braille-dots')
    // if they were a lot of words, we would use: Math.round(Math.random() * words.length - 1) - 1
    brailleWord.innerHTML = words[index];
    index++;

    let input = document.querySelector('input');

    // everytime the user writes something 
    input.addEventListener('input', (event) => {
        // when the user enters the first letter, the timer starts running
        if (firstChar) {
            stopwatch.start();
            firstChar = false;
        }
    });

    // everytime the user submits a word
    input.addEventListener('keypress', (event) => {
        if (event.key == 'Enter') {
            // add element to list if the input and the braille word displayed are the same
            if (input.value == brailleWord.innerHTML) {
                input.style.backgroundColor = 'white';
                input.classList.remove('border-danger');
                add2Chart(input.value);
                brailleWord.innerHTML = words[index];
                index = (index == words.length - 1) ? 0 : index + 1;
            } else {
                input.style.backgroundColor = '#F6CCD0';
                input.classList.add('border-danger');
            }

            // clear input
            input.value = '';
        }
    });
});