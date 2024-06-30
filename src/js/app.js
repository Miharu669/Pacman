let pacman, scoreDisplay, ghostInterval, isGameOver = false, ghostsEaten = 0, score = 0, targetPosition = null;
const moveSpeed = 5;

function initialize() {
  scoreDisplay = document.querySelector(".points");
  pacman = document.querySelector(".pacman");
  pacman.style.position = "absolute";
  centerPacman();
  ghostInterval = setInterval(generateGhost, 2000);
  document.addEventListener("click", handleItemClick);
  requestAnimationFrame(movePacman);
}

document.addEventListener("DOMContentLoaded", initialize);

function centerPacman() {
  const container = document.querySelector(".pacmanCont");
  pacman.style.left = `${(container.clientWidth - pacman.clientWidth) / 2}px`;
  pacman.style.top = `${(container.clientHeight - pacman.clientHeight) / 2}px`;
}

function handleItemClick(event) {
  const item = event.target, containerRect = document.querySelector(".pacmanCont").getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();
  targetPosition = item.classList.contains("fantasmito") || item.classList.contains("cherry")
    ? { x: itemRect.left - containerRect.left, y: itemRect.top - containerRect.top, element: item }
    : { x: event.clientX - containerRect.left, y: event.clientY - containerRect.top };
}

function generateGhost() {
  if (!isGameOver) generateItem("fantasmito", "./public/assets/images/fantasmito.png");
}

function generateCherry() {
  generateItem("cherry", "./public/assets/images/cherry.png");
}

function generateItem(className, src) {
  const container = document.querySelector(".pacmanCont"), item = document.createElement("img");
  item.className = className;
  item.src = src;
  item.style.position = "absolute";
  item.style.left = `${Math.random() * (container.clientWidth - 30)}px`;
  item.style.top = `${Math.random() * (container.clientHeight - 30)}px`;
  container.appendChild(item);
}

function movePacman() {
  if (isGameOver || !targetPosition) return requestAnimationFrame(movePacman);

  const pacmanRect = pacman.getBoundingClientRect(), containerRect = document.querySelector(".pacmanCont").getBoundingClientRect();
  const pacmanX = pacmanRect.left - containerRect.left, pacmanY = pacmanRect.top - containerRect.top;
  const dx = targetPosition.x - pacmanX, dy = targetPosition.y - pacmanY;

  if (Math.abs(dx) > moveSpeed) {
    pacman.style.left = `${pacmanX + Math.sign(dx) * moveSpeed}px`;
  } else if (Math.abs(dy) > moveSpeed) {
    pacman.style.top = `${pacmanY + Math.sign(dy) * moveSpeed}px`;
  } else {
    if (targetPosition.element) eatItem(targetPosition.element);
    targetPosition = null;
  }

  requestAnimationFrame(movePacman);
}

function eatItem(item) {
  if (item.classList.contains("fantasmito")) {
    ghostsEaten++;
    updateScore(100);
    if (ghostsEaten % 3 === 0) generateCherry();
  } else if (item.classList.contains("cherry")) {
    updateScore(500);
  }
  item.remove();
}

function updateScore(points) {
  score += points;
  scoreDisplay.innerText = String(score).padStart(4, "0");
  if (score >= 5000) endGame();
}

function endGame() {
  isGameOver = true;
  clearInterval(ghostInterval);
  document.querySelector(".gameOver").style.display = "block";
}
