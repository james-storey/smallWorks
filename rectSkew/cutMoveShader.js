
// render given objects to a buffer
// permute rectangles of the buffer to fragment the image


function cutMoveShader(options) {

	var genRectangles = function() {
		return [[0.30,0.30], [0.70, 0.70]];
	};

	var genDistances = function() {
		return [0.5];
	};

	options = options || {};
	// defaults
	var brkup, rects, dists, maxRectangles;
	maxRectangles = options.maxRectangles !== undefined ? options.maxRectangles : 1.0;
	brkup = options.breakup !== undefined ? options.breakup : 0.5;
	rects = options.rects !== undefined ? options.rects : genRectangles();
	dists = options.distances !== undefined ? options.distances : genDistances();

	var vs = [
		"varying vec2 vUv;",
		"void main() {",
			"vUv = uv;",
			"gl_Position = vec4(position, 1.0);",
		"}"
	].join("\n");

	var fs = [
	// first decide if in union of original rectangle and moved rectangle
	// next decide if in only the original
	// if only original diplay back with normal coords
	// if new rect sample front with offset
	// else sample front
	"uniform sampler2D texture1;",
	"uniform sampler2D texture2;",
	"uniform float breakup;",
	"uniform vec2 rects[", (maxRectangles * 2).toString(), "];",
	"uniform float distances[", maxRectangles.toString(), "];",

	"varying vec2 vUv;",

	"void main() {",
		"vec4 colorOutput;",
		"for(int i = 0; i < ", (maxRectangles * 2).toString(), "; i += 2) {",
			"vec4 rect = vec4(rects[i], rects[i+1]);",
			"float d = distances[int(i/2)];",
			"vec2 bounds = vec2(rect.z - rect.x, rect.w - rect.y);",
			"if( vUv.x > rect.x && vUv.y > rect.y && vUv.x < rect.z + (bounds.x * d) && vUv.y < rect.w) {",
				"if(vUv.x < rect.x + (bounds.x * d)) {",
					"colorOutput = texture2D(texture2, vUv);",
				"}",
				"else {",
					"colorOutput = texture2D(texture1, vec2(vUv.x - (bounds.x * d), vUv.y));",
				"}",
			"}",
			"else {",
				"colorOutput = texture2D(texture1, vUv);",
			"}",
		"}",
		"gl_FragColor = colorOutput;",
	"}" 
	].join("\n");

	var uniforms = {
		texture1: {type: "t", value: null},
		texture2: {type: "t", value: null},
		breakup: {type: "f", value: 0.0},
		rects: {type: "v2v", value: []},
		distances: {type: "fv1", value: []}
	};

	var cutMoveShader = new THREE.ShaderMaterial ( {
		uniforms : uniforms, 
		vertexShader: vs,
		fragmentShader: fs
	});

	cutMoveShader.uniforms.breakup.value = brkup;
	cutMoveShader.uniforms.rects.value = rects;
	cutMoveShader.uniforms.distances.value = dists;

	var update = function (options) {
		cutMoveShader.uniforms.breakup.value = uniforms.breakup;
		cutMoveShader.uniforms.rects.value = uniforms.rects;
		cutMoveShader.uniforms.distances.value = uniforms.distances;
	}

	return {
		shader: cutMoveShader,
		uniform: uniforms,
		update: update
	}

};