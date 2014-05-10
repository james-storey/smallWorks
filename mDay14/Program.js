
var Program = function () {
	var that = {};

	var init = function() {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
		camera.translateZ(100);
		camera.lookAt(new THREE.Vector3());
		scene.add(camera);

		renderer = new THREE.WebGLRenderer();
		renderer.setClearColor(0xF3BE5A, 1);
		renderer.setSize(window.innerWidth, window.innerHeight);

		var viewport = renderer.domElement;
		document.body.appendChild(viewport);

		window.addEventListener('resize', onResize, false);
	};

	var update = function () {
		requestAnimationFrame( update );
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

var program = new Program();
program.init();
program.update();