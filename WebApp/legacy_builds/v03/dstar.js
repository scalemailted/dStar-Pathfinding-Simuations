
//priority queue

class PriorityQueue {
  constructor(comparator = (a, b) => a > b) {
    this._heap = [];
    this._comparator = comparator;
  }

  enqueue(item) {
    this._heap.push(item);
    this._siftUp();
  }

  dequeue() {
    const item = this._heap[0];
    const last = this._heap.pop();
    if (this._heap.length > 0) {
      this._heap[0] = last;
      this._siftDown();
    }
    return item;
  }

  peek() {
    return this._heap[0];
  }

  get length() {
    return this._heap.length;
  }

  _siftUp() {
    let nodeIdx = this._heap.length - 1;
    while (nodeIdx > 0) {
      const parentIdx = Math.floor((nodeIdx - 1) / 2);
      if (this._comparator(this._heap[nodeIdx].key, this._heap[parentIdx].key)) {
        const tmp = this._heap[nodeIdx];
        this._heap[nodeIdx] = this._heap[parentIdx];
        this._heap[parentIdx] = tmp;
        nodeIdx = parentIdx;
      } else {
        break;
      }
    }
  }

  _siftDown() {
    let nodeIdx = 0;
    while (nodeIdx < this._heap.length) {
      const leftChildIdx = 2 * nodeIdx + 1;
      const rightChildIdx = 2 * nodeIdx + 2;
      let maxIdx = nodeIdx;
      if (leftChildIdx < this._heap.length && this._comparator(this._heap[leftChildIdx].key, this._heap[maxIdx].key)) {
        maxIdx = leftChildIdx;
      }
      if (rightChildIdx < this._heap.length && this._comparator(this._heap[rightChildIdx].key, this._heap[maxIdx].key)) {
        maxIdx = rightChildIdx;
      }
      if (maxIdx !== nodeIdx) {
        const tmp = this._heap[nodeIdx];
        this._heap[nodeIdx] = this._heap[maxIdx];
        this._heap[maxIdx] = tmp;
        nodeIdx = maxIdx;
      } else {
        break;
      }
    }
  }

  contains(item) {
    return this._heap.some((x) => x === item);
  }

  remove(item) {
    const idx = this._heap.indexOf(item);
    if (idx >= 0) {
      const last = this._heap.pop();
      if (idx !== this._heap.length) {
        this._heap[idx] = last;
        this._siftDown();
      }
      return true;
    }
    return false;
  }
}

function calculateKey(node, start, gScore, k, goal) {
  console.log('[calculateKey]->params','\n\t--node',node, '\n\t--start',start, '\n\t--gScore',gScore, '\n\t--k',k, '\n\t--goal',goal)
  const g = gScore[key(node, goal, 0)];
  console.log('g: ', g)
  const rhsValue = rhs(node, start, goal, gScore);
  console.log('rhsValue: ', rhsValue)
  const estimatedCost = Math.min(g, rhsValue) + heuristic(node, goal) + k;
  console.log('estimatedCost:  ', estimatedCost)
  const minimumCost = Math.min(g, rhsValue)
  console.log('minimumCost:  ', minimumCost)
  return [estimatedCost, minimumCost];
}


function key(node, goal, k) {
  return `(${node.x},${node.y})|(${goal.x},${goal.y})|${k}`;
}

function rhs(node, start, goal, gScore) {
  console.log('[rhs]->params','\n\t--node: ',node, '\n\t--start: ',start, '\n\t--goal: ',goal, '\n\t--gScore: ',gScore)
  const isGoal = equal(node, goal)
  if (isGoal) {
    console.log('GOAL!')
    return 0;
  } 
  else {
    const neighbors = successors(node, map);
    console.log('neighbors: ',neighbors)
    const neighborKeys = getNeighborKeys(neighbors, goal);
    console.log('neighborKeys: ',neighborKeys)
    const minRhs = getMinRhs(neighborKeys, start, gScore, goal);
    console.log('minRhs: ',minRhs)
    const h = heuristic(node, start);
    console.log('h: ',h)
    return minRhs + h;
  }
}

function getNeighborKeys(neighbors, goal) {
  return neighbors.map((n) => key(n, goal, 0));
}

