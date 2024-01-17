// Get the canvas element and its context
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const cluesEl = document.getElementById("clues");

// Define some variables for the game state
let gameRunning = true; // Whether the game is running or not
let gameTime = 0; // The elapsed time of the game in seconds
let gameScore = 0; // The score of the game
let gameLives = 1; // The lives of the game
let player; // The player object
let enemies = []; // An array of enemy objects
let golds = []; // An array of gold objects
let holes = []; // An array of hole objects
let grid = [];
let visible = [];

// Define some constants for the game settings
const GAME_FPS = 60; // The frames per second of the game
const GAME_SPEED = 5; // The speed of the game in pixels per frame
const PLAYER_SIZE = 50; // The size of the player in pixels
const ENEMY_SIZE = 50; // The size of the enemy in pixels
const GOLD_SIZE = 25; // The size of the gold in pixels
const HOLE_SIZE = 75; // The size of the hole in pixels
const GRID_SIZE = 100; // The size of the grid in pixels
const GRID_ROWS = 8; // The number of rows in the grid
const GRID_COLS = 8; // The number of columns in the grid
const NUM_GOLDS = 1; // The number of golds in the game
const NUM_ENEMIES = 3;
const NUM_HOLES = 16;
const ENEMIES_MOVE = false;
const AUTO_COLLECT_GOLDS = false;

// Define some colors for the game elements
const BACKGROUND_COLOR = "#fff"; // The color of the background
const PLAYER_COLOR = "#22c55e"; // The color of the player
const ENEMY_COLOR = "#dc2626"; // The color of the enemy
const GOLD_COLOR = "#f59e0b"; // The color of the gold
const HOLE_COLOR = "#334155"; // The color of the hole

// Define some images for the game elements
const PLAYER_IMAGE = new Image(); // The image of the player
PLAYER_IMAGE.src = "player.png"; // The source of the image
const ENEMY_IMAGE = new Image(); // The image of the enemy
ENEMY_IMAGE.src = "enemy.png"; // The source of the image
const GOLD_IMAGE = new Image(); // The image of the gold
GOLD_IMAGE.src = "gold.png"; // The source of the image
const HOLE_IMAGE = new Image(); // The image of the hole
HOLE_IMAGE.src = "hole.png"; // The source of the image

// Define some sounds for the game events
const GAME_OVER_SOUND = new Audio(); // The sound of the game over
GAME_OVER_SOUND.src = "game_over.wav"; // The source of the sound
const GAME_WIN_SOUND = new Audio(); // The sound of the game win
GAME_WIN_SOUND.src = "game_win.wav"; // The source of the sound
const COLLECT_GOLD_SOUND = new Audio(); // The sound of collecting gold
COLLECT_GOLD_SOUND.src = "collect_gold.wav"; // The source of the sound
const HIT_ENEMY_SOUND = new Audio(); // The sound of hitting enemy
HIT_ENEMY_SOUND.src = "hit_enemy.wav"; // The source of the sound
const HIT_HOLE_SOUND = new Audio(); // The sound of hitting hole
HIT_HOLE_SOUND.src = "hit_hole.wav"; // The source of the sound

class Block {
  constructor(
    size = GRID_SIZE,
    color = "#64748b",
    wind = false,
    smell = false,
    bright = false
  ) {
    this.size = size;
    this.color = color;
    this.wind = wind;
    this.smell = smell;
    this.bright = bright;
  }
}

