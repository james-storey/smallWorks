
var Program = function() { 
	var camera, scene, renderer;
	var meshObject;
	var uFaces;
	var fxComp;
	var renderTarget;
	var time = new THREE.Clock();

	var that = { };

	var colorShader = function () {
		var uniforms = {
			texture: { type: "t", value: null },
			time: { type: "f", value: 0.0 }
		};
		var vs = [
			"varying vec2 vUv;",
			"void main() {",
				"vUv = uv;",
				"gl_Position = vec4(position, 1.0);",
			"}"
		].join('\n');

		var fs = [
			"uniform sampler2D texture;",
			"uniform float time;",
			"varying vec2 vUv;",
			"void main() {",
				"vec3 color = texture2D(texture, vUv).xyz;",
				"gl_FragColor = vec4(color*vec3(vUv, sin(time)), 1.0);",
			"}"
		].join('\n');
		var s = new THREE.ShaderMaterial({
			uniforms: uniforms,
			vertexShader: vs,
			fragmentShader: fs
		});

		return {
			shader: s,
			uniform: uniforms,
			update: function () {
				uniforms.time.value = time.getElapsedTime(); 
			}
		}
	}();

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
		fxComp.addShaderPass(colorShader.shader, false);
		time.start();
	};

	that.update = function() {
		requestAnimationFrame(that.update);
		//meshObject.rotateX(0.004);
		//meshObject.rotateY(0.003);
		//meshObject.rotateZ(0.01);

		var pFace = uFaces.faceByIndex(Math.floor(Math.random() * meshObject.geometry.faces.length));
		uFaces.translateFace(pFace, pFace.normal);

		renderer.render(scene, camera, renderTarget);
		colorShader.update();
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