function getMinRhs(neighborKeys, start, gScore, goal) {
  return Math.min(...neighborKeys.map((key) => {
    const g = gScore[key] || Infinity;
    const s = getSuccessor(key, start);
    const rhsValue = rhs(s, start, goal, gScore);
    const h = heuristic(s, { x: parseInt(key.split("|")[1].split(",")[0]), y: parseInt(key.split("|")[1].split(",")[1]) });
    return g + h + rhsValue;
  }));
}

function getSuccessor(key, start) {
  return { x: parseInt(key.split("|")[0].split(",")[0]), y: parseInt(key.split("|")[0].split(",")[1]) };
}



function equal(a, b) {
  return a?.x === b?.x && a?.y === b?.y;
}


function dStar(start, goal, map) {
  let counter = 0 //haxfix
  let U = new PriorityQueue((a, b) => a.key < b.key);
  let k = 0;
  let gScore = {};
  let cameFrom = {};

  initializeGScore(gScore, map);
  setStartNodeGScore(start, goal, gScore);
  addStartNodeToQueue(start, goal, gScore, U);
  notThereYet = shouldContinue(U, start, goal, gScore, k)
  while (U.length > 0 && notThereYet) {
    let u = U.dequeue();
    console.log('u: ', u)
    k = updateK(u, start, gScore, goal, k);
    console.log('k: ', k)
    let gOld = gScore[key(u.value, goal, 0)];
    console.log( 'gOld: ',gOld, 'u.rhs: ',u.rhs )
    if (gOld > u.rhs) {
      updateGScore(u, goal, gScore);
      updateNeighbors(u, start, goal, gScore, U, cameFrom, map, k);
    } 
    else {
      resetGScore(u, goal, gScore);
      updateNeighbors(u, start, goal, gScore, U, cameFrom, map, k);
      updateVertex(u, start, goal, gScore, U, cameFrom, map, k);
    }
    notThereYet = shouldContinue(U, start, goal, gScore, k) 
    console.log('counter')
    notThereYet = notThereYet && ++counter < 100 //hackfix
  }
  console.log('cameFrom', cameFrom)


  let path = reconstructPath(start, goal, cameFrom);
  return path;
}

function initializeGScore(gScore, map) {
  for (let key of Object.keys(map)) {
    gScore[key] = Infinity;
  }
}

function setStartNodeGScore(start, goal, gScore) {
  let startKey = key(start, goal, 0);
  gScore[startKey] = 0;
}

function addStartNodeToQueue(start, goal, gScore, queue) {
  let startNode = { key: calculateKey(start, start, gScore, 0, goal), value: start, rhs: heuristic(start, goal) };
  queue.enqueue(startNode);
}

function shouldContinue(queue, start, goal, gScore, k) {
  const topNode = queue.peek().value;
  const topNodeKey = queue.peek().key;
  const rhsValue = rhs(topNode, start, goal, gScore);
  const gScoreValue = gScore[key(topNode, goal, 0)];
  const goalKey = calculateKey(goal, start, gScore, k, goal);

  return topNodeKey < goalKey || rhsValue !== gScoreValue;
}


function updateK(node, start, gScore, goal, k) {
  return Math.min(k, rhs(node.value, start, goal, gScore));
}

function updateGScore(node, goal, gScore) {
  gScore[key(node.value, goal, 0)] = node.rhs;
}

function resetGScore(node, goal, gScore) {
  gScore[key(node.value, goal, 0)] = Infinity;
}

function updateNeighbors(node, start, goal, gScore, queue, cameFrom, map, k) {
  const predecessors = getPredecessors(node.value, map);
  for (let p of predecessors) {
    const key = calculateKey(p, start, gScore, k, goal);
    const vertex = { key: key, value: p, rhs: Infinity };
    updateVertex(vertex, start, goal, gScore, queue, cameFrom, map, k);
  }
}


function reconstructPath(start, goal, cameFrom) {
  console.log('[reconstructPath]->params','\n\t-start',start, '\n\t-goal',goal, '\n\t-cameFrom',cameFrom)
  let path = [goal];
  let current = goal;
  while (!equal(current, start)) {
    current = cameFrom[key(current, goal, 0)];
    path.unshift(current);
  }
  return path;
}


