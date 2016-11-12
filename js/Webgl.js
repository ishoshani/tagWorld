'use strict';

var video = document.getElementById("video");
console.log(video);
var errorCallback = function(e) {
    console.log('Reeeejected!', e);
  };
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

var vidtexture = new THREE.VideoTexture( video );
vidtexture.minFilter = THREE.LinearFilter;
vidtexture.magFilter = THREE.LinearFilter;
vidtexture.format = THREE.RGBFormat;



var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
var geometry = new THREE.PlaneGeometry( 20, 20);
var material = new THREE.MeshBasicMaterial( {  map: vidtexture} );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;
function render() {
	requestAnimationFrame( render );
	renderer.render( scene, camera );
	cube.rotation.y += 0.01;
	
}
render();