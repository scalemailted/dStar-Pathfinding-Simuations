#python
#readme - v0.15 - When drone gets to goal, randomize it to new location and make old goal the new start

#import packages
import numpy as np
import math
import random

# initialize global variables
grid = []
start_handle = -1
goal_handle = -1
quad_handle = -1  # added this global variable to store quadcopter object handle
path = []  # added this global variable to store current path
path_index = 0  # added this global variable to track current path index
elapsed_time = 0  # added this global variable to track elapsed time
DRONE_SPEED = 0.05  # added this global variable for drone speed
timestamp = 0


def is_ready(interval=0.5):
    global timestamp
    now = sim.getSystemTime()       #now time
    sim.addLog(0, 'now:{} then:{} elapsed:{}'.format(now, timestamp, now-timestamp) )
    if (now - timestamp) > interval:
        timestamp = now
        return True
    return False

def get(prop):
    data = {
        'cell_size': 0.5,# / 3,
        'world_length': 10,
        'world_width': 10,
        'start_pos': [1.25, 2.25, 0.1],
        'goal_pos': [-1.25, -2.25, 0.1]
    }
    return data[prop]


def sysCall_init():
    #move the start position
    # during initialization
    global grid
    global start_handle
    global goal_handle
    global quad_handle  # added this global variable to store quadcopter object handle
    global timestamp
    grid = init_grid()
    start_handle = add_start_object()
    goal_handle = add_goal_object()
    quad_handle = add_drone()  # added this line to add quadcopter object
    quad_handle = sim.getObjectHandle("/target")

    # set the timer to call follow_path every `timer_interval` seconds
    timestamp = sim.getSystemTime()


def sysCall_actuation():
    clear_line()
    #during main loop
    handle_key_press()
    
    # initialize Dstar algorithm
    row, col = grid.shape
    #map_obj = Map(row, col)
    map_obj = SafeMap(row,col)
    start_pos = sim.getObjectPosition(quad_handle, -1)
    start_i, start_j = get_grid_coordinates(start_pos[:2])
    goal_pos = sim.getObjectPosition(goal_handle, -1)
    goal_i, goal_j = get_grid_coordinates(goal_pos[:2])
    start_state = map_obj.map[start_i][start_j]
    end_state = map_obj.map[goal_i][goal_j]
    map_obj.set_obstacle(get_obstacles())
    dstar = Dstar(map_obj)
    rx, ry = dstar.run(start_state, end_state)
    
    # draw blue path from start to goal object
    path = []
    for i in range(len(rx)-1):
        current_cell_handle = int( grid[rx[i]][ry[i]] )
        next_cell_handle = int( grid[rx[i+1]][ry[i+1]] )       
        src_cell = sim.getObjectPosition(current_cell_handle, -1)
        dst_cell = sim.getObjectPosition(next_cell_handle, -1)
        path.append((src_cell, dst_cell))
        
    set_path(path)

 
    #if is_ready():
    #    # move the quadcopter along the next point
    #    #this happens every .5 seconds
    if len(path) < 2:
        randomize_goal()
    else:
        src, dst = path[0]
        follow_path(dst)
    #randomize_goal()
        


def follow_path(dst):
    global quad_handle
    # Get the start position of the drone
    current_pos_3D = sim.getObjectPosition(quad_handle, -1)
    current_pos = np.array(current_pos_3D[:2])

    # Get the quadcopter object handle
    
    # Move the drone to the destination
    target_pos = np.array(dst[:2])
    direction = target_pos - current_pos
    distance = np.linalg.norm(direction)
    if distance > DRONE_SPEED:
        # Calculate the drone's next position
        direction /= distance
        next_pos = current_pos + DRONE_SPEED * direction
        next_pos = [next_pos[0], next_pos[1], current_pos_3D[2]]
    else:
        # The drone has reached the target position
        next_pos = dst
    # Set the new position of the drone
    sim.setObjectPosition(quad_handle, -1, next_pos)


