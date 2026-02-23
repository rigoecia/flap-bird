// Obter o canvas e o contexto
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 600;

// Carregar a imagem do pássaro
const birdImg = new Image();
birdImg.src = 'bird.png'; // Coloque o caminho da imagem baixada aqui

// Variáveis do jogo
let bird = {
    x: 50,
    y: 300,
    width: 34, // Ajuste com base na imagem
    height: 24,
    gravity: 0.8,
    lift: -15,
    velocity: 0
};

let pipes = [];
let gap = 150; // Espaço entre os canos
let pipeWidth = 60;
let score = 0;
let gameOver = false;

// Função para desenhar o pássaro
function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

// Função para desenhar os canos
function drawPipes() {
    pipes.forEach(pipe => {
        ctx.fillStyle = 'green';
        // Cano superior
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        // Cano inferior
        ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom);
    });
}

// Atualizar a lógica do jogo
function update() {
    if (gameOver) return;

    // Gravidade e movimento do pássaro
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Colisão com o chão ou teto
    if (bird.y + bird.height > canvas.height - 50) {
        gameOver = true;
    }
    if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
    }

    // Movimentar e verificar canos
    pipes.forEach((pipe, index) => {
        pipe.x -= 2;

        // Remover cano que saiu da tela
        if (pipe.x + pipeWidth < 0) {
            pipes.splice(index, 1);
        }

        // Colisão com canos
        if (
            bird.x + bird.width > pipe.x &&
            bird.x < pipe.x + pipeWidth &&
            (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
        ) {
            gameOver = true;
        }

        // Pontuação (quando o pássaro passa pelo cano)
        if (pipe.x + pipeWidth === bird.x) {
            score++;
        }
    });
}

// Desenhar tudo na tela
function draw() {
    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Chão
    ctx.fillStyle = 'limegreen';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

    // Canos e pássaro
    drawPipes();
    drawBird();

    // Pontuação
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`Pontos: ${score}`, 10, 30);

    // Game Over
    if (gameOver) {
        ctx.fillText('Game Over! Clique para reiniciar', 50, 300);
    }
}

// Função de flap (pulo)
function flap() {
    if (gameOver) {
        // Reiniciar o jogo
        bird.y = 300;
        bird.velocity = 0;
        pipes = [];
        score = 0;
        gameOver = false;
        addPipe(); // Adicionar o primeiro cano
    } else {
        bird.velocity = bird.lift;
    }
}

// Eventos (espaço ou clique)
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') flap();
});
canvas.addEventListener('click', flap);

// Adicionar canos a intervalos
function addPipe() {
    const top = Math.floor(Math.random() * (canvas.height / 2 - gap / 2)) + 50;
    const bottom = top + gap;
    pipes.push({ x: canvas.width, top, bottom });
}

setInterval(addPipe, 1500);
addPipe(); // Adicionar o primeiro cano

// Loop do jogo
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Iniciar quando a imagem carregar
birdImg.onload = gameLoop;