// Define a function to initialize the game
function initGame() {
  console.log(`Initializing the game...`);

  console.log(`Limiting visibility...`);
  for (let i = 0; i <= GRID_ROWS; i++) {
    grid[i] = [];
    visible[i] = [];
    for (let j = 0; j <= GRID_COLS; j++) {
      grid[i][j] = new Block();
      visible[i][j] = false;
    }
  }

  player = {
    ...generateRandomEmptyXY(),
    size: PLAYER_SIZE,
    color: PLAYER_COLOR,
  };
  visible[player.x / GRID_SIZE][player.y / GRID_SIZE] = true;
  console.log(`Created player at (${player.x}, ${player.y})`, player);

  // Create some enemy objects
  console.log(`Creating ${NUM_ENEMIES} enemies...`);
  for (let i = 0; i < NUM_ENEMIES; i++) {
    let enemy = {
      ...generateRandomEmptyXY(),
      size: ENEMY_SIZE,
      color: ENEMY_COLOR,
    };
    // Add the enemy to the array of enemies
    enemies.push(enemy);
    console.log(`Created Enemy at (${enemy.x}, ${enemy.y})`);
  }

  // Create some gold objects
  console.log(`Creating ${NUM_GOLDS} golds...`);
  for (let i = 0; i < NUM_GOLDS; i++) {
    let gold = {
      ...generateRandomEmptyXY(),
      size: GOLD_SIZE,
      color: GOLD_COLOR,
    };
    golds.push(gold);
    console.log(`Created gold at (${gold.x}, ${gold.y})`);
  }

  // Create some hole objects
  console.log(`Creating ${NUM_HOLES} holes...`);
  for (let i = 0; i < NUM_HOLES; i++) {
    let hole = {
      ...generateRandomEmptyXY(),
      size: HOLE_SIZE,
      color: HOLE_COLOR,
    };
    holes.push(hole);
    console.log(`Created hole at (${hole.x}, ${hole.y})`);
  }
  setupUserInputHandler();
  console.log(`Starting the game loop...`);
  requestAnimationFrame(gameLoop);
}

// Define a function to update the game state
function updateGame() {
  // Update the game time
  gameTime += 1 / GAME_FPS;

  // Update the player position
  // player.x += player.vx ?? 0 * GAME_SPEED;
  // player.y += player.vy ?? 0 * GAME_SPEED;

  // Check the player boundaries
  if (player.x < 0) {
    player.x = 0;
  }
  if (player.x > canvas.width - player.size) {
    player.x = canvas.width - player.size;
  }
  if (player.y < 0) {
    player.y = 0;
  }
  if (player.y > canvas.height - player.size) {
    player.y = canvas.height - player.size;
  }

  // Update the enemy position
  for (let enemy of enemies) {
    if (ENEMIES_MOVE) {
      let randomEnemyDirection = Math.floor(Math.random() * 4);
      // Set the enemy velocity based on the direction
      switch (randomEnemyDirection) {
        case 0: // Up
          enemy.vx = 0;
          enemy.vy = -1;
          break;
        case 1: // Down
          enemy.vx = 0;
          enemy.vy = 1;
          break;
        case 2: // Left
          enemy.vx = -1;
          enemy.vy = 0;
          break;
        case 3: // Right
          enemy.vx = 1;
          enemy.vy = 0;
          break;
      }

      // Move the enemy
      enemy.x += enemy.vx ?? 0 * GAME_SPEED;
      enemy.y += enemy.vy ?? 0 * GAME_SPEED;

      // Check the enemy boundaries
      if (enemy.x < 0) {
        enemy.x = 0;
      }
      if (enemy.x > canvas.width - enemy.size) {
        enemy.x = canvas.width - enemy.size;
      }
      if (enemy.y < 0) {
        enemy.y = 0;
      }
      if (enemy.y > canvas.height - enemy.size) {
        enemy.y = canvas.height - enemy.size;
      }
    }

    // Check the collision between the enemy and the player
    if (isColliding(enemy, player)) {
      HIT_ENEMY_SOUND.play();
      gameLives--;
      if (!gameLives) {
        gameOver();
      } else {
        // Reset the player position and velocity
        player.x = Math.floor(Math.random() * GRID_COLS) * GRID_SIZE;
        player.y = Math.floor(Math.random() * GRID_ROWS) * GRID_SIZE;
        player.vx = 0;
        player.vy = 0;

        // Reset the enemy position and velocity
        enemy.x = Math.floor(Math.random() * GRID_COLS) * GRID_SIZE;
        enemy.y = Math.floor(Math.random() * GRID_ROWS) * GRID_SIZE;
        enemy.vx = 0;
        enemy.vy = 0;
      }
    }
  }

  // Update the gold position
  for (let gold of golds) {
    // Check the collision between the gold and the player
    if (AUTO_COLLECT_GOLDS) {
      if (isColliding(gold, player)) {
        collectGold(gold);
      }
    }
  }

  // Update the hole position
  for (let hole of holes) {
    // Check the collision between the hole and the player
    if (isColliding(hole, player)) {
      HIT_HOLE_SOUND.play();
      gameLives--;

      // Check the game over condition
      if (!gameLives) {
        gameOver();
      } else {
        // Reset the player position and velocity
        player.x = Math.floor(Math.random() * GRID_COLS) * GRID_SIZE;
        player.y = Math.floor(Math.random() * GRID_ROWS) * GRID_SIZE;
        player.vx = 0;
        player.vy = 0;
      }
    }
  }
}

