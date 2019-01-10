var scene;
var cameraL;
var cameraR;
var renderer
var box0;
var box1;
var box2;
var floor;
var clock;

const width = window.innerWidth;
const height = window.innerHeight;

var keyboard = {};
var player = {height: 1.8, speed: 0.2, turnSpeed: Math.PI * 0.01, canShoot: 0};
var ship;
var ship1;
var gun;
var gun1;
var gun2;
var craft1;
var craft2;
var tree;

var bullets = [];

var targets = [];	// array that store all the destroyable targets. A target is removed from array is destroyed

var quaternionIMU = new THREE.Quaternion();
var quaternionIMU_r = new THREE.Quaternion();
var position = new THREE.Vector3();

var score = 0;
var click = false;
var musicStart;
var musicLose;
var musicWin;
var soundGun1;
var soundGun2;
var soundHit;
var gunNum = 1;

function init() {

	// set the music for starting, lose and win
	musicStart = new sound("music/Escape.mp3");
	musicLose = new sound("music/Impossible-Decision.mp3");
	musicWin = new sound("music/melodyloops-skater.mp3");
	musicStart.play();

	scene = new THREE.Scene();

	// parameters: fov, ratio, zNear, zFar
	// window.innerWidth is dispParams.canvasWidth in the starter code
	// set left camera for left eye
	cameraL = new THREE.PerspectiveCamera(120, width / 2 / height, 0.1, 1000);
	cameraL.position.set(-0.005, 0, -10);
    cameraL.up = new THREE.Vector3(0,1,10);
    cameraL.lookAt(scene.position);

    // set right camera for right eye
    cameraR = new THREE.PerspectiveCamera(120, width / 2 / height, 0.1, 1000);
	cameraR.position.set(0.005, 0, -10);
    cameraR.up = new THREE.Vector3(0,1,10);
    cameraR.lookAt(scene.position);

	box0 = new THREE.Mesh(
		new THREE.BoxGeometry(1, 1, 1),
		// NormalMaterial maps the normal vectors to RGB colors. change to singel color by PhongMaterial
		new THREE.MeshPhongMaterial({color: 0xff9999, wireframe: false}));
	box0.receiveShadow = true;
	box0.castShadow = true;
	targets.push(box0);
	scene.add(box0);

	box1 = new THREE.Mesh(
		new THREE.BoxGeometry(1, 1, 1),
		new THREE.MeshNormalMaterial({wireframe: false}));
	box1.position.y += 2;
	box1.receiveShadow = true;
	box1.castShadow = true;
	targets.push(box1);
	scene.add(box1);

	box2 = new THREE.Mesh(
		new THREE.BoxGeometry(1, 1, 1),
		new THREE.MeshPhongMaterial({color: 0xff9999, wireframe: false}));
	box2.position.y += 3;
	box2.receiveShadow = true;
	box2.castShadow = true;
	targets.push(box2);
	scene.add(box2);

	// load background Mars
	var textBackLoader =  new THREE.CubeTextureLoader();
	textBackLoader.setPath( 'universe/' );
	var textBack = textBackLoader.load( [ 'right.png', 'left.png', 'top.png', 'bottom.png', 'front.png', 'back.png' ] );
	scene.background = textBack;

	floor = new THREE.Mesh(
		new THREE.PlaneGeometry(100, 100, 10, 10), // last two parameters is how many triangles in the floor
		new THREE.MeshPhongMaterial({color: 0xffffff, wireframe: false}));
	floor.rotation.x -= Math.PI / 2;
	floor.receiveShadow = true;

	// check the folder kenney_watercraft_updated/Models if want to change the ship model being loaded
	// might need to rescale
	var mtlLoader_ship = new THREE.MTLLoader();
	mtlLoader_ship.load("kenney_watercraft_updated/Models/watercraftPack_007.mtl", function(materials){
		
		materials.preload();
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		
		objLoader.load("kenney_watercraft_updated/Models/watercraftPack_007.obj", function(mesh){
		
			mesh.traverse(function(node){
				if( node instanceof THREE.Mesh ){
					node.castShadow = true;
					node.receiveShadow = true;
				}
			});

			ship = mesh;
			scene.add(ship);
			ship.position.set(0, 3, 6);
			ship.rotation.y = Math.PI/2;
			ship.scale.set(0.2, 0.2, 0.2);
			targets.push(ship);
		});
		
	});

	// check the folder kenney_watercraft_updated/Models if want to change the ship model being loaded
	// might need to rescale
	var mtlLoader_ship1 = new THREE.MTLLoader();
	mtlLoader_ship1.load("kenney_watercraft_updated/Models/watercraftPack_003.mtl", function(materials){
		
		materials.preload();
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		
		objLoader.load("kenney_watercraft_updated/Models/watercraftPack_003.obj", function(mesh){
		
			mesh.traverse(function(node){
				if( node instanceof THREE.Mesh ){
					node.castShadow = true;
					node.receiveShadow = true;
				}
			});

			ship1 = mesh;
			scene.add(ship1);
			ship1.position.set(-5, 0, 4);
			ship1.rotation.y = Math.PI/2;
			ship1.scale.set(0.2, 0.2, 0.2);
			targets.push(ship1);
		});
		
	});

	var loader_craft1 = new THREE.ObjectLoader();
    loader_craft1.load(
        "models/starwars-tie-fighter-threejs/starwars-tie-fighter.json",

        function ( obj ) {
            craft1 = obj;
            craft1.scale.set(0.2, 0.2, 0.2);
            craft1.position.set(0, 0, 4);
            scene.add( craft1 );
            targets.push(craft1);
        },

        function ( xhr ) {
            console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        },

        function ( err ) {
            console.error( 'An error happened' );
        }
    );

    var loader_craft2 = new THREE.ObjectLoader();
    loader_craft2.load(
        // resource URL
        "models/vehicle-ifv-dmm08-threejs/vehicle-ifv-dmm08.json",

        function ( obj ) {
            // Add the loaded object to the scene
            craft2 = obj;
            craft2.scale.set(1, 1, 1);
            craft2.position.set(-10, -10, 10);
            craft2.rotation.y -= Math.PI / 2;
            scene.add( craft2 );
            targets.push(craft2);
        },

        function ( xhr ) {
            console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        },

        function ( err ) {
            console.error( 'An error happened' );
        }
    );

    // check the folder weaponpack_assets/Models if want to change the gun model being loaded
    // might need to rescale
	var mtlLoader_gun1 = new THREE.MTLLoader();
	mtlLoader_gun1.load("weaponpack_assets/Models/sniperCamo.mtl", function(materials){
		
		materials.preload();
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		
		objLoader.load("weaponpack_assets/Models/sniperCamo.obj", function(mesh){
		
			mesh.traverse(function(node){
				if( node instanceof THREE.Mesh ){
					node.castShadow = false;
					node.receiveShadow = true;
				}
			});
			
			gun1 = mesh;
			scene.add(gun1);
			gun1.position.set(0, 2, 0);
			gun1.rotation.y = Math.PI/2;

			gun1.scale.set(8, 8, 8);
			gun = gun1;
		});
		
	});

	// check the folder weaponpack_assets/Models if want to change the gun model being loaded
    // might need to rescale
	var mtlLoader_gun2 = new THREE.MTLLoader();
	mtlLoader_gun2.load("weaponpack_assets/Models/uziSilencer.mtl", function(materials){
		
		materials.preload();
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		
		objLoader.load("weaponpack_assets/Models/uziSilencer.obj", function(mesh){
		
			mesh.traverse(function(node){
				if( node instanceof THREE.Mesh ){
					node.castShadow = false;
					node.receiveShadow = true;
				}
			});
			
			gun2 = mesh;
			scene.add(gun2);
			gun2.position.set(0, 2, -100);
			gun2.rotation.y = Math.PI/2;

			gun2.scale.set(8, 8, 8);
		});
		
	});

	// check the folder kenney_naturepackextended_updated/Models if want to change the gun model being loaded
    // might need to rescale
	var mtlLoader_tree = new THREE.MTLLoader();
	mtlLoader_tree.load("kenney_naturepackextended_updated/Models/naturePack_052.mtl", function(materials){
		
		materials.preload();
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		
		objLoader.load("kenney_naturepackextended_updated/Models/naturePack_052.obj", function(mesh){
		
			mesh.traverse(function(node){
				if( node instanceof THREE.Mesh ){
					node.castShadow = true;
					node.receiveShadow = true;
				}
			});

			tree = mesh;
			scene.add(tree);
			tree.position.set(5, -10, 20);
			tree.rotation.y = Math.PI/2;
			tree.scale.set(3, 3, 3);
		});
		
	});

	// enable communications between VRduino and web browser
	var socket = null;

    initWebSocket();

    function initWebSocket() {

		if ( socket && socket.readyState == 1 ) {

			return;

		}

		console.log( 'connecting' );

		/* Initialize WebSocket */
		socket = new WebSocket( "ws://localhost:8081" );

		socket.onopen = function () {

			var openMsg = "WebSocket is opened.";

			socket.send( openMsg );

			console.log( openMsg );

			console.log("Connected!");

		};

		socket.onclose = function () {

			var closeMsg = "WebSocket is closed.";

			socket.send( closeMsg );

			console.log( closeMsg );

			console.log("Lost...");

			socket = null;

			// try to reconnect in 1s
			setTimeout( initWebSocket, 1000 );

		};

		socket.onmessage = function ( imu ) {

			var data = imu.data.replace( /"/g, "" ).split( " " );

			// read quaternion values from IMU
			if ( data[ 0 ] == "QC" ) {

				quaternionIMU.set(
					Number( data[ 2 ] ), Number( data[ 3 ] ),
					Number( data[ 4 ] ), Number( data[ 1 ] ) ).normalize();
			} else if ( data[ 0 ] == 'PS' ) {	//read position values from Lighthouse
				var x = parseFloat( data[ 1 ] ) / 100.0;
				var y = parseFloat( data[ 2 ] ) / 100.0;
				var z = parseFloat( data[ 3 ] ) / 100.0;
				position.set( x, -y, z );
			}

		};

	}

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);
	renderer.setPixelRatio(1920 / 1080);

	// Set the background of the scene to a orange/red
	// renderer.setClearColor(0xffd4a6);

	// enable lighting
	light = new THREE.PointLight(0xffffff, 0.8, 18, 2);	// color, intensity, distance that intensity is zero, decay
	light.position.set(3, 5, -2);
	light.castShadow = true;
	light.shadow.camera.near = 0.1;
	light.shadow.camera.far = 25;
	scene.add(light);

	ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
	scene.add(ambientLight);

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;

	clock = new THREE.Clock();

	document.body.appendChild(renderer.domElement);

	animate();
}

