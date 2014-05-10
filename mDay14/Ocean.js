
var Ocean = function () {
	var that = {};
	//radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart,thetaLength )
	var geo = new THREE.SphereGeometry(700, 10, 10,
		 0.3 * Math.PI, 0.4 * Math.PI, 0.3 * Math.PI, 0.4 * Math.PI);
	var mat = new THREE.MeshLambertMaterial( {color: 0x553966, wireframe: false} );

	var oceanMesh = new THREE.Mesh(geo, mat);
	oceanMesh.position = new THREE.Vector3(0, -750, 0);
	oceanMesh.rotateX(-Math.PI * 0.5)

	var update = function (dt) {

	};

	that.mesh = oceanMesh;
	that.update = update;
	return that;
};