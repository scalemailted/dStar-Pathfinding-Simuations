// Define the grid as a global variable
let grid = []

// Define the size of each cell on the grid
const cellSize = 20;

// Define the start and goal points
let start = [2, 2];
let goal = [7, 7];

// Define whether we're dragging the start or goal
let cursorTarget = null;

// Define the D* pathfinding algorithm
function dStar(grid, start, goal) {
  console.log(grid)
  const m = new Grid(grid[0].length, grid.length);
  const obstacles = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === 1) {
        obstacles.push([x, y]);
      }
    }
  }
  m.set_obstacle(obstacles);

  const startNode = m.grid[start[0]][start[1]];
  const endNode = m.grid[goal[0]][goal[1]];
  const dstar = new Dstar(m);
  return dstar.run(startNode, endNode);
}


// Draw the map
function drawMap(grid, start, goal) {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === 1) {
        ctx.fillStyle = "black";
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }

  // Draw the start and goal positions
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(
    start[0] * cellSize + cellSize / 2,
    start[1] * cellSize + cellSize / 2,
    cellSize / 2,
    0,
    2 * Math.PI
  );
  ctx.fill();

  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.arc(
    goal[0] * cellSize + cellSize / 2,
    goal[1] * cellSize + cellSize / 2,
    cellSize / 2,
    0,
    2 * Math.PI
  );
  ctx.fill();
}

// Draw the path on the canvas
function drawPath(path) {
  console.log(path);
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  ctx.strokeStyle = "blue";
  ctx.lineWidth = cellSize / 4;

  ctx.beginPath();
  ctx.moveTo(
    path[0][0] * cellSize + cellSize / 2,
    path[1][0] * cellSize + cellSize / 2
  );

  for (let i = 1; i < path[0].length; i++) {
    ctx.lineTo(
      path[0][i] * cellSize + cellSize / 2,
      path[1][i] * cellSize + cellSize / 2
    );
  }

  ctx.stroke();
}


// Function to set up the canvas with the specified number of rows and columns
function setup_canvas() {
  // Get the canvas element
  const canvas = document.getElementById("canvas");

  // Get the rows and columns inputs
  const rows_input = document.getElementById("rows");
  const cols_input = document.getElementById("cols");

  // Get the rows and columns values
  const rows = parseInt(rows_input.value);
  const cols = parseInt(cols_input.value);

  // Set the canvas size based on the rows and columns values
  canvas.width = cols * cellSize;
  canvas.height = rows * cellSize;

  // Initialize the map with all floor cells
  grid = []; 
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(0);
    }
    grid.push(row);
  }

  console.log(rows,cols,grid)
  // Update the map and draw it on the canvas
  run(grid);
}


// Run the D* algorithm and update the canvas
function run(grid) {
  const path = dStar(grid, start, goal);
  drawMap(grid, start, goal);
  drawPath(path);
}

// Add an event listener to the canvas to modify the map
const canvas = document.getElementById("canvas");
canvas.addEventListener("click", modifyGrid);


function modifyGrid(event) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) / cellSize);
  const y = Math.floor((event.clientY - rect.top) / cellSize);
   console.log(x,y)
  // Toggle walls/floors
  if (!cursorTarget && !event.shiftKey && !(x == start[0] && y == start[1]) && !(x == goal[0] && y == goal[1])) {
    grid[y][x] = +!grid[y][x];
    run(grid);
  }

  // Set dragging state
  if (x == start[0] && y == start[1] && event.shiftKey) {
    cursorTarget = start;
  } 
  if (x == goal[0] && y == goal[1] && event.shiftKey) {
    cursorTarget = goal;
  }

}

// If dragging the start or goal, update its position
canvas.addEventListener("mousemove", (event) => {
  if (cursorTarget) {
    const rect = canvas.getBoundingClientRect();
    const moveX = Math.floor((event.clientX - rect.left) / cellSize);
    const moveY = Math.floor((event.clientY - rect.top) / cellSize);
    if (cursorTarget == start) {
      start[0] = moveX;
      start[1] = moveY;
    }
    if (cursorTarget == goal) {
      goal[0] = moveX;
      goal[1] = moveY;
    }
    //run(grid);
    drawMap(grid,start,goal)
  }
});

// Reset dragging state when shift button is released
document.body.addEventListener("keyup", (event) => {
    if (event.key == 'Shift') {
      cursorTarget = null;
      run(grid);
    }
});


// Set up the canvas with default values
setup_canvas();


 

