const brailleLetters = {
    'a': 'O.....', 'b': 'O.O...', 'c': 'OO....', 'd': 'OO.O..', 'e': 'O..O..',
    'f': 'OOO...', 'g': 'OOOO..', 'h': 'O.OO..', 'i': '.OO...', 'j': '.OOO..',
    'k': 'O...O.', 'l': 'O.O.O.', 'm': 'OO..O.', 'n': 'OO.OO.', 'o': 'O..OO.',
    'p': 'OOO.O.', 'q': 'OOOOO.', 'r': 'O.OOO.', 's': '.OO.O.', 't': '.OOOO.',
    'u': 'O...OO', 'v': 'O.O.OO', 'w': '.OOO.O', 'x': 'OO..OO', 'y': 'OO.OOO', 
    'z': 'O..OOO',' ': '......', '.': '..OO.O', ',': '..O...', ';': '..O.O.', ':': '..OO..', 
    '?': '..O.OO', '!': '..OOO.','(': 'O.O..O', ')': '.O.OO.', '-': '....O.', 
    '/': '.O..O.'
};
const brailleNumbers = 
{   '1': 'O.....', '2': 'O.O...', '3': 'OO....', '4': 'OO.O..', '5': 'O..O..',
    '6': 'OOO...', '7': 'OOOO..', '8': 'O.OO..', '9': '.OO...', 'O': '.OOO..',
    ' ': '......', '.': '..OO.O', ',': '..O...', ';': '..O.O.', ':': '..OO..', 
    '?': '..O.OO', '!': '..OOO.','(': 'O.O..O', ')': '.O.OO.', '-': '....O.', 
    '/': '.O..O.', '<': '.OO.O.', '>': 'O..OO.'
};

const latinLetters = Object.fromEntries(
    Object.entries(brailleLetters).map(([key, value]) => [value, key])
);
const latinNumbers = Object.fromEntries(
    Object.entries(brailleNumbers).map(([key, value]) => [value, key])
);

function isNumber(char) {
    return /^[0-9]$/.test(char);
}
function isCapital(char) {
    return /^[A-Z]$/.test(char);
}

function isBraille(input) {
    const regex = /^[O.]+$/;
    return regex.test(input);
}

function translateBraille(input) {
    const braille = input.match(/.{1,6}/g);
    var translatedString = '';
    var capitalizing = false;
    var numerical = false;
    braille.forEach(pattern => {
        if (pattern === '.O.OOO') {
            // Set flag for numbers
            numerical = true;
        }
        else if (pattern === '.....O') {
            // Set flag for capitalizing
            capitalizing = true;
        } else {
            // Translate the Braille pattern
            var translatedChar = '';
            if(numerical)
            {
                translatedChar = latinNumbers[pattern] || '?';
                translatedString += translatedChar;
            }
            else
            {
                translatedChar = latinLetters[pattern] || '?';
                translatedString += capitalizing ? translatedChar.toUpperCase() : translatedChar;
            }

            // Reset flags
            capitalizing = false;
            if(translatedChar == ' ')
                numerical = false;
        }
    });

    return translatedString;
}

function translateEnglish(input) {
    const latin = input.match(/.{1,1}/g);
    var translatedString = '';
    var numberMode = false;
    latin.forEach(pattern => {
        if (isNumber(pattern) && !numberMode) {
            translatedChar = '.O.OOO' + brailleNumbers[pattern] || '?';
            translatedString += translatedChar;
            numberMode = true;
        }
        else if (isCapital(pattern)) {
            translatedChar = '.....O' + brailleLetters[pattern.toLowerCase()] || '?';
            translatedString += translatedChar;
        }
        else{
            if(numberMode)
            {
                translatedChar = brailleNumbers[pattern] || '?';
                translatedString += translatedChar;
            }
            else
            {
                translatedChar = brailleLetters[pattern.toLowerCase()] || '?';
                translatedString += translatedChar;
            }
            if(pattern == ' ')
                numberMode = false;
        } 
    });
    return translatedString;
}

function translator(input) {
    let translatedString = '';
    if (isBraille(input)) {
        translatedString = translateBraille(input);
    } else {
        translatedString = translateEnglish(input);
    }
    return translatedString;
}

// Getting command-line arguments
const input = process.argv.slice(2).join(' ');

// Translate and output the result
const translated = translator(input);
console.log(translated);
