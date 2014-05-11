var Heart = function(){
	var that = {};
	that.heartLoaded = false;
    that.textLoaded = false;
    that.tweenFinished = false;
    var heartMesh;
    var textMesh;
    var ySort = [];
    var ogVerts = [];
    var hPos = new THREE.Vector3();
    var t = 0;

    var startY = -150;
   	var pos = {y:startY};
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
            ogVerts.push(new THREE.Vector3(v.x, v.y, v.z));
        }
    };

    var load = function () {
    	var loader = new THREE.JSONLoader();

    	loader.load("./mdheart.js", function(geometry){
		 	var material = new THREE.MeshLambertMaterial( {color: 0xDD4D98, wireframe:false} );
		 	heartMesh = new THREE.Mesh(geometry, material);
		 	that.heartLoaded = true;
		 	console.log("heart loaded");
		 	scene.add(heartMesh);

            loader.load("./mdText.js", function(geometry) {
                var material = new THREE.MeshLambertMaterial( {color: 0xf384c6});
                textMesh = new THREE.Mesh(geometry, material);
                that.textLoaded = true;
                console.log("text Loaded");
                textMesh.scale.set(0.4, 0.4, 0.4);
                textMesh.position.setZ(1);
                heartMesh.add(textMesh);
            });
            sortVertsY();
	 	});
    };

    var update = function (dt) {
    	if (that.heartLoaded === true) {
    		if (t === 0)
    		{
    			tween = new TWEEN.Tween(pos).to({y:10}, 5000);
    			tween.onUpdate(function () {
    				heartMesh.position = new THREE.Vector3( 0, pos.y, 200 );

                    for(var i = 0; i < ySort.length; i += 1) {
                        var tWt = (1 - ((pos.y + 150)/160)) * Math.PI * 2 *
                        (5 * (ySort.length - i)/ySort.length);
                        heartMesh.geometry.vertices[ySort[i]].setX( 
                            ogVerts[ySort[i]].x * Math.cos(tWt) - 
                            ogVerts[ySort[i]].z * Math.sin(tWt));
                        heartMesh.geometry.vertices[ySort[i]].setZ( 
                            ogVerts[ySort[i]].x * Math.sin(tWt) +
                            ogVerts[ySort[i]].z * Math.cos(tWt));
                    }
                    heartMesh.geometry.verticesNeedUpdate = true;
                    hPos = new THREE.Vector3().copy(heartMesh.position);
    			});
                tween.onComplete(function () {
                    hPos = new THREE.Vector3().copy(heartMesh.position);
                    that.tweenFinished = true;
                });
    			tween.easing(TWEEN.Easing.Quadratic.InOut);
    			tween.start();
    		}
    		t += dt * 0.0016;
    		heartMesh.scale.set(50, 50, 50);

            heartMesh.position.setY(hPos.y + (Math.sin(t) * 2.5));
            heartMesh.position.setX(hPos.x + (Math.sin(t * 0.8 + Math.PI*0.3) * 2.5));
            heartMesh.setRotationFromEuler(new THREE.Euler( Math.sin(t) * 0.1, Math.sin(t * 0.7) * 0.1, 0 ));
    	}

        if (that.textLoaded === true) {
            
        }
    };

    

    that.load = load;
    that.update = update;
    return that;
};