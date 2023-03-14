// define canvas element and context
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// define grid size and cell size
var gridSize = 50;
var cellSize = 10;

// define colors
var gridColor = "#aaaaaa";
var wallColor = "#444444";
var startColor = "#00ff00";
var goalColor = "#ff0000";
var pathColor = "#ffff00";
var openColor = "#ffffff";
var closedColor = "#cccccc";

// define grid and start/goal cells
var grid = [];
var start = { x: 0, y: 0 };
var goal = { x: gridSize - 1, y: gridSize - 1 };

// initialize grid
for (var i = 0; i < gridSize; i++) {
  grid[i] = [];
  for (var j = 0; j < gridSize; j++) {
    grid[i][j] = { x: i, y: j, g: Infinity, rhs: Infinity, parent: null, open: false, closed: false };
  }
}

// update start and goal cells in grid
grid[start.x][start.y].g = 0;
grid[goal.x][goal.y].rhs = 0;

// define drawCell function (draw a cell on the canvas)
function drawCell(cell, color) {
  var x = cell.x * cellSize;
  var y = cell.y * cellSize;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, cellSize, cellSize);
  ctx.strokeStyle = gridColor;
  ctx.strokeRect(x, y, cellSize, cellSize);
}

// define click handler for grid cells
function handleClick(e) {
  var x = e.clientX - canvas.offsetLeft;
  var y = e.clientY - canvas.offsetTop;
  var cellX = Math.floor(x / cellSize);
  var cellY = Math.floor(y / cellSize);
  var cell = grid[cellX][cellY];
  if (cell == start || cell == goal) {
    return;
  }
  cell.closed = !cell.closed;
  drawCell(cell, cell.closed ? wallColor : openColor);
}

// initialize grid
function initGrid() {
  // draw grid lines
  ctx.beginPath();
  ctx.strokeStyle = gridColor;
  for (var i = 0; i <= gridSize; i++) {
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(canvas.width, i * cellSize);
  }
  for (var j = 0; j <= gridSize; j++) {
    ctx.moveTo(j * cellSize, 0);
    ctx.lineTo(j * cellSize, canvas.height);
  }
  ctx.stroke();

  // draw cells
  for (var i = 0; i < gridSize; i++) {
    for (var j = 0; j < gridSize; j++) {
      drawCell(grid[i][j], grid[i][j].closed ? wallColor : openColor);
    }
  }

  canvas.addEventListener("click", handleClick);
}

// expose grid and start/goal cells to other scripts
var gridObj = {
  grid: grid,
  start: start,
  goal: goal,
  drawCell: drawCell,
  initGrid: initGrid
};
