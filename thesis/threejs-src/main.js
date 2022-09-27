// TODO: replace CSS#DRender.js with CDN link
import { CSS3DObject } from "../../mindar-course/course-material/applications/libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js";
import { mockWithImage, mockWithVideo } from "../libs/camera-mock.js";
import { loadGLTF } from "../libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

// Load .js after html doc has loaded
document.addEventListener("DOMContentLoaded", () => {
  const start = async() => {
		// Use mock webcam for testing: mockWithVideo is more stable
		//mockWithImage("../assets/mock-videos/kp-horizontal.png");
    mockWithVideo("../assets/mock-videos/kp-horizontal.mp4");

		// Instantiate MindARThree object which auto instantiates three.js renderder, CSSRenderer, scene, CSSScene, camera
		const mindarThree = new window.MINDAR.IMAGE.MindARThree({
			container: document.body, // size of three.js renderer <canvas>
			imageTargetSrc: "../assets/targets/kp.mind", // compiled image target
		});
		const {renderer, cssRenderer, scene, cssScene, camera} = mindarThree;
	
		// Create a MindAR anchor
		const anchor = mindarThree.addAnchor(0);

		// Create a CSS3DObject from the <div>
		// <div> has "visibility: hidden" css styling so that <div> will not show before MindAR camera starts
		const dashboardCSSObject = new CSS3DObject(document.querySelector("#dashboard"));
		const cssAnchor = mindarThree.addCSSAnchor(0);
		cssAnchor.group.add(dashboardCSSObject);

		// Start MindAR engine
		await mindarThree.start();

		// Start renderer loop to (re)render content for every video frame
		renderer.setAnimationLoop(() => {
			renderer.render(scene, camera);
			cssRenderer.render(cssScene, camera);
		});
	};
	start();
});