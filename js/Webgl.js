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


function hasGetUserMedia() {
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
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
function AddSticker(color){
	var geometry = new THREE.PlaneGeometry( 1, 1 );
	var material = new THREE.MeshBasicMaterial( { color: color} );
	var tag = new THREE.Mesh( geometry, material );
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

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
var backgeometry = new THREE.PlaneGeometry( 2, 2, 0);
var backmaterial = new THREE.MeshBasicMaterial( {  map: vidtexture} );
var background = new THREE.Mesh( backgeometry, backmaterial );
background.material.depthTest= false;
background.material.depthWrite= false;
backscene.add(background);
var geometry1 = new THREE.BoxGeometry( 1, 1, 1 );
var material1 = new THREE.MeshNormalMaterial( { color: 0x00ff00 } );
var tag1 = new THREE.Mesh( geometry1, material1 );
scene.add( tag1 );
var lastOrientation
window.ondeviceorientation = function(event){
	if(!initialized){
		lastOrientation=[event.alpha, event.beta, event.gamma];
		initialized = true;
	}
	var delta=[event.alpha-lastOrientation[0],event.beta-lastOrientation[1], event.gamma-lastOrientation[2]]
	lastOrientation=[event.alpha, event.beta, event.gamma];
	console.log(delta);
	camera.rotation.x+=delta[1]/180;
	camera.rotation.y+=delta[0]/180;
	camera.rotation.z+=delta[2]/180;

}




camera.position.z = 5;
function render() {
	requestAnimationFrame( render );
	renderer.autoClear=false;
	renderer.clear();
	renderer.render(backscene, backCamera)
	renderer.render( scene, camera );



	
}
render();