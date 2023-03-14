
# API Documentation

---

## `add_drone`
Adds a drone to the simulation at the specified initial position and orientation.

#### Parameters
None

#### Returns
- `int`: the handle of the created drone object

#### Details
This function loads the Quadcopter model file and sets its initial position and orientation based on the start_handle object's position in the simulation. The quadcopter object handle is returned.

---

## add_goal_object
Adds a goal object to the simulation at the given position, rounding to the nearest grid point.

#### Parameters
Non3

#### Returns
int: the handle of the created goal object

#### Details
This function creates a goal object in the simulation. It first retrieves the position of the goal from the configuration file using the get() function. It then rounds this position to the nearest grid point using the get_closest_grid_point() function. Finally, it creates a spherical object at the rounded position using the sim.createPrimitiveShape() function and sets the object's color to red using the sim.setShapeColor() function. The object's handle is returned.

---

## `add_grid_cell`
Adds a grid cell to the simulation at the specified grid coordinates.

#### Parameters
- `i` (int): the row position of the cell in the grid
- `j` (int): the column position of the cell in the grid

#### Returns
- `int`: the handle of the created cell object

#### Details
This function creates a new cuboid shape with the specified dimensions using the sim.createPrimitiveShape function. The position of the cell is set using the sim.setObjectPosition function, which takes the handle of the floor object, the world coordinates of the cell, and the z-coordinate of 0.15 to place the cell on top of the floor. The color of the cell is set to white using the sim.setShapeColor function. The transparency of the cell is set to 0 to make it opaque. The special properties of the cell are set to collidable and measurable using the sim.setObjectSpecialProperty function. The handle of the created cell object is returned.

---

## `add_start_object`
Adds a green sphere representing the start object to the simulation at the closest grid cell to the specified start position.

#### Parameters
None

#### Returns
- `int`: the handle of the created start object

#### Details
This function adds a green sphere representing the start object to the simulation at the closest grid cell to the specified start position. The size of the sphere is determined by the object_size parameter, which is set to 0.25 by default. The function retrieves the start position from the start_pos parameter and uses the get_closest_grid_point function to find the closest grid cell to the start position. The function then creates a primitive shape with the specified size and sets the color to green. Finally, the function sets the position of the start object to the center of the closest grid cell and returns the handle of the created start object.

---

## `clear_line`

#### Parameters
None

#### Returns
None

#### Details
This function removes the previous line drawing object from the simulation. It checks if a global variable line_handle exists, and if it does, removes the drawing object using the sim.removeDrawingObject() function.

---

## `follow_path`
Controls the quadcopter to follow the path to the destination.

#### Parameters
- `dst` (tuple): a tuple containing the (x, y, z) coordinates of the destination

#### Returns
None

#### Details
This function controls the quadcopter to follow the path to the destination using a proportional control law. The current position of the drone is obtained using the sim.getObjectPosition function. The quadcopter object handle is assumed to be stored in the global variable quad_handle. The distance between the current position and the destination is computed using numpy.linalg.norm. The step size is set to DRONE_SPEED * sim.getSimulationTimeStep(), where DRONE_SPEED is a constant representing the speed of the drone. If the distance is greater than the step size, the drone is moved one step towards the destination using a proportional control law. If the distance is less than or equal to the step size, the drone is moved directly to the destination. The new position of the drone is set using the sim.setObjectPosition function. The quadcopter object is also moved to the new position using a hack, since the path is drawn using the target object, which is assumed to have the same position as the quadcopter object.

---

## `get_closest_grid_point`
This method returns the world coordinates of the closest grid point to a given world position.

#### Parameters
`world_pos`: A tuple of 3 floats representing the x, y, z coordinates of a position in the world.

#### Returns
`tuple`: A tuple of 3 floats representing the x, y, z coordinates of the closest grid point in the world.

#### Details
This method get_closest_grid_point takes a 3D coordinate as input and returns the 3D coordinate of the closest grid point to that input coordinate. It does this by first converting the input coordinate to a grid coordinate using the get_grid_coordinates function, then converting that grid coordinate back to a world coordinate using the get_world_coordinates function, and finally returning the 3D coordinate of the resulting world coordinate, but with the same z-coordinate as the original input coordinate. This ensures that the returned coordinate is on the same plane as the original input coordinate, but aligned with the closest grid point in the x-y plane.