function animate() {
	requestAnimationFrame(animate);

	renderer.setScissorTest( true );

		// Render for the left eye on the left viewport
		renderer.setScissor(
			0, 0, width / 2, height );

		renderer.setViewport(
			0, 0, width / 2, height );
		
		renderer.render(scene, cameraL);

		// Render for the right eye on the right viewport
		renderer.setScissor(
			 width / 2, 0,
			 width / 2, height );

		renderer.setViewport(
			width / 2, 0,
			width / 2, height );
		renderer.render(scene, cameraR);

		renderer.setScissorTest( false );


	var t = clock.getElapsedTime();	// enable periodic movement of object for shooting
	var delta = clock.getDelta();
	box1.rotation.x += 0.01;
	box1.rotation.y += 0.02;
	box1.position.x = 10 * Math.sin(t);
	box2.rotation.x -= 0.01;
	box2.rotation.y -= 0.02;
	box2.position.x = -50 * Math.sin(0.5*t);
	ship.position.x -= 0.5 * Math.sin(1*t);
	ship1.position.x += 0.5 * Math.sin(1*t);
	craft1.rotation.x -= 0.1;
	craft1.position.x -= 1 * Math.sin(1*t);


	// determine rotation of ship based on derivateve of position (velocity)
	if (Math.sin(1*t) > 0) {
		ship.rotation.y = -Math.PI / 2;
		ship1.rotation.y = Math.PI / 2;
		if (craft1.rotation.y = -Math.PI) craft1.rotation.y += Math.PI / 2;
	} else {
		ship.rotation.y = Math.PI / 2;
		ship1.rotation.y = -Math.PI / 2;
		craft1.rotation.y = -Math.PI / 2;
	}

	if (bullets.length > 0) {
		for (var i = 0; i < bullets.length; i++) {
			if (!bullets[i].alive) {
				bullets.splice(i, 1);
				continue;
			}
			bullets[i].position.add(bullets[i].velocity);
			for (var j = 0; j < targets.length; j++) {
				if (hit(bullets[i].position, targets[j].position)) {
					soundHit = new sound("music/Plate_Shatter_Break.mp3");
					soundHit.play();
					scene.remove(targets[j]);
					console.log(targets.length);
					targets.splice(j, 1);
					score += 1;
				}
			}
		}
	}

	if (keyboard[49]) {	// 1
		gun.position.z -= 10;
		gunNum = 1;
		gun = gun1;
	}
	if (keyboard[50]) {	// 2
		gun.position.z -= 10;
		gunNum = 2;
		gun = gun2;
	}

	// ############## lighthouse control, begin ##############
	cameraL.position.copy(position);
	cameraR.position.copy(position);
	cameraL.position.x -= 0.005;
	cameraR.position.x += 0.005;
	cameraL.position.z += 6;
	cameraR.position.z += 6;
	// ############## lighthouse control, end ##############

	// we need to rotate the camera by 180 degre aroung y-axis. In order not to have Lock on Euler rotation,
	// we set the sequence in Euler rotation to be YXZ, so that we can rotate y only without changing other axis.
	cameraL.rotation.setFromQuaternion( quaternionIMU, order = 'YXZ' );
	cameraR.rotation.setFromQuaternion( quaternionIMU, order = 'YXZ' );
	cameraL.rotation.y -= Math.PI;
	cameraR.rotation.y -= Math.PI;
	cameraL.rotation.x *= -1.0;
	cameraR.rotation.x *= -1.0;

    gun.rotation.copy(cameraL.rotation);
    gun.rotation.y -= Math.PI;
    gun.rotation.x *= -1.0;
    gun.position.y = cameraL.position.y - 0.5;
    gun.position.x = (cameraL.position.x + cameraR.position.x) / 2;
    gun.position.z = cameraL.position.z + 1;

	if ((keyboard[32] || click) && player.canShoot <= 0) {
		if (gunNum == 1) {
			soundGun1 = new sound("music/Sniper_Rifle-Kibblesbob.mp3");
			soundGun1.play();
		} else {
			soundGun2 = new sound("music/9_mm_gunshot-mike-koenig-123.mp3");
			soundGun2.play();
		}
		
		var bullet = new THREE.Mesh(
			new THREE.SphereGeometry(0.05, 8, 8),
			new THREE.MeshBasicMaterial({color: 0xffffff}));
		bullet.position.set(
			gun.position.x,
			gun.position.y + 0.1,
			gun.position.z + 0.1);
		bullet.velocity = new THREE.Vector3(
		-Math.sin(cameraL.rotation.y),
		-Math.sin(gun.rotation.x),
		-Math.cos(cameraL.rotation.y));
		bullet.alive = true;
		setTimeout(function() {
			bullet.alive = false;
			scene.remove(bullet);
		}, 1000);
		bullets.push(bullet);
		scene.add(bullet);
		player.canShoot = 5;
	}
	if (player.canShoot > 0) {
		player.canShoot--;
	}

	// set Time, Score and other message on the web page
	// all this information will only be shown in left view port, since it's html code, not stereo rendering
	$( "#ScorePositionVal" ).html(

			"<p>Score: " + score + "/7</p>"
		);
	remainTime = 50 - Math.floor(t);
	if (remainTime >= 0 && targets.length >= 0) {
		if (targets.length > 0) {
			if (remainTime >= 0) {
				$( "#TimePositionVal" ).html(

					"<p>Time: " + remainTime + "</p>"
				);
			} else {
				$( "#TimePositionVal" ).html(

					"<p>Time: " + 0 + "</p>"
				);
			}
		} else {
			musicStart.stop();
			musicWin.play();
			$( "#WinPositionVal" ).html(

					"<p>YOU WIN!!</p>"
				);
		}
	} else if (remainTime < 0 && targets.length > 0) {
		musicStart.stop();
		musicLose.play();
		$( "#LossPositionVal" ).html(

					"<p>YOU LOSE...</p>"
				);
	}
	
	
}

function keyDown(key) {
	keyboard[key.keyCode] = true;
}

function keyUp(key) {
	keyboard[key.keyCode] = false;
}


function mouseDown(event) {
	click = true;
}
function mouseUp(event) {
	click = false;
}

// function to check if a target is destroyed
function hit(bulletP, targetP) {
	if (Math.abs(bulletP.x - targetP.x) <= 1 && Math.abs(bulletP.y - targetP.y) <= 1 && Math.abs(bulletP.z - targetP.z) <= 1) {
		return true;
	} else {
		return false;
	}
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
window.addEventListener('mousedown', mouseDown);	// uncomment to use mouse to control the camera
window.addEventListener('mouseup', mouseUp);

window.onload = init;