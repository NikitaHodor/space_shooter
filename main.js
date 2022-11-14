//константы canvas
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let BG = new Image();
BG.src = "img/BG.jpg";

let char = new Image();
char.src = 'img/ship.png';
let char_w = 30;
let char_h = 30;
let char_x = 0;
let char_y = canvas.height - char_h;
let char_speed = 10;
let char_direction = "";

let bullets = [];
let bullet_w = 14;
let bullet_h = 5;
let bullet_speed = 10;

let foe = new Image();
foe.src = 'img/asteroid.png';
let foes = [];
let foes_total = 4;
let foe_w = 50;
let foe_h = 50;
let foe_gap = 60;
let foe_x = canvas.width;
let foe_y = foe_h;
let foe_speed = 3;
for (let i = 0; i < foes_total; i++) {
    foes.push([foe_x, foe_y, foe_w, foe_h]);
    foe_y += foe_h + foe_gap;

}

let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;
let bullet_action = false;

let score = 0;
let HP = 100;
let press_F = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    e.preventDefault();
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
        char_direction = "Right";
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
        char_direction = "Left";
    } else if (e.key == "Up" || e.key == "ArrowUp") {
        upPressed = true;
        char_direction = "Up";
    } else if (e.key == "Down" || e.key == "ArrowDown") {
        downPressed = true;
        char_direction = "Down";
    }
    if (bullet_action) {
        return;
    }
    if (e.keyCode == 32) {
        bullet_action = true;
        bullets.push([char_x + (char_w / 2) - 2, char_y + (char_h / 2) - 2, bullet_w, bullet_h]);
    }
    if(e.keyCode == 70){
        press_F = true;
    }
}

function keyUpHandler(e) {
    e.preventDefault();
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    } else if (e.key == "Up" || e.key == "ArrowUp") {
        upPressed = false;
    } else if (e.key == "Down" || e.key == "ArrowDown") {
        downPressed = false;
    } else if (e.keyCode == 32) {
        bullet_action = false;
    }
    if(e.keyCode == 70){
        press_F = false;
    }
}


function move_char() {

    if (rightPressed) { //moove char right
        char_x += char_speed; //char speed
        if (char_x + char_w > canvas.width) { //ограничение стенами
            char_x = canvas.width - char_w;

        }
    } else if (leftPressed) { //moove char left
        char_x -= char_speed; //char speed
        if (char_x < 0) { //ограничение стенами
            char_x = 0;
        }
    } else if (upPressed) {
        char_y -= char_speed;
        if (char_y < 0) {
            char_y = 0;
        }
    } else if (downPressed) {
        char_y += char_speed;
        if (char_y + char_h > canvas.height) {
            char_y = canvas.height - char_h;
        }
    }
}

function draw_char() {

    ctx.drawImage(char, char_x, char_y, char_w, char_h);
}

function drawFoes() {
    for (let i = 0; i < foes.length; i++) {
        ctx.drawImage(foe, foes[i][0], foes[i][1], foe_w, foe_h);

    }
}

function moveFoes() {
    for (let i = 0; i < foes.length; i++) {
        foes[i][0] -= foe_speed;
        if (foes[i][0] < 0) {
            foes[i][0] = canvas.width;
        }
    }
}

function drawBullet() {
    if (bullets.length)
        for (let i = 0; i < bullets.length; i++) {
            ctx.fillStyle = '#f00';
            ctx.fillRect(bullets[i][0], bullets[i][1], bullets[i][2], bullets[i][3]);
        }
}

function moveBullets() {
    for (let i = 0; i < bullets.length; i++) {
        bullets[i][0] += bullet_speed;
        if (bullets[i][0] > (canvas.width + bullets[i][3])) {
            bullets.splice(i, 1);
        }
    }
}

function hitDetection() {
    let remove = false;
    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < foes.length; j++) {
            if (bullets[i][0] >= foes[j][0] && bullets[i][1] <= (foes[j][1] + foes[j][3]) && bullets[i][1] >= foes[j][1]) {
                remove = true;
                foes.splice(j, 1);
                foes.push([foe_x, Math.floor(Math.random() * (canvas.height - foe_h)), foe_w, foe_h]);
            }
        }
        if (remove == true) {
            bullets.splice(i, 1);
            score++;
            remove = false;
        }
    }
}

function charCollusion(){
    for (let i = 0; i < foes.length; i++) {
        if (char_x > foes[i][0] && char_x < foes[i][0] + foe_w && char_y > foes[i][1] && char_y < foes[i][1] + foe_h ||
          char_x + char_w < foes[i][0] + foe_w && char_x + char_w > foes[i][0] && char_y > foes[i][1] && char_y < foes[i][1] + foe_h ||
           char_y + char_h > foes[i][1] && char_y + char_h < foes[i][1] + foe_h && char_x > foes[i][0] && char_x < foes[i][0] + foe_w ||
           char_y + char_h > foes[i][1] && char_y + char_h < foes[i][1] + foe_h && char_x + char_w < foes[i][0] + foe_w && char_x + char_w > foes[i][0]){
            HP -= 10;
            foes.splice(i, 1);
            foes.push([foe_x, Math.floor(Math.random() * (canvas.height - foe_h)), foe_w, foe_h]);
        }
    }
}

function drawScore(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#ff0000";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawHP(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#ff0000";
    ctx.fillText("HP: " + HP, canvas.width - 65, 20);
    if(HP <= 0){
    ctx.font = "30px Arial ";
    ctx.fillStyle = "#ff0000";
    ctx.fillText("Game Over", canvas.width/2 - 120, canvas.height/2);
    ctx.fillText("Press <F> to restart", canvas.width/2 - 130, canvas.height/2 + 60);
        if (press_F){
            document.location.reload();
        }
    }
}

function drawBG(){
    ctx.drawImage(BG, 0, 0, canvas.width, canvas.height);
}

function draw_game() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBG();
    if(HP > 0){
    hitDetection();
    charCollusion();
    draw_char();
    drawBullet();
    drawFoes();
    moveFoes();
    move_char();
    moveBullets();
    }
    drawScore();
    drawHP();
    




    requestAnimationFrame(draw_game);
}
draw_game();
