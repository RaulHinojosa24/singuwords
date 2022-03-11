const letters = "abcdefghijklmnñopqrstuvwxyz";
const secretWord = "letra";

let keyPress = false;
let table = [[false], [false], [false], [false], [false], [false]];

document.addEventListener("keydown", keyDownPressed);

function keyDownPressed(event) {
    if (!keyPress) {
        keyPress = true;

        if (letters.includes(event.key.toLowerCase())) {
            addLetterOnTile(event.key.toLowerCase());
        } else if (event.code.includes("Enter")) {
            checkWord();
        } else if (event.code.includes("Backspace")) {
            deleteLetter();
        }
    }
}

document.addEventListener("keyup", keyUpPressed);

function keyUpPressed(event) {
    keyPress = false;
}

function addLetterOnTile(letter) {
    table.every((row, index) => {
        if (!row[0]) {
            if (row.length < 6) {
                row.push(letter);

                fillTilesOnRow(index);

                return false;
            } else if (row.length == 6) {
                return false;

            }
        }

        return true;
    });
};

function checkWord() {
    table.every((row, index) => {
        if (!row[0]) {
            if (row.length == 6) {
                colorRow(index);
                return false;
            } else {
                alert("La palabra NO está completa.");
                return false;
            }
        }

        return true;
    });
};

function fillTilesOnRow(index) {
    const tiles = document.querySelectorAll(`.row-${index} *`);

    tiles.forEach(tile => {
        tile.className = "tile";
        tile.textContent = "";
    });

    for (let i = 1; i < table[index].length; i++) {
        tiles[i - 1].textContent = table[index][i];
        tiles[i - 1].classList.add("fill");
    }
}

function colorRow(index) {
    const tiles = document.querySelectorAll(`.row-${index} *`);
    const comparison = compareWords(secretWord, table[index]);
    table[index][0] = true;

    tiles.forEach((tile, index) => {
        switch (comparison[index]) {
            case 1:
                tile.classList.add("correct");
                break;
            case 0:
                tile.classList.add("present");
                break;
            case -1:
                tile.classList.add("wrong");
                break;
        }
    });

    checkIfGameOver(comparison);
};

function compareWords(secret, input) {
    let comparison = [];

    for (let i = 0; i < secretWord.length; i++) {
        if (secretWord[i] == input[i + 1]) {
            comparison.push(1);
        } else if (secretWord.includes(input[i + 1])) {
            comparison.push(0);
        } else {
            comparison.push(-1);
        }
    }

    return comparison;
};

function deleteLetter() {
    table.every((row, index) => {
        if (!row[0]) {
            if (row.length > 1) {
                row.splice(row.length - 1, 1);

                fillTilesOnRow(index);

                return false;
            }
        }

        return true;
    });
}

function checkIfGameOver(comparison) {
    const score = comparison.reduce((sum, a) => sum + a, 0);

    if (score == 5) {
        alert("ENHORABUENA, HAS GANADO.");
        document.removeEventListener("keydown", keyDownPressed);
        document.removeEventListener("keyup", keyUpPressed);
    } else if (table[0][0] && table[1][0] && table[2][0] && table[3][0] && table[4][0] && table[5][0]) {
        alert("LO SIENTO, SE TE HAN ACABADO LOS INTENTOS.");
    }
}