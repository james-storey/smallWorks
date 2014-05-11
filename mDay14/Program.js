
var Program = function () {
	var that = {};

	var ocean;
	var heart = Heart();

	var time = 0;
	var timer = 0;

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

		var aL = new THREE.AmbientLight( 0x202020 );
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
program.init();
program.update();