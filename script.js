import { BLOCK_SIZE, BOARD_HEIGHT, BOARD_WIDTH, EVENT_MOVEMENTS} from "./consts.js";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const scoreId = document.getElementById("score");

const board = [];
let score = 0;
const piece = {
  position : { x : 5, y : 5},
  shape: [
    [1, 1],
    [1, 1]
  ]
}
const PIECES = [
  [
    [1, 1], 
    [1, 1],
  ],

  [
    [1, 1, 1, 1],
  ],

  [
    [0, 1, 0], 
    [1, 1, 1],
  ],

  [
    [1, 0],
    [1, 0],
    [1, 1],
  ],
]
canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;
ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

let dropCounter = 0;
let lastTime = 0;
function animate(time = 0){
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if(dropCounter > 1000) {
    piece.position.y++;
    dropCounter = 0;
  }
  handlePieceDown();
  draw();
  requestAnimationFrame(animate);
}

function draw() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if(value === 1) {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(x, y, 1, 1);
      }
    })
  })

  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if(value){
        ctx.fillStyle = 'red'
        ctx.fillRect(x + piece.position.x, y + piece.position.y, 1, 1);
      }
    })
  })

}
createBoard();

function createBoard(){
  for(let column = 0; column < BOARD_HEIGHT; column++) {
    const arr = [];
    for(let row = 0;  row < BOARD_WIDTH; row++) {
      arr.push(0);
    }
    if(column > BOARD_HEIGHT - 5) {
      while(arr.length) arr.pop();
      for(let row = 0;  row < BOARD_WIDTH; row++) {
        arr.push(1);
      }
    }
    board.push(arr);
  }
  board[BOARD_HEIGHT - 4][BOARD_WIDTH - 7] = 0;
  board[BOARD_HEIGHT - 4][BOARD_WIDTH - 6] = 0;
}
function checkCollision() {
  return piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return(
        value !== 0 && 
        board[y + piece.position.y]?.[x + piece.position.x] !== 0
      )
    })
  })

}
function solidifyPiece() {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if( value === 1 ) {
        board[y + piece.position.y][x + piece.position.x] = 1;
      }
    })
  })
  piece.position.x = Math.floor(BOARD_WIDTH / 2 - 2);
  piece.position.y = 0;

  piece.shape = PIECES[Math.floor(Math.random() * PIECES.length)]
  if(checkCollision()){
    gameOver();
  }

}
function removeRows() {
  const rowsToRemove = [];
  board.forEach((row, y) => {
    if(row.every(value => value === 1)){
      rowsToRemove.push(y)
    }
  })
  rowsToRemove.forEach((row) => {
    board[row].forEach((value, indexValue) => {
      board[row][indexValue] = 0;
    })
  })
  if(rowsToRemove.length) {
    score += 10 ** rowsToRemove.length;
    changeScore();
    moveRowsDown();
  }
}
function moveRowsDown(){
  for(let column = 0; column < BOARD_WIDTH; column++) {
    for(let row = 0; row < BOARD_HEIGHT; row++){
      for(let h = 0; h < BOARD_HEIGHT - 1; h++) {
        const current = board[h][row];
        const below = board[h + 1][row];
        if(current > below) {
          board[h + 1][row] = current;
          board[h][row] = 0;
        }
      }
    }
  }
}
function handlePieceDown(){
  if(checkCollision()) {
    piece.position.y--;
    solidifyPiece();
    removeRows();
  }
}
function gameOver() {
  alert("You lose");
  board.forEach((row) => row.fill(0))
}





function changeScore(){
  scoreId.innerHTML = "Score : " + score;
}
document.addEventListener('keydown', (event) => {
  if(event.key === EVENT_MOVEMENTS.LEFT) {
    piece.position.x--;
    if(checkCollision()) {
      piece.position.x++;
    }
  };
  if(event.key === EVENT_MOVEMENTS.RIGHT){
    piece.position.x++;
    if(checkCollision()) {
      piece.position.x--;
    }
  };
  if(event.key === EVENT_MOVEMENTS.DOWN){
    piece.position.y++;
    checkCollision();
  };
  if(event.key === EVENT_MOVEMENTS.UP){
    const rotated = [];
    for(let i = 0; i < piece.shape[0].length; i++) {
      const row = [];
      for(let j  = piece.shape.length - 1;
        j >= 0; j--) {
        row.push(piece.shape[j][i]);
      }
      rotated.push(row);
    };
    const previousShape = piece.shape;
    piece.shape = rotated;
    if(checkCollision()) {
      piece.shape = previousShape;
    }
  };
})

const playButton = document.getElementById("playButton");
playButton.addEventListener("click", () => {
  playButton.style.display = "none";
  canvas.style.display = "inline";
  const audio = new Audio("./tetris.mp3");
  audio.volume = 0.5;
  audio.loop = true;
  audio.play();
  changeScore();
  animate();
})


