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
      return Math.sqrt(
        Math.pow(this.x - state.x, 2) + Math.pow(this.y - state.y, 2)
      );
    }
  
    set_state(state) {
      /*
          .: new
          #: obstacle
          e: oparent of current state
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

class Dstar {
    constructor(grid) {
      this.grid = grid;
      this.openList = new Set();
    }
  
    processState() {
      const x = this.minState();
  
      if (x === null) {
        return -1;
      }
  
      const kOld = this.getKmin();
      this.remove(x);
  
      if (kOld < x.h) {
        for (const y of this.grid.get_neighbors(x)) {
          if (y.h <= kOld && x.h > y.h + x.cost(y)) {
            x.parent = y;
            x.h = y.h + x.cost(y);
          }
        }
      } 
      else if (kOld === x.h) {
        for (const y of this.grid.get_neighbors(x)) {
          if (
            y.t === "new" ||
            (y.parent === x && y.h !== x.h + x.cost(y)) ||
            (y.parent !== x && y.h > x.h + x.cost(y))
          ) {
            y.parent = x;
            this.insert(y, x.h + x.cost(y));
          }
        }
      } 
      else {
        for (const y of this.grid.get_neighbors(x)) {
          if (
            y.t === "new" ||
            (y.parent === x && y.h !== x.h + x.cost(y))
          ) {
            y.parent = x;
            this.insert(y, x.h + x.cost(y));
          } else {
            if (
              y.parent !== x &&
              y.h > x.h + x.cost(y)
              && y.t === "close"
              && y.h > kOld
            ) {
              this.insert(y, y.h);
            } else if (
              y.parent !== x &&
              x.h > y.h + x.cost(y)
              && y.t === "close"
              && x.h > kOld
            ) {
              this.insert(y, y.h + x.cost(y));
            }
          }
        }
      }
      return this.getKmin();
    }
  
    minState() {
      if (this.openList.size === 0) {
        return null;
      }
      const minState = [...this.openList].reduce((a, b) => a.k < b.k ? a : b);
      return minState;
    }
  
    getKmin() {
      if (this.openList.size === 0) {
        return -1;
      }
      const kMin = Math.min(...[...this.openList].map(s => s.k));
      return kMin;
    }
  
    insert(state, hNew) {
      if (state.t === "new") {
        state.k = hNew;
      } else if (state.t === "open") {
        state.k = Math.min(state.k, hNew);
      } else if (state.t === "close") {
        state.k = Math.min(state.h, hNew);
      }
      state.h = hNew;
      state.t = "open";
      this.openList.add(state);
    }
  
    remove(state) {
      if (state.t === "open") {
        state.t = "close";
      }
      this.openList.delete(state);
    }
  
    modifyCost(x) {
      if (x.t === "close") {
        this.insert(x, x.parent.h + x.cost(x.parent));
      }
    }
  
    run(start, end) {
        let rx = [];
        let ry = [];
    
        this.insert(end, 0.0);
    
        while (true) {
          this.processState();
          if (start.t === "close") {
            break;
          }
        }
    
        start.set_state("s");
        let s = start;
        s = s.parent;
        s.set_state("e");
        let tmp = start;
    
        while (tmp !== end) {
          tmp.set_state("*");
          rx.push(tmp.x);
          ry.push(tmp.y);
          //if (show_animation) {
          //  plt.plot(rx, ry, "-r");
          //  plt.pause(0.01);
          //}
          if (tmp.parent.state === "#") {
            this.modify(tmp);
            continue;
          }
          tmp = tmp.parent;
        }
        tmp.set_state("e");
    
        console.log(end)
        rx.push(end.x) //tedit
        ry.push(end.y) //tedit
        return [rx, ry];
    }
    
    modify(state) {
        this.modifyCost(state);
        while (true) {
          const k_min = this.processState();
          if (k_min >= state.h) {
            break;
          }
        }
    }
}
  

  
  
