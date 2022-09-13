var arr = [[], [], [], [], [], [], [], [], []]; //this should be displayed in the web

//connecting HTML divs of cells to the arr by using ids
for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
        arr[i][j] = document.getElementById(i * 9 + j);
    }
}

//after copying from board, filling all those boxes with red
function setColor(board) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (board[i][j] != 0) {
                arr[i][j].style.color = "#DC3545"; //this is red
            }
        }
    }
}

function resetColor() {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            arr[i][j].style.color = "green";
        }
    }
}

var board = [[], [], [], [], [], [], [], [], []];


let button = document.getElementById('generate-sudoku');
let solve = document.getElementById('solve');

console.log(arr);
function changeBoard(board) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (board[i][j] != 0) {
                arr[i][j].innerText = board[i][j];
            }
            else
                arr[i][j].innerText = '';
        }
    }
}
function disableGenerateBtn() {
    button.disabled = true;
}
function disableSolveBtn() {
    solve.disabled = true;
}
function enableGenerateBtn() {
    button.disabled = false;
}
function enableSolveBtn() {
    solve.disabled = false;
}

disableGenerateBtn();
disableSolveBtn();

function disableLevelBtn() {
    document.querySelector(".easy").disabled = true;
    document.querySelector(".intermediate").disabled = true;
    document.querySelector(".difficult").disabled = true;
}

function enableLevelBtn() {
    document.querySelector(".easy").disabled = false;
    document.querySelector(".intermediate").disabled = false;
    document.querySelector(".difficult").disabled = false;
}

let easy = false;
let difficult = false;
let intermediate = false;
const easyBtn = document.querySelector(".easy");
const intermediateBtn = document.querySelector(".intermediate");
const difficultBtn = document.querySelector(".difficult");
easyBtn.onclick = () => {
    easy = true;
    disableLevelBtn();
    enableGenerateBtn();
}
intermediateBtn.onclick = () => {
    intermediate = true;
    disableLevelBtn();
    enableGenerateBtn();
}
difficultBtn.onclick = () => {
    difficult = true;
    disableLevelBtn();
    enableGenerateBtn();
}

button.onclick = function () {
    var xhrRequest = new XMLHttpRequest();

    method = 'GET';
    //we can change the difficulty of the puzzle the allowed values of difficulty are easy, medium, hard and random
    if (easy == true)
        url = 'https://sugoku.herokuapp.com/board?difficulty=easy';
    else if (difficult == true)
        url = 'https://sugoku.herokuapp.com/board?difficulty=medium';
    else if (difficult == true)
        url = 'https://sugoku.herokuapp.com/board?difficulty=hard';

    //initialising the req to the server
    xhrRequest.open(method, url);
    xhrRequest.onload = function () {
        //on loading, we get a data response in JSON format; 
        //we paerse it to readable js format and store it int a variable
        var response = JSON.parse(xhrRequest.response)
        console.log(response);

        //making all the box's inner html text color as green
        resetColor();

        //we got a unsolved sudoku board via the API call
        //assinging it to our board variable to solve
        board = response.board;

        //make the color style of those boxes as red
        setColor(board);

        //update the table and displaying it in website
        changeBoard(board);
        enableSolveBtn();
    }

    //now send the req to the web page of ours
    xhrRequest.send();
}



function isPossible(board, sr, sc, val) {
    for (var row = 0; row < 9; row++) {
        if (board[row][sc] == val) {
            return false;
        }
    }

    for (var col = 0; col < 9; col++) {
        if (board[sr][col] == val) {
            return false;
        }
    }

    var smfri = Math.floor((sr / 3)) * 3; //sub-matrix first row index
    var smfci = Math.floor((sc / 3)) * 3; //sub_matrix first col index

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (board[smfri + i][smfci + j] == val) {
                return false;
            }
        }
    }
    return true;

}

//main board filling logic - backtracking
function solveSudokuHelper(board, row, col) {
    if (row == 9) {
        changeBoard(board);
        return;
    }
    var nrow = 0, ncol = 0;
    if (col == 8) {
        nrow = row + 1;
        ncol = 0;
    }
    else {
        nrow = row;
        ncol = col + 1;
    }
    if (board[row][col] != 0) {
        solveSudokuHelper(board, nrow, ncol);
    }
    else {
        for (var po = 1; po <= 9; po++) {
            if (isPossible(board, row, col, po)) {
                board[row][col] = po;
                solveSudokuHelper(board, nrow, ncol);
                board[row][col] = 0;
            }
        }
    }
}

async function solveSudoku(board) {
    solveSudokuHelper(board, 0, 0);
}

solve.onclick = async function () {
    await solveSudoku(board);
    enableLevelBtn();
    disableGenerateBtn();
    disableSolveBtn();
    easy = false;
    difficult = false;
    intermediate = false;
}