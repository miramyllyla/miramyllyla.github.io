window.onload = function() {

/** Returns a random number between min and max */
function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var guessIt = getRandomInteger(1, 10);
function guessTheNumber() {
    var theNumber = parseInt(document.getElementById("number").value);
    if (theNumber >= 1 && theNumber <= 10 && theNumber % 1 === 0) {
        if (compareNumbers(guessIt,theNumber)) {
            alert("Congrats! You guessed the right number!");
            guessIt = getRandomInteger(1,10);
            } else {
            alert("Sorry, that was not the right number... Try again!");
            }
        } else {
         alert("Sorry, your guess was not accepted. Please guess numbers between 1-10.");
        }
    }
    
function compareNumbers(first, second) { return( first === second ) };                   

var moi = document.getElementById("nappi");
moi.addEventListener("click", guessTheNumber);
}