'''
def move_to_waypoint(src_handle, next_point):
    # Get the current position of the source handle
    current_pos = sim.getObjectPosition(src_handle, -1)
    # Get the speed of the quadcopter
    speed = 1
    # Calculate the step size based on the speed and simulation time step
    step_size = speed * sim.getSimulationTimeStep()
    # Calculate the angle to move towards the destination
    angle = get_angle(next_point, current_pos)
    # Calculate the new position based on the angle and step size
    new_pos = get_new_pos(angle, step_size, current_pos)
    # Set the position of the source handle to the new position
    sim.setObjectPosition(src_handle, -1, new_pos)

def get_angle(destination, current_pos):
    # Calculate the difference in x and y positions
    x_diff = destination[1] - current_pos[1]
    y_diff = destination[0] - current_pos[0]
    # Calculate the angle between the destination and current position
    angle = np.arctan2(x_diff, y_diff)
    return angle 


def get_new_pos(angle, step_size, current_pos):
    # Calculate new x position using cosine of angle and step size
    new_x = current_pos[0] + np.cos(angle) * step_size
    # Calculate new y position using sine of angle and step size
    new_y = current_pos[1] + np.sin(angle) * step_size
    # Keep the current z position
    new_z = current_pos[2]
    # Return the new position as a list
    return [new_x, new_y, new_z]
'''




def sysCall_sensing():
    pass

def sysCall_cleanup():
    pass




'''
def move_object(handle,new_pos):
    # Define object sizes and positions
    object_size = get('cell_size')
    x,y,z = get_closest_grid_point(new_pos)
    sim.setObjectPosition(goal_handle, -1, (x,y,z) )
'''


def randomize_goal():
    global start_handle, goal_handle, grid
    nrows, ncols = grid.shape
    # Get the current obstacles
    obstacles = get_obstacles()
    # Get a new random position for the goal that is not an obstacle
    while True:
        new_goal_i, new_goal_j = random.randint(0, nrows-1), random.randint(0, ncols-1)
        if (new_goal_i, new_goal_j) not in obstacles:
            break
    # Convert the grid indices to world coordinates
    new_goal_pos = get_world_coordinates((new_goal_i, new_goal_j))
    # Set the new position for the goal object
    #sim.setObjectPosition(goal_handle, -1, new_goal_pos)
    # Set the old goal position as the start position
    old_goal_pos = sim.getObjectPosition(goal_handle, -1) 
    sim.setObjectPosition(start_handle, -1, old_goal_pos)
    # Set the new position as the goal position
    print('new_goal_pos:{}'.format(new_goal_pos))
    new_goal_pos = [new_goal_pos[0], new_goal_pos[1], old_goal_pos[2]]
    sim.setObjectPosition(goal_handle, -1, new_goal_pos) 

    




def set_path(path):
    global line_handle
    line_handle = sim.addDrawingObject(sim.drawing_lines, 6, 0.0, -1, 9999, [0, 0, 1])
    
    for current, previous in path:
        line = np.append(previous, current)
        line = list(line)
        sim.addDrawingObjectItem(line_handle, line)


def add_grid_cell(i,j):
    cell_size = get("cell_size")
    floor = sim.getObject("/Floor")
    world_pos = get_world_coordinates([i,j])         
    cell_handle = sim.createPrimitiveShape(sim.primitiveshape_cuboid, [cell_size, cell_size, 0], 1)
    sim.setObjectPosition(cell_handle, floor, [world_pos[0], world_pos[1], 0.15])
    sim.setShapeColor(cell_handle, None, 0, [1, 1, 1])
    sim.setShapeColor(cell_handle,None,sim.colorcomponent_transparency,[0])
    sim.setObjectSpecialProperty(cell_handle, sim.objectspecialproperty_collidable + sim.objectspecialproperty_measurable)
    return cell_handle

def init_grid():
    cell_size = get('cell_size')
    xaxis, yaxis = get_world_size()
    nrows = int((xaxis[1] - xaxis[0]) / cell_size)
    ncols = int((yaxis[1] - yaxis[0]) / cell_size)
    grid = np.empty((nrows, ncols), dtype=np.int32)
    for i in range(nrows):
        for j in range(ncols):
            cell_handle = add_grid_cell(i,j)
            grid[i][j] = int(cell_handle)
    return grid


def get_world_size():
    world_handle = sim.getObjectHandle("/Floor")
    xmin = sim.getObjectFloatParam(world_handle, sim.objfloatparam_modelbbox_min_x)
    xmax = sim.getObjectFloatParam(world_handle, sim.objfloatparam_modelbbox_max_x)
    ymin = sim.getObjectFloatParam(world_handle, sim.objfloatparam_modelbbox_min_y)
    ymax = sim.getObjectFloatParam(world_handle, sim.objfloatparam_modelbbox_max_y)
    return (xmin,xmax),(ymin,ymax)


