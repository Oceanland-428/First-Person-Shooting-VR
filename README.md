# First-Person-Shooting-VR

This is the README file for our project: First-person Shooting Game in THREE.js. In this file we will introduce all of our important source code files and provide instructions on running the project.

The game can only run on Firefox!! Chrome does not support some external 3D models.

############################  JavaScript  #################################

We implement the interactive virtual environment in JavaScript. 
## In js folder:
1. game_normal.js: this is the main file we render our scene. In this file we set cameras and construct the stereo scene. Also data from VRduino are streamed into javascript through WebSocket. We use the position data and quaternion data to control the position and movement of cameras and guns.
2. backgroundSound.js: we implement a function to play music during a game. The function is called in game_normal.js.
3. MTLLoader.js and OBJLoader.js: object loaders. Credits to authors on line.
4. jquery-3.2.1.min.js: jquery library we use to update remaining time and scores on webpage.
5. three.min.js: library we use for THREE.

## In server folder:
This folder contains all necessary files including server.js and node.js which enable WebSocket server to communicate VRduino data to the browser.

## In css folder
style.css: this is the file we specify the layout of our webpage such as the locations of Time and Score.

## Various object folders:
1. kenney_naturepackextended_updated is the folder for tree object.
2. kenney_watercraft_updated is the folder for pirate ship objects.
3. weaponpack_assets is the folder for gun objects.
4. Universe is the folder containing the pictures we use to construct cube object of the scene.

## Music folder:
This folder contains all the music files we play in the game. 

##############################  VRduino  #####################################

We use the VRduino code from HW6 to implement IMU orientation tracking and Lighthouse pose tracking. The whole package is directly borrowed from HW6 with minimal modifications. 

################  Instructions on running the project  #######################

The project is able to run out of box without any third party software. There are some necessary steps to run the project successfully:
1. First connect the HMD and Teensyduino to your laptop before running any software. Connect a remote mouse to your laptop if you have one.
2. Open terminal and change dir to /server in the project folder. This is where server.js is located. With the Teensyduino connected, enter: node server.js in terminal. You should start seeing data streaming to the terminal.
2. In project folder, open game_normal.html in Firefox browser. Note that our project won't work on Chrome. You will see the virtual environment opened in a new tab in your browser. The game is started once you open the html, you can restart the game by refreshing the webpage. 
3. Wear HMD on your head and look to the Lighthouse, press 'b' in terminal to recalibrate biases and then press 'r' to reset your starting position (you can repeat these two steps at any time during a game). Now you are all set, try press 1 or 2 to change the gun and click mouse or space bar to shoot. Enjoy the game! 
