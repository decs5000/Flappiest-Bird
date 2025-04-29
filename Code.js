let gravity = 0.25;
let bird_dy = 0;
let score = 0;
let game_state = "Start";

let gameInterval = null;

let bird = document.getElementById("bird");
let score_display = document.getElementById("score");
let game_container = document.getElementById("game-container");
let start_btn = document.getElementById("start-btn");

document.addEventListener ("keydown", (e) => {
    if (e.code === "Space" || e.code === "ArrowUP") {
        if (game_state !== "Play") {
            game_state = "Play";
            startGame();
        }

        bird_dy = -7;
    }
})

function applyGravity() {
    bird_dy += gravity;
    let birdTop = bird.offset + bird_dy;

    birdTop = Math.max(birdTop, 0);
    birdTop = Math.min(birdTop, game_container.offsetHeight - bird.offsetHeight);

    bird.style.top = birdTop + "px";
}

function startGame() {
    if (gameInterval !== null) return;

    gameInterval = setInterval(() => {
        applyGravity();
    }, 10);
}   

function onStartButtonClick(){
    if (game_state !== "Play") {
        game_state = "Play";
        startGame();
    }
}