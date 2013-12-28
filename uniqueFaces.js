
var UniqueFaces = function(geometry) {
	this.geo = geometry !== undefined ? geometry : THREE.Geometry();
	this.geo = this.createUniqueFaces(this.geo);
};

UniqueFaces.prototype = {
	constructor: UniqueFaces,

	createUniqueFaces: function (geo) {
		var newGeo = new THREE.Geometry();
		geo.faces.forEach(function (face) {
			var vert0 = geo.vertices[face.a].clone();
			var vert1 = geo.vertices[face.b].clone();
			var vert2 = geo.vertices[face.c].clone();

			newGeo.vertices.push(vert0);
			newGeo.vertices.push(vert1);
			newGeo.vertices.push(vert2);

			var newFace = face.clone();
			newFace.a = newGeo.vertices.length-3;
			newFace.b = newGeo.vertices.length-2;
			newFace.c = newGeo.vertices.length-1;

			newGeo.faces.push(newFace);

		});
		return newGeo;
	},

	translateFace: function(face, vector) {
		this.geo.vertices[face.a].add(vector);
		this.geo.vertices[face.b].add(vector);
		this.geo.vertices[face.c].add(vector);

		this.geo.verticesNeedUpdate = true;
	},

	translateA: function(face, vector) {
		this.geo.vertices[face.a].add(vector);
		this.geo.verticesNeedUpdate = true;
	},
	translateB: function(face, vector) {
		this.geo.vertices[face.b].add(vector);
		this.geo.verticesNeedUpdate = true;
	},
	translateC: function(face, vector) {
		this.geo.vertices[face.c].add(vector);
		this.geo.verticesNeedUpdate = true;
	},

	positionA: function(face, vector) {
		this.geo.vertices[face.a] = vector;
		this.geo.verticesNeedUpdate = true;
	},
	positionB: function(face, vector) {
		this.geo.vertices[face.b] = vector;
		this.geo.verticesNeedUpdate = true;
	},
	positionC: function(face, vector) {
		this.geo.vertices[face.c] = vector;
		this.geo.verticesNeedUpdate = true;
	},

	faceVerts: function(face) {
		return { a: this.geo.vertices[face.a],
				 b: this.geo.vertices[face.b],
				 c: this.geo.vertices[face.c] };
	}

	faceByIndex: function(index) {
		if(index >= this.geo.faces.length){
			console.error("faces array access out of bounds");
			return null;
		}
		return this.geo.faces[index];
	},

	getFaces: function() {
		return this.geo.faces;
	},

	getGeometry: function() {
		return this.geo;
	},

	sortFaces: function(vector) {
		//sort nearest to farthest from local position
		var compare = function(a, b) {
			return vector.sub(a).lengthSq - vector.sub(b).lengthSq;
		}
		this.geo.faces.sort(compare);
	}

};