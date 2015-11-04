// Create the Enemy object,
// which is used to generate enemies.
var Enemy = function(x, y) {
  // Set the enemy's image and dimensions.
  this.sprite = 'images/enemy-bug.png';
  this.width = 70;
  this.height = 70;
  // Set the enemy's initial location.
  this.x = x;
  this.y = y;
  // Set the enemy's speed.
  var min = 50;
  var max = 200;
  var randSpeed = Math.random() * (max - min) + min;
  this.speed = randSpeed;
};

// Update the enemy's position.
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // Update the Enemy's location.
  var randPos = Math.floor(Math.random() * 3);
  // If the enemy's x-coordinate exceeds 500 pixels,
  // then move the enemy to the left side of the screen.
  if (this.x > 500) {
    // Move the enemy to (0 - Enemy's width) in pixels.
    this.x = -this.width;
    if (randPos === 0) {
      this.y = 55;
    } else if (randPos === 1) {
      this.y = 140;
    } else {
      this.y = 225;
    }
    // Else, move the enemy across the screen.
    // Multiply any movement by the dt parameter
    // to ensure the game runs at the same speed
    // on all computers.
  } else {
    this.x += (this.speed * dt);
  }

  // Handle collision with the player.
  // Ref: https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  if (player.x < this.x + this.width &&
    player.x + player.width > this.x &&
    player.y < this.y + this.height &&
    player.height + player.y > this.y) {
     player.reset();
     if (player.score < 10) {
       player.removeLives();
     }
  }
};

// Draw the enemy on the screen.
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Create the Player object,
// which is used to generate the player.
var Player = function(x, y) {
  // Load the player's image by setting this.sprite
  // to the appropriate image in the image folder.
  this.sprite = 'images/char-horn-girl.png';
  this.width = 70;
  this.height = 70;
  // Add audio property.
  this.audio = document.getElementById("audio");
  // Set the player's initial location.
  this.x = x;
  this.y = y;
};

// Update the player's position.
// Parameter: dt, a time delta between ticks
Player.prototype.update = function() {
  this.moveLeft = this.x - 41;
  this.moveRight = this.x + 41;
  this.moveUp = this.y - 41;
  this.moveDown = this.y + 41;
};

// Draw the player on the screen.
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  // player.showScore();
  // player.showLives();
  this.showLivesAndScore();
};

// Move the player back to his or her initial position.
Player.prototype.reset = function() {
  this.x = 200;
  this.y = 400;
};

// Create the score.
Player.prototype.initScore = function() {
  this.score = 0;
};

// Increment the score.
Player.prototype.addScore = function() {
  this.score += 1;
};

// Create the life count.
Player.prototype.initLives = function() {
  this.lives = 5;
};

// Decrement the life count until it reaches 0.
Player.prototype.removeLives = function() {
  this.lives = (this.lives > 0) ? this.lives -= 1 : this.lives = 0;
};

Player.prototype.showLivesAndScore = function() {
  ctx.font = "16px sans-serif";
  // If the player has lives, show the score and life count.
  if (this.lives > 0) {
    // If the score is less than 10, show the score and life count.
    if (this.score < 10) {
      ctx.fillStyle = "white";
      ctx.fillText("Score: " + this.score + "/10", 7, 572);
      ctx.fillStyle = "yellow";
      ctx.fillText("Lives: " + this.lives + "/5", 415, 572);
    }
    // Else, the show winning notification.
    else {
      this.sprite = 'images/char-princess-girl.png';
      ctx.fillStyle = "yellow";
      ctx.font = "20px sans-serif";
      ctx.fillText("You Did It!", 206, 572);
      // Remove enemies, allowing princess to travel freely.
      allEnemies = [];
    }
  }
  // Else, show the losing notification.
  else {
    // If the score is less than 10, show losing notification.
    // Else, show nothing.
    if (this.score < 10) {
      ctx.fillStyle = "yellow";
      ctx.font = "20px sans-serif";
      ctx.fillText("Game Over", 202, 572);
      win.cancelAnimationFrame(main);
    }
  }
};

// Move the player according to allowedKeys input.
Player.prototype.handleInput = function(allowedKeys) {
  // Left key should move the player to the left,
  // right key to the right,
  // up should move the player up and
  // down should move the player down.
  // Check for off-screen movement and handle appropriately.
  if (allowedKeys === 'left') {
    if (this.x >= 50) {
      this.x = this.moveLeft;
    } else {
      this.x = this.x;
    }
  } else if (allowedKeys === 'right') {
    if (this.x <= 350) {
      this.x = this.moveRight;
    } else {
      this.x = this.x;
    }
  } else if (allowedKeys === 'up') {
    if (this.y >= 50) {
      this.y = this.moveUp;
    } else {
      // If the player reaches the water,
      // the game should be reset by moving the player
      // back to his or her initial position.
      if (this.y === 0 && this.x === 200) {
        this.addScore();
      } else {
        this.removeLives();
      }
      this.reset();
    }
  } else if (allowedKeys === 'down') {
    if (this.y <= 350) {
      this.y = this.moveDown;
    } else {
      this.y = this.y;
    }
  }
  if (allowedKeys === 'left' ||
      allowedKeys === 'right' ||
      allowedKeys === 'up' ||
      allowedKeys === 'down') {
    audio.src = "audio/walk.wav";
    audio.play();
  }
};

// Place all enemy objects in an array called allEnemies.
var enemy1 = new Enemy(0, 55);
var enemy2 = new Enemy(100, 140);
var enemy3 = new Enemy(200, 225);
var allEnemies = [enemy1, enemy2, enemy3];

// Place the player object in a variable called player.
var player = new Player(200, 400);

// Initialize the score variable.
player.initScore();
player.initLives();

// This listens for key presses and sends the keys
// to the Player.handleInput() method.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };
  // Call the handleInput method.
  player.handleInput(allowedKeys[e.keyCode]);
});
