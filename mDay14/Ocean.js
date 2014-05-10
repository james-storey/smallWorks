
var Ocean = function () {
	var that = {};
	//radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart,thetaLength )
	var geo = new THREE.SphereGeometry(100, 10, 10, 0, Math.PI, 0, Math.PI);
	var mat = new THREE.MeshBasicMaterial( {color: 0xffffff, wireframe: true} );

	var oceanMesh = new THREE.Mesh(geo, mat);
	oceanMesh.position = new THREE.Vector3(0, 0, 0);
};