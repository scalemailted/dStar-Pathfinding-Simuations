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
  
    updateCell(cell, goalCell) {
      if (cell !== goalCell) {
        let minRhs = Infinity;
        for (const neighbor of this.getNeighbors(cell)) {
          const rhs = neighbor.g + cellCost(cell, neighbor);
  
          if (rhs < minRhs) {
            minRhs = rhs;
            cell.parent = neighbor;
          }
        }
  
        cell.rhs = minRhs;
      }
  
      if (cell.g !== cell.rhs) {
        cell.key = Math.min(cell.g, cell.rhs) + heuristic(cell, goalCell);
      }
    }
  
    getPath(start, goal) {
      const path = [];
  
      let current = start;
      while (current !== goal) {
        path.push(current);
  
        let minCost = Infinity;
        let next = null;
  
        for (const neighbor of this.getNeighbors(current)) {
          const cost = neighbor.g + cost(current, neighbor);
  
          if (cost < minCost) {
            minCost = cost;
            next = neighbor;
          }
        }
  
        current = next;
      }
  
      path.push(current);
  
      return path;
    }

    updateVertex(vertex, goalCell, openSet) {
        if (vertex.g !== vertex.rhs) {
          vertex.key = Math.min(vertex.g, vertex.rhs) + heuristic(vertex, goalCell);
          if (openSet.items.includes(vertex)) {
            openSet.items.splice(openSet.items.indexOf(vertex), 1);
          }
          openSet.enqueue(vertex);
        } else {
          if (openSet.items.includes(vertex)) {
            openSet.items.splice(openSet.items.indexOf(vertex), 1);
          }
        }
    }
      
}
  
function computeShortestPath(map, start, goal) {
    const grid = new Grid(map);
    const openSet = new PriorityQueue();
    const closedSet = new Set();
  
    const startNode = initializeStartNode(grid, goal);
    openSet.enqueue(startNode);
  
    search(grid, start, goal, openSet, closedSet);

    let current = null;
    if (!openSet.isEmpty()) {
        current = openSet.dequeue();
      
        const path = buildPath(grid, start, goal, current);
      
        return { grid, path };
    } 
    else {
        return { grid, path: [] };
    }
}
  
function search(grid, start, goal, openSet, closedSet) {
    let current = grid.getCell(goal.x, goal.y);
    current.rhs = 0;
  
    while (!openSet.isEmpty() && current !== start && (openSet.items[0].key < heuristic(start, current) || current.rhs !== current.g)) {
        current = openSet.dequeue();
      
        if (closedSet.has(current)) {
          continue;
        }
      
        closedSet.add(current);
      
        for (const neighbor of grid.getNeighbors(current)) {
          grid.updateCell(neighbor, goal);
      
          if (!closedSet.has(neighbor)) {
            neighbor.g = neighbor.rhs;
            grid.updateVertex(neighbor, goal, openSet);
          }
        }
    }      
}


  
// This function initializes the start node for the search algorithm by setting its rhs (right-hand side) value to 0.
function initializeStartNode(grid, goal) {
    // Retrieve the start node from the grid using the goal node's coordinates.
    const startNode = grid.getCell(goal.x, goal.y);
    // Set the rhs value of the start node to 0.
    startNode.rhs = 0;
    // Return the start node.
    return startNode;
}
  
function buildPath(grid, start, goal, current) {
    const path = [];
    path.push(start); // Start with adding the starting node to the path
  
    let next = start;
  
    while (current !== goal) { // Continue searching until the goal node is reached
      path.push(current); // Add the current node to the path
  
      let minCost = Infinity; // Set the initial minimum cost to infinity to find the minimum cost path
      let tempNext = null;
  
      // Check all neighbors of the current node and find the one with the minimum cost
      for (const neighbor of grid.getNeighbors(current)) {
        const edgeCost = neighbor.g + cellCost(current, neighbor); // Calculate the cost of the current edge
  
        if (edgeCost < minCost) { // If the cost is less than the minimum cost so far
          minCost = edgeCost; // Update the minimum cost
          tempNext = neighbor; // Set the temporary next node to the neighbor with the minimum cost
        }
      }
  
      if (tempNext === null) { // If no neighbor was found, the path cannot be completed
        return [];
      }
  
      next = tempNext; // Set the next node as the neighbor with the minimum cost
  
      current = next; // Set the current node to the next node
    }
  
    path.push(current); // Add the goal node to the path
  
    return path; // Return the final path
}


  
function heuristic(cell, goalCell) {
    return Math.abs(cell.x - goalCell.x) + Math.abs(cell.y - goalCell.y);
}

function cellCost(cell1, cell2) {
    if (map[cell1.y][cell1.x] === 1 || map[cell2.y][cell2.x] === 1) {
      return Infinity;
    }
    const dx = cell1.x - cell2.x;
    const dy = cell1.y - cell2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

  



  
    
  
  

  