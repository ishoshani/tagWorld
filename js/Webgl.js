'use strict';

var video = document.getElementById("video");//video to play from camera

console.log(video);
var errorCallback = function(e) {
    console.log('Reeeejected!', e);
  };
var initialized = false; //have we been orientated yet?

var constraints = window.constraints={
  audio: false,
  video: {facingMode:"environment"}
};
var tagList = [];
//list of Video Inputs
var Vinputs = [];
//if managed to get list of devices, try to find the videoinput and choose the final one:hopefully rearcam
/*function gotDevice(devices){

	for (var i = 0; i !== devices.length; ++i) {
		console.log(devices[i]);
		if(devices[i]['kind']=='videoinput'){
			console.log("found a videoinput");
			Vinputs.push(devices[i].deviceId);

		}
	}
	console.log(Vinputs);
	constraints = {
		audio:false,
<<<<<<< HEAD
		video:{deviceId:Vinputs[1]}
=======
		video:true
>>>>>>> e8c7bc76362e4fdaceff175e829f43729f6a12f3
	};
}*/
//Check to see what inputs are avialable
/*
navigator.mediaDevices.enumerateDevices().then(gotDevice).catch(errorCallback);
*/

//test various use media prefixes
function hasGetUserMedia() {
  return !!(navigator.getUserMedia
  	|| navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
}
//handle Success of finding video
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

//test to see if usermedia is available. Video will not work in safari or ios browsers
if(hasGetUserMedia()){
	navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess)
}
else{
	alert('getUserMedia() is not supported in your browser');
}

//create a 2d plane tag. Image must be in resource folder. does not actuall add to scene. Adds to a list of tags.
function AddTag(image){
	var texture = THREE.ImageUtils.loadTexture("resource/"+image);
	var geometry = new THREE.PlaneGeometry(2,2);
	var material = new THREE.MeshBasicMaterial( { map: texture} );
	var tag = new THREE.Mesh( geometry, material );
	tag.lookAt(camera.position);
	$(tag).click(function(){	
		console.log("clicked!")
	});
	return tag;	
}


//foreground and background scenes
var scene = new THREE.Scene();
var backscene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var backCamera= new THREE.Camera();
backscene.add(backCamera);

//set up rendere
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight - 100 );
document.getElementById('stream-area').appendChild( renderer.domElement );

//create video texture
var vidtexture = new THREE.VideoTexture( video );
vidtexture.minFilter = THREE.LinearFilter;
vidtexture.magFilter = THREE.LinearFilter;
vidtexture.format = THREE.RGBFormat;

//background object
var backgeometry = new THREE.PlaneGeometry( 2, 2, 0);
var backmaterial = new THREE.MeshBasicMaterial( {  map: vidtexture} );
var background = new THREE.Mesh( backgeometry, backmaterial );
background.material.depthTest= false;
background.material.depthWrite= false;
backscene.add(background);

//setup foreground objects
var geometry1 = new THREE.BoxGeometry( 1, 1, 1 );
var material1 = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
var tag1 = new THREE.Mesh( geometry1, material1 );

$(tag1).click(function(){	
		console.log("clicked!")
	});


tagList[0]=AddTag("einNopee.gif");
tagList[1]=AddTag("large.jpg");
tagList[2]=AddTag("large.jpg");

//repositioning around central position
tag1.position.z -= 5;
tagList[0].position.x -=5;
tagList[1].position.z +=10;
tagList[2].position.y +=5;
//Adding
scene.add( tag1 );
for (var i = tagList.length - 1; i >= 0; i--) {
	scene.add(tagList[i]);
}
//Images need light to show up correctly
var pointLight = new THREE.PointLight(0xFFFFFF);
scene.add(pointLight);
var lastOrientation;
//move camera as device moves
window.ondeviceorientation = function(event){
	if(!initialized){//means the device will orientate to the first thing after it has first moved.
		lastOrientation=[event.alpha, event.beta, event.gamma];
		initialized = true;
	}
	var delta=[event.alpha-lastOrientation[0],event.beta-lastOrientation[1], event.gamma-lastOrientation[2]]
	lastOrientation=[event.alpha, event.beta, event.gamma];
	console.log(delta);
	camera.rotation.x+=delta[1]*3.14/180;
	camera.rotation.y+=delta[0]*3.14/180;
};

//set camera to be at center
camera.position.z = 0;
//do this every frame
function render() {
	requestAnimationFrame( render );
	renderer.autoClear=false;//do not autoclear after render so that the back and fore live together
	renderer.clear();
	renderer.render(backscene, backCamera);
	renderer.render( scene, camera );
	tag1.rotation.y+=0.01; //show off 3d object

	for (var i = tagList.length - 1; i >= 0; i--) {
		tagList[i].lookAt(camera.position);
	}
}

//start rendering.
render();