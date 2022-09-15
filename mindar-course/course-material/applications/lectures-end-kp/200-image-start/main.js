// Importing mindAR in .html using <script> attaches MINDAR to the window object
// <script src='../../libs/mindar/mindar-image-three.prod.js'></script>
// Can access threejs as threejs is already part of MindAR
const THREE = window.MINDAR.IMAGE.THREE;

// Confirm THREE is successfully loaded
// console.log('THREE: ', THREE);

// Load JS code after .html finishes loading
document.addEventListener('DOMContentLoaded', () => {
  // Create an async start() to start MindAR engine and render a blue transparent plane on image target
  const start = async() => {
    // Instantiate a MindARThree object using MindAR engine
	const mindarThree = new window.MINDAR.IMAGE.MindARThree({
	  container: document.body,
	  imageTargetSrc: '../../assets/targets/course-banner.mind'
	 });

	// When MindARThree object is instantiated, renderer + scene + camera are auto created
	const {renderer, scene, camera} = mindarThree;

	// Create a 3D, semi-transparent, blue plane to demonstrate the AR effect
	const geometry = new THREE.PlaneGeometry(1, 1);
	const material = new THREE.MeshBasicMaterial({
	  color: 0x0000ff,
	  transparent: true,
	  opacity: 0.5,
	});
	const plane = new THREE.Mesh(geometry, material);

	// Create a MindArThree anchor object and pass in the index of the target image
	// In this case, index = 0 as there is only 1 image target 
	// Possible to track multiple image targets by specifying the indices
	// MindarThree now then tracks this image target and calculate the estimated image target position 
	// where AR contents can be rendered onto
	const anchor = mindarThree.addAnchor(0);
  
	// Instead of adding the plane directly to scene, add plane to anchor
	// 3D scene is represented in a hierarchy
	// anchor.group = THREE.Group: a virtual representaton of position and rotation
	// When adding renderable objects to a group, all objects will inherit
	// the position and rotation of the group
	anchor.group.add(plane);

	// Start the MindARThree engine and wait until the engine is ready
	// await can only be called from async function, so make start() an async function
	await mindarThree.start();

	// Once the AR engine has started, 
	// this callback function will be executed for every video frame
	renderer.setAnimationLoop(() => {
	  // Render <canvas> element
	  renderer.render(scene, camera);
	});
  };
  // Start the MindAR engine
  start();
});