def get_world_coordinates(grid_pos):
    cell_size = get('cell_size')
    (xmin, xmax),(ymin, ymax) = get_world_size()
    # Shift axis from leftmost point (grid) to center point (world) and left-shift range into negatives
    x = cell_size * grid_pos[0] + xmin + cell_size / 2.0
    y = cell_size * grid_pos[1] + ymin + cell_size / 2.0
    return x, y


def get_grid_coordinates(world_pos):
    cell_size = get('cell_size')
    (xmin, xmax),(ymin, ymax) = get_world_size()
    # Shift axis from center point (world) to leftmost point (grid) and rightshift range to 0
    i = int((world_pos[0] - xmin) / cell_size)
    j = int((world_pos[1] - ymin) / cell_size)
    return i, j


def get_selected_object():
    selections_list = sim.getObjectSelection()
    if len(selections_list) > 0: 
        selected_handle = selections_list[0]
        selected_name = sim.getObjectAlias(selected_handle,-1)
        selected_position = sim.getObjectPosition(selected_handle, 0)
        return selected_handle
    else:
        return None


def isclose(a, b, rel_tol=1e-2):
    for i in range(len(a)):
        if not math.isclose(a[i], b[i], rel_tol=rel_tol):
            return False
    return True



def toggle_selected_object(selected_handle):
    if selected_handle and selected_handle != -1:
        # Get the current color of the object
        color = sim.getObjectColor(selected_handle, 0, sim.colorcomponent_ambient_diffuse )
        if isclose(color, [1, 1, 1]):  # Blue
            sim.setObjectColor(selected_handle,0,sim.colorcomponent_ambient_diffuse,[0, 0, 0]) # Red 
            sim.setShapeColor(selected_handle,None,sim.colorcomponent_transparency,[1.0])
        elif isclose(color, [0, 0, 0]):  # Red
            sim.setObjectColor(selected_handle,0,sim.colorcomponent_ambient_diffuse,[1, 1, 1]) # Blue
            sim.setShapeColor(selected_handle,None,sim.colorcomponent_transparency,[0])




def handle_key_press(): 
    message, auxiliaryData, _ = sim.getSimulatorMessage()
    if message != -1:
        sim.addLog(0, 'message:{} key:{}'.format(message, auxiliaryData[0]))
    if message == 6:     #keyboard click
        if chr(auxiliaryData[0]) == ' ':
            selected_handle = get_selected_object()
            if selected_handle != -1:
                toggle_selected_object(selected_handle)
    if message == 11:     #mouse click
        selected_handle = auxiliaryData[0]
        if selected_handle != -1:
            toggle_selected_object(selected_handle)



def get_message_type(id):
    types = {
        6: 'keyboard_click',
        11: 'mouse_click'
    }
    return types[id]


def add_start_object():
    # Define object sizes and positions
    object_size = get('cell_size')
    start_pos = get('start_pos')
    x,y,z = get_closest_grid_point(start_pos)

    # Add start object
    start_handle = sim.createPrimitiveShape(sim.primitiveshape_spheroid, [object_size, object_size, object_size],0)
    sim.setShapeColor(start_handle, None, sim.colorcomponent_ambient_diffuse, [0, 1, 0])
    #sim.setObjectPosition(start_handle, -1, start_pos )
    sim.setObjectPosition(start_handle, -1, (x,y,z) )
    return start_handle


def add_goal_object():
    # Define object sizes and positions
    object_size = get('cell_size')
    goal_pos = get('goal_pos')
    x,y,z = get_closest_grid_point(goal_pos)

    # Add goal object
    goal_handle = sim.createPrimitiveShape(sim.primitiveshape_spheroid, [object_size, object_size, object_size],0)
    sim.setShapeColor(goal_handle, None, sim.colorcomponent_ambient_diffuse, [1, 0, 0])
    #sim.setObjectPosition(start_handle, -1, goal_pos )
    sim.setObjectPosition(goal_handle, -1, (x,y,z) )
    return goal_handle


