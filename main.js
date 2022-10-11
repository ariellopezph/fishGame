// Canvas setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 1500;
canvas.height = 700;


let score = 0;
let gameFrame = 0;
ctx.font = '50px Georgia';



// Mouse Interactivity
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
    x : 0,
    y : canvas.height/2,
    click : false
}



canvas.addEventListener('mousedown', function (event){
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
    
});


canvas.addEventListener('mouseup', function (e){
    mouse.click = false;
})




// Player

const playerLeft = new Image(); // Imagenes de pj
playerLeft.src = './Img/fishPlayerLeft.png';
const playerRight = new Image();
playerRight.src = './Img/fishPlayerRight.png';


class Player {
    constructor(){
        this.x = canvas.width;
        this.y = canvas.height;
        this.radius = 30;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spritWidth = 498;
        this.spritHeight = 327;
    }

    update(){
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        let theta = Math.atan2(dy, dx);
        this.angle = theta;
        if (mouse.x != this.x) {
            this.x -= dx/20; // Velocidad
        }

        if (mouse.y != this.y) {
            this.y -= dy/20; // Velocidad
        }
    }

    draw(){
        if (mouse.click) { // Dibujo linea
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();

        }
        ctx.fillStyle = 'transparent'; // Dibujo personaje
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.fillRect(this.x, this.y, this.radius, 10);

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        if (this.x >= mouse.x){
            ctx.drawImage(playerLeft, this.frameX * this.spritWidth, this.frameY * this.spritHeight, this.spritWidth, this.spritHeight, 0 -40, 0 -30, this.spritWidth/6, this.spritHeight/6);
        } else {
            ctx.drawImage(playerRight, this.frameX * this.spritWidth, this.frameY * this.spritHeight, this.spritWidth, this.spritHeight, 0 -40, 0 -30, this.spritWidth/6, this.spritHeight/6);
        }
        ctx.restore();
        
    }
}
const player = new Player();

// Bubbles

const bubbleDraw = new Image();
bubbleDraw.src = './Img/bubble.png';


const bubblesArray = [];
class Bubble {
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius = 50;
        this.speed = Math.random() * 5 + 1;
        this.distance;
        this.counted = false;
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
    }

    update(){
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx*dx + dy*dy);
        
    }
    draw(){
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
        ctx.drawImage(bubbleDraw, this.frameX * this.spritWidth, this.frameY * this.spritHeight, this.spritWidth, this.spritHeight, this.x -0, this.y -0, this.spritWidth/2, this.spritHeight/2);
    }
}

// Sounds

const bubblePop1 = document.createElement('audio');
bubblePop1.src = './Sounds/bubbles-single1.wav';
const bubblePop2 = document.createElement('audio');
bubblePop2.src = './Sounds/bubbles-single2.wav';
const backGroundSound = document.createElement('audio');
backGroundSound.src = './Sounds/background.mp3';

function bGSound(){
    backGroundSound.play();
}



function handleBubbles(){
    if (gameFrame % 50 == 0){ // Crea burbujas azules
        bubblesArray.push(new Bubble());
        
    }
    for (let i = 0; i < bubblesArray.length; i++){ // Velocidad y Dibujo
        bubblesArray[i].update();
        bubblesArray[i].draw();
        
    }

    for (let i = 0; i < bubblesArray.length; i++){ // Borra las que se van de cuadro
        if (bubblesArray[i].y < 0 - bubblesArray[i].radius * 2){
            bubblesArray.splice(i, 1);
        }
        if (bubblesArray[i]){
            if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius){ // Colision burbujas
                if (!bubblesArray[i].counted){
                    if (bubblesArray[i].sound == 'sound1'){
                        bubblePop1.play();
                    } else {
                        bubblePop2.play();
                    }
                    score++;
                    bubblesArray[i].counted = true;
                    bubblesArray.splice(i, 1);
                }
        }
            
        }
    }
    
    
    
}
// Animation Loop

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update();
    player.draw();
    ctx.fillStyle = 'black';
    ctx.fillText('score: ' + score, 10, 50);
    handleBubbles();
    gameFrame++;
    requestAnimationFrame(animate);
    // bGSound();
}

animate();

window.addEventListener('resize', function(){
    canvasPosition = canvas.getBoundingClientRect();
});