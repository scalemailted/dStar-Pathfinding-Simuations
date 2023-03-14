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

class DepthFirstSearch {
  constructor(grid) {
    this.grid = grid;
  }

  dfs(start, end, found) {
    if (start === end) {
      found.found = true;
      return;
    }
    start.visited = true;
    for (let neighbor of this.grid.get_neighbors(start)) {
      if (neighbor.state !== "#" && !neighbor.visited) {
        neighbor.parent = start;
        this.dfs(neighbor, end, found);
        if (found.found) {
          return;
        }
      }
    }
  }

  run(start, end) {
    let rx = [];
    let ry = [];
    let found = { found: false };
    this.dfs(start, end, found);

    if (!found.found) {
      return null;
    }

    end.set_state("e");
    let tmp = end;

    while (tmp !== start) {
      tmp.set_state("*");
      rx.push(tmp.x);
      ry.push(tmp.y);
      tmp = tmp.parent;
    }

    start.set_state("s");
    rx.push(start.x);
    ry.push(start.y);

    return [rx.reverse(), ry.reverse()];
  }
}


