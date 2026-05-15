let dino = document.getElementById("dino");
let tree = document.getElementById("tree");
let game = document.getElementById("game");
let restartBtn = document.getElementById("restartBtn");

let isJumping = false;
let gravity = 0.9;
let position = 0;
let runFrame = 1;
let runSpeed = 5;
let runIntervalId = null;
let verticalVelocity = 0;
let groundOffset = 0;
let gameOver = false;
let score = 0;
let scoreIntervalId = null;
let treePosition = 600;
let treeIntervalId = null;


restartBtn.style.display = "none";

// Handle jump
document.addEventListener("keydown", function (event) {
  if ((event.code === "Space" || event.code === "ArrowUp") && !gameOver) {
    jump();
  }
});


function jump() {
  if (isJumping || gameOver) return;
  isJumping = true;
  verticalVelocity = 13; // initial jump impulse

  const jumpInterval = setInterval(() => {
    if (gameOver) {
      clearInterval(jumpInterval);
      return;
    }

    position += verticalVelocity;
    verticalVelocity -= gravity;

    if (position <= 0) {
      position = 0;
      isJumping = false;
      clearInterval(jumpInterval);
    }

    dino.style.bottom = position + "px";
  }, 20);
}

// Move tree
function moveTree() {
  treeIntervalId = setInterval(() => {
    if (gameOver) return;

    treePosition -= runSpeed;

    // When the tree is out of the screen
    // reset the tree position to the right again
    if (treePosition < -40) {
      treePosition = 600;

      // Set random tree height in between 50px-70px after 200 score
      if (score > 200) {
        const randomHeight = Math.floor(Math.random() * 20) + 50;
        treePosition= Math.floor(Math.random()*400)+600;
        console.log(treePosition);
       
 

        tree.style.height = randomHeight + "px";
        tree.style.width = 48 * (randomHeight / 100) + "px";
      }
      else {
        tree.style.height = "50px";
        tree.style.width = "24px";
      }
    }
    tree.style.left = treePosition + "px";
  }, 20);
}

function stopTreeMovement() {
  if (treeIntervalId !== null) {
    treeIntervalId = null;
  }
}

moveTree();

// Toggle dino run frames
function startRunAnimation() {
  if (runIntervalId !== null) return;
  runIntervalId = setInterval(() => {
    if (gameOver) return;

    runFrame = runFrame === 1 ? 2 : 1;
    if (runFrame === 1) {
      dino.classList.add("run1");
      dino.classList.remove("run2");
    } else {
      dino.classList.add("run2");
      dino.classList.remove("run1");
    }
  }, 120);
}

// Stops dino run frames
function stopRunAnimation() {
  if (runIntervalId !== null) {
    clearInterval(runIntervalId);
    runIntervalId = null;
  }
}

// Start animating on load
startRunAnimation();

// Scroll ground background continuously based on runSpeed
function scrollGround() {
  setInterval(() => {
    if (gameOver) return;

    groundOffset -= runSpeed;
    game.style.backgroundPosition = groundOffset + "px bottom";
  }, 20);
}

scrollGround();

// Collision detection
function checkCollision() {
  setInterval(() => {
    if (gameOver) return;

    const dinoRect = dino.getBoundingClientRect();
    const treeRect = tree.getBoundingClientRect();
    const gameRect = game.getBoundingClientRect();

    // Convert to game coordinates
    const dinoLeft = dinoRect.left - gameRect.left;
    const dinoRight = dinoRect.right - gameRect.left;
    const dinoTop = dinoRect.top - gameRect.top;
    const dinoBottom = dinoRect.bottom - gameRect.top;

    const treeLeft = treeRect.left - gameRect.left;
    const treeRight = treeRect.right - gameRect.left;
    const treeTop = treeRect.top - gameRect.top;
    const treeBottom = treeRect.bottom - gameRect.top;

    // Check if dino and tree overlap
    if (
      treeRight - dinoLeft > 5 &&
      dinoRight - treeLeft > 5 &&
      treeBottom - dinoTop > 5 &&
      dinoBottom - treeTop > 5
    ) {
      endGame();
      restartBtn.style.display = "inline";
    }
  }, 20);
}

function showTextInsideGameElement({
  id,
  text,
  top,
  left,
  right,
  fontSize,
  transform,
}) {
  const textElement = document.createElement("div");
  textElement.id = id;
  textElement.textContent = text;
  textElement.style.position = "absolute";
  textElement.style.top = top;
  textElement.style.left = left;
  textElement.style.right = right;
  textElement.style.fontSize = fontSize;
  textElement.style.transform = transform;
  textElement.style.zIndex = "1000";
  game.appendChild(textElement);
}

function endGame() {
  gameOver = true;
  stopRunAnimation();
  stopScore();

  // Show game over text
  showTextInsideGameElement({
    id: "gameOverMessage",
    text: "GAME OVER!",
    top: "50%",
    left: "50%",
    right: "",
    fontSize: "20px",
    transform: "translate(-50%, -50%)",
  });
}

// Score system
function startScore() {
  if (scoreIntervalId !== null) return;
  scoreIntervalId = setInterval(() => {
    if (gameOver) return;

    score += 1;
    updateScoreDisplay();
  }, 100); // 0.1 seconds = 100ms
}

function stopScore() {
  if (scoreIntervalId !== null) {
    clearInterval(scoreIntervalId);
    scoreIntervalId = null;
  }
}

function updateScoreDisplay() {
  let scoreElement = document.getElementById("score");
  if (!scoreElement) {
    showTextInsideGameElement({
      id: "score",
      text: "",
      top: "10px",
      left: "",
      right: "10px",
      fontSize: "12px",
      transform: "",
    });
  }
  scoreElement.textContent = "Score: " + score;
}

function restartGame() {
  isJumping = false;
  gravity = 0.9;
  position = 0;
  runFrame = 1;
  runSpeed = 5;
  runIntervalId = null;
  verticalVelocity = 0;
  groundOffset = 0;
  gameOver = false;
  score = 0;
  scoreIntervalId = null;
  treePosition = 600;
  treeIntervalId = null;
  startRunAnimation();
  startScore();

  const gameOverText = document.getElementById("gameOverMessage");
  if (gameOverText) {
    gameOverText.remove();
  }

  
}

// Add restart button event listener
restartBtn.addEventListener("click", restartGame);

checkCollision();
startScore();
