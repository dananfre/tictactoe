"use strict";

//Global object that is populated when the function initGlobalObject() is initiated
let oGameData = {};

window.addEventListener('load', () => {
    initGlobalObject();
    prepGame();
});

function initGlobalObject() {

    oGameData.gameField = ['', '', '', '', '', '', '', '', ''];
    
    oGameData.playerOne = "X";
    oGameData.playerTwo = "O";

    //Current player (X or O)
    oGameData.currentPlayer = "";

    oGameData.nickNamePlayerOne = "";
    oGameData.nickNamePlayerTwo = "";

    oGameData.colorPlayerOne = "";
    oGameData.colorPlayerTwo = "";

    //Antalet sekunder för timerfunktionen
    oGameData.seconds = 5;

    //Timerns ID
    oGameData.timerId = null;

    //Från start är timern inaktiverad
    oGameData.timerEnabled = false;

    //Referens till element för felmeddelanden
    oGameData.timeRef = document.querySelector("#errorMsg");

    //Referens till elementet för spelplanen
    oGameData.gameAreaRef = document.querySelector("#gameArea")

    //Referens till elementet för fomuläret
    oGameData.formRef = document.querySelector("#theForm")
}

function checkForGameOver() {   
   
    if (checkForWinner(oGameData.gameField, oGameData.playerOne)) {
        return 1
    } else if (checkForWinner(oGameData.gameField, oGameData.playerTwo)) {
        return 2
    } else if (checkForDraw()) {
        return 3
    } else {
        return 0
    }

}

function checkForWinner(playerIn, playerSymbol) {
    
    let winningCombinations = [
        [0, 1, 2], // Rad 1
        [3, 4, 5], // Rad 2
        [6, 7, 8], // Rad 3
        [0, 3, 6], // Kolumn 1
        [1, 4, 7], // Kolumn 2
        [2, 5, 8], // Kolumn 3
        [0, 4, 8], // Diagonal 1
        [2, 4, 6], // Diagonal 2
    ]

    for (let combination of winningCombinations) {
        if (combination.every(index => playerIn[index] === playerSymbol)) {
            return true   
        }
    }
    return false
}

function checkForDraw() {

    return oGameData.gameField.every(cell => cell === 'X' || cell === 'O')

}

function prepGame() {
    
    oGameData.gameAreaRef.classList.add("d-none")

    let startGameBtnRef = document.querySelector("#newGame")
    
    startGameBtnRef.addEventListener('click', initiateGame)
    
}

function validateForm() {
    
}

function initiateGame() {

    oGameData.formRef.classList.add("d-none")
    oGameData.gameAreaRef.classList.remove("d-none")
    oGameData.timeRef.innerText = ""

    let nickInputPlayerOneRef = document.querySelector("#nick1")
    oGameData.nickNamePlayerOne = nickInputPlayerOneRef.value;
    
    let nickInputPlayerTwoRef = document.querySelector("#nick2") 
    oGameData.nickNamePlayerTwo = nickInputPlayerTwoRef.value;

    let colorInputPlayerOneRef = document.querySelector("#color1")
    oGameData.colorPlayerOne = colorInputPlayerOneRef.value

    let colorInputPlayerTwoRef = document.querySelector("#color2")
    oGameData.colorPlayerTwo = colorInputPlayerTwoRef.value

    let squaresRef = document.querySelectorAll("#gameArea td")
    
    for (let squareRef of squaresRef) {
        squareRef.innerText = ""
        squareRef.style.backgroundColor = "#ffffff"
    }

    let playerChar = ""
    let playerName = ""

    if(Math.random() < 0.5) {
        playerChar = oGameData.playerOne
        playerName = oGameData.nickNamePlayerOne
        oGameData.currentPlayer = oGameData.playerOne
    } else {
        playerChar = oGameData.playerTwo
        playerName = oGameData.nickNamePlayerTwo
        oGameData.currentPlayer = oGameData.playerTwo
    }
        
    oGameData.timeRef.innerText = `Aktuell spelare är ${playerName}`

    oGameData.gameAreaRef.addEventListener("click", executeMove)
}

function executeMove (event) {
    
    let cellIdClicked = event.target.getAttribute("data-id")
    
    let gameCellsRef = document.querySelectorAll("#gameArea td")    
    
    if (gameCellsRef[cellIdClicked].innerText === ""){
    
        oGameData.gameField[cellIdClicked] = oGameData.currentPlayer
        gameCellsRef[cellIdClicked].innerText = oGameData.currentPlayer
        
        if(oGameData.currentPlayer === "X"){
            gameCellsRef[cellIdClicked].style.backgroundColor = oGameData.colorPlayerOne
            oGameData.currentPlayer = "O"
            oGameData.timeRef.innerText = `Aktuell spelare är ${oGameData.nickNamePlayerTwo}`
        } else {
            gameCellsRef[cellIdClicked].style.backgroundColor = oGameData.colorPlayerTwo
            oGameData.currentPlayer = "X"
            oGameData.timeRef.innerText = `Aktuell spelare är ${oGameData.nickNamePlayerOne}`
        }

        checkForGameOver()

        if (checkForGameOver() === 1 || checkForGameOver() === 2 || checkForGameOver() === 3) {
            gameOver(checkForGameOver())
        }
    }
}

function changePlayer() {

}

function timer() {

}

function gameOver(result) {

    oGameData.gameAreaRef.removeEventListener("click", executeMove)
    oGameData.formRef.classList.remove("d-none")
    oGameData.gameAreaRef.classList.add("d-none")

    if (result === 1) {
        oGameData.timeRef.innerText = `Vinnaren är ${oGameData.nickNamePlayerOne}!`
    } else if (result === 2) {
        oGameData.timeRef.innerText = `Vinnaren är ${oGameData.nickNamePlayerTwo}!`
    } else {
        oGameData.timeRef.innerText = `Oavgjort.`
    }

    oGameData.timeRef.innerText += ` Spela igen?`
   
    initGlobalObject();

}
