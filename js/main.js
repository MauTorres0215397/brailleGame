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
        this.print();
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
    document.querySelector('.text-success').innerHTML = totAnswered + ' palabras';
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
let brailleWord = document.querySelector('.braille-dots')
let words = ['abadíes', 'acierto', 'adoptas', 'afianza', 'aflojar', 'agendas', 'ajustes', 'anillos', 'antenas', 'aplasto',
    'aplique', 'arbitro', 'ardilla', 'arrojar', 'arrugas', 'balones', 'barrios', 'bazares', 'bestias', 'biblias',
    'bloques', 'bonitos', 'botadas', 'botando', 'boscosa', 'boletas', 'banales', 'avispas', 'atisbes', 'idiomas',
    'idiotez', 'integra', 'infecta', 'juguito', 'kimonos', 'labores', 'lagañas', 'lanoso', 'lenguas', 'llueven',
    'lunares', 'motivas', 'muertos', 'navales', 'panales', 'papayas', 'papeles', 'parques', 'patrias', 'pecados',
    'pañales', 'pruebas', 'relojes', 'renales', 'rivales', 'romanos', 'rurales', 'palabra', 'palabra', 'vacunas',
    'valores', 'varones', 'veremos', 'vinagre', 'vocales', 'vomitas', 'yanquis', 'yunques', 'zarinas', 'zullona',
    'william', 'wyoming'];

let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
let making = []

words = words.sort(() => Math.random() - 0.5);

letters = letters.sort(() => Math.random() - 0.5);

let rand = Math.floor(Math.random() * (words.length));
let makingWord = words[rand];
for (var i = 0; i < makingWord.length - 1; i++) {
    making.push(makingWord[i]);
}
making.push(makingWord[makingWord.length - 1])
making.push(makingWord);
console.log(words);
console.log(letters);
console.log(making);
console.log(makingWord.length)

let input = document.querySelector('input');
let activeSet = 'words';

window.addEventListener('DOMContentLoaded', (event) => {
    // display the word from the active set
    brailleWord.innerHTML = selectMode(activeSet);

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
                console.log('palabra correcta')
                resetInput();
                add2Chart(input.value);
                let temp = '';
                switch (activeSet) {
                    case 'words':
                        temp = words[words.indexOf(brailleWord.innerHTML) + 1];
                        console.log(activeSet);
                        break;
                    case 'letters':
                        temp = letters[letters.indexOf(brailleWord.innerHTML) + 1];
                        console.log(activeSet);
                        break;
                    case 'making':
                        let indexTemp = making.indexOf(brailleWord.innerHTML) + 1;
                        console.log(indexTemp + ' ' + making.length);
                        temp = (indexTemp == making.length) ? making[0] : making[making.indexOf(brailleWord.innerHTML) + 1];
                        console.log(temp);
                        break;
                }
                brailleWord.innerHTML = temp;
            } else {
                console.log(input.value + ' ' + brailleWord.innerHTML)
                input.style.backgroundColor = '#F6CCD0';
                input.classList.add('border-danger');
            }

            // clear input
            input.value = '';
        }
    });
});

function resetInput() {
    input.style.backgroundColor = 'white';
    input.classList.remove('border-danger');

}
function changeSet() {
    firstChar = true;
    activeSet = false;
    stopwatch.reset();
    stopwatch.stop();
    input.value = '';
    resetInput();
    document.querySelector('input').disabled = false;
    document.querySelector('.text-success').innerHTML = '';
}
function wordArray() {
    changeSet();
    activeSet = 'words';
    brailleWord.innerHTML = words[0];
    chart.innerHTML = '';

}
function letterArray() {
    changeSet();
    activeSet = 'letters';
    brailleWord.innerHTML = letters[0];
    chart.innerHTML = '';
}

function makingWordsMode() {
    changeSet();
    activeSet = 'making';
    brailleWord.innerHTML = making[0];
    chart.innerHTML = '';
}

function selectMode(mode) {
    switch (mode) {
        case 'words':
            return words[0];
        case 'letters':
            return letters[0];
        case 'making':
            return making[0];
    }
}