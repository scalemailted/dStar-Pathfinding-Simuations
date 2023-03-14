function updateStart() {
    editMode = 'start';
    document.getElementById("canvas").style.cursor = "crosshair";
}

function updateGoal() {
    editMode = 'goal';
    document.getElementById("canvas").style.cursor = "crosshair";
}

function reset() {
    initGrid();
}

function toggleObstacleMode() {
    if (obstacleMode) {
      obstacleMode = false;
      document.getElementById("canvas").style.cursor = "default";
    } else {
      obstacleMode = true;
      document.getElementById("canvas").style.cursor = "crosshair";
    }
}

function computeShortestPath() {
    initializeDStar(start, goal, grid);
    var path = getPathDStar();
    if (path == null) {
      alert("No path found!");
    } else {
      drawPath();
    }
}

// set up canvas and event listeners
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mouseup", handleMouseUp);

// initialize grid and start/goal cells
var grid = createGrid(50, 50);
var start = { x: 5, y: 5 };
var goal = { x: 45, y: 45 };
console.log('init d*')
initializeDStar(start, goal, grid);
console.log('draw grid')
drawGrid();
console.log('draw start and goal')
drawStartAndGoal();

// set up keyboard shortcuts
document.addEventListener("keydown", function(event) {
    if (event.key == "s") {
      updateStart();
    } else if (event.key == "g") {
      updateGoal();
    } else if (event.key == "r") {
      reset();
    } else if (event.key == "o") {
      toggleObstacleMode();
    } else if (event.key == "c") {
      computeShortestPath();
    }
});

function handleMouseDown(event) {
    if (obstacleMode) {
        var cell = getCellFromEvent(event);
        if (!isEqual(cell, start) && !isEqual(cell, goal)) {
            updateObstacleDStar(cell.x, cell.y, !grid[cell.x][cell.y].closed, grid);
        }
    } else if (editMode == 'start') {
        start = getCellFromEvent(event);
        initializeDStar(start, goal, grid);
        drawStartAndGoal();
        editMode = null;
        document.getElementById("canvas").style.cursor = "default";
    } else if (editMode == 'goal') {
        goal = getCellFromEvent(event);
        initializeDStar(start, goal, grid);
        drawStartAndGoal();
        editMode = null;
        document.getElementById("canvas").style.cursor = "default";
    }
}



function handleMouseUp(event) {
    // do nothing
}



