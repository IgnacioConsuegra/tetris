const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

const BLOCK_SIZE = 20;
const BOARD_WIDTH = 14;
const BOARD_HEIGHT = 30;
const board = [];
const piece = {
  position : { x : 5, y : 5},
  shape: [
    [1, 1],
    [1, 1]
  ]
}

canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;

ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
function animate(){
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
animate();

function createBoard(){
  for(let column = 0; column < BOARD_HEIGHT; column++) {
    const arr = [];
    for(let row = 0;  row < BOARD_WIDTH; row++) {
      arr.push(0);
    }
    if(column > BOARD_HEIGHT - 2) {
      while(arr.length) arr.pop();
      for(let row = 0;  row < BOARD_WIDTH; row++) {
        arr.push(1);
      }
    }
    board.push(arr);
  }
  board[BOARD_HEIGHT - 1][BOARD_WIDTH - 6] = 0;
  board[BOARD_HEIGHT - 1][BOARD_WIDTH - 7] = 0;
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
      if(value === 1 ) {
        board[y + piece.position.y][x + piece.position.x] = 1;
      }
    })
  })
  piece.position.x = 0;
  piece.position.y = 0;
}

document.addEventListener('keydown', (event) => {
  if(event.key === 'ArrowLeft') {
    piece.position.x--;
    if(checkCollision()) {
      piece.position.x++;
    }
  };
  if(event.key === 'ArrowRight'){
    piece.position.x++;
    if(checkCollision()) {
      piece.position.x--;
    }
  };
  if(event.key === 'ArrowDown'){
    piece.position.y++;
    if(checkCollision()) {
      piece.position.y--;
      solidifyPiece();
    }
  };
})