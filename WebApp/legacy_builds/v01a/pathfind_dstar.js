// define calculateKey function (calculate key for a cell)
function calculateKey(cell, start) {
    return Math.min(cell.g, cell.rhs) + heuristic(cell, start) + kM;
  }
  
  // define getCost function (get cost to move from one cell to another)
  function getCost(cell1, cell2) {
    var dx = cell1.x - cell2.x;
    var dy = cell1.y - cell2.y;
    return dx !== 0 && dy !== 0 ? 1.414 : 1;
  }
  
  // define heuristic function (calculate heuristic for a cell)
  function heuristic(cell, goal) {
    return Math.abs(cell.x - goal.x) + Math.abs(cell.y - goal.y);
  }
  
  // define isValidCell function (check if a cell is a valid grid cell)
  function isValidCell(x, y, grid) {
    return x >= 0 && x < grid.length && y >= 0 && y < grid[0].length && !grid[x][y].closed;
  }
  
  // define updateCell function (update the g and rhs values of a cell)
  function updateCell(cell, start, goal, grid) {
    if (cell != start) {
      cell.rhs = Infinity;
      for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
          if (i == 0 && j == 0) continue;
          var neighborX = cell.x + i;
          var neighborY = cell.y + j;
          if (isValidCell(neighborX, neighborY, grid)) {
            var neighbor = grid[neighborX][neighborY];
            cell.rhs = Math.min(cell.rhs, getCost(cell, neighbor) + neighbor.g);
          }
        }
      }
    }
    if (cell.open) {
      var queue = new PriorityQueue();
      queue.insert({ x: cell.x, y: cell.y, key: calculateKey(cell, start) });
      var u = queue.top();
      queue.pop();
      if (cell.g > cell.rhs) {
        cell.g = cell.rhs;
        for (var i = -1; i <= 1; i++) {
          for (var j = -1; j <= 1; j++) {
            if (i == 0 && j == 0) continue;
            var neighborX = cell.x + i;
            var neighborY = cell.y + j;
            if (isValidCell(neighborX, neighborY, grid)) {
              var neighbor = grid[neighborX][neighborY];
              if (neighbor != start) {
                updateCell(neighbor, start, goal, grid);
              }
            }
          }
        }
      } else {
        cell.g = Infinity;
        for (var i = -1; i <= 1; i++) {
          for (var j = -1; j <= 1; j++) {
            if (i == 0 && j == 0) continue;
            var neighborX = cell.x + i;
            var neighborY = cell.y + j;
            if (isValidCell(neighborX, neighborY, grid)) {
              var neighbor = grid[neighborX][neighborY];
              if (neighbor != start) {
                neighbor.rhs = Math.min(neighbor.rhs, getCost(cell, neighbor) + cell.g);
                updateCell(neighbor, start, goal, grid);
              }
            }
          }
        }
      }
    }
  }
  
  // define initializeDStar function (initialize
  