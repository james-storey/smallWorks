
var Program = function() { 
	var camera, scene, renderer;
	var meshObject;
	var uFaces;
	var fxComp;
	var renderTarget;
	var theta = 0.0;

	var that = { };

	that.initGeo = function() {
		uFaces = new UniqueFaces(new THREE.CubeGeometry(50, 50, 50, 3, 3, 3));
		var mat = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe:true});
		meshObject = new THREE.Mesh(uFaces.getGeometry(), mat);

		scene.add(meshObject);
	};

	that.init = function() {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
		camera.translateZ(100);
		camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
		scene.add(camera);

		renderer = Detector.webgl? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
		renderer.setClearColor(0xef5f6a, 1);
		renderer.setSize(window.innerWidth, window.innerHeight);

		var viewport = renderer.domElement;
		document.body.appendChild(viewport);
		window.onresize = (this.onResize);

		this.initGeo();

		fxComp = new EffectComposer(renderer);
		renderTarget = fxComp.getRenderTarget();

	};

	that.update = function() {
		requestAnimationFrame(that.update);
		//meshObject.rotateX(0.004);
		//meshObject.rotateY(0.003);
		//meshObject.rotateZ(0.01);

		var pFace = uFaces.faceByIndex(Math.floor(Math.random() * meshObject.geometry.faces.length));
		if(Math.random()-0.5 > 0){
			uFaces.translateFace(pFace, pFace.normal);
		}
		else {
			var reverse = new THREE.Vector3(-1*pFace.normal.x, -1*pFace.normal.y, -1*pFace.normal.z);
			uFaces.translateFace(pFace, reverse);
		}
		

		camera.position.x = Math.sin(theta)*100;
		camera.position.z = Math.cos(theta)*100;
		camera.lookAt(new THREE.Vector3(0, 0, 0));
		theta += 0.01;


		renderer.render(scene, camera, renderTarget);
		fxComp.render();
	};

	that.onResize = function(event) {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);
	};

	return that;
};

var program = new Program();
program.init();
program.update();