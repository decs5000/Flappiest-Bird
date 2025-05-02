let gravity = 0.25;
let bird_dy = 0;
let score = 0;
let game_state = "Start";
let pipes = [];
let pipe_gap = 250;
let frame = 0;

let gameInterval = null;

const frame_time = 150;

let highScore = localStorage.getItem("bambooHighScore") || 0;

let bird = document.getElementById("bird");
let score_display = document.getElementById("score");
let game_container = document.getElementById("game_container");
let start_btn = document.getElementById("start-btn");
let jump = document.getElementById("jump");


//define the new elements
let newDiv = document.createElement("div");
newDiv.className = "endBox";
game_container.appendChild(newDiv);
newDiv.style.top = "150%";

let Score_Text = document.createElement("div");
Score_Text.className = "endBoxText";
game_container.appendChild(Score_Text);
Score_Text.style.top = "150%";

//key press check
document.addEventListener("keydown", (e) => {
  if (
    e.code === "Space" ||
    e.code === "ArrowUp" ||
    e.code === "KeyF" ||
    e.code === "KeyJ"
  ) {
    flapSound.play();
    bird_dy = -7;
  }
});

jump.onclick = () =>{
  flapSound.play();
  bird_dy = -7;
}

//read the name
function applyGravity() {
  bird_dy += gravity;
  let birdTop = bird.offsetTop + bird_dy;

  birdTop = Math.max(birdTop, 0);
  birdTop = Math.min(birdTop, game_container.offsetHeight - bird.offsetHeight);

  bird.style.top = birdTop + "px";

  let angle = Math.min(Math.max(bird_dy * 2 - 30), 90);
  bird.style.transform = `rotate(${angle}deg)`;
}

//read the name
function startGame() {
  backgroundMusic.play();
  newDiv.style.top = "150%";
  Score_Text.style.top = "150%";
  start_btn.style.top = "200%";
  start_btn.style.right = "20px";
  difficulty.style.top = "200%";
  if (gameInterval !== null) return;

  score_display.textContent = "Score: " + score + " | Best: " + highScore;
  highScore = localStorage.getItem("bambooHighScore") || 0;

  gameInterval = setInterval(() => {
    applyGravity();
    movePipes();
    frame++;
    checkCollsion();
    getDifficultySetting();
    //updateBirdAvatar(score); I dont like it

    if (frame % frame_time === 0) {
      createPipe();
    }
  }, 10);
}

//button start click check
function onStartButtonClick() {
  if (game_state !== "Play") {
    game_state = "Play";
    startGame();
  }
}

//generate pipes
function createPipe() {
  let pipe_position =
    Math.floor(Math.random() * (game_container.offsetHeight - pipe_gap - 100)) +
    50;

  //top pipe
  let top_pipe = document.createElement("div");
  top_pipe.className = "pipe top-pipe";
  top_pipe.style.height = pipe_position + "px";
  top_pipe.style.top = "0px";
  top_pipe.style.left = "100%";
  game_container.appendChild(top_pipe);

  //bottom pipe
  let bottom_pipe = document.createElement("div");
  bottom_pipe.className = "pipe bottom-pipe";
  bottom_pipe.style.height =
    game_container.offsetHeight - pipe_gap - pipe_position + "px";
  bottom_pipe.style.bottom = "0px";
  bottom_pipe.style.left = "100%";
  game_container.appendChild(bottom_pipe);

  pipes.push(top_pipe, bottom_pipe);
}

//move pipes
function movePipes() {
  for (let pipe of pipes) {
    pipe.style.left = pipe.offsetLeft - pipeSpeed + "px";
    //remove pipes from screen
    if (pipe.offsetLeft < -pipe.offsetWidth) {
      pipe.remove();
    }
  }
  //remove old pipes from array
  pipes.filter((pipe) => pipe.offsetLeft + pipe.offsetWidth > 0);
}

//READ THE NAMW!!!
function checkCollsion() {
  let birdRect = bird.getBoundingClientRect();
  for (let pipe of pipes) {
    let pipeRect = pipe.getBoundingClientRect();

    if (
      birdRect.left < pipeRect.left + pipeRect.width &&
      birdRect.left + birdRect.width > pipeRect.left &&
      birdRect.top < pipeRect.top + pipeRect.height &&
      birdRect.top + birdRect.height > pipeRect.top
    ) {
      endGame();
      return;
    }
  }

  if (
    bird.offsetTop <= 0 ||
    bird.offsetTop >= game_container.offsetHeight - bird.offsetHeight
  ) {
    endGame();
  }

  pipes.forEach((pipe, index) => {
    if (index % 2 === 0) {
      if (
        pipe.offsetLeft + pipe.offsetWidth < bird.offsetLeft &&
        !pipe.passed
      ) {
        pipe.passed = true;
        setScore(score + 1);
      }
    }
  });
}

//if you ask what this does there will be problems
function endGame() {
  if (Number(score) > Number(highScore)) {
    localStorage.setItem("bambooHighScore", score);
  }

  hitSound.play();
  newDiv.style.top = "30%";
  Score_Text.style.top = "32%";
  start_btn.style.top = "45%";
  start_btn.style.right = "43%";
  start_btn.style.width = "300px";
  start_btn.style.height = "100px";
  difficulty.style.top = "50%";
  clearInterval(gameInterval);
  gameInterval = null;
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
  resetGame();
}

//-----------v
function resetGame() {
  bird.style.transform = `rotate(${90}deg)`;
  Score_Text.textContent = "Score: " + score;
  bird.style.top = "20%";
  bird_dy = 0;
  for (let pipe of pipes) {
    pipe.remove();
  }
  pipes = [];
  setScore(0);
  frame = 0;
  game_state = "Start";
  score_display.textContent = "";
  pipe_gap = 250;
  score_display.textContent = "Score: 0 | Best: " + highScore;
}

//sets the score
function setScore(newScore) {
  score = newScore;
  if (newScore > score) {
    pipePass.play();
  }
  score_display.textContent = "Score: " + score + " | Best: " + highScore;
}

let pipeSpeed = 3;

function getDifficultySetting() {
  let difficulty = document.getElementById("difficulty").value;

  if (difficulty === "normal") {
    pipeSpeed = 3;
    pipe_gap = 250;
  } else if (difficulty === "baby") {
    pipeSpeed = 2;
    pipe_gap = 325;
  } else if (difficulty === "hard") {
    pipeSpeed = 6;
    pipe_gap = 200;
  }
}

const pipePass = new Audio("assets/pipePass");
const flapSound = new Audio("assets/FlapSFX");
const hitSound = new Audio("assets/SquawkSFX");

const backgroundMusic = new Audio("assets/JungleSFX");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;

const muteButton = document.getElementById("muteButton");

function updateBirdAvatar(score) {
  if (score >= 10 && score < 20) {
    bird.style.background = "url(assets/Toucan.png)";
  } else if (score >= 20) {
    bird.style.background = "url(assets/Parrot.png)"
  } else {
    bird.style.background = "url(assets/flappy\ bird.png) no-repeat center center"
  }
}