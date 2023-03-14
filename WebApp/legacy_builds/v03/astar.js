// Define the A* pathfinding algorithm
function aStar(start, goal, map) {
  const openSet = [start];
  const cameFrom = {};

  const gScore = {};
  gScore[start.x + "," + start.y] = 0;

  const fScore = {};
  fScore[start.x + "," + start.y] = heuristic(start, goal);

  while (openSet.length > 0) {
    // Find the node in the open set with the lowest fScore
    let current = openSet[0];
    let currentIndex = 0;
    for (let i = 1; i < openSet.length; i++) {
      const f = fScore[openSet[i].x + "," + openSet[i].y];
      if (f < fScore[current.x + "," + current.y]) {
        current = openSet[i];
        currentIndex = i;
      }
    }

    // Check if the goal has been reached
    if (current.x === goal.x && current.y === goal.y) {
      let path = [current];
      while (current.x !== start.x || current.y !== start.y) {
        current = cameFrom[current.x + "," + current.y];
        path.push(current);
      }
      return path.reverse();
    }

    // Remove the current node from the open set
    openSet.splice(currentIndex, 1);

    // Add the current node to the closed set
    const x = current.x;
    const y = current.y;
    const neighbors = [      { x: x - 1, y: y },      { x: x + 1, y: y },      { x: x, y: y - 1 },      { x: x, y: y + 1 },    ];
    for (let i = 0; i < neighbors.length; i++) {
      const neighbor = neighbors[i];
      if (neighbor.x < 0 || neighbor.x >= map[0].length) {
        continue;
      }
      if (neighbor.y < 0 || neighbor.y >= map.length) {
        continue;
      }
      if (map[neighbor.y][neighbor.x] !== 0) {
        continue;
      }
      const tentativeGScore = gScore[current.x + "," + current.y] + 1;
      if (
        !gScore.hasOwnProperty(neighbor.x + "," + neighbor.y) ||
        tentativeGScore < gScore[neighbor.x + "," + neighbor.y]
      ) {
        cameFrom[neighbor.x + "," + neighbor.y] = current;
        gScore[neighbor.x + "," + neighbor.y] = tentativeGScore;
        fScore[neighbor.x + "," + neighbor.y] =
          tentativeGScore + heuristic(neighbor, goal);
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  // If the algorithm reaches this point, the goal is unreachable
  return null;
}

// Define the heuristic function (in this case, use the Manhattan distance)
function heuristic(a, b) {
	return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
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
const start = { x: 2, y: 2 };
const goal = { x: 7, y: 7 };


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
		start.x * cellSize + cellSize / 2,
		start.y * cellSize + cellSize / 2,
		cellSize / 2,
		0,
		2 * Math.PI
	);
	ctx.fill();

	ctx.fillStyle = "green";
	ctx.beginPath();
	ctx.arc(
		goal.x * cellSize + cellSize / 2,
		goal.y * cellSize + cellSize / 2,
		cellSize / 2,
		0,
		2 * Math.PI
	);
	ctx.fill();
	// Find the shortest path between the start and goal points
	const path = aStar(start, goal, map);

	// Draw the path
	ctx.strokeStyle = "blue";
	ctx.lineWidth = cellSize / 3;
	ctx.beginPath();
	ctx.moveTo(
		start.x * cellSize + cellSize / 2,
		start.y * cellSize + cellSize / 2
	);
	for (const node of path) {
		ctx.lineTo(
			node.x * cellSize + cellSize / 2,
			node.y * cellSize + cellSize / 2
		);
	}
	ctx.stroke();
}

// Find the shortest path using A*
const path = aStar(start, goal, map);

// Draw the shortest path
if (path) {
  // ... the rest of your code for drawing the shortest path
}

// Call the drawMap function to display the map and the shortest path
drawMap(map);




  



  
    
  
  

  