---

## `get_endpoints`
Gets the grid coordinates of the start and goal objects.

#### Parameters
None

#### Returns
- `tuple`: a tuple containing the grid coordinates of the start and goal objects
  - `start_i` (int): the row position of the start object in the grid
  - `start_j` (int): the column position of the start object in the grid
  - `goal_i` (int): the row position of the goal object in the grid
  - `goal_j` (int): the column position of the goal object in the grid

#### Details
This function retrieves the position of the quadcopter object and the goal object using the sim.getObjectPosition function. The grid coordinates of the start and goal objects are computed using the get_grid_coordinates function. If the start and goal objects have the same grid coordinates, the goal object is randomized using the randomize_goal function, and get_endpoints is called recursively. The function returns a tuple containing the grid coordinates of the start and goal objects.


---

## `get_grid_coordinates`
Converts world coordinates to grid coordinates.

#### Parameters
- `world_pos` (tuple): a tuple containing the (x,y) world coordinates of a point

#### Returns
- `tuple`: a tuple containing the (i,j) grid coordinates of the cell at the specified point

#### Details
This function first gets the cell size and the size of the world in the x-axis and y-axis using the get and get_world_size functions, respectively. The minimum and maximum values of the x-axis and y-axis are extracted from the returned tuple. 

---

## `get_message_type`
Returns a string representing the type of message based on its ID.

#### Parameters
- `id` (int): the ID of the message

#### Returns
A string representing the type of message, either 'keyboard_click' or 'mouse_click'.

#### Details
This function takes an integer id as input and returns a string representing the type of message based on its ID. If the ID is 6, the function returns 'keyboard_click'. If the ID is 11, the function returns 'mouse_click'. If the ID is not 6 or 11, the function returns None.

---

## `get_obstacles`
This method returns a list of coordinates of obstacles in the grid. It loops through each cell in the grid, checks the color of the cell object to determine whether it is an obstacle or not, and adds the coordinates of the obstacle to the obstacles list.

#### Parameters:
This method does not take any parameters.

#### Returns:
obstacles (list of tuples): A list of coordinates of obstacles in the grid.

#### Details
This method returns a list of grid coordinates representing the location of obstacles on the map. It iterates over all the cells in the grid and checks their color to determine if they are obstacles or not.

---

## `get_selected_object`
Gets the handle of the currently selected object in the simulation.

#### Parameters
None

#### Returns
- `int`: the handle of the selected object, or `None` if no object is selected

#### Details
This function gets the list of currently selected objects in the simulation using the sim.getObjectSelection function. If the list is not empty, the handle of the first selected object is extracted and returned. If the list is empty, None is returned. If an object is selected, its name and position can also be obtained using the sim.getObjectAlias and sim.getObjectPosition functions, respectively.

---

## `get_world_coordinates`
Converts grid coordinates to world coordinates.

#### Parameters
- `grid_pos` (tuple): a tuple containing the (i,j) grid coordinates of a cell

#### Returns
- `tuple`: a tuple containing the (x,y) world coordinates of the center of the cell

#### Details
This function first gets the cell size and the size of the world in the x-axis and y-axis using the get and get_world_size functions, respectively. The minimum and maximum values of the x-axis and y-axis are extracted from the returned tuple. 

---

## `get_world_size`
Gets the size of the world in the x-axis and y-axis.

#### Parameters
None

#### Returns
- `tuple`: a tuple containing two tuples representing the minimum and maximum values of the x-axis and y-axis

### Details
This function gets the handle of the floor object using the sim.getObjectHandle function. It then gets the minimum and maximum values of the x-axis and y-axis using the sim.getObjectFloatParam function with the sim.objfloatparam_modelbbox_min_x, sim.objfloatparam_modelbbox_max_x, sim.objfloatparam_modelbbox_min_y, and sim.objfloatparam_modelbbox_max_y parameters. The minimum and maximum values are returned as two tuples within another tuple.

---

## `handle_key_press`
Handles keyboard and mouse events in the simulation.

#### Parameters
None

#### Returns
None

