const gameContainer = document.getElementById("game__container");
const numberButtonsContainer = document.getElementById("number__buttons");

document.addEventListener("DOMContentLoaded", () => {
  createEmptyBoard();
  renderBoard(sudokuBoard);
  createNumberButtons();
  document.addEventListener("keydown",onPressKey)
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
  const index = cell.getAttribute("data-index");
  const row = Math.floor(index / 9);
  const col = index % 9;
  const value = sudokuBoard[row][col];
  console.log(`Cell ${index} clicked. Value: ${value}`);
}

const sudokuBoard = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

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
