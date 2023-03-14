class State {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.parent = null;
    this.state = ".";
    this.visited = false;
  }

  set_state(state) {
    /*
        .: new
        #: obstacle
        e: parent of current state
        *: closed state
        s: current state
        */
    if (!["s", ".", "#", "e", "*"].includes(state)) {
      return;
    }
    this.state = state;
  }
}

class Grid {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.grid = this.init_map();
  }

  init_map() {
    const cell_list = [];
    for (let i = 0; i < this.row; i++) {
      const tmp = [];
      for (let j = 0; j < this.col; j++) {
        tmp.push(new State(i, j));
      }
      cell_list.push(tmp);
    }
    return cell_list;
  }

  get_neighbors(state) {
    const state_list = [];
    for (let i of [-1, 0, 1]) {
      for (let j of [-1, 0, 1]) {
        if (i === 0 && j === 0) {
          continue;
        }
        if (state.x + i < 0 || state.x + i >= this.row) {
          continue;
        }
        if (state.y + j < 0 || state.y + j >= this.col) {
          continue;
        }
        state_list.push(this.grid[state.x + i][state.y + j]);
      }
    }
    return state_list;
  }

  set_obstacle(point_list) {
    for (let [x, y] of point_list) {
      if (x < 0 || x >= this.row || y < 0 || y >= this.col) {
        continue;
      }
      this.grid[x][y].set_state("#");
    }
  }
}
/*
class DepthFirstSearch {
  constructor(grid) {
    this.grid = grid;
  }

  iddfs(start, end, maxDepth, visited) {
    visited.push(start);
    if (start === end) {
      return visited;
    }
    if (maxDepth === 0) {
      return null;
    }
    for (let neighbor of this.grid.get_neighbors(start)) {
      if (neighbor.state !== "#" && !visited.includes(neighbor)) {
        neighbor.parent = start;
        let path = this.iddfs(neighbor, end, maxDepth - 1, visited);
        if (path) {
          return path;
        }
      }
    }
    visited.pop();
    return null;
  }

  run(start, end) {
    let depth = 0;
    while (true) {
      let visited = [];
      let path = this.iddfs(start, end, depth, visited);
      if (path) {
        end.set_state("e");
        for (let node of visited) {
          node.set_state("*");
        }
        for (let node of path) {
          if (node.parent) {
            node.distance = node.parent.distance + 1;
          }
        }
        let shortestPath = [];
        let distance = end.distance;
        let tmp = end;
        while (tmp !== null && tmp !== start) {
          shortestPath.unshift([tmp.x, tmp.y]);
          distance--;
          tmp = tmp.parent;
        }
        shortestPath.unshift([start.x, start.y]);
        for (let node of this.grid.grid.flatMap(row => row)) {
          node.distance = Infinity;
        }
        return shortestPath;
      }
      depth++;
    }
  }
}
*/

/*
//class IDDFS {
class DepthFirstSearch{
  constructor(grid) {
    this.grid = grid;
  }

  run(start, end) {
    let depth = 0;

    while (true) {
      let visited = new Set();
      let path = this._iddfs(start, end, depth, visited);

      if (path) {
        end.set_state("e");

        for (let node of visited) {
          node.set_state("*");
        }

        for (let node of path) {
          if (node.parent) {
            node.distance = node.parent.distance + 1;
          }
        }

        let shortestPath = [];
        let tmp = end;

        while (tmp !== null && tmp !== start) {
          shortestPath.unshift([tmp.x, tmp.y]);
          tmp = tmp.parent;
        }

        shortestPath.unshift([start.x, start.y]);

        for (let node of this.grid.grid.flatMap(row => row)) {
          node.distance = Infinity;
        }

        return shortestPath;
      }

      depth++;
    }
  }

  _iddfs(start, end, depth, visited) {
    if (start === end) {
      return visited;
    }

    if (depth <= 0) {
      return null;
    }

    visited.add(start);

    for (let neighbor of this.grid.get_neighbors(start)) {
      if (neighbor.state !== "#" && !visited.has(neighbor)) {
        neighbor.parent = start;

        let path = this._iddfs(neighbor, end, depth - 1, visited);

        if (path) {
          return path;
        }
      }
    }

    visited.delete(start);
    return null;
  }
}
*/

class DepthFirstSearch {
//class DepthLimitedSearch {
  constructor(grid, limit) {
    this.grid = grid;
    this.limit = limit;
  }

  dls(start, end, depth, visited) {
    if (depth > this.limit || visited.size > this.grid.rows * this.grid.cols) {
      return null;
    }
    visited.add(start);
    if (start === end) {
      return [end];
    }
    for (let neighbor of this.grid.get_neighbors(start)) {
      if (neighbor.state !== "#" && !visited.has(neighbor)) {
        neighbor.parent = start;
        let path = this.dls(neighbor, end, depth + 1, visited);
        if (path) {
          return [start, ...path];
        }
      }
    }
    visited.delete(start);
    return null;
  }

  run(start, end) {
    let depth = 0;
    let visited = new Set();
    while (true) {
      let path = this.dls(start, end, depth, visited);
      if (path) {
        end.set_state("e");
        for (let node of path) {
          node.set_state("*");
        }
        for (let node of path) {
          if (node.parent) {
            node.distance = node.parent.distance + 1;
          }
        }
        let shortestPath = [];
        let tmp = end;
        while (tmp !== null && tmp !== start) {
          shortestPath.unshift([tmp.x, tmp.y]);
          tmp = tmp.parent;
        }
        shortestPath.unshift([start.x, start.y]);
        for (let node of this.grid.grid.flatMap(row => row)) {
          node.distance = Infinity;
        }
        return shortestPath;
      }
      depth++;
    }
  }
}
