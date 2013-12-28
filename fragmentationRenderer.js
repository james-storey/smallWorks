
// render given objects to a buffer
// permute rectangles of the buffer to fragment the image


function fragmentationRenderer(renderer) {
	var width, height;

	var scene = THREE.Scene();

	var camera = new THREE.Camera();
	camera.position.z = 1;

	var mesh = new THREE.Mesh(new THREE.PlaneGeometry( 2,2), passThruShader);
	mesh.position = new THREE.Vector3( 0.0, 0.0, -1.0 );
	mesh.rotateX(-Math.PI / 2.0);

	scene.add(mesh);

	var rtBreakup, rtCombine;

	var passVertex = """

	void main() {
		gl_Position = vec4(position, 1.0);
	}
	""";

	var breakupFragment = """
	uniform vec2 resolution;
	uniform sampler2D textureScene;
	uniform float breakup;
	uniform vec2 rects[];
	uniform float distances[]; 
	void main() {

	}
	""";

	var combineFragment = """
	uniform sampler2D textureBreakup;
	uniform sampler2D textureControl;

	void main() {

	}
	""";

	var breakupShader = new THREE.ShaderMaterial ( {
		uniforms : {
			resolution: { type: "v2", value: res},
			textureScene: {type: "t", value: null},
			breakup: {type: "f", value: 0.0},
			rects: {type: "v2v", value: []},
			distances: {type: "fv1", value: []}
		}
		vertexShader: passVertex,
		fragmentShader: breakupFragment
	});

	var combineShader = new THREE.ShaderMaterial ( {
		uniforms : {
			textureBreakup: { type: "t", value: null},
			textureControl: { type: "t", value: null}
		}
		vertexShader: passVertex,
		fragmentShader: combineFragment
	});

	this.breakupUniforms = breakupShader.uniforms;

	function createRenderTarget() {
		var rTarget = new THREE.WebGLRenderTarget(width, height, {
			wrapS: THREE.RepeatWrapping,
			wrapT: THREE.ClampToEdgeWrapping,
			minFilter: THREE.LinearFilter,
			magFilter: THREE.LinearFilter,
			format: THREE.RGBAFormat,
			type: THREE.FloatType,
			stencilBuffer: false
		});
		return renderTarget;
	}

	this.init = function (w, h) {

		width = w;
		height = h;

		rtBreakup = createRenderTarget();
		rtCombine = rtBreakup.clone();

	}

	this.render = function (breakupPass, controlPass, combinedOut, options) {

		options = options || {};

		// defaults
		var brkup, rects, dists;
		brkup = options.breakup !== undefined ? options.breakup : 0.5;
		rects = options.rects !== undefined ? options.rects : genRectangles();
		dists = options.distances !== undefined ? options.distances : genDistances();

		renderBreakup(breakupPass, rtBreakup, brkup, rects, dists);
		renderCombine(breakupPass, controlPass, rtCombine);

		return rtCombine;
	}

	this.renderTexture = function (input, output) {
		mesh.material = this.passThruShader;
		passThruUniforms.texture.value = input;

		renderer.render(scene, camera, output);
	}

	this.renderBreakup = function (input, output, breakFactor, rectangles, maxDistances) {
		mesh.material = breakupShader;
		breakupShader.uniforms.textureScene.value = input;
		breakupShader.uniforms.breakup.value = breakFactor;
		breakupShader.uniforms.rects.value = rectangle;
		breakupShader.uniforms.distances.value = maxDistances;

		renderer.render(scene, camera, output);
	}

	this.renderCombine = function (breakupInput, controlInput, output) {
		mesh.material = combineShader;
		combineShader.uniforms.textureBreakup.value = breakupInput;
		combineShader.uniforms.textureControl.value = controlInput;

		renderer.render(scene, camera, output);
	}

}