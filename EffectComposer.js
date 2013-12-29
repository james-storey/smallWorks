// extended Effect Composer
// based on the THREE.js version, but with with slightly altered functionallity


// functionallity
// 0 add shaders in the sequence desired
// 1 add combination shaders, these should accept two texture inputs
// 2 receive a renderTarget from the composer
// 2.1 the first two renderTargets will be combined in combination shader
// 2.2 any further shaders will be applied to the combination
// 3 render to that target with the main camera and scene
// 4 call EffectComposer.render to render to the screen with the effects applied

var EffectComposer = function (renderer, renderTarget) {
	this.renderer = renderer;

	if (renderTarget === undefined) {
		var width = window.innerWidth || 1;
		var height = window.innerHeight || 1;
		var parameters = {
			 minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, 
			 format: THREE.RGBFormat, stencilBuffer: false 
		};
		renderTarget = new THREE.WebGLRenderTarget(width, height, parameters);
	}
	
	var renderTarget1 = renderTarget;
	var renderTarget2 = renderTarget.clone();

	var writeBuffer = renderTarget1;
	var readBuffer = renderTarget2;

	this.passes = [];
	this.rawRenders = [];
	this.combineIndex = false;

	var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

	var scene = new THREE.Scene();
	
	var mesh = new THREE.Mesh(new THREE.PlanarGeometry(2,2), null);
	scene.add(this.mesh);

	var passVertex = """

	void main() {
		gl_Position = vec4(position, 1.0);
	}
	""";

	var blitShader = """
	uniform vec2 resolution;
	uniform sampler2D texture; 
	void main() {
		vec2 uv = gl_FragCoord.xy / resolution.xy;
		vec3 color = texture2D(texture, uv).xyz;
		gl_FragColor = vec4(color, 1.0);
	}
	""";

	var swapBuffers = function(){
		var tmp = readBuffer;
		readBuffer = writeBuffer;
		writeBuffer = tmp;
	}

	var passThruUniforms = {
		resolution: {type: "v2", value: res },
		texture: { type: "t", value: null }
	}

	var passThruShader = new THREE.ShaderMaterial( {
		uniforms: passThruUniforms,
		vertexShader: passVertex,
		fragmentShader: blitShader
	});

	this.renderToScreen = function (inTexture) {
		if(inTexture === undefined) {
			passThruUniforms.texture = readBuffer;	
		}
		else {
			passThruUniforms.texture = inTexture;
		}
		this.mesh.material = passThruShader;
		renderer.render(this.scene, this.camera);
	}

	this.renderPass = function(passNum) {
		var currentPass = passes[passNum];
		if(currentPass.uniforms.texture !== undefined) {
			currentPass.uniforms.texture = this.readBuffer;
		}

		mesh.material = currentPass;
		renderer.render(this.scene, this.camera, this.writeBuffer);

		this.swapBuffers();
	}

	var renderPassThru = function(input, output) {
		mesh.material = passThruShader;
		passThruShader.uniforms.texture = input;
		renderer.render(this.scene, this.camera, output);
		this.swapBuffers();
	}

	this.render = function() {

		for(var j = 0; j < this.rawRenders.length; j += 1) {
			renderPassThru(rawRenders[j] ,this.writeBuffer);
			for(var i = 0; i < passes.length; i += 1) {
				if(this.combineIndex !== false && i === this.combineIndex) {
					renderPassThru(this.readBuffer, rawRenders[j]);
					break;
				}
				renderPass(i);

			}
		}

		if(this.combineIndex !== false ) {
			var cShader = passes[this.combineIndex];
			cShader.uniforms.texture1 = rawRenders[0];
			cShader.uniforms.texture2 = rawRenders[1];

			renderPass(this.combineIndex);
		}

		for(var i = this.combineIndex + 1; i < passes.length; i += 1) {
			renderPass(i);
		}

		this.renderToScreen();
	}

	this.getRenderTarget = function () {
		var rt = renderTarget.clone();
		this.rawRenders.push(rt);
		return rt;
	}

	this.addShaderPass = function (obj, combine) {
		if(obj instanceof THREE.ShaderMaterial) {
			this.passes.push(obj);
			if(combine === true) {

			}
		}
	}

	this.reset = function (renderTarget) {
		if(renderTerget === undefined) {
			var width = window.innerWidth || 1;
			var height = window.innerHeight || 1;
			var parameters = {
				 minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, 
				 format: THREE.RGBFormat, stencilBuffer: false 
			};
			renderTarget = new THREE.WebGLRenderTarget(width, height, parameters);
		}

		this.renderTarget1 = renderTarget;
		this.renderTarget2 = renderTarget.clone();

		this.writeBuffer = renderTarget1;
		this.readBuffer = renderTarget2;
	}

	this.setSize = function (w, h) {
		var rt = this.renderTarget1.clone();
		rt.width = w;
		rt.height = h;

		this.reset(rt);
	}
}
