// Get the canvas element and its context
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Define some variables for the game state
let gameRunning = true; // Whether the game is running or not
let gameTime = 0; // The elapsed time of the game in seconds
let gameScore = 0; // The score of the game
let gameLives = 1; // The lives of the game
let player; // The player object
let enemies = []; // An array of enemy objects
let golds = []; // An array of gold objects
let holes = []; // An array of hole objects

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
const NUM_GOLDS = 3; // The number of golds in the game
const NUM_ENEMIES = 2;
const NUM_HOLES = 12;
const ENEMIES_MOVE = false;
const AUTO_COLLECT_GOLDS = false;

// Define some colors for the game elements
const BACKGROUND_COLOR = "transparent"; // The color of the background
const PLAYER_COLOR = "green"; // The color of the player
const ENEMY_COLOR = "red"; // The color of the enemy
const GOLD_COLOR = "yellow"; // The color of the gold
const HOLE_COLOR = "black"; // The color of the hole

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

// Define a function to initialize the game
function initGame() {
  console.log(`Initializing the game...`);
  // Create the player object
  console.log(`Creating the player object...`);
  player = {
    // x: Math.floor(Math.random() * GRID_COLS) * GRID_SIZE, // The x coordinate of the player
    // y: Math.floor(Math.random() * GRID_ROWS) * GRID_SIZE, // The y coordinate of the player
    ...generateRandomEmptyXY(),
    size: PLAYER_SIZE, // The size of the player
    color: PLAYER_COLOR, // The color of the player
  };
  console.log(`Player at (${player.x}, ${player.y})`, player);

  // Create some enemy objects
  console.log(`Creating ${NUM_ENEMIES} enemies...`);
  for (let i = 0; i < NUM_ENEMIES; i++) {
    // Generate a random position for the enemy
    // let x = Math.floor(Math.random() * GRID_COLS) * GRID_SIZE; // TODO: generateRandomXY
    // let y = Math.floor(Math.random() * GRID_ROWS) * GRID_SIZE; // TODO: generateRandomEmptyXY

    // Create the enemy object
    let enemy = {
      // x: x, // The x coordinate of the enemy
      // y: y, // The y coordinate of the enemy
      ...generateRandomEmptyXY(),
      size: ENEMY_SIZE, // The size of the enemy
      color: ENEMY_COLOR, // The color of the enemy
    };

    // Add the enemy to the array of enemies
    enemies.push(enemy);
    console.log(`Enemy at (${enemy.x}, ${enemy.y})`);
  }

  // Create some gold objects
  console.log(`Creating ${NUM_GOLDS} golds...`);
  for (let i = 0; i < NUM_GOLDS; i++) {
    // Generate a random position for the gold
    // let x = Math.floor(Math.random() * GRID_COLS) * GRID_SIZE;
    // let y = Math.floor(Math.random() * GRID_ROWS) * GRID_SIZE;

    // Create the gold object
    let gold = {
      // x: x, // The x coordinate of the gold
      // y: y, // The y coordinate of the gold
      ...generateRandomEmptyXY(),
      size: GOLD_SIZE, // The size of the gold
      color: GOLD_COLOR, // The color of the gold
    };

    // Add the gold to the array of golds
    golds.push(gold);
    console.log(`Gold at (${gold.x}, ${gold.y})`);
  }

  // Create some hole objects
  console.log(`Creating ${NUM_HOLES} holes...`);
  for (let i = 0; i < NUM_HOLES; i++) {
    // Generate a random position for the hole
    // let x = Math.floor(Math.random() * GRID_COLS) * GRID_SIZE;
    // let y = Math.floor(Math.random() * GRID_ROWS) * GRID_SIZE;

    // Create the hole object
    let hole = {
      // x: x, // The x coordinate of the hole
      // y: y, // The y coordinate of the hole
      ...generateRandomEmptyXY(),
      size: HOLE_SIZE, // The size of the hole
      color: HOLE_COLOR, // The color of the hole
    };

    // Add the hole to the array of holes
    holes.push(hole);
    console.log(`Hole at (${hole.x}, ${hole.y})`);
  }

  // Start the game loop
  console.log(`Starting the game loop...`);

  // Handle the user input
  handleInput();

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
      // Choose a random direction for the enemy
      let direction = Math.floor(Math.random() * 4);

      // Set the enemy velocity based on the direction
      switch (direction) {
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
      // Play the hit sound
      HIT_ENEMY_SOUND.play();

      // Reduce the lives
      gameLives--;

      // Check the game over condition
      if (!gameLives) {
        // Play the game over sound
        GAME_OVER_SOUND.play();

        // Show the game over message
        alert("GAME OVER");

        // Reload the page
        document.location.reload();

        // Stop the game loop
        gameRunning = false;
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
        // Play the collect sound
        COLLECT_GOLD_SOUND.play();
        // Increase the score
        gameScore++;
        // Check the game win condition
        if (gameScore === NUM_GOLDS) {
          // Play the game win sound
          GAME_WIN_SOUND.play();
          // Show the game win message
          alert("YOU WIN");
          // Reload the page
          document.location.reload();
          // Stop the game loop
          gameRunning = false;
        } else {
          // Remove the gold from the array
          golds.splice(golds.indexOf(gold), 1);
        }
      }
    }
  }

  // Update the hole position
  for (let hole of holes) {
    // Check the collision between the hole and the player
    if (isColliding(hole, player)) {
      // Play the hit sound
      HIT_HOLE_SOUND.play();

      // Reduce the lives
      gameLives--;

      // Check the game over condition
      if (!gameLives) {
        // Play the game over sound
        GAME_OVER_SOUND.play();

        // Show the game over message
        alert("GAME OVER");

        // Reload the page
        document.location.reload();

        // Stop the game loop
        gameRunning = false;
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
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  for (let i = 0; i <= GRID_ROWS; i++) {
    for (let j = 0; j <= GRID_COLS; j++) {
      let x = j * GRID_SIZE;
      let y = i * GRID_SIZE;
      ctx.strokeRect(x, y, GRID_SIZE, GRID_SIZE);
    }
  }

  // Draw the player
  ctx.fillStyle = player.color;
  ctx.fillRect(
    player.x + (GRID_SIZE - player.size) / 2,
    player.y + (GRID_SIZE - player.size) / 2,
    player.size,
    player.size
  );

  // // Draw the player
  // ctx.fillStyle = player.color;
  // ctx.fillRect(player.x, player.y, player.size, player.size);

  // Draw the enemies
  for (let enemy of enemies) {
    ctx.fillStyle = enemy.color;
    ctx.fillRect(
      enemy.x + (GRID_SIZE - enemy.size) / 2,
      enemy.y + (GRID_SIZE - enemy.size) / 2,
      enemy.size,
      enemy.size
    );
  }

  // // Draw the enemies
  // for (let enemy of enemies) {
  //   ctx.fillStyle = enemy.color;
  //   ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
  // }

  // Draw the golds
  for (let gold of golds) {
    ctx.fillStyle = gold.color;
    ctx.fillRect(
      gold.x + (GRID_SIZE - gold.size) / 2,
      gold.y + (GRID_SIZE - gold.size) / 2,
      gold.size,
      gold.size
    );
  }

  // // Draw the golds
  // for (let gold of golds) {
  //   ctx.fillStyle = gold.color;
  //   ctx.fillRect(gold.x, gold.y, gold.size, gold.size);
  // }

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

  // // Draw the holes
  // for (let hole of holes) {
  //   ctx.fillStyle = hole.color;
  //   ctx.fillRect(hole.x, hole.y, hole.size, hole.size);
  // }

  // Draw the game information
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + gameScore, 10, 30);
  ctx.fillText("Lives: " + gameLives, 10, 60);
}

// Define a function to handle the user input
function handleInput() {
  // Listen for keydown events
  document.addEventListener("keydown", function (event) {
    // Check if the game is running
    if (gameRunning) {
      // Get the key code
      let keyCode = event.keyCode;

      // Switch on the key code
      switch (keyCode) {
        case 37: // Left arrow
          // Move the player left
          player.x -= GRID_SIZE;
          // player.vx = -1;
          // player.vy = 0;
          break;
        case 38: // Up arrow
          // Move the player up
          player.y -= GRID_SIZE;
          // player.vx = 0;
          // player.vy = -1;
          break;
        case 39: // Right arrow
          // Move the player right
          player.x += GRID_SIZE;
          // player.vx = 1;
          // player.vy = 0;
          break;
        case 40: // Down arrow
          // Move the player down
          player.y += GRID_SIZE;
          // player.vx = 0;
          // player.vy = 1;
          break;
        case 32: // Space
          // Collect the gold
          for (let gold of golds) {
            // Check if the player is in the same block as the gold
            if (player.x == gold.x && player.y == gold.y) {
              // Play the collect sound
              COLLECT_GOLD_SOUND.play();

              // Increase the score
              gameScore++;

              console.log("GAME SCORE: ", gameScore, golds, golds.length);

              // Check the game win condition
              if (gameScore === NUM_GOLDS) {
                // Play the game win sound
                GAME_WIN_SOUND.play();

                // Show the game win message
                alert("YOU WIN");

                // Reload the page
                document.location.reload();

                // Stop the game loop
                gameRunning = false;
              } else {
                // Remove the gold from the array
                golds.splice(golds.indexOf(gold), 1);
              }
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
