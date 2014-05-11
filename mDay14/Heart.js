var Heart = function(){
	var that = {};
	that.loaded = false;
    var heartMesh;
    var ySort = [];
    var t = 0;

   	var pos = {y:-150};
    var tween;

    var insertVByY = function (a, v, i)
    {
        // base case
        var pos = Math.floor(a.length / 2);
        if(a.length === 0)
        {
            a.push(i);
            return a;
        }
        else if (a.length === 1) {
            if(v.y < heartMesh.geometry.vertices[a[pos]].y) {
                var n = []
                n.push(i);
                return n.concat(a);
            }
            else {
                a.push(i);
                return a;
            }
        }

        // split
        var aG = a.slice(pos);
        var aL = a.slice(0, pos);
        
        //sort logic
        if(v.y > heartMesh.geometry.vertices[a[pos]].y) {
            aG = insertVByY(aG, v, i);
        }
        else {
            aL = insertVByY(aL, v, i);
        }

        // combine
        return aL.concat(aG);
    }

    var sortVertsY = function () {
        for (var i = 0; i < heartMesh.geometry.vertices.length; i += 1) {
            var v = heartMesh.geometry.vertices[i];
            var r = insertVByY(ySort, v, i);
            ySort = r;
        }
    };

    var load = function () {
    	var loader = new THREE.JSONLoader();

    	loader.load("./mdheart.js", function(geometry){
		 	var material = new THREE.MeshLambertMaterial( {color: 0xDD4D98, wireframe:true} );
		 	heartMesh = new THREE.Mesh(geometry, material);
		 	that.loaded = true;
		 	console.log("heart loaded");
		 	scene.add(heartMesh);
            sortVertsY();
            //heartMesh.geometry.vertices[ySort[0]].setY(0);
            //heartMesh.geometry.vertices[ySort[ySort.length - 1]].setY(0);
            //heartMesh.geometry.verticesNeedUpdate = true;
	 	});
    };

    var update = function (dt) {
    	if (that.loaded === true) {
    		if (t === 0)
    		{
    			tween = new TWEEN.Tween(pos).to({y:10}, 4000);
    			tween.onUpdate(function () {
    				heartMesh.position = new THREE.Vector3( 0, pos.y, 200 );
    			});
    			tween.easing(TWEEN.Easing.Quadratic.InOut);
    			tween.start();
    		}
    		t += dt * 0.0016;
    		heartMesh.scale.set(50, 50, 50)
    		heartMesh.rotateY(0.0016*dt);
    	}
    };

    

    that.load = load;
    that.update = update;
    return that;
};