def get_closest_grid_point(world_pos):
    x,y,z = world_pos
    i,j = get_grid_coordinates( (x,y) )
    dx,dy = get_world_coordinates( (i,j) )
    return (dx,dy,z)

    
def get_obstacles():
    obstacles = []
    for i in range(grid.shape[0]):
        for j in range(grid.shape[1]):
            cell_handle = int(grid[i][j])
            color = sim.getObjectColor(cell_handle, 0, sim.colorcomponent_ambient_diffuse )
            if isclose(color, [0, 0, 0]):
                wall_cell = sim.getObjectPosition(cell_handle, -1)
                obstacles.append((i,j))
    return obstacles

def clear_line():
    # Remove previous line drawing object
    if 'line_handle' in globals():
        sim.removeDrawingObject(line_handle)


import os

def add_drone():
    sim.addLog(0,os.getcwd())
    # Load the Quadcopter model file
    #model_file = '/Applications/coppeliaSim.app/Contents/Resources/models/robots/mobile/Quadcopter.ttm'
    model_file = '../../Contents/Resources/models/robots/mobile/Quadcopter.ttm'
    quad_handle = sim.loadModel(model_file)

    # Set the initial position and orientation of the Quadcopter
    x,y,_ = sim.getObjectPosition(start_handle, -1)
    init_pos = [x, y, 0.5]   # x, y, z position
    init_ori = [0, 0, 0]     # Euler angles (yaw, pitch, roll)
    sim.setObjectPosition(quad_handle, -1, init_pos)
    sim.setObjectOrientation(quad_handle, -1, init_ori)

    # Add a force sensor to the Quadcopter
    #force_sensor_handle = sim.addForceSensor(quad_handle, 'Quadcopter_force_sensor')

    # Add a proximity sensor to the Quadcopter
    #prox_sensor_handle = sim.createProximitySensor(sim.sensor_generic_flag_forcesensing, sim.sensor_subtype_proximityresponder)
    #sim.setObjectParent(prox_sensor_handle, quad_handle, True)


###############################



"""
D* grid planning
author: Nirnay Roy
See Wikipedia article (https://en.wikipedia.org/wiki/D*)
"""
import math

from sys import maxsize




class State:

    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.parent = None
        self.state = "."
        self.t = "new"  # tag for state
        self.h = 0
        self.k = 0

    def cost(self, state):
        if self.state == "#" or state.state == "#":
            return maxsize

        return math.sqrt(math.pow((self.x - state.x), 2) +
                         math.pow((self.y - state.y), 2))

    def set_state(self, state):
        """
        .: new
        #: obstacle
        e: oparent of current state
        *: closed state
        s: current state
        """
        if state not in ["s", ".", "#", "e", "*"]:
            return
        self.state = state


class Map:

    def __init__(self, row, col):
        self.row = row
        self.col = col
        self.map = self.init_map()

    def init_map(self):
        map_list = []
        for i in range(self.row):
            tmp = []
            for j in range(self.col):
                tmp.append(State(i, j))
            map_list.append(tmp)
        return map_list

    def get_neighbors(self, state):
        state_list = []
        for i in [-1, 0, 1]:
            for j in [-1, 0, 1]:
                if i == 0 and j == 0:
                    continue
                if state.x + i < 0 or state.x + i >= self.row:
                    continue
                if state.y + j < 0 or state.y + j >= self.col:
                    continue
                state_list.append(self.map[state.x + i][state.y + j])
        return state_list

    def set_obstacle(self, point_list):
        for x, y in point_list:
            if x < 0 or x >= self.row or y < 0 or y >= self.col:
                continue

            self.map[x][y].set_state("#")


