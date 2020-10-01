const game = document.getElementById("game");
let box = game.getContext("2d");
const scoreBox = document.getElementById("score");
const highScoreBox = document.getElementById("highScore");
let highScore;
let score;
let move;
let flag;
let posX;
let posY;
let foodX;
let foodY;
let snakeBody = [];
let myVal;
let speed =150;
let tempMove;

start();

function loadHighScore(){
    const old = getCookie();
    if (old === null){
        highScore = 0;
    }else{
        highScore = old;
    }
}

function saveHighScore(value){
    const old = getCookie();
    if (old === null){
        setCookie(value);
    }else if(old < value){
        deleteCookie();
        setCookie(value);
    }
}

function setCookie(value) {
    let date = new Date();
    date.setTime(date.getTime() + 365*24*60*60*1000);
    document.cookie = "highscore" + '=' + value + ';expires=' + date.toUTCString() + ';path=/';
}

function deleteCookie() {
    document.cookie = "highscore" + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function getCookie() {
    let value = document.cookie.match('(^|;) ?' + "highscore" + '=([^;]*)(;|$)');
    return value? value[2] : null;
}

window.onkeydown = function (event) {
    if (event.keyCode === 37 && move !== 2) {
        tempMove = 0;
    } else if (event.keyCode === 38 && move !== 3) {
        tempMove = 1;
    } else if (event.keyCode === 39 && move !== 0) {
        tempMove = 2;
    } else if (event.keyCode === 40 && move !== 1) {
        tempMove = 3;
    }
    flag = 1;
}

function play() {
    move=tempMove;
    scoreBox.innerHTML = String(score);
    highScoreBox.innerHTML = String(highScore);
    switch (move) {
        case 0:
            posX -= 1;
            break;
        case 1:
            posY -= 1;
            break;
        case 2:
            posX += 1;
            break;
        case 3:
            posY += 1;
            break;
    }
    if (posX < 0 || posX > 19 || posY < 0 || posY > 19||checkBodyTouch(posX,posY)) {
        dead();
    } else if (foodY === posY && foodX === posX) {
        snakeBody.push([posX, posY]);
        drawSnake(posX, posY);
        drawFood();
        score++;
        highScore = Math.max(score,highScore);

    } else {
        snakeBody.push([posX, posY]);
        drawSnake(posX, posY);
        eraseSnake(snakeBody[0][0], snakeBody[0][1]);
        snakeBody.shift();
    }
}


function drawSnake(x, y) {
    box.fillStyle = "green";
    box.fillRect(40 * x, 40 * y, 40, 40);
    return [x, y];
}

function eraseSnake(x, y) {
    box.clearRect(40 * x, 40 * y, 40, 40);
}

function drawFood() {
    box.fillStyle = "orange";
    makeFood();
    box.fillRect(40 * foodX, 40 * foodY, 40, 40);
}

function wait() {
    if (flag === 0) {
        setTimeout(wait, 300);
    } else {
        box.clearRect(0, 0, 800, 800);
        setGame();

        myVal = setInterval(play, speed);
    }
}

function dead() {
    box.clearRect(0, 0, 800, 800);
    box.fillStyle = "red";
    box.font = "40px Arial";
    box.fillText("GAME OVER", 255, 200);
    if(score === highScore){
        box.fillText("HIGH SCORE!", 240, 300);
    }else {

        box.fillText("HIGH SCORE : "+ highScore, 210, 300);
    }
    box.fillText("SCORE : " + score, 285, 400);
    box.fillText("PRESS ANY KEY TO RESTART", 105, 500);
    flag = 0;
    clearInterval(myVal);
    saveHighScore(score);
    wait();
}

function startWait() {
    if (flag === 0) {
        setTimeout(startWait, 300);
    } else {
        box.clearRect(0, 0, 800, 800);
        setGame();
        myVal = setInterval(play, speed);
    }
}

function start() {
    loadHighScore();
    if (highScore === 0){
        highScore = 1;
    }
    highScoreBox.innerHTML = String(highScore);
    scoreBox.innerHTML = "0";
    flag =0;
    box.fillStyle = "white";
    box.font = "40px Arial";
    box.fillText("Welcome to Snake Game!", 155, 300);
    box.fillText("PRESS ANY KEY TO START", 125, 400);
    startWait();

}

function makeFood() {
    let x;
    let y;
    do {
        x = Math.floor(Math.random() * 20);
        y = Math.floor(Math.random() * 20);
    } while (checkBodyTouch(x,y));
    foodX = x;
    foodY = y;
}

function setGame() {
    tempMove = 0;
    score = 1;
    posX = 10;
    posY = 10;
    snakeBody = [];
    snakeBody.push([posX, posY]);
    makeFood();
    drawSnake(posX, posY);
    drawFood(foodX, foodY);

}

function checkBodyTouch(x,y){
    for(let i =0;i <snakeBody.length;i++){
        if(snakeBody[i][0]===x && snakeBody[i][1]===y){
            return true;
        }
    }
    return false;
}
