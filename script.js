const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

const BLOCK_SIZE = 20;
const BOARD_WIDTH = 14;
const BOARD_HEIGHT = 30;
const board = [];

canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;

ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
function animate(){
  draw();
  requestAnimationFrame(animate);
}

function draw() {
  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, ctx.width, ctx.height);

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if(value === 1) {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(x, y, 1, 1);
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
    if(column > BOARD_HEIGHT - 5) {
      while(arr.length) arr.pop();
      for(let row = 0;  row < BOARD_WIDTH; row++) {
        arr.push(1);
      }
    }
    board.push(arr);
  }
  console.log(board)
}