#### Details
This function first retrieves any messages from the simulator using the sim.getSimulatorMessage function. If the message is a keyboard click (message 6), the function checks if the space bar was pressed and if there is currently a selected object. If so, it calls the toggle_selected_object function to toggle the color and transparency of the selected object. If the message is a mouse click (message 11), the function retrieves the handle of the clicked object from the auxiliaryData parameter and calls the toggle_selected_object function with that handle. If there is no selected object or clicked object, the function does nothing. The function also logs any keyboard clicks using the sim.addLog function.

---

## `init_grid`
Initializes the grid of cells in the simulation.

#### Parameters
None

#### Returns
- `numpy.ndarray`: a 2D array representing the grid of cells in the simulation

#### Details
This function initializes the grid of cells in the simulation by first getting the cell size and the size of the world in the x-axis and y-axis using the get and get_world_size functions, respectively. The number of rows and columns in the grid are then computed using the cell size and world size. An empty 2D array of the appropriate size is created using the numpy.empty function. The grid is then populated by looping through the rows and columns, and adding a new cell to the simulation at each grid position using the add_grid_cell function. The handle of each cell object is stored in the grid array. Finally, the grid array is returned.

---

## `isclose`
Checks if two vectors are approximately equal within a given relative tolerance.

#### Parameters
- `a` (list): a list representing a vector
- `b` (list): a list representing another vector
- `rel_tol` (float): the relative tolerance to use for the comparison (default is 1e-2)

#### Returns
- `bool`: `True` if the vectors are approximately equal, `False` otherwise

#### Details
This function checks if the two input vectors are approximately equal within a given relative tolerance. It does this by iterating over the elements of the vectors and comparing them using the math.isclose function with the specified relative tolerance. If any elements are not approximately equal, the function returns False. If all elements are approximately equal, the function returns True.

---

## `randomize_goal`
Randomizes the position of the goal object.

#### Parameters
None

#### Returns
None

#### Details
This function generates a new random position for the goal object that is not an obstacle. It first gets the current obstacles using the get_obstacles function, and then repeatedly generates random positions until it finds one that is not an obstacle. The new position is then converted to world coordinates using the get_world_coordinates function. The old goal position is set as the start position, and the new position is set as the goal position using the sim.setObjectPosition function. The print statement is used for debugging and can be removed.

---

## `set_path`
Draws the given path on the simulation.

#### Parameters
- `path` (list): a list of tuples containing the (x, y, z) coordinates of the line segments in the path

#### Returns
None

#### Details
This function draws the given path on the simulation using blue lines. It creates a new drawing object using the sim.addDrawingObject function, with the sim.drawing_lines flag to indicate that the drawing object should be a set of lines, a 9999 flag to indicate that the drawing object should be visible from all camera angles, and the [0, 0, 1] color to indicate that the lines should be blue. The line segments in the path are then added to the drawing object using the sim.addDrawingObjectItem function. The drawing object handle is stored in the global variable line_handle, which can be used to clear the lines from the simulation using the sim.removeDrawingObject function.

---

## `sysCall_actuation`
Main loop function that runs the D* algorithm to find the path from the start to the goal object, and controls the quadcopter to follow the path.

#### Parameters
None

#### Returns
None

#### Details
This function is called in the main loop of the simulation. It clears the previous path from the visualization using the clear_line function, handles any key presses using the handle_key_press function, and initializes the D* algorithm to find the shortest path from the start to the goal object. The start and goal objects are retrieved using the get_endpoints function. The obstacles are retrieved using the get_obstacles function and set on the map object using the set_obstacle method. The D* algorithm is run using the run method of the Dstar object, and the resulting path is stored in the rx and ry arrays.

The blue path is drawn on the simulation using the set_path function, which takes a list of line segments. The line segments are computed using the positions of the cells in the path obtained from the rx and ry arrays. The follow_path function is then called with the destination of the first line segment in the path. This function controls the quadcopter to follow the path.

---

## `sysCall_init`
Initializes the simulation by setting the start and goal objects, the quadcopter object, and the target object, and sets a timer to call `follow_path` function periodically.

#### Parameters
None

#### Returns
None

#### Details
This function initializes the simulation by creating a grid, adding the start and goal objects, adding a quadcopter object, and setting a timer to call the follow_path function every timer_interval seconds. The quadcopter object is added using the add_drone function, which loads a Quadcopter model file and sets its initial position and orientation. The handle of the quadcopter object is stored in the global variable quad_handle. The target object is retrieved using the object name "/target". The timer is set using the getSystemTime function to get the current system time, and timer_interval to specify the duration between timer callbacks.

