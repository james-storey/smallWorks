
var Program = function () {
	var that = {};

	var ocean;
	var heart = Heart();
	var confettis = new Array();

	var time = 0;
	var timer = 0;
	var dt = 1/60;
	N = 1000;

	var positions = new Float32Array(N*3);
	var velocities = new Float32Array(N*3);
  	var eulers = new Float32Array(N*3);

	var worker = new Worker('wwparticles.js');
	worker.postMessage = worker.webkitPostMessage || worker.postMessage;
  	worker.onmessage = function(e){
  		positions = e.data.positions;
  		velocities = e.data.velocities;
  		eulers = e.data.eulers;

  		for(var i = 0; i!==confettis.length; i++){
  			confettis[i].position.set(positions[3*i+0],
  									positions[3*i+1],
  									positions[3*i+2]);
  			confettis[i].rotation.set(eulers[3*i+0],
  									eulers[3*i+1],
  									eulers[3*i+2]);
  		}
  		//if the worker is faster than the timestep, delay the next timestep
  		var delay = dt*1000 - (Date.now() - sendTime);
  		if(delay < 0){
  			delay = 0;
  		}
  		setTimeout(that.sendDataToWorker, delay);
  	};

  	that.sendDataToWorker = function(){
  		sendTime = Date.now();
  		worker.postMessage({
        cmd: 'run',
  			N : N,
  			dt : dt,
  			positions : positions,
  			velocities: velocities,
  			eulers : eulers,
  		}, [positions.buffer, velocities.buffer, eulers.buffer]);
  	};

	var init = function() {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
		camera.translateZ(400);
		camera.lookAt(new THREE.Vector3());
		scene.add(camera);

		renderer = new THREE.WebGLRenderer();
		renderer.setClearColor(0x72D6AD, 1);
		renderer.setSize(window.innerWidth, window.innerHeight);

		var viewport = renderer.domElement;
		document.body.appendChild(viewport);

		window.addEventListener('resize', onResize, false);

		ocean = Ocean();
		scene.add(ocean.mesh)

		heart.load();

		var confettigeo = new THREE.PlaneGeometry( 1, 3, 2, 2 );
		var mats = new Array();
		var confettib = new THREE.MeshBasicMaterial( {side: THREE.DoubleSide,
														color: 0xDD4D98} );
		var confettig = new THREE.MeshBasicMaterial( {side: THREE.DoubleSide,
														color: 0x22dd55} );
		var confettir = new THREE.MeshBasicMaterial( {side: THREE.DoubleSide,
														color: 0xdd5522} );
		mats[0] = confettib;
		mats[1] = confettig;
		mats[2] = confettir;
		for(i = 0; i < N; i++){
			var confetti = new THREE.Mesh(confettigeo, mats[Math.floor(Math.random()*3.999)]);
			confettis[i] = confetti;
			scene.add(confetti);
		}

		//that.sendDataToWorker();

		var aL = new THREE.AmbientLight( 0x222222 );
		var dL = new THREE.DirectionalLight({color: 0xF9DFAE});
		dL.position = new THREE.Vector3( 1, 1.5, 1.5 );
		var dL2 = new THREE.DirectionalLight(0xF9DFAE, 0.8);
		dL2.position = new THREE.Vector3( -1, -1.5, 0.1 );
		scene.add(aL);
		scene.add(dL);
		scene.add(dL2);
	};

	var update = function () {
		requestAnimationFrame( update );
		var now = new Date().getTime();
		var dt = now - (time || now);
		time = now;
		timer += dt;

		TWEEN.update();
		heart.update(dt);
		ocean.update(dt);
		render();
	};

	var render = function () {
		renderer.render(scene, camera);
	};

	var onResize = function() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);
	};

	that.init = init;
	that.update = update;

	return that;
};

var program = Program();
if(! Detector.webgl) {
	document.body.appendChild(Detector.getWebGLErrorMessage());
}
else {
	program.init();
	program.update();
}
