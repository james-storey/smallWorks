var running = false;
var gravity;
var time;
var simplex;

self.onmessage = function(e){

	switch(e.data.cmd){

      case 'run':
      	var positions = e.data.positions;
      	var velocities = e.data.velocities;
      	var eulers = e.data.eulers;
      	if(!running){
      		importScripts('SimplexNoise.js', '../../three.js/build/three.js');
      		simplex = new SimplexNoise();
      		running = true;
      		gravity = new THREE.Vector3( 0.0, -0.3, 0.0 );
      		time = 0.0;
  			var origin = new THREE.Vector3( 0, 25, 0 );
  			for(i = 0; i < positions.length/3; i++){
  				var initpos = new THREE.Vector3( Math.random()*2.0-1.0, 
  											 Math.random()*2.0-1.0 + 250, 
  											 Math.random()*2.0-1.0 );

  				positions[3*i+0] = initpos.x;
  				positions[3*i+1] = initpos.y;
  				positions[3*i+2] = initpos.z;

  				var initvel = initpos;
  				initvel
  				initvel.normalize();
  				initvel.multiplyScalar(1000);

  				velocities[3*i+0] = initvel.x;
  				velocities[3*i+1] = initvel.y;
  				velocities[3*i+2] = initvel.z;

  				var initrot = new THREE.Vector3( Math.random()*4.0*Math.PI-2.0*Math.PI, 
  											 Math.random()*4.0*Math.PI-2.0*Math.PI,  
  											 Math.random()*4.0*Math.PI-2.0*Math.PI );
  				eulers[3*i+0] = initrot.x;
  				eulers[3*i+1] = initrot.y;
  				eulers[3*i+2] = initrot.z;
  			}
      	}

      	time+=0.01;

      		
      	for(i = 0; i < positions.length/3; i++){
      		//fall
      		var vel = new THREE.Vector3( velocities[3*i+0], 
      								 velocities[3*i+1], 
      								 velocities[3*i+2] );
      		var pos = new THREE.Vector3( positions[3*i+0], 
      								 positions[3*i+1], 
      								 positions[3*i+2] );
      		vel.add(gravity);

      		//drift

      		var drift = new THREE.Vector3(simplex.noise(3*i+0, time), 
      								  simplex.noise(3*i+1, time+10), 
      							      simplex.noise(3*i+2, time+20) );
      		eulers[3*i+0] += drift.x/2;
      		eulers[3*i+1] += drift.y/2;
      		eulers[3*i+2] += drift.z/2;

      		vel.add(drift);
      		vel.normalize();

      		velocities[3*i+0] = vel.x;
      		velocities[3*i+1] = vel.y;
      		velocities[3*i+2] = vel.z;

      		//apply velocity

      		pos.add(vel);
      		positions[3*i+0] = pos.x;
      		positions[3*i+1] = pos.y;
      		positions[3*i+2] = pos.z;
      	}
      	if(running){
      	self.postMessage({
  			positions:positions,
  			velocities:velocities,
  			eulers:eulers
  		}, [positions.buffer,
  			velocities.buffer,
  			eulers.buffer]);
      }
      	break;

      	default:
    	self.postMessage('unknown worker command: ' + e.data.cmd);
    }
};