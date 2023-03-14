function initializeDStar(start, goal, grid) {
    // set start and goal cells
    grid[start.x][start.y].rhs = 0;
    grid[start.x][start.y].g = Infinity;
    grid[goal.x][goal.y].rhs = Infinity;
    grid[goal.x][goal.y].g = Infinity;
  
    // initialize priority queue
    var queue = new PriorityQueue();
    queue.insert({ x: goal.x, y: goal.y, key: calculateKey({ x: goal.x, y: goal.y }, start) });
    console.log(queue)
  
    // calculate rhs and update priority queue
    while (!queue.isEmpty()) {
      var u = queue.top();
      queue.pop();
      var uCell = grid[u.x][u.y];
      if (uCell.g > uCell.rhs) {
        uCell.g = uCell.rhs;
        for (var i = -1; i <= 1; i++) {
          for (var j = -1; j <= 1; j++) {
            if (i == 0 && j == 0) continue;
            var neighborX = u.x + i;
            var neighborY = u.y + j;
            if (isValidCell(neighborX, neighborY, grid)) {
              var neighbor = grid[neighborX][neighborY];
              if (neighbor != start) {
                neighbor.rhs = Math.min(neighbor.rhs, getCost(uCell, neighbor) + uCell.g);
              }
              if (!neighbor.open || neighbor.g != neighbor.rhs) {
                neighbor.open = true;
                queue.insert({ x: neighborX, y: neighborY, key: calculateKey(neighbor, start) });
              }
            }
          }
        }
      } else {
        uCell.g = Infinity;
        for (var i = -1; i <= 1; i++) {
          for (var j = -1; j <= 1; j++) {
            if (i == 0 && j == 0) continue;
            var neighborX = u.x + i;
            var neighborY = u.y + j;
            if (isValidCell(neighborX, neighborY, grid)) {
              var neighbor = grid[neighborX][neighborY];
              if (neighbor != start && neighbor.open) {
                neighbor.rhs = Math.min(neighbor.rhs, getCost(uCell, neighbor) + 1);
              }
              if (!neighbor.open || neighbor.g != neighbor.rhs) {
                neighbor.open = true;
                queue.insert({ x: neighborX, y: neighborY, key: calculateKey(neighbor, start) });
              }
            }
          }
        }
      }
    }
  
    // reset start cell
    grid[start.x][start.y].g = Infinity;
    grid[start.x][start.y].rhs = calculateKey(start, goal);
}

function updateCellDStar(x, y, cost, parent, grid) {
    grid[x][y].g = cost;
    grid[x][y].parent = parent;
    if (isCellOpenDStar(x, y, grid)) {
      insertDStar(x, y, calculateKeyDStar(x, y, grid), grid);
    }
}

function getPathDStar() {
    var path = [];
    var current = goal;
  
    while (!isEqual(current, start)) {
      path.push(current);
      var neighbors = getNeighbors(current, grid);
      var minG = Infinity;
      var next = null;
  
      for (var i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i];
        var g = neighbor.g + distance(current, neighbor);
        if (g < minG) {
          minG = g;
          next = neighbor;
        }
      }
  
      if (!next) {
        return null;
      }
  
      current = next;
    }
  
    path.push(start);
    return path.reverse();
}


