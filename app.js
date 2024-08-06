const gameContainer = document.getElementById("game__container");
const numberButtonsContainer = document.getElementById("number__buttons");
let selectedCell = null;
const generateButton = document.getElementById("generate__button");
let sudokuBoard = [];

document.addEventListener("DOMContentLoaded", () => {
  createEmptyBoard();
  generateNewBoard();
  createNumberButtons();
  document.addEventListener("keydown", onPressKey);
  generateButton.addEventListener("click", generateNewBoard);
});

function createEmptyBoard() {
  for (let i = 0; i < 81; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("data-index", i);
    cell.addEventListener("click", onCellClick);
    gameContainer.appendChild(cell);
  }
}

function onCellClick(event) {
  const cell = event.target;

  if (selectedCell) {
    selectedCell.classList.remove("selected");
  }
  cell.classList.add("selected");
  const index = cell.getAttribute("data-index");
  selectedCell = cell;
  const row = Math.floor(index / 9);
  const col = index % 9;
  const value = sudokuBoard[row][col];
  console.log(`Cell ${index} clicked. Value: ${value}`);
}

function renderBoard(board) {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    const index = cell.getAttribute("data-index");
    const row = Math.floor(index / 9);
    const col = index % 9;
    const value = board[row][col];
    cell.textContent = value !== 0 ? value : "";
  });
}

function createNumberButtons() {
  for (let i = 1; i <= 9; i++) {
    const button = document.createElement("div");
    button.classList.add("number__button");
    button.textContent = i;
    button.addEventListener("click", onNumberButtonClick);
    numberButtonsContainer.appendChild(button);
  }
}
function onNumberButtonClick(event) {
  const button = event.target;
  const number = button.textContent;
  console.log(`Нажал на ${number}`);
}
function onPressKey(event) {
  const key = event.key;
  if (key >= "1" && key <= "9") {
    console.log(`Нажата кнопка ${key}`);
  }
}
function generateNewBoard() {
  sudokuBoard = generateSudokuBoard();
  renderBoard(sudokuBoard);
}

function generateSudokuBoard() {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillBoard(board);
  return board;
}

function fillBoard(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        const possibleValues = sfuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (let value of possibleValues) {
          if (isValidMove(board, row, col, value)) {
            board[row][col] = value;
            if (fillBoard(board)) {
              return true;
            } else {
              board[row][col] = 0;
            }
          }
        }
        return false;
      }
    }
  }
  return true;
}

function isValidMove(board, row, col, value) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === value || board[i][col] === value) {
      return false;
    }
  }
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === value) {
        return false;
      }
    }
  }
  return true;
}

function sfuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
