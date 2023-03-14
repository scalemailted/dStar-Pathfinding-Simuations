#python
#readme - v0.0.05 - toggle selected object red/blue

#import packages
import numpy as np
import math




# initialize global variables
click_flag = False
wall_count = []


def get(prop):
    data = {
        'cell_size': 0.5,
        'world_length': 10,
        'world_width': 10
    }
    return data[prop]


def sysCall_init():
    #during initialization
    global wall_count
    wall_count = init_grid()
    #pass
    
def sysCall_actuation():
    #during main loop
    #if is_mouse_clicked():
    #    selected_handle = get_selected_object()
    #    toggle_selected_object(selected_handle)
    handle_key_press()
        

def sysCall_sensing():
    pass

def sysCall_cleanup():
    pass


def is_mouse_clicked():
    global click_flag
    mouse_button_id = 17
    button_status = sim.getInt32Param(sim.intparam_mouse_buttons)
    is_clicked = False
    if button_status == mouse_button_id and not click_flag:
        is_clicked = click_flag = True
    elif button_status != mouse_button_id and click_flag:
        is_clicked = click_flag = False
    return is_clicked


def get_mouse_screen_coords():
    x_pos = sim.getInt32Param(sim.intparam_mouse_x)
    y_pos = sim.getInt32Param(sim.intparam_mouse_y)
    return x_pos, y_pos

def log_coords(x_pos, y_pos):
    sim.addLog(0, "x_pos: {}, y_pos: {}".format(x_pos, y_pos))


def add_masking_cell(i,j):
    cell_size = get("cell_size")
    floor = sim.getObject("/Floor")
    world_pos = get_world_coordinates([i,j])         
    cell_handle = sim.createPrimitiveShape(sim.primitiveshape_cuboid, [cell_size, cell_size, 0], 1)
    sim.setObjectPosition(cell_handle, floor, [world_pos[0], world_pos[1], 0.15])
    sim.setShapeColor(cell_handle, None, 0, [1, 0.1, 0.1])
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
            cell_handle = add_masking_cell(i,j)
            grid[i][j] = int(cell_handle)
    return grid


def get_world_size():
    world_handle = sim.getObjectHandle("/Floor")
    xmin = sim.getObjectFloatParam(world_handle, sim.objfloatparam_modelbbox_min_x)
    xmax = sim.getObjectFloatParam(world_handle, sim.objfloatparam_modelbbox_max_x)
    ymin = sim.getObjectFloatParam(world_handle, sim.objfloatparam_modelbbox_min_y)
    ymax = sim.getObjectFloatParam(world_handle, sim.objfloatparam_modelbbox_max_y)
    sim.addLog(0,'floor size: x:[{}, {}] y:[{}, {}]'.format(xmin,xmax,ymin,ymax))
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
        sim.addLog(0, 'object selection (handle): {}'.format(selected_handle) )
        sim.addLog(0, 'object selection (name): {}'.format(selected_name) )
        sim.addLog(0, 'object selection (pos): {}'.format(selected_position) )
        return selected_handle
    else:
        return None


def isclose(a, b, rel_tol=1e-2):
    for i in range(len(a)):
        if not math.isclose(a[i], b[i], rel_tol=rel_tol):
            return False
    return True

def toggle_selected_object(selected_handle):
    if selected_handle:
        # Get the current color of the object
        color = sim.getObjectColor(selected_handle, 0, sim.colorcomponent_ambient_diffuse )
        sim.addLog(0,'color:{}'.format(color))
        if isclose(color, [0.1, 0.1, 1]):  # Blue
            sim.setObjectColor(selected_handle,0,sim.colorcomponent_ambient_diffuse,[1, 0.1, 0.1]) # Red 
        elif isclose(color, [1, 0.1, 0.1]):  # Red
            sim.setObjectColor(selected_handle,0,sim.colorcomponent_ambient_diffuse,[0.1, 0.1, 1]) # Blue  


def sysCall_keyPressed(key):
    if key == ord('t'):
        toggle_selected_object_color()


def sysCall_event(e):
    sim.addLog(0, 'event: {}'.format(e))

def handle_key_press(): 
    #sim.addLog(0,'{}'.format(sim.getSimulatorMessage()))
    message, auxiliaryData, _ = sim.getSimulatorMessage()
    if message != -1:
        sim.addLog(0, 'message:{} key:{}'.format(message, auxiliaryData[0]))
    if message == 6:
        if chr(auxiliaryData[0]) == ' ':
            selected_handle = get_selected_object()
            toggle_selected_object(selected_handle)
    if message == 11:
        selected_handle = auxiliaryData[0]
        toggle_selected_object(selected_handle)
            

    #elif message == sim.message_keypress:
    #    print(auxiliaryData[0], auxiliaryData[1], auxiliaryData[2], auxiliaryData[3])
    #    if chr(auxiliaryData[0]) == ' ':
    #        # space key was pressed
    #        pass
            