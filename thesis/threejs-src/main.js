// TODO: replace CSS3DRender.js with CDN link
import { CSS3DObject } from "../../mindar-course/course-material/applications/libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js";
import { mockWithImage, mockWithVideo } from "../libs/camera-mock.js";
import { loadGLTF,loadTexture } from "../libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

// Load .js after html doc has loaded
document.addEventListener("DOMContentLoaded", () => {
  const start = async() => {
		// Use mock webcam for testing: mockWithVideo is more stable
		/* mockWithImage("../assets/mock-videos/kp-horizontal.png"); */
		mockWithImage("../assets/mock-videos/kp-vertical.png");
    /* mockWithVideo("../assets/mock-videos/kp-horizontal.mp4"); */
		/* mockWithVideo("../assets/mock-videos/kp-vertical.mp4"); */

		// Instantiate MindARThree object which auto instantiates three.js renderder, CSSRenderer, scene, CSSScene, perspective camera
		const mindarThree = new window.MINDAR.IMAGE.MindARThree({
			container: document.body, // size of three.js renderer <canvas>
			imageTargetSrc: "../assets/targets/kp.mind", // compiled image target
		});
		const {renderer, cssRenderer, scene, cssScene, camera} = mindarThree;
		// Add light to scene to "light up" GLTF model. Otherwise, model will be completely dark
		const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

		// Create a CSS3DObject from a <div> which has "visibility: hidden" css styling 
		// so that <div> does not show before MindAR camera starts
		// dashboardCSSObject.children = [] since only 1 object is created using new CSS3DObject(). No child objects are auto created
		// for <div>'s embeded inside <div id="dashboard">
		const dashboardCSSObject = new CSS3DObject(document.getElementById("dashboard"));
		const cssAnchor = mindarThree.addCSSAnchor(0);
		cssAnchor.group.add(dashboardCSSObject);

		// Load gltf model
		// plantGLTF.scene.type = GROUP
		const plantGLTF = await loadGLTF("../assets/models/plant/scene.gltf");
		plantGLTF.scene.position.set(0, -1.2, 0);
		// Add a MindAr anchor for the first image target idx=0 and add gltf to anchor
		const anchor = mindarThree.addAnchor(0);
		anchor.group.add(plantGLTF.scene); // causing error
		/* anchor.group.add(gltf.scene); */

		// Start MindAR engine
		await mindarThree.start();

		// Start renderer loop to (re)render content for every video frame
		renderer.setAnimationLoop(() => {
			// Update dashboard's position so that dashboard always faces towards camera
			// before re-rendering cssScene as dashboard is attached to cssScene
			dashboardCSSObject.lookAt(camera.position);

			// Re-render scene and cssScene
			renderer.render(scene, camera);
			cssRenderer.render(cssScene, camera);
		});
	};
	start();
});

const waterMeButton = document.getElementById("water-me-button");
waterMeButton.addEventListener("click", () => {
  console.log("water me button clicked");
	/* document.getElementById("dashboard").style.color = "purple"; */
	document.getElementById("dashboard-title").style.visibility = "hidden";
});

const viewHistoryButton = document.getElementById("view-history-button");
viewHistoryButton.addEventListener("click", () => {
  console.log("view history button clicked");
});

const aboutMeButton = document.getElementById("about-me-button");
aboutMeButton.addEventListener("click", () => {
  console.log("about me button clicked");
	document.getElementById("dashboard-title").innerHTML = "Who Am I?";
	document.getElementById("water-cup").classList.add("hidden");
	document.getElementById("humidity-reading").classList.add("hidden");
	document.getElementById("plant-description").classList.remove("hidden");
});

const getUpdatesButton = document.getElementById("get-updates-button");
getUpdatesButton.addEventListener("click", () => {
  console.log("get updates button clicked");
});