document.addEventListener("DOMContentLoaded", () => {
  const gameContainer = document.getElementById("game__container");
  console.log("loading page");

  for (let i = 0; i < 81; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("data-index", i);
    cell.addEventListener("click", onCellClick);
    gameContainer.appendChild(cell);
  }
});
function onCellClick(event){
    const cell = event.target;
    const index = cell.getAttribute('data-index');
    console.log(`Cell ${index} click`)
}