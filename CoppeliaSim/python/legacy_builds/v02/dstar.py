#python
#readme - v0.0.02 - Functional Decomposition on Mouse Events

# initialize global variables
click_flag = False

def sysCall_init():
    #during initialization
    pass
    
def sysCall_actuation():
    #during main loop
    if is_mouse_clicked():
        x_pos, y_pos = get_mouse_coords()
        log_coords(x_pos, y_pos)

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


def get_mouse_coords():
    x_pos = sim.getInt32Param(sim.intparam_mouse_x)
    y_pos = sim.getInt32Param(sim.intparam_mouse_y)
    return x_pos, y_pos

def log_coords(x_pos, y_pos):
    sim.addLog(0, "x_pos: {}, y_pos: {}".format(x_pos, y_pos))

