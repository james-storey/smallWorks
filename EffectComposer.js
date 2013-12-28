// extended Effect Composer
// based on the THREE.js version, but with with slightly altered functionallity

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
	
	this.renderTarget1 = renderTarget;
	this.renderTarget2 = renderTarget.clone();

	this.writeBuffer = this.renderTarget1;
	this.readBuffer = this.renderTarget2;

	this.passes = [];

	this.camera = new THREE.Camera();
	this.camera.position.z = 1;

	this.scene = new THREE.Scene();

	
	this.mesh = new THREE.Mesh(new THREE.PlanarGeometry(2,2));
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

	this.renderPass(passNum) {
		var currentPass = passes[passNum];
		currentPass.uniforms.texture = this.readBuffer;

		this.mesh.material = currentPass;
		renderer.render(this.scene, this.camera, this.writeBuffer);

		swapBuffers();
	}
}