// Define a function to render the game graphics
function renderGame() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the background
  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the grid lines
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 1;
  for (let i = 0; i <= GRID_ROWS; i++) {
    for (let j = 0; j <= GRID_COLS; j++) {
      let x = j * GRID_SIZE;
      let y = i * GRID_SIZE;
      ctx.strokeRect(x, y, GRID_SIZE, GRID_SIZE);
    }
  }

  // Draw the holes
  for (let hole of holes) {
    ctx.fillStyle = hole.color;
    ctx.beginPath();
    ctx.arc(
      hole.x + GRID_SIZE / 2,
      hole.y + GRID_SIZE / 2,
      hole.size / 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }

  for (let entity of [player, ...enemies, ...golds]) {
    ctx.fillStyle = entity.color;
    ctx.fillRect(
      entity.x + (GRID_SIZE - entity.size) / 2,
      entity.y + (GRID_SIZE - entity.size) / 2,
      entity.size,
      entity.size
    );
  }

  // // Draw the player
  // ctx.fillStyle = player.color;
  // ctx.fillRect(
  //   player.x + (GRID_SIZE - player.size) / 2,
  //   player.y + (GRID_SIZE - player.size) / 2,
  //   player.size,
  //   player.size
  // );

  // // Draw the enemies
  // for (let enemy of enemies) {
  //   ctx.fillStyle = enemy.color;
  //   ctx.fillRect(
  //     enemy.x + (GRID_SIZE - enemy.size) / 2,
  //     enemy.y + (GRID_SIZE - enemy.size) / 2,
  //     enemy.size,
  //     enemy.size
  //   );
  // }

  // // Draw the golds
  // for (let gold of golds) {
  //   ctx.fillStyle = gold.color;
  //   ctx.fillRect(
  //     gold.x + (GRID_SIZE - gold.size) / 2,
  //     gold.y + (GRID_SIZE - gold.size) / 2,
  //     gold.size,
  //     gold.size
  //   );
  // }

  // loop through the grid rows and columns
  // for (let i = 0; i < GRID_ROWS; i++) {
  //   for (let j = 0; j < GRID_COLS; j++) {
  //     // get the x and y coordinates of the block
  //     let x = j * GRID_SIZE;
  //     let y = i * GRID_SIZE;

  //     // draw the block with its color
  //     const block = grid[i][j];
  //     // ctx.fillStyle = block.color;
  //     // ctx.fillRect(x, y, block.size, block.size);

  //     // check if the player has seen this block before
  //     if (!visible[i][j]) {
  //       // draw a gray color over the block to hide it
  //       ctx.fillStyle = "#64748b";
  //       ctx.fillRect(x + 5, y + 5, block.size - 10, block.size - 10);
  //     }
  //   }
  // }

  // Information
  scoreEl.innerText = gameScore + " / " + NUM_GOLDS;
  livesEl.innerText = gameLives;

  // cluesEl.innerHTML = "";
  // TODO: append child environment clues with different colors

  // Draw the game information
  // ctx.fillStyle = "#3b82f6";
  // ctx.font = "20px Arial";
  // ctx.fillText("Score: " + gameScore, 10, 30);
  // ctx.fillText("Lives: " + gameLives, 10, 60);
}

