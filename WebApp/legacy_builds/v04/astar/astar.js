class State {
  constructor(x, y) {
      this.x = x;
      this.y = y;
      this.parent = null;
      this.state = ".";
      this.t = "new"; // tag for state
      this.h = 0;
      this.k = 0;
  }

  cost(state) {
      if (this.state === "#" || state.state === "#") {
          return Number.MAX_SAFE_INTEGER;
      }
      if (typeof state.x !== "number" || typeof state.y !== "number") {
          return Number.MAX_SAFE_INTEGER;
      }
      return Math.sqrt(
          Math.pow(this.x - state.x, 2) + Math.pow(this.y - state.y, 2)
      );
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

class Astar {
  constructor(grid) {
    this.grid = grid;
    this.openList = new Set();
  }

  processState() {
    const x = this.minState();

    if (x === null) {
      return -1;
    }

    this.remove(x);

    for (const y of this.grid.get_neighbors(x)) {
      const tentative_g = x.g + x.cost(y);
      if (y.state === "#" || tentative_g >= y.g) {
        continue;
      }
      y.parent = x;
      y.g = tentative_g;
      y.h = y.cost(this.grid.grid[0][this.grid.col - 1]);
      y.f = y.g + y.h;
      if (y.t === "new") {
        y.t = "open";
        this.openList.add(y);
      } else {
        this.openList.add(y);
      }
    }

    return 0;
  }

  minState() {
    if (this.openList.size === 0) {
      return null;
    }
    const minState = [...this.openList].reduce((a, b) => (a.f < b.f ? a : b));
    return minState;
  }

  insert(state, g) {
    if (state.t === "new") {
      state.g = g;
      state.h = state.cost(this.grid.grid[0][this.grid.col - 1]);
    } else {
      state.g = Math.min(state.g, g);
    }
    state.f = state.g + state.h;
    state.t = "open";
    this.openList.add(state);
  }

  remove(state) {
    if (state.t === "open") {
      state.t = "close";
    }
    this.openList.delete(state);
  }

  run(start, end) {
    this.insert(start, 0);

    while (true) {
      const ret = this.processState();
      if (ret === -1) {
        return null;
      }
      if (end.t === "open") {
        break;
      }
    }

    let tmp = end;
    const path = [];

    while (tmp !== start) {
      if (tmp === null) {
        return null;
      }
      path.push([tmp.x, tmp.y]);
      tmp = tmp.parent;
    }

    path.push([start.x, start.y]);

    return path.reverse();
  }
}
