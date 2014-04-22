function StickyVertsRenderer(WIDTH, renderer){

	var camera = new THREE.Camera();
	camera.position.z = 1;
	var scene = new THREE.Scene();
	var uniforms = {
		texture:{type: "t", value: null},
		resolution:{type: "v2", value: new THREE.Vector2(WIDTH, WIDTH)}
	};

	var passThruShader = new THREE.ShaderMaterial( {
		uniforms: uniforms,
		vertexShader: document.getElementById('ptVertexShader').textContent,
		fragmentShader: document.getElementById('ptFragmentShader').textContent
	} );

	var mesh = new THREE.Mesh(new THREE.PlaneGeometry(2,2), passThruShader);

	var rt, dt;

	scene.add(mesh);

	function init(targetGeo, matrixworld){
		rt = getRenderTarget();
		dt = generateDataTexture(targetGeo, matrixworld);
		svr.renderTexture(dt, rt);
	}

	this.init = init;

	function getRenderTarget(){
		var renderTarget = new THREE.WebGLRenderTarget(WIDTH, WIDTH, {
			wrapS: THREE.RepeatWrapping,
			wrapT: THREE.RepeatWrapping,
			minFilter: THREE.NearestFilter,
			magFilter: THREE.NearestFilter,
			format: THREE.RGBAFormat,
			type: THREE.FloatType,
			stencilBuffer: false
		});
		return renderTarget;
	}

	this.renderTexture = function (input, output){
		mesh.material = passThruShader;
		uniforms.texture.value = input;
		renderer.render(scene, camera, output);
		this.currentPosition = output;
	}

	this.update = function(targetGeo, matrixworld){
		dt = generateDataTexture(targetGeo, matrixworld);
		svr.renderTexture(dt, rt);
	}

	function generateDataTexture(geo, matrixworld) {

		var x, y, z;

		var w = WIDTH, h = WIDTH;

		var a = new Float32Array(VERTS * 4);

		

		for (var k = 0; k < VERTS; k++) {
			if(k < geo.vertices.length){
			x = geo.vertices[k].x;
			y = geo.vertices[k].y;
			z = geo.vertices[k].z;
		} else{
			x = Math.random();
			y = Math.random();
			z = Math.random();
		}
			var b = new THREE.Vector4( x, y, z, 1.0 );
			b = b.applyMatrix4(matrixworld);
			a[ k*4 + 0 ] = b.x;
			a[ k*4 + 1 ] = b.y;
			a[ k*4 + 2 ] = b.z;
			a[ k*4 + 3 ] = 1;

		}

		var texture = new THREE.DataTexture( a, WIDTH, WIDTH, THREE.RGBAFormat, THREE.FloatType );
		texture.minFilter = THREE.NearestFilter;
		texture.magFilter = THREE.NearestFilter;
		texture.needsUpdate = true;
		texture.flipY = false;

		return texture;

	}

}