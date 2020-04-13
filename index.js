var images = {
    virus: 'https://cdn.jsdelivr.net/gh/louwie17/js-html5game@master/images/virus.png',
    virusdead: 'https://cdn.jsdelivr.net/gh/louwie17/js-html5game@master/images/virusdead2.png',
    swordman: 'https://cdn.jsdelivr.net/gh/louwie17/js-html5game@master/images/swordman_black.png'
};
var imageSrc = {};
var loaded = 0;
// This piece code it loads all the pictures in the images variable, and once all those pictures
// are loaded it calls startGame().
Object.keys(images).forEach(function(key) {
    var img = document.createElement('img'); 
    img.src = images[key];
    img.onload = function () {
        loaded++;
        imageSrc[key] = img;
        if (loaded === Object.keys(images).length) {
            startGame();
        }
    };
});



function myGame(canvasId) {
  this.canvas = document.getElementById(canvasId);
  this.context = this.canvas.getContext("2d");

  this.start = function() {
    var x = 0;
    var self = this;
    this.context.lineTo(x, 10);
    this.context.stroke();
    this.interval = setInterval(function() {
      updateGameArea(self.context);
    }, 10);
  }

  this.clear = function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  this.stop = function() {
    clearInterval(this.interval);
  }
}

var game;
function startGame() {
    var canvas = document.getElementById("colorCanvas");
    var context = canvas.getContext("2d");
    game = new myGame("colorCanvas");
    game.start();
}
/*
* (abs(a.x - b.x) * 2 < (a.width + b.width)) &&
         (abs(a.y - b.y) * 2 < (a.height + b.height));
 */
var lifes = 10;
var score = 0;
var swordmanY = 260;
var virusX = 350;
var virusY = 100;
var crash = false;

var array = [1,234,5,5];
array.push(9);
array.pop();

function updateGameArea(context) {
  game.clear();
  var virus = imageSrc.virus;
  var myleft = 10;
  var myright = 140;
  var mytop = swordmanY;
  var mybottom = swordmanY + 70;
  var virusleft = virusX;
  var virusright = virusX + 70;
  var virustop = virusY;
  var virusbottom = virusY + 70;
  
  if (Math.abs(myleft - virusleft) * 2 < (70 + 35) && Math.abs(mytop - virustop) * 2 < (70 + 70) ) {
     if (crash === false) {
       score += 10;
     }
     crash = true;
  }
  
  if (crash) {
      virus = imageSrc.virusdead;
  }
  context.drawImage(virus,0,0,virus.width,virus.height,virusX,virusY,70,70);
  
  var swordman = imageSrc.swordman;
  context.drawImage(swordman,0,0,swordman.width,swordman.height,10,swordmanY,70,70); // 70 width and 70 long
  // We want to update the game here
  context.font = "20px Georgia";
  
  context.fillText("Lifes: " + lifes, 300, 20); // text, x, y 
  context.fillText("Score: " + score, 300, 40); 
  virusX -= 1;
  if (virusright < 0) {
    virusX = 350;
    virusY = Math.floor(Math.random() * 300) + 25;
    if (crash === false) {
      lifes--;
    }
    crash = false;
  }
}

window.moveSwordmanUp = function() {
  swordmanY -= 10;
}

window.moveSwordmanDown = function() {
  swordmanY += 10;
}


// when to add new viruses
function everyinterval(n) {s
    if (n < 40) { n = 40;}
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function myGamePiece(width, height, imgOrColor, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
}