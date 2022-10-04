// TODO: replace CSS3DRender.js with CDN link
import { CSS3DObject } from "../../mindar-course/course-material/applications/libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js";
import { mockWithImage, mockWithVideo } from "../libs/camera-mock.js";
import { loadGLTF,loadTexture } from "../libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

// Load .js after html doc has loaded
document.addEventListener("DOMContentLoaded", () => {
  const start = async() => {
		// Use mock webcam for testing: mockWithVideo is more stable
		//mockWithImage("../assets/mock-videos/kp-horizontal.png");
    mockWithVideo("../assets/mock-videos/kp-horizontal.mp4");

		// Instantiate MindARThree object which auto instantiates three.js renderder, CSSRenderer, scene, CSSScene, perspective camera
		const mindarThree = new window.MINDAR.IMAGE.MindARThree({
			container: document.body, // size of three.js renderer <canvas>
			imageTargetSrc: "../assets/targets/kp.mind", // compiled image target
		});
		const {renderer, cssRenderer, scene, cssScene, camera} = mindarThree;
		const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

		// Create a cube
    const cubeGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
		const cubeMaterial = new THREE.MeshBasicMaterial({color: "gold"});
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
		cube.position.set(0, 0, 0);

		// Load gltf
		/* const plantGLTF = await loadGLTF("../assets/models/musicband-raccoon/scene.gltf"); */
		const plantGLTF = await loadGLTF("../assets/models/plant/scene.gltf");

		// Create an anchor and add button to anchor
		const anchor = mindarThree.addAnchor(0);
		anchor.group.add(cube);
		anchor.group.add(plantGLTF.scene); // causing error

		// Start MindAR engine
		await mindarThree.start();

		// Start renderer loop to (re)render content for every video frame
		renderer.setAnimationLoop(() => {
			// Re-render scene and cssScene
			renderer.render(scene, camera);
			cssRenderer.render(cssScene, camera);
		});
	};
	start();
});