class Dstar:
    def __init__(self, maps):
        self.map = maps
        self.open_list = set()
    
    def process_state(self):
        x = self.min_state()

        if x is None:
            return -1

        k_old = self.get_kmin()
        self.remove(x)

        if k_old < x.h:
            for y in self.map.get_neighbors(x):
                if y.h <= k_old and x.h > y.h + x.cost(y):
                    x.parent = y
                    x.h = y.h + x.cost(y)
        elif k_old == x.h:
            for y in self.map.get_neighbors(x):
                if y.t == "new" or y.parent == x and y.h != x.h + x.cost(y) \
                        or y.parent != x and y.h > x.h + x.cost(y):
                    y.parent = x
                    self.insert(y, x.h + x.cost(y))
        else:
            for y in self.map.get_neighbors(x):
                if y.t == "new" or y.parent == x and y.h != x.h + x.cost(y):
                    y.parent = x
                    self.insert(y, x.h + x.cost(y))
                else:
                    if y.parent != x and y.h > x.h + x.cost(y):
                        self.insert(y, x.h)
                    else:
                        if y.parent != x and x.h > y.h + x.cost(y) \
                                and y.t == "close" and y.h > k_old:
                            self.insert(y, y.h)
        return self.get_kmin()

    def min_state(self):
        if not self.open_list:
            return None
        min_state = min(self.open_list, key=lambda x: x.k)
        return min_state

    def get_kmin(self):
        if not self.open_list:
            return -1
        k_min = min([x.k for x in self.open_list])
        return k_min

    def insert(self, state, h_new):
        if state.t == "new":
            state.k = h_new
        elif state.t == "open":
            state.k = min(state.k, h_new)
        elif state.t == "close":
            state.k = min(state.h, h_new)
        state.h = h_new
        state.t = "open"
        self.open_list.add(state)

    def remove(self, state):
        if state.t == "open":
            state.t = "close"
        self.open_list.remove(state)

    def modify_cost(self, x):
        if x.t == "close":
            self.insert(x, x.parent.h + x.cost(x.parent))

    
    def run(self, start, end):

        rx = []
        ry = []

        self.insert(end, 0.0)

        while True:
            self.process_state()
            if start.t == "close":
                break

        start.set_state("s")
        s = start
        s = s.parent
        s.set_state("e")
        tmp = start

        while tmp != end:
            tmp.set_state("*")
            rx.append(tmp.x)
            ry.append(tmp.y)
            if tmp.parent.state == "#":
                self.modify(tmp)
                continue
            tmp = tmp.parent
        tmp.set_state("e")

        rx.append(end.x)                     #tedit
        ry.append(end.y)                     #tedit
        return rx, ry




    def modify(self, state):
        self.modify_cost(state)
        while True:
            k_min = self.process_state()
            if k_min >= state.h:
                break



#Only checks orthogonal neighbors 
class ManhattanMap(Map):
    def get_neighbors(self, state):
        state_list = []
        for i, j in [(0, -1), (0, 1), (-1, 0), (1, 0)]:
            if state.x + i < 0 or state.x + i >= self.row:
                continue
            if state.y + j < 0 or state.y + j >= self.col:
                continue
            state_list.append(self.map[state.x + i][state.y + j])
        return state_list


# Only allows diagonals if no clipping into neighbors
class SafeMap(Map):

    def __init__(self, row, col):
        super().__init__(row, col)

    def get_neighbors(self, state):
        state_list = []
        for i in [-1, 0, 1]:
            for j in [-1, 0, 1]:
                if i == 0 and j == 0:
                    continue
                if state.x + i < 0 or state.x + i >= self.row:
                    continue
                if state.y + j < 0 or state.y + j >= self.col:
                    continue

                # Check for diagonal moves
                if i != 0 and j != 0:
                    # Check for obstacle clipping corners
                    if self.map[state.x + i][state.y].state == "#" or self.map[state.x][state.y + j].state == "#":
                        continue

                state_list.append(self.map[state.x + i][state.y + j])

        return state_list

def main():
    m = Map(100, 100)
    ox, oy = [], []
    for i in range(-10, 60):
        ox.append(i)
        oy.append(-10)
    for i in range(-10, 60):
        ox.append(60)
        oy.append(i)
    for i in range(-10, 61):
        ox.append(i)
        oy.append(60)
    for i in range(-10, 61):
        ox.append(-10)
        oy.append(i)
    for i in range(-10, 40):
        ox.append(20)
        oy.append(i)
    for i in range(0, 40):
        ox.append(40)
        oy.append(60 - i)
    print([(i, j) for i, j in zip(ox, oy)])
    m.set_obstacle([(i, j) for i, j in zip(ox, oy)])

    start = [10, 10]
    goal = [50, 50]

    start = m.map[start[0]][start[1]]
    end = m.map[goal[0]][goal[1]]
    dstar = Dstar(m)
    rx, ry = dstar.run(start, end)
            