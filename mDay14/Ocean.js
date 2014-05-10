
var Ocean = function () {
	var that = {};
	//radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart,thetaLength )
	var geo = new THREE.SphereGeometry(700, 10, 10,
		 0.3 * Math.PI, 0.4 * Math.PI, 0.3 * Math.PI, 0.4 * Math.PI);
	var mat = new THREE.MeshLambertMaterial( {color: 0x553966, wireframe: false} );
	var simplex = new SimplexNoise();
	var scale = 1;
	var t = 0;
	var ogPos = [];

	var oceanMesh = new THREE.Mesh(geo, mat);
	oceanMesh.position = new THREE.Vector3(0, -750, 0);
	oceanMesh.rotateX(-Math.PI * 0.5)

	for (var i = 0; i < geo.vertices.length; i += 1) {
		ogPos.push(geo.vertices[i]);
	} 

	var update = function (dt) {
		t += dt * 0.0005;
		var verts = geo.vertices;
		for (var i = 0; i < verts.length; i += 1) {
			var v = verts[i];
			var og = ogPos[i];
			var r = simplex.noise(og.x * scale, t * scale, og.z * scale) * 40;
			var n = new THREE.Vector3().subVectors(og, oceanMesh.position).normalize();
			n.multiplyScalar(r);
			geo.vertices[i] = new THREE.Vector3().addVectors(og, n);
		}
		geo.verticesNeedUpdate = true;
	};

	that.mesh = oceanMesh;
	that.update = update;
	return that;
};