---

## `toggle_selected_object`
Toggles the color and transparency of the currently selected object between red and blue.

#### Parameters
- `selected_handle` (int): the handle of the currently selected object

#### Returns
None

#### Details
This function checks if an object is currently selected using the selected_handle parameter. If an object is selected, the current color of the object is retrieved using the sim.getObjectColor function with the sim.colorcomponent_ambient_diffuse flag. If the color is approximately equal to blue (RGB [1,1,1]), the color and transparency of the object are set to red (RGB [0,0,0]) using the sim.setObjectColor and sim.setShapeColor functions. If the color is approximately equal to red, the color and transparency of the object are set to blue (RGB [1,1,1]) and opaque (transparency 0.0). The color comparison is done using the isclose function. If no object is selected, the function does nothing.

---


## Class `State`

A class representing a state in a graph for pathfinding algorithms.

### Methods

- `__init__(self, x, y)`: Initializes a `State` object with the given x and y coordinates.
- `cost(self, state) -> float`: Returns the cost between this `State` object and the given `State` object.
- `set_state(self, state) -> None`: Sets the state of this `State` object to the given string, which can be one of the following: ".", "#", "e", "*", or "s".

### Properties

- `x`: The x-coordinate of the state.
- `y`: The y-coordinate of the state.
- `parent`: The parent `State` object of this state.
- `state`: The state of the `State` object, which can be one of the following: ".", "#", "e", "*", or "s".
- `t`: The tag for the `State` object.
- `h`: The heuristic value for the `State` object.
- `k`: The cost value for the `State` object.

---


## Class `Map`

### Methods:

#### `__init__(self, row, col)`
- Initializes the Map object with given number of rows and columns.
- Parameters:
  - `row` : int : number of rows in the map.
  - `col` : int : number of columns in the map.
- Returns: None.

#### `init_map(self)`
- Initializes the map grid with State objects.
- Parameters: None.
- Returns:
  - `map_list` : list : a 2D list of State objects representing the map grid.

#### `get_neighbors(self, state)`
- Returns a list of neighboring states of the given state.
- Parameters:
  - `state` : State : the state whose neighbors are to be returned.
- Returns:
  - `state_list` : list : a list of neighboring State objects.

#### `set_obstacle(self, point_list)`
- Sets the state of the given points as obstacle in the map.
- Parameters:
  - `point_list` : list : a list of points (tuples) to be set as obstacle in the map.
- Returns: None.

---

## Class `SafeMap`
The SafeMap class is a subclass of the Map class that overrides the get_neighbors method to only allow diagonal moves if there are no obstacles that would cause clipping into neighboring obstacles.

### Methods:

#### `__init__(self, row, col)`  
Initializes a new SafeMap object with the given number of rows and columns.

#### `get_neighbors(self, state) -> List[State]` 
Returns a list of neighboring states of the given state. Only allows diagonal moves if there are no obstacles that would cause clipping into neighboring obstacles. Overrides the get_neighbors method of the Map class.

### Inherits from:
`Map` class.

---


# Class: Dstar

The `Dstar` class is used for finding the shortest path in a map that may contain obstacles. It has the following methods:

## Methods

### `__init__(self, maps) -> None`

Initializes a new `Dstar` object with the given map.

### `process_state(self) -> int`

Processes the current state of the `Dstar` object and returns the value of `kmin`.

### `min_state(self) -> State`

Returns the state with the minimum k value from the `open_list`.

### `get_kmin(self) -> float`

Returns the minimum k value in the `open_list`.

### `insert(self, state, h_new) -> None`

Inserts a new state into the `open_list` with the given h and k values.

### `remove(self, state) -> None`

Removes a state from the `open_list` and updates its tag to "close".

### `modify_cost(self, x) -> None`

Modifies the cost of a state x and all its children.

### `run(self, start, end) -> Tuple[List[int], List[int]]`

Finds the shortest path from the start state to the end state and returns the x and y coordinates of the path as lists.

### `modify(self, state) -> None`

Modifies the cost of a state and its children until kmin >= state.h.

### Inherits from:

None.





