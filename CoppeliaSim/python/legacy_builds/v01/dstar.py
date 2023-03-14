#python
#readme - v0.0.01 - Capture a click event and log the x,y coords to sim's console

def sysCall_init(): 
    global click_flag        #inialize global variable to track click status 
    click_flag = False       #set default click state as false
    

def sysCall_actuation():
    global click_flag       #import global click status 
    mouse_btn_id = 17       #id for mouse left button
    
    #get the current mouse button state from simulator
    btn_state = sim.getInt32Param(sim.intparam_mouse_buttons)

    # if left button active and not clicked prior
    if btn_state == mouse_btn_id and not click_flag:
        click_flag = True
        x_pos = sim.getInt32Param(sim.intparam_mouse_x)
        y_pos = sim.getInt32Param(sim.intparam_mouse_y)
        sim.addLog(0, "x_pos: {}, y_pos: {}".format(x_pos, y_pos))
    # otherwise reset click flag
    elif btn_state != mouse_btn_id:
        click_flag = False

def sysCall_sensing():
    # put your sensing code here
    pass

def sysCall_cleanup():
    # do some clean-up here
    pass