// Define a function to handle the user input
function setupUserInputHandler() {
  document.addEventListener("keydown", function (event) {
    if (gameRunning) {
      let keyCode = event.keyCode;
      switch (keyCode) {
        case 37: // Left arrow
        case 65: // A
          player.x -= GRID_SIZE;
          // player.vx = -1;
          // player.vy = 0;
          break;

        case 38: // Up arrow
        case 87: // W
          player.y -= GRID_SIZE;
          // player.vx = 0;
          // player.vy = -1;
          break;

        case 39: // Right arrow
        case 68: // D
          player.x += GRID_SIZE;
          // player.vx = 1;
          // player.vy = 0;
          break;

        case 40: // Down arrow
        case 83: // S
          player.y += GRID_SIZE;
          // player.vx = 0;
          // player.vy = 1;
          break;

        case 32: // Space
        case 13: // Enter
        case 69: // E
        case 70: // F
          for (let gold of golds) {
            if (player.x == gold.x && player.y == gold.y) {
              collectGold(gold);
            }
          }
          break;
      }

      // Check the player boundaries
      if (player.x < 0) {
        player.x = 0;
      }
      if (player.x > canvas.width - player.size) {
        player.x = canvas.width - player.size;
      }
      if (player.y < 0) {
        player.y = 0;
      }
      if (player.y > canvas.height - player.size) {
        player.y = canvas.height - player.size;
      }
    }
  });
}

// Define a function to check the collision between two objects
function isColliding(obj1, obj2) {
  return obj1.x === obj2.x && obj1.y === obj2.y;
  // // Check if the objects are overlapping
  // if (
  //   obj1.x < obj2.x + obj2.size &&
  //   obj1.x + obj1.size > obj2.x &&
  //   obj1.y < obj2.y + obj2.size &&
  //   obj1.y + obj1.size > obj2.y
  // ) {
  //   // Return true if they are colliding
  //   return true;
  // } else {
  //   // Return false if they are not colliding
  //   return false;
  // }
}

function generateRandomXY() {
  return {
    x: Math.floor(Math.random() * GRID_COLS) * GRID_SIZE,
    y: Math.floor(Math.random() * GRID_ROWS) * GRID_SIZE,
  };
}

function generateRandomEmptyXY() {
  let xy = generateRandomXY();
  while (isCollidingWithEntities(xy)) {
    xy = generateRandomXY();
  }
  return xy;
}

function isCollidingWithEntities(obj) {
  const entities = [player, ...enemies, ...golds, ...holes];
  for (entity of entities) {
    if (obj && entity && isColliding(obj, entity)) {
      return true;
    }
  }
  return false;
}

function collectGold(gold) {
  COLLECT_GOLD_SOUND.play();
  gameScore++;
  if (gameScore === NUM_GOLDS) {
    win();
  } else {
    console.log(`Removing gold at (${gold.x}, ${gold.y})...`);
    golds.splice(golds.indexOf(gold), 1);
  }
}

function win() {
  GAME_WIN_SOUND.play();
  alert("YOU WIN");
  document.location.reload();
  gameRunning = false;
}

function gameOver() {
  GAME_OVER_SOUND.play();
  alert("GAME OVER");
  document.location.reload();
  gameRunning = false;
}

function AI() {}

// Define a function to run the game loop
function gameLoop() {
  // Update the game state
  updateGame();

  // Render the game graphics
  renderGame();

  // Handle the user input
  // handleInput();

  // Request the next frame
  requestAnimationFrame(gameLoop);
}

// Start the game
initGame();
