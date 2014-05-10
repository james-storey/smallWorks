var Heart = function(){
	var that = {};
	that.loaded = false;
    var heartMesh;

    var load = function () {
    	var loader = new THREE.JSONLoader();

    	loader.load("./mdheart.js", function(geometry){
		 	var material = new THREE.MeshLambertMaterial( {color: 0xDD4D98, wireframe:true} );
		 	heartMesh = new THREE.Mesh(geometry, material);
		 	that.loaded = true;
		 	console.log("heart loaded");
		 	scene.add(heartMesh);
	 	});
    };

    var update = function (dt) {
    	if (that.loaded === true) {
    		heartMesh.position = new THREE.Vector3( 0, 0, 200 );
    		heartMesh.scale.set(50, 50, 50)
    		heartMesh.rotateY(0.0016*dt);
    	}
    };

    that.load = load;
    that.update = update;
    return that;
};