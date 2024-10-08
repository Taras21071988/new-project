const gameContainer = document.getElementById("game__container");
const numberButtonsContainer = document.getElementById("number__buttons");
const generateButton = document.getElementById("generate__button");
let selectedCell = null;
let currentLevel = "light";
let errorCount = 0;
const maxErrors = 3;
let sudokuBoard = [];
let originalBoard = [];
let timer;
let secondsElapsed = 0;

document.addEventListener("DOMContentLoaded", () => {
  createEmptyBoard();
  createNumberButtons();
  generateButton.addEventListener("click", generateNewBoard);
  document.addEventListener("keydown", onPressKey);
  document
    .getElementById("level__light")
    .addEventListener("click", () => changeLevel("light"));
  document
    .getElementById("level__medium")
    .addEventListener("click", () => changeLevel("medium"));
  document
    .getElementById("level__hard")
    .addEventListener("click", () => changeLevel("hard"));
});
document.getElementById("delete__button").addEventListener("click", () => {
  removeErrorValue();
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

function checkInput(row, col, number) {
  if (number === originalBoard[row][col]) {
    selectedCell.textContent = number;
    selectedCell.classList.add("user-input");
    selectedCell.classList.remove("error-input");
    sudokuBoard[row][col] = number;

    if (isGameComplete()) {
      stopTimer();
      alert("Поздравляем! Вы завершили игру.");
    }
    return true;
  } else {
    selectedCell.textContent = number;
    selectedCell.classList.add("error-input");
    errorCount++;
    updateErrorCounter();
    alert("Ошибка: введено неверное значение!");
    if (errorCount >= maxErrors) {
      stopTimer();
      alert("Игра оконченна, Превышенно количество ошибок!!!");
      resetGame();
    }
  }
}
function isGameComplete() {
  return sudokuBoard.every((row) => row.every((cell) => cell !== 0));
}

function updateErrorCounter() {
  const errorCounterElement = document.getElementById("error__counter");
  errorCounterElement.textContent = `Ошибки: ${errorCount}/3`;
}

function resetGame() {
  sudokuBoard = Array.from({ length: 9 }, () => Array(9).fill(0));
  originalBoard = [];
  renderBoard(sudokuBoard);
  errorCount = 0;
  updateErrorCounter();
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

    cell.classList.remove("user-input");
    cell.classList.remove("error-input");

    if (value !== 0) {
      cell.textContent = value;
    } else {
      cell.textContent = "";
    }
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
  const number = parseInt(button.textContent);

  if (selectedCell) {
    const index = selectedCell.getAttribute("data-index");
    const row = Math.floor(index / 9);
    const col = index % 9;

    if (sudokuBoard[row][col] === 0) {
      checkInput(row, col, number);
    } else {
      console.log(`Ячейка уже заполнена значением ${sudokuBoard[row][col]}`);
    }
  }
}

function onPressKey(event) {
  const key = event.key;

  if (key >= "1" && key <= "9") {
    const number = parseInt(key);

    if (selectedCell) {
      const index = selectedCell.getAttribute("data-index");
      const row = Math.floor(index / 9);
      const col = index % 9;

      if (sudokuBoard[row][col] === 0) {
        checkInput(row, col, number);
      } else {
        console.log(`Ячейка уже заполнена значением ${sudokuBoard[row][col]}`);
      }
    }
  }
}

function generateNewBoard() {
  originalBoard = generateSudokuBoard();
  sudokuBoard = JSON.parse(JSON.stringify(originalBoard));
  selectedCell = null;
  renderBoard(sudokuBoard);
  setDifficulty(currentLevel);
  startTimer();
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
        const possibleValues = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
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

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function setDifficulty(level) {
  let cellsToHide;
  switch (level) {
    case "light":
      cellsToHide = 20;
      break;
    case "medium":
      cellsToHide = 40;
      break;
    case "hard":
      cellsToHide = 60;
      break;
  }

  const cells = document.querySelectorAll(".cell");
  const indices = Array.from({ length: 81 }, (_, i) => i);
  shuffle(indices);

  for (let i = 0; i < 81; i++) {
    const cell = cells[indices[i]];
    const row = Math.floor(indices[i] / 9);
    const col = indices[i] % 9;
    if (i < cellsToHide) {
      cell.textContent = "";
      sudokuBoard[row][col] = 0;
    } else {
      cell.textContent =
        originalBoard[row][col] !== 0 ? originalBoard[row][col] : "";
    }
  }
  // console.log(originalBoard) Для теста написал
}

function changeLevel(level) {
  currentLevel = level;
  generateNewBoard();
}

function removeErrorValue() {
  if (selectedCell && selectedCell.classList.contains("error-input")) {
    const index = selectedCell.getAttribute("data-index");
    const row = Math.floor(index / 9);
    const col = index % 9;

    sudokuBoard[row][col] = 0;
    selectedCell.textContent = "";
    selectedCell.classList.remove("error-input");
  }
}

function startTimer() {
  stopTimer();

  secondsElapsed = 0;
  updateTimerDisplay();
  timer = setInterval(() => {
    secondsElapsed++;
    updateTimerDisplay();
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function updateTimerDisplay() {
  const minutes = Math.floor(secondsElapsed / 60);
  const seconds = secondsElapsed % 60;
  document.getElementById("timer").textContent = `Время ${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
