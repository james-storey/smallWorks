
var Program = function() { 
	var camera, scene, renderer;
	var meshObject;
	var uFaces = [];
	var fxComp;
	var renderTarget;
	var theta = 0.0;
	var faceVelocities = [];
	var mouseX, mouseY;
	var windowHalfX = window.innerWidth/2, windowHalfY = window.innerHeight/2; 
	

	var that = { };

	that.initGeo = function() {
		var ugeo = new UniqueFaces(new THREE.CubeGeometry(50, 50, 50, 3, 3, 3));
		uFaces.push(ugeo);
		var mat = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe:true});
		meshObject = new THREE.Mesh(ugeo.getGeometry(), mat);

		scene.add(meshObject);
	};

	that.init = function() {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
		camera.translateZ(100);
		camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
		scene.add(camera);

		renderer = Detector.webgl? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
		renderer.setClearColor(0xe05f6a, 1);
		renderer.setSize(window.innerWidth, window.innerHeight);

		var viewport = renderer.domElement;
		document.body.appendChild(viewport);
		window.onresize = (this.onResize);
		window.onmousemove = (this.onMouseMove);


		//this.initGeo();

		var manager = new THREE.LoadingManager();
		var objLoader = new THREE.OBJLoader(manager);
		objLoader.load("obj/mesh.obj", function(object) {
			object.traverse(function (child) {
				if(child instanceof THREE.Mesh) {
					var ugeo = new UniqueFaces(child.geometry)
					uFaces.push(ugeo);
					child.geometry = ugeo.getGeometry();
					//child.material = new THREE.MeshBasicMaterial({color:0xffffff, wireframe:true});
					child.material.side = THREE.DoubleSide;
					child.geometry.faces.forEach(function (face) {
						faceVelocities.push(0.0);
					});
				}
			});
			scene.add(object);
		});


		var aL = new THREE.AmbientLight( 0x431c20 );
		scene.add(aL);

		var dL = new THREE.DirectionalLight( 0xffe2e5 );
		dL.position.set(0, 1, 1);
		scene.add(dL);

		fxComp = new EffectComposer(renderer);
		renderTarget = fxComp.getRenderTarget();

	};

	that.update = function() {
		requestAnimationFrame(that.update);
		//meshObject.rotateX(0.004);
		//meshObject.rotateY(0.003);
		//meshObject.rotateZ(0.01);

		uFaces.forEach(function(f) {
			for(var i = 0; i < f.geo.faces.length / 128; i++) {
				var index = Math.floor(Math.random() * f.geo.faces.length);
				var pFace = f.faceByIndex(index);
				if(Math.random()-0.5 > 0){
					//f.translateFace(pFace, pFace.normal);
					faceVelocities[index] = 0.01;
				}
				else {
					//var reverse = new THREE.Vector3(-1*pFace.normal.x, -1*pFace.normal.y, -1*pFace.normal.z);
					//f.translateFace(pFace, reverse);
					faceVelocities[index] = -0.01;
				}
			}
			var vI = 0;
			f.geo.faces.forEach(function (face) {
				var n = face.normal.clone();
				f.translateFace(face, (n.multiplyScalar(faceVelocities[vI])));
				vI += 1;
			});
		});
		

		camera.position.x = Math.sin(theta + mouseX*0.01)*100;
		camera.position.z = Math.cos(theta + mouseX*0.01)*100;
		camera.lookAt(new THREE.Vector3(0, 0, 0));
		theta += 0.001;


		renderer.render(scene, camera, renderTarget);
		fxComp.render();
	};

	that.onResize = function(event) {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);
	};

	that.onMouseMove = function (event) {
		mouseX = ( event.clientX - windowHalfX ) / 2;
		mouseY = ( event.clientY - windowHalfY ) / 2;
	}

	return that;
};

var program = new Program();
program.init();
program.update();