function successors(node, map) {
  const x = node.x;
  const y = node.y;
  const successors = [];
  if (x > 0 && map[y][x - 1] === 0) {
    successors.push({ x: x - 1, y: y });
  }
  if (x < map[0].length - 1 && map[y][x + 1] === 0) {
    successors.push({ x: x + 1, y: y });
  }
  if (y > 0 && map[y - 1][x] === 0) {
    successors.push({ x: x, y: y - 1 });
  }
  if (y < map.length - 1 && map[y + 1][x] === 0) {
    successors.push({ x: x, y: y + 1 });
  }
  return successors;
}


function getPredecessors(u, map) {
  const predecessors = [];
  const { x, y } = u;
  if (y > 0 && map[y - 1][x] === 0) {
    predecessors.push({ x, y: y - 1 });
  }
  if (x < map[0].length - 1 && map[y][x + 1] === 0) {
    predecessors.push({ x: x + 1, y });
  }
  if (y < map.length - 1 && map[y + 1][x] === 0) {
    predecessors.push({ x, y: y + 1 });
  }
  if (x > 0 && map[y][x - 1] === 0) {
    predecessors.push({ x: x - 1, y });
  }
  return predecessors;
}



function updateVertex(node, start, goal, gScore, U, cameFrom, map, k) {
  // check if the node is not the start node
  let isStart = equal(node.value, start)
  if (!isStart) {
    // remove cameFrom variable usage and replace neighbors with getPredecessors
    const parent = null;
    const predecessors = getPredecessors(node.value, map);
    // loop through the predecessors
    for (let predecessor of predecessors) {
      updatePredecessor(predecessor, node, start, goal, gScore, U, cameFrom, k);
    }
  }

  // check if U contains node and remove it if it does
  U.remove(node);

  // update the node if its gScore is not equal to its rhsScore
  updateNode(node, start, goal, gScore, k, U);
}

function updatePredecessor(predecessor, node, start, goal, gScore, U, cameFrom, k) {
  const sKey = key(predecessor, goal, 0);
  // check if the predecessor is valid and not an obstacle
  if (isObstacle(predecessor, map) || !isWithinMap(predecessor, map)) {
    return;
  }
  const sRhs = rhs(predecessor, start, goal, gScore);
  const sNode = { key: calculateKey(predecessor, start, gScore, k, goal), value: predecessor, rhs: sRhs };
  const oldParent = cameFrom[sKey];

  if (oldParent !== null && equal(oldParent, node.value) && sRhs !== gScore[sKey]) {
    U.enqueue(sNode);
  } 
  else if (sRhs !== gScore[sKey]) {
    U.enqueue(sNode);
    cameFrom[sKey] = node.value;
  } 
  else if (oldParent !== null && equal(oldParent, node.value)) {
    U.enqueue(sNode);
  } 
  else if (oldParent !== null && sRhs > gScore[sKey]) {
    U.enqueue({ key: calculateKey(predecessor, start, gScore, k, goal), value: predecessor, rhs: gScore[sKey] });
    cameFrom[sKey] = node.value;
  } 
  else if (oldParent === null && sRhs > gScore[sKey]) {
    U.enqueue({ key: calculateKey(predecessor, start, gScore, k, goal), value: predecessor, rhs: gScore[sKey] });
    cameFrom[sKey] = node.value;
  }
}


function updateNode(node, start, goal, gScore, k, U) {
  const gValue = gScore[node.key];
  const rhsValue = rhs(node.value, start, goal, gScore);
  if (gValue !== rhsValue) {
    node.key = calculateKey(node.value, start, gScore, k, goal);
    node.rhs = rhsValue;
    U.enqueue(node);
  }
}

function isObstacle(node, map) {
  return map[node.y][node.x] === 1;
}

function isWithinMap(node, map) {
  return node.x >= 0 && node.x < map[0].length && node.y >= 0 && node.y < map.length;
}





// Define the heuristic function (in this case, use the Manhattan distance)
function heuristic(a, b) {
	return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}


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
}

function drawPath(path){
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

drawMap(map)

// Find the shortest path between the start and goal points
const path = dStar(start, goal, map);

drawPath(path)







