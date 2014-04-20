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

var EffectComposer = function (r, rt) {
	var renderer = r;
	var renderTarget = rt;
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

	var passes = [];
	var rawRenders = [];
	var combineIndex = -1;

	var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

	var scene = new THREE.Scene();
	
	var mesh = new THREE.Mesh(new THREE.PlaneGeometry(2,2), null);
	scene.add(mesh);

	var passVertex = [
	"varying vec2 vUv;",
	"void main() {",
	"	vUv = uv;",
	"	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
	"}"
	].join("\n");

	var blitShader = [
	"uniform sampler2D texture;",
	"varying vec2 vUv;",
	"void main() {",
	"	vec4 texel = texture2D(texture, vUv);",
	"	gl_FragColor = texel;",
	"}"
	].join("\n");

	var swapBuffers = function(){
		var tmp = readBuffer;
		readBuffer = writeBuffer;
		writeBuffer = tmp;
	}

	var passThruUniforms = {
		texture: { type: "t", value: null }
	}

	var passThruShader = new THREE.ShaderMaterial( {
		uniforms: passThruUniforms,
		vertexShader: passVertex,
		fragmentShader: blitShader
	});

	var that = {};

	var renderToScreen = function (inTexture) {
		// render the result to the screen
		// serves as final output
		if(inTexture === undefined) {
			passThruUniforms.texture.value = readBuffer;	
		}
		else {
			passThruUniforms.texture.value = inTexture;
		}
		mesh.material = passThruShader;
		renderer.render(scene, camera);
	}

	var renderPass = function(passNum) {
		// render a single pass as found in the passes array
		var currentPass = passes[passNum];
		if(currentPass.uniforms.texture !== undefined) {
			currentPass.uniforms.texture.value = readBuffer;
		}
		else if(currentPass.uniforms.tDiffuse !== undefined) {
			// compatibility with alteredq style shader names
			currentPass.uniforms.tDiffuse.value = readBuffer;
		}

		mesh.material = currentPass;
		renderer.render(scene, camera, writeBuffer);

		swapBuffers();
	}

	var renderPassThru = function(input, output) {
		// renders a texture to another target;
		mesh.material = passThruShader;
		passThruShader.uniforms.texture.value = input;
		renderer.render(scene, camera, output);
		swapBuffers();
	}

	var render = function() {
		// renders all passes to each rendertarget entry up to the combine pass
		for(var j = 0; j < rawRenders.length; j += 1) {
			renderPassThru(rawRenders[j], writeBuffer);
			for(var i = 0; i < passes.length; i += 1) {
				if(combineIndex >= 0 && i === combineIndex) {
					// put the rendertargets back onto the input buffers
					// this is for access by the combine shader
					renderPassThru(readBuffer, rawRenders[j]);
					break;
				}
				renderPass(i);

			}
		}

		// render the combine step following that shader's routines
		if(combineIndex >= 0) {
			var cShader = passes[combineIndex];
			try {
				cShader.uniforms.texture1.value = rawRenders[0];
				cShader.uniforms.texture2.value = rawRenders[1];
			}
			catch (e) {
				console.error("combine shader needs texture targets 'texture1' and 'texture2'");
			}

			renderPass(combineIndex);
		}

		// render the rest of the steps on the combination buffer
		for(var i = this.combineIndex + 1; i < passes.length; i += 1) {
			renderPass(i);
		}

		renderToScreen();
	}

	var getRenderTarget = function () {
		// returns a new input to render a scene on to.
		// this serves as the entry point to the effectComposer
		// if more than one renderTarget is called, effects up to a combination step are run in parallel
		var rt = renderTarget.clone();
		rawRenders.push(rt);
		return rt;
	}

	var addShaderPass = function (obj, combine) {
		// add a regular screen space shader.
		// will expect at least one texture input named 'texture'
		if(obj instanceof THREE.ShaderMaterial) {
			passes.push(obj);
			if(combine === true) {
				if(combineIndex > 0) {
					console.error("too many combine steps in EffectComposer");
				}
				else {
					combineIndex = passes.length - 1;
				}
			}
		}
	}

	var reset = function (renderTarget) {
		//reinitialize the render targets to a new size;
		if(renderTerget === undefined) {
			var width = window.innerWidth || 1;
			var height = window.innerHeight || 1;
			var parameters = {
				 minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, 
				 format: THREE.RGBFormat, stencilBuffer: false 
			};
			renderTarget = new THREE.WebGLRenderTarget(width, height, parameters);
		}

		renderTarget1 = renderTarget;
		renderTarget2 = renderTarget.clone();

		writeBuffer = renderTarget1;
		readBuffer = renderTarget2;
	}

	var setSize = function (w, h) {
		var rt = renderTarget1.clone();
		rt.width = w;
		rt.height = h;

		reset(rt);
	}

	that.setSize = setSize;
	that.reset = reset;
	that.render = render;
	that.addShaderPass = addShaderPass;
	that.getRenderTarget = getRenderTarget;
	that.renderPassThru = renderPassThru;
	that.renderPass = renderPass;

	return that;
}
