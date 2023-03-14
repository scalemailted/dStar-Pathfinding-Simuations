// Define the D* path finding algorithm
function dStar(start, goal, map) {
    // Define the size of each cell on the grid
    const cellSize = 20;
  
    // Define the heuristic function
    function heuristic(a, b) {
      return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }
  
    // Define the cost function
    function cost(current, next) {
      if (map[next.y][next.x] === 0) {
        return Infinity;
      }
  
      const dx = Math.abs(current.x - next.x);
      const dy = Math.abs(current.y - next.y);
  
      if (dx === 1 && dy === 1) {
        return Math.sqrt(2);
      } else {
        return 1;
      }
    }
  
    // Define the cell class
    class Cell {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.g = Infinity;
        this.rhs = Infinity;
        this.key = Infinity;
        this.parent = null;
      }
  
      compareTo(other) {
        return this.key - other.key;
      }
    }
  
    // Define the priority queue class
    class PriorityQueue {
      constructor() {
        this.items = [];
      }
  
      enqueue(item) {
        this.items.push(item);
        this.items.sort((a, b) => a.compareTo(b));
      }
  
      dequeue() {
        return this.items.shift();
      }
  
      isEmpty() {
        return this.items.length === 0;
      }
    }
  
    // Define the grid class
    class Grid {
      constructor(map) {
        this.map = map;
        this.cells = [];
  
        for (let y = 0; y < map.length; y++) {
          this.cells.push([]);
          for (let x = 0; x < map[y].length; x++) {
            this.cells[y].push(new Cell(x, y));
          }
        }
      }
  
      getCell(x, y) {
        if (x < 0 || x >= this.map[0].length || y < 0 || y >= this.map.length) {
          return null;
        } else {
          return this.cells[y][x];
        }
      }
  
      getNeighbors(cell) {
        const neighbors = [];
  
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) {
              continue;
            }
  
            const x = cell.x + dx;
            const y = cell.y + dy;
            const neighbor = this.getCell(x, y);
  
            if (neighbor !== null) {
              neighbors.push(neighbor);
            }
          }
        }
  
        return neighbors;
      }
  
      updateCell(cell) {
        if (cell !== goal) {
          let minRhs = Infinity;
  
          for (const neighbor of this.getNeighbors(cell)) {
            const rhs = neighbor.g + cost(cell, neighbor);
  
            if (rhs < minRhs) {
              minRhs = rhs;
              cell.parent = neighbor;
            }
          }
  
          cell.rhs = minRhs;
        }
  
        if (cell.g !== cell.rhs) {
          cell.key = Math.min(cell.g, cell.rhs) + heuristic(cell, goal);
        } else {
          cell.key = cell.g + heuristic(cell, goal);
        }
      }
    }
  
  // Create the grid and initialize the start and goal cells
  const grid = new Grid(map);
  const startCell = grid.getCell(start.x, start.y);
  const goalCell = grid.getCell(goal.x, goal.y);

  startCell.g = 0;
  startCell.rhs = heuristic(startCell, goalCell);
  startCell.key = heuristic(startCell, goalCell);

  // Initialize the priority queue
  const queue = new PriorityQueue();
  queue.enqueue(goalCell);

  // Define the path variable
  const path = [];

  // Run the D* algorithm
  while (!queue.isEmpty()) {
    const current = queue.dequeue();

    if (current.g > current.rhs) {
      current.g = current.rhs;
      for (const neighbor of grid.getNeighbors(current)) {
        grid.updateCell(neighbor);
        if (neighbor.parent === current) {
          queue.enqueue(neighbor);
        }
      }
    } else {
      current.rhs = Infinity;
      for (const neighbor of grid.getNeighbors(current)) {
        if (neighbor !== startCell) {
          const rhs = neighbor.g + cost(current, neighbor);
          if (rhs < current.rhs) {
            current.rhs = rhs;
            current.parent = neighbor;
          }
        }
      }
      grid.updateCell(current);
      for (const neighbor of grid.getNeighbors(current)) {
        if (neighbor.parent === current && neighbor.g !== current.g + cost(current, neighbor)) {
          queue.enqueue(neighbor);
        }
      }
    }
  }

  // Build the path
  let current = startCell;
  while (current !== goalCell) {
    path.push({ x: current.x, y: current.y });
    current = current.parent;
  }
  path.push({ x: goalCell.x, y: goalCell.y });

  // Return the path
  return path;
}

  