// helper functions
function getMousePos(event) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

//global vars (yuck, i know, but it's ok for this narrow application)
var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    scoreEl = document.getElementById('score'),
    livesEl = document.getElementById('lives'),
    gameOverEl = document.getElementById('gameOver'),
    closeEl = document.getElementById('close'),
    width = window.innerWidth - 100,
    height = window.innerHeight -10,
    gameOver = false,
    player = {
      score: 0,
      lives: 5,
      h: 20,
      w: 20,
      x: 0,
      y: height - 70, // player is 20px tall, draw at 60px above the bottom of screen
      fire: function() {
        var shot = new Bullet(player.x);
      }
    },
    Bullet = function(x) {
      this.h = 10;
      this.w = 5;
      this.x = x;
      this.y = height - 75;
      shots.push(this);
    },
    Enemy = function() {
      this.r = Math.floor(Math.random() * 7 ) + 20;
      this.y = 0;
      this.color = '#' + Math.random().toString(16).slice(2, 8); // thanks jennifer dewalt!
      var random = Math.floor(Math.random() * width - this.r);
      if(random < 0) { random = 0; }

      this.x = random;
      enemies.push(this);
    },
    shots = [],
    enemies = [];

//event listeners
document.addEventListener('DOMContentLoaded', function(e) {
  canvas.height = height;
  canvas.width = width;
});

closeEl.addEventListener('click', function(e) {
  e.preventDefault();
  document.getElementById('welcome').style.display = "none";
  initGame();
});

canvas.addEventListener('mousemove', function(event) {
  player.x = getMousePos(event).x;
  if(player.x >= width - player.w) {
    player.x = width - player.w; // prevent drawing player offscreen by creating a boundary equal to the player width on the right edge of the screen
  }
}, false);

document.addEventListener('click', function(e) { // attach handler to document instead of canvas so if you're in the margin, it will still fire
  player.fire();
});

//game functions
function drawPlayer() {
  context.fillStyle = '#000000';
  context.fillRect(player.x, player.y, player.w, player.h);
};

function drawShots() {
  context.fillStyle = '#FF0000';
  shots.forEach(function(shot, index) {
    context.fillRect(shot.x, shot.y, shot.w, shot.h);
    shot.y -= (shot.h / 2);
    enemies.forEach(function(enemy, indexEnemy) {
      if(shot.x < enemy.x + enemy.r && shot.x > enemy.x - enemy.r) { //if shot is horizontally between enemy's x center plus it's radius (center to right edge) or it's x center minus radius (center to left edge)
        if(shot.y <= enemy.y + enemy.r) { //if above is true and shot is vertically touching edge of enemy
          player.score++; // bump score
          shots.splice(index, 1); //remove this shot
          enemies.splice(indexEnemy, 1); //remove hit enemy
          new Enemy; // create a new enemy
        }
      }
    });
    if(shot.y <= 0) {
      shots.splice(index, 1); // remove if it's at the top of the screen
    }
  });
};

function drawEnemies() {
  enemies.forEach(function(enemy, index) {
    context.beginPath();
    context.arc(enemy.x, enemy.y, enemy.r, 0, 2 * Math.PI);
    context.fillStyle = enemy.color;
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = '#000000';
    context.stroke();
    enemy.y++;
    if(enemy.y > player.y) {
      enemies.splice(index, 1);
      player.lives--;
      new Enemy;
      if(player.lives == 0) {
        doGameOver();
      }
    }
  });
};

function updateInfo() {
  scoreEl.innerText = player.score;
  livesEl.innerText = player.lives;
}

function draw() {
  context.clearRect(0,0,width,height);
  drawPlayer();
  drawShots();
  drawEnemies();
  updateInfo();
  if(!gameOver) {
    setTimeout(draw, 10);
  }
};

function doGameOver() {
  gameOver = true;
  gameOverEl.innerText = 'Game over!\nYour score was ' + player.score;
  gameOverEl.style.display = 'block';
}

function initGame() {
  for(var x = 0; x < 7; x++) {
    setTimeout(function() {
      new Enemy();
    }, Math.random() * 1000);
  }
  draw();
};
