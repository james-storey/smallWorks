
// render given objects to a buffer
// permute rectangles of the buffer to fragment the image


function cutMoveRenderer(options) {

	var vs = [
		"varying vec2 vUv;",
		"void main() {",
			"vUv = uv;",
			"gl_Position = vec4(position, 1.0);",
		"}"
	].join("\n");

	var fs = [
	"uniform vec2 resolution;",
	"uniform sampler2D texture1;",
	"uniform sampler2D texture2;",
	"uniform float breakup;",
	"uniform vec2 rects[];",
	"uniform float distances[];",

	"varying vec2 vUv;",

	"void main() {",

	"}" 
	].join("\n");

	var uniforms = {
		resolution: { type: "v2", value: res},
		texture1: {type: "t", value: null},
		texture2: {type: "t", value: null},
		breakup: {type: "f", value: 0.0},
		rects: {type: "v2v", value: []},
		distances: {type: "fv1", value: []}
	};

	var cutMoveShader = new THREE.ShaderMaterial ( {
		uniforms : uniforms, 
		vertexShader: passVertex,
		fragmentShader: breakupCombine
	});

	var genRectangles = function() {

	};

	var genDistances = function() {

	};

	options = options || {};

	// defaults
	var brkup, rects, dists;
	brkup = options.breakup !== undefined ? options.breakup : 0.5;
	rects = options.rects !== undefined ? options.rects : genRectangles();
	dists = options.distances !== undefined ? options.distances : genDistances();

	breakupShader.uniforms.breakup.value = breakFactor;
	breakupShader.uniforms.rects.value = rectangle;
	breakupShader.uniforms.distances.value = maxDistances;

	return {
		shader: cutMoveShader,
		uniform: uniforms
	}

}