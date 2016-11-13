'use strict';

var video = document.getElementById("video");

console.log(video);
var errorCallback = function(e) {
    console.log('Reeeejected!', e);
  };
var initialized = false;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var constraints = window.constraints = {
  audio: false,
  video: true
};
var Vinputs = [];

function gotDevice(devices){

	for (var i = 0; i !== devices.length; ++i) {
		console.log(devices[i]);
		if(devices[i]['kind']=='videoinput'){
			console.log("found a videoinput");
			Vinputs = devices[i]['deviceID'];
		}
		}
	constraints = window.constraints ={
		audio:false,
		video: {deviceID : Vinputs[Vinputs.length]}
	};
}

navigator.mediaDevices.enumerateDevices().then(gotDevice).catch(errorCallback);

function hasGetUserMedia() {
  return !!(navigator.getUserMedia
  	|| navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
}
function handleSuccess(stream) {
  var videoTracks = stream.getVideoTracks();
  console.log('Got stream with constraints:', constraints);
  console.log('Using video device: ' + videoTracks[0].label);
  stream.oninactive = function() {
    console.log('Stream inactive');
  };
  window.stream = stream; // make variable available to browser console
  video.srcObject = stream;
}

if(hasGetUserMedia()){
	navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess)
}
else{
	alert('getUserMedia() is not supported in your browser');
}
function AddSticker(image){
	var texture = THREE.ImageUtils.loadTexture('resource/einNopee.gif');
	var geometry = new THREE.PlaneGeometry(2,2);
	var material = new THREE.MeshBasicMaterial( { map: texture} );
	var tag = new THREE.Mesh( geometry, material );
	tag.lookAt(camera.position);
	return tag;
	
}

var vidtexture = new THREE.VideoTexture( video );
vidtexture.minFilter = THREE.LinearFilter;
vidtexture.magFilter = THREE.LinearFilter;
vidtexture.format = THREE.RGBFormat;



var scene = new THREE.Scene();
var backscene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var backCamera= new THREE.Camera();
backscene.add(backCamera);
var renderer = new THREE.WebGLRenderer();

renderer.setSize( window.innerWidth+100, window.innerHeight+100 );
document.body.appendChild( renderer.domElement );
var backgeometry = new THREE.PlaneGeometry( 2, 2, 0);
var backmaterial = new THREE.MeshBasicMaterial( {  map: vidtexture} );
var background = new THREE.Mesh( backgeometry, backmaterial );
background.material.depthTest= false;
background.material.depthWrite= false;
backscene.add(background);
var geometry1 = new THREE.Geometry( 1, 1, 1 );
var material1 = new THREE.MeshNormalMaterial( { color: 0x00ff00 } );
var tag1 = new THREE.Mesh( geometry1, material1 );
var tag2 = AddSticker(0x00ff00);
var tag3 = AddSticker(0x0BB000);
var tag4 = AddSticker(0xAFFA10);
tag1.position.z -= 5;
tag2.position.x -=5;
tag3.position.z +=10;
tag4.position.y +=5;

scene.add( tag1 );
scene.add( tag2) ;
scene.add(tag3);
scene.add(tag4);
var pointLight = new THREE.PointLight(0xFFFFFF);
scene.add(pointLight);
var lastOrientation
window.ondeviceorientation = function(event){
	if(!initialized){
		lastOrientation=[event.alpha, event.beta, event.gamma];
		initialized = true;
	}
	var delta=[event.alpha-lastOrientation[0],event.beta-lastOrientation[1], event.gamma-lastOrientation[2]]
	lastOrientation=[event.alpha, event.beta, event.gamma];
	console.log(delta);
	camera.rotation.x+=delta[1]*3.14/180;
	camera.rotation.y+=delta[0]*3.14/180;
}


camera.position.z = 0;
function render() {
	requestAnimationFrame( render );
	renderer.autoClear=false;
	renderer.clear();
	renderer.render(backscene, backCamera)
	renderer.render( scene, camera );
	tag2.lookAt(camera.position);
	tag3.lookAt(camera.position);
	tag4.lookAt(camera.position);






	
}
render();