function updateStartDStar(x, y, grid) {
    // update the start cell in the grid
    grid[start.x][start.y].closed = false;
    drawCell(grid[start.x][start.y], openColor);
    start = { x: x, y: y };
    grid[start.x][start.y].closed = false;
    drawCell(grid[start.x][start.y], startColor);
  
    // update the g value of the new start cell to 0
    grid[start.x][start.y].g = 0;
  
    // update the rhs value of the start cell to be the minimum cost of its successors
    var successors = getSuccessors(start.x, start.y, grid);
    var rhsValues = [];
    for (var i = 0; i < successors.length; i++) {
      var s = successors[i];
      var cost = getCost(start.x, start.y, s.x, s.y, grid);
      rhsValues.push(grid[s.x][s.y].g + cost);
    }
    grid[start.x][start.y].rhs = Math.min.apply(null, rhsValues);
  
    // update the D* values of the affected cells
    var openList = new PriorityQueue();
    var affectedCells = getAffectedCells(start.x, start.y, grid);
    for (var i = 0; i < affectedCells.length; i++) {
      var cell = affectedCells[i];
      if (!cell.closed) {
        updateCellDStar(cell.x, cell.y, grid);
        openList.enqueue(cell, calculateKey(cell, grid));
      }
    }
  
    // compute the new path and update the path variable
    getPathDStar();
}
  
function updateGoalDStar(x, y, grid) {
    // set new goal cell
    goal = { x: x, y: y };
    grid[goal.x][goal.y].rhs = 0;
  
    // initialize priority queue and closed set
    var U = new PriorityQueue();
    var closed = [];
  
    // add start cell to priority queue with key based on start and goal cells
    grid[start.x][start.y].g = heuristic(start, goal);
    var key = calculateKey(start, goal);
    U.insert(start, key);
  
    // update all cells in priority queue
    while (!U.isEmpty() && (U.topKey() < calculateKey(goal, goal) || grid[goal.x][goal.y].rhs > grid[goal.x][goal.y].g)) {
      // get cell with lowest key from priority queue
      var u = U.extractMin();
  
      // check if cell was previously expanded
      if (grid[u.x][u.y].g > grid[u.x][u.y].rhs) {
        grid[u.x][u.y].g = grid[u.x][u.y].rhs;
        closed.push(u);
  
        // update all neighbors of u
        var neighbors = getNeighbors(u, grid);
        for (var i = 0; i < neighbors.length; i++) {
          var v = neighbors[i];
          if (v != start) {
            updateCellDStar(v.x, v.y, grid);
          }
        }
      } else {
        grid[u.x][u.y].g = Infinity;
        updateCellDStar(u.x, u.y, grid);
        closed.push(u);
  
        // update all neighbors of u and u's parent
        var neighbors = getNeighbors(u, grid);
        neighbors.push(grid[u.x][u.y].parent);
        for (var i = 0; i < neighbors.length; i++) {
          var v = neighbors[i];
          if (v != null && v != start) {
            updateCellDStar(v.x, v.y, grid);
          }
        }
      }
    }
  
    // get path from start to goal
    path = getPathDStar();
  
    // redraw grid
    initGrid();
}

function updateObstacleDStar(x, y, isObstacle, grid) {
    var cell = grid[x][y];
    cell.closed = isObstacle;
    if (isObstacle) {
      drawCell(cell, wallColor);
    } else {
      drawCell(cell, openColor);
    }
    var successors = getSuccessors(cell, grid);
    for (var i = 0; i < successors.length; i++) {
      updateCellDStar(successors[i].x, successors[i].y, successors[i].cost, cell, grid);
    }
    computeShortestPath();
    drawPath();
}

function calculateKey(cell, start) {
  var g = cell.g;
  var rhs = cell.rhs;
  var h = heuristic(cell, start);
  var eps = 0.001;
  if (g <= rhs) {
    return [g + h + eps, g];
  } else {
    return [rhs + h + eps, rhs];
  }
}

function heuristic(node1, node2) {
  return Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y);
}

function getCost(cell1, cell2) {
  var dx = Math.abs(cell1.x - cell2.x);
  var dy = Math.abs(cell1.y - cell2.y);
  return dx + dy;
}




/*
//variable
pathDStar
dsStart
dsGoal
dsGrid

//function
initializeDStar(start, goal, grid)
updateCellDStar(x, y, cost, parent, grid)
getPathDStar()
updateStartDStar(x, y, grid)
updateGoalDStar(x, y, grid)
updateObstacleDStar(x, y, isObstacle, grid)
*/

  
  