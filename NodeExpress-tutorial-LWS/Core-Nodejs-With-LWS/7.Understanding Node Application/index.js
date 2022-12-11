/*
 * Title: Basic Node app example
 * Description: Simple node application that print random quotes per second interval.
 * Author: MD Romi
 * Date: 18/11/20
 */

// Dependencies
const mathLibrary = require('./lib/math');
const quotesLibrary = require('./lib/quotes');

// App object - Module scaffolding
const app = {};

// Configuration
app.config = {
    timeBetweenQuotes: 1000
};

// Function that prints a random quote
app.printAQuote = function printAQuote() {
    // Gwt all quotes
    const allQuotes = quotesLibrary.allQuotes();

    // get the length of the quotes
    const numberOfQuotes = allQuotes.length;

    // Pick a random number between 1 and the number of quotes
    const randomNumber = mathLibrary.getRandomNumber(1, numberOfQuotes)

    // get the quote at that position in the array (minus one)
    const selectedQuote = allQuotes[randomNumber - 1]

    // print the quote the console
    console.log(selectedQuote);
}

// Function that loops indefinitey, calling the printAQuote function as it goes
app.indefiniteLoop = function indefiniteLoop() {
    // create the interval, using the config variable defined above
    setInterval(app.printAQuote, app.config.timeBetweenQuotes)
}

// Invoke the app
app.indefiniteLoop();