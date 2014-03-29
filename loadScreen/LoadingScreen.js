
// interface to load assets and provide progress reports to frontend

var AssetFactory = function (onFinish, onProgress) {
	var that = {};
	var map = {};
	var loader = THREE.JSONLoader(false);
	var filesLoaded;
	var filesToLoad;

	var loadAudio = function (key, uri) {
		var audio = new Audio();
		audio.AddEventListener('canplaythrough', finishLoading, false);
		audio.src = uri
		map[key] = audio;
	};

	var loadMesh = function (key, uri) {
		loader.load(uri, function (geo, mats) {
			map[key] = THREE.Mesh(geo, mats);
			finishLoading();
		});
	};

	var finishLoading = function () {
		filesLoaded += 1;
		if (filesToLoad <= filesLoaded) {
			// finish
			if(typeof onLoad === "function") {
				onFinish();
			}
		}
		else
		{
			onProgress(filesLoaded, filesToLoad);
		}
	}

	var loadAssets = function (assetMap, callback, progressCallback) {
		filesToLoad = Object.keys(assetMap).length;
		filesLoaded = 0;
		for (var prop in assetMap) {
			if(typeof assetMap[prop] === "string") {
				var uri = assetMap[prop];
				if(uri.indexOf(".ogg") >= 0 || uri.indexOf(".mp3") >= 0)
				{
					// audio
					loadAudio(prop, uri);
				}
				else if(uri.indexOf(".js") >= 0 || uri.indexOf(".json") >= 0)
				{
					// mesh
					loadMesh(prop, uri);
				}
				else
				{
					console.error("file " + uri + " not supported");
				}
			}
		}
	};

	that.loadAssets = loadAssets;
	that.map = map;
	return that;
};

var LoadingScreen = function (renderer, width, height, assetMap) {
	var factory = new AssetFactory();
	var map = assetMap || {};
	var that = {};
	var loadingScene = THREE.scene();
	var camera = THREE.OrthographicCamera(  width / -2, width / 2,  height / 2,  height / -2, 10, 200);

	

	var render = function() {

	};
};