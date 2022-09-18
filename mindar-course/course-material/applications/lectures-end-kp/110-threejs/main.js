import * as THREE from '../../libs/three.js-r132/build/three.module.js';

// Load JS code after .html finishes loading
document.addEventListener('DOMContentLoaded', () => {
	// Create an AR scene
	const scene = new THREE.Scene();

	// In threejs, a 3D object is presented as a Mesh
	// and consists of: 1) geometry 2) material = property of the geometry
	// Create a 3D cube
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({color: '#0000FF'});
	const cube = new THREE.Mesh(geometry, material);

	// Add cube to scene; position and rotate cube
	scene.add(cube);
	cube.position.set(0., 0, -2);
	cube.rotation.set(0, Math.PI/4, 0);

	// Create a camera
	const camera = new THREE.PerspectiveCamera();
	camera.position.set(1, 1, 5);

	// When creating WebGLRenderer renderer, a html <canvas> element is auto created
	// alpha: true = make the background of the canvas renderer object transparent
	const renderer = new THREE.WebGLRenderer({alpha: true});
	// 500 pixel in width and height
	renderer.setSize(500, 500);
	renderer.render(scene, camera);

	// Create a html <video> to embed a video into the html doc
	const video = document.createElement('video');
	// Start the webcam
	// https://developer.mozilla.org/en-US/docs/Web/API/Navigator/mediaDevices
	navigator.mediaDevices.getUserMedia({video: true}).then((stream) => {
		video.srcObject = stream;
		video.play();
	});

	// Make video and renderer overlap
	video.style.position = 'absolute';
	renderer.domElement.style.position = 'absolute';

	// Set video according to the renderer canvas size
	video.style.width =  renderer.domElement.width;
	video.style.height =  renderer.domElement.height;

	// Attach the renderer and video to document.body
	document.body.appendChild(video);
	document.body.appendChild(renderer.domElement);
});