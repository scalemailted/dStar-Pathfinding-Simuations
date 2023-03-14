// Define the Dijkstra pathfinding algorithm
function run_dijkstra(map, start, goal) {
    const m = new Grid(map[0].length, map.length);
    //m.set_obstacle(map);
    const obstacles = [];
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 1) {
                obstacles.push([x, y]);
            }
        }
    }
    m.set_obstacle(obstacles);
    
    const startNode = m.grid[start[0]][start[1]];
    const endNode = m.grid[goal[0]][goal[1]];
    const dijkstra = new Dijkstra(m);
    return dijkstra.run(startNode, endNode);
}
  
// Define the size of each cell on the grid
const cellSize = 20;
  
// Define the map as a 2D array of cells
const map = [    
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];
  
// Define the start and goal points
const start = [2, 2];
const goal = [7, 7];
  
// Draw the map
function drawMap(map) {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
  
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] === 0) {
          ctx.fillStyle = "white";
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
    console.log(path)
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


  
// Run the D* algorithm and update the canvas
function run() {
    const path = run_dijkstra(map, start, goal);
    drawMap(map);
    drawPath(path);
}
  
// Modify the map when the user clicks on a cell
function modifyMap(event) {
    const canvas = document.getElementById("canvas");
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / cellSize);
    const y = Math.floor((event.clientY - rect.top) / cellSize);
    if (event.shiftKey) {
      // Make the cell an obstacle
      map[y][x] = 1;
    } else {
      // Make the cell empty
      map[y][x] = 0;
    }
    drawMap(map);
}

run();
  
  