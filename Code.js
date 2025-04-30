let gravity = 0.25;
let bird_dy = 0;
let score = 0;
let game_state = "Start";
let pipes = [];
let pipe_gap = 250;
let frame = 0;

let gameInterval = null;

const frame_time = 150;

let bird = document.getElementById("bird");
console.log(bird);
let score_display = document.getElementById("score");
let game_container = document.getElementById("game_container");
let start_btn = document.getElementById("start-btn");

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
  console.log(e.code);
  if (
    e.code === "Space" ||
    e.code === "ArrowUp" ||
    e.code === "KeyF" ||
    e.code === "KeyJ"
  ) {
    if (game_state !== "Play") {
      game_state = "Play";
      startGame();
    }

    bird_dy = -7;
  }
});

//read the name
function applyGravity() {
  bird_dy += gravity;
  let birdTop = bird.offsetTop + bird_dy;

  birdTop = Math.max(birdTop, 0);
  birdTop = Math.min(birdTop, game_container.offsetHeight - bird.offsetHeight);

  bird.style.top = birdTop + "px";
}

//read the name
function startGame() {
  newDiv.style.top = "150%";
  Score_Text.style.top = "150%";
  if (gameInterval !== null) return;
  gameInterval = setInterval(() => {
    applyGravity();
    movePipes();
    frame++;
    checkCollsion();

    if (frame % frame_time === 0) {
      createPipe();
      if (pipe_gap > 200) {
        pipe_gap = pipe_gap - 5;
      }
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
    pipe.style.left = pipe.offsetLeft - 3 + "px";

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
  newDiv.style.top = "30%";
  Score_Text.style.top = "30%";
  clearInterval(gameInterval);
  gameInterval = null;
  resetGame();
}

//-----------v
function resetGame() {
  Score_Text.textContent = "Score: " + score;
  bird.style.top = "50%";
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
  score_display.textContent = "Score: 0";
}

//sets the score
function setScore(newScore) {
  score = newScore;
  score_display.textContent = "Score: " + score;
}
