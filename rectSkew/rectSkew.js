
var Program = function () {
	var camera, frontScene, backScene, renderer;
	var frontMesh;
	var backMesh;
	var frontRT, backRT, fxComp;

	var that = {};

	var init = function() {
		frontScene = new THREE.Scene();
		backScene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 5000);
		camera.position.z = 200;
		camera.lookAt(new THREE.Vector3(0,0,0));
		frontScene.add(camera);
		backScene.add(camera);

		renderer = Detector.webgl? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
		renderer.setClearColor(0x96A4B0, 1);
		renderer.setSize(window.innerWidth, window.innerHeight);

		var view = renderer.domElement;
		document.body.appendChild(view);
		window.addEventListener( 'resize', onResize, false );

		// initialize geometry

		var cubeGeo = new THREE.CubeGeometry(50, 50, 50, 3, 3, 3);
		var mat = new THREE.MeshLambertMaterial( { color: 0xffffff });
		frontMesh = new THREE.Mesh(cubeGeo, mat);
		var sphereGeo = new THREE.SphereGeometry( 50, 20, 20);
		backMesh = new THREE.Mesh(sphereGeo, mat);
		backMesh.translateZ(-100);
		backMesh.translateX(40);

		frontScene.add(frontMesh);
		frontScene.add(backMesh);
		backScene.add(backMesh);
		
		// initialize lights

		var aL = new THREE.AmbientLight( 0x444444 );
		frontScene.add(aL);
		backScene.add(aL);

		var dL = new THREE.DirectionalLight( 0xeeeeee );
		dL.position.set(0,1,1);
		frontScene.add(dL);
		backScene.add(dL);

		// initialize fx

		fxComp = new EffectComposer(renderer);
		frontRT = fxComp.getRenderTarget();
		backRT = fxComp.getRenderTarget();
		var cmShader = cutMoveShader();

		fxComp.addShaderPass(cmShader.shader, true);

	};
	that.init = init;

	var update = function () {
		requestAnimationFrame(update);

		frontMesh.rotateX(0.01);
		frontMesh.rotateZ(0.004);
		frontMesh.rotateY(0.007);

		renderer.render(frontScene, camera, frontRT);
		renderer.render(backScene, camera, backRT);
		fxComp.render();
	};
	that.update = update;

	var onResize = function() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);
	};

	return that;
};

var program = new Program();
program.init();
program.update();