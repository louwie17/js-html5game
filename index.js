// Import stylesheets
import './style.css';

// Write Javascript code!
const appDiv = document.getElementById('app');
appDiv.innerHTML = `<h1>JS Starter</h1>`;

var myGamePiece;
var myObstacles = [];
var myScore;
var myLifes;
var images = {
    virus: './images/virus.png',
    virusdead: './images/virusdead2.png',
    swordman: './images/swordman_black.png'
};
var imageSrc = {};
var loaded = 0;
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
})


function startGame() {
    myGamePiece = new component(50, 50, imageSrc.swordman, 10, 120);
    myGamePiece.gravity = 0.05;
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    myLifes = new component("30px", "Consolas", "red", 280, 70, "text");
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 10);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function() {
        clearInterval(this.interval);
    }
}

function component(width, height, imgOrColor, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.imgOrColor = imgOrColor;
    this.isDead = false;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = this.imgOrColor;
            ctx.fillText(this.text, this.x, this.y);
        } else if (type == "box") {
            ctx.fillStyle = this.imgOrColor;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        } else {
            ctx.drawImage(this.imgOrColor,0,0,this.imgOrColor.width,this.imgOrColor.height,this.x,this.y,this.width,this.height);
        }
    }
    this.dead = function() {
        this.isDead = true;
        this.imgOrColor = imageSrc.virusdead;
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        // console.log(this.x);
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}


var interval = 120;
function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    var score = 0;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myObstacles[i].dead();
            // return;
        } 
        if (myObstacles[i].isDead) {
            score++;
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(interval - (score * 5))) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(40, 40, imageSrc.virus, x, height));
        // myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
    }
    var lifes = 10;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myObstacles[i].x > -10) {
            myObstacles[i].x += -1;
            myObstacles[i].update();
        } else if (!myObstacles[i].isDead) {
            lifes--;
        }
    }
    myScore.text="SCORE: " + score;
    myLifes.text="My Lifes: " + lifes;
    if (lifes === 0) {
        myGameArea.stop();
    }

    myScore.update();
    myLifes.update();
    myGamePiece.newPos();
    myGamePiece.update();
}

function everyinterval(n) {
    if (n < 40) { n = 40;}
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}