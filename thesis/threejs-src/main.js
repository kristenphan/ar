// TODO: replace CSS3DRender.js with CDN link
import { CSS3DObject } from "../../mindar-course/course-material/applications/libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js";
import { mockWithImage, mockWithVideo } from "../libs/camera-mock.js";
import { loadGLTF,loadTexture } from "../libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

// Create createYoutube() using YT iframe api
// https://developers.google.com/youtube/iframe_api_reference
const createYoutube = (videoId) => {
  return new Promise((resolve, reject) => {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    const onYouTubeIframeAPIReady = () => {
      const player = new YT.Player('player', {
        videoId: videoId,
        events: {
          onReady: () => {
            resolve(player);
          }
	      }
      });
    }
    window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
  });
}

// Load .js after html doc has loaded
document.addEventListener("DOMContentLoaded", () => {
  const start = async() => {
		// Use mock webcam for testing: mockWithVideo is more stable
		/* mockWithImage("../assets/mock-videos/kp-horizontal.png"); */
		/* mockWithImage("../assets/mock-videos/kp-vertical.png"); */
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
		const dashboardCSS3DObject = new CSS3DObject(document.getElementById("dashboard"));
		const cssAnchor = mindarThree.addCSSAnchor(0);
		cssAnchor.group.add(dashboardCSS3DObject);

		// Load and position gltf model
		// plantGLTF.scene.type = GROUP
		// plantGLTF.scene.children.length = 1
		// plantGLTF.scene.children[0].visible = true by default
		const plantGLTF = await loadGLTF("../assets/models/plant/scene.gltf");
		plantGLTF.scene.position.set(0, -1.2, 0);
		// Make gltf model invisible until "About Me" button is clicked
		plantGLTF.scene.children[0].visible = false;
		// Add a MindAr anchor for the first image target idx=0 and add gltf to anchor
		const anchor = mindarThree.addAnchor(0);
		anchor.group.add(plantGLTF.scene); // causing error

		// Add event listeners for dashboard-home-button
		document.getElementById("home-water-me-button").addEventListener("click", () => {
				console.log("home water me button clicked");
			});

		document.getElementById("home-view-history-button").addEventListener("click", () => {
			console.log("home view history button clicked");
		});

		document.getElementById("home-about-me-button").addEventListener("click", () => {
			console.log("home about me button clicked");
			// Change dashboard content
			document.getElementById("dashboard-home").classList.add("hidden");
			document.getElementById("dashboard-aboutme-page1").classList.remove("hidden");
			// Render gltf model
			plantGLTF.scene.children[0].visible = true;
			plantGLTF.scene.userData.clickable = true;
		});

		document.getElementById("home-get-updates-button").addEventListener("click", () => {
			console.log("home get updates button clicked");
		});

		document.getElementById("aboutme-page1-back-button").addEventListener("click", () => {
			console.log("about me page1 back button clicked");
			document.getElementById("dashboard-home").classList.remove("hidden");
			document.getElementById("dashboard-aboutme-page1").classList.add("hidden");
			plantGLTF.scene.children[0].visible = false;
		});

		document.getElementById("aboutme-page1-next-button").addEventListener("click", () => {
			console.log("about me page1 next button clicked");
			document.getElementById("dashboard-aboutme-page2").classList.remove("hidden");
			document.getElementById("dashboard-aboutme-page1").classList.add("hidden");
			document.getElementById("dashboard").style.height = "900px";
			plantGLTF.scene.children[0].visible = false;
			/* ytVideoCSS3DObject.visible = true; */
		});

		document.getElementById("aboutme-page2-back-button").addEventListener("click", () => {
			console.log("about me page2 back button clicked");
			document.getElementById("dashboard-aboutme-page2").classList.add("hidden");
			document.getElementById("dashboard-aboutme-page1").classList.remove("hidden");
			document.getElementById("dashboard").style.height = "700px";
			plantGLTF.scene.children[0].visible = true;
			/* ytVideoCSS3DObject.visible = false; */
		});

		document.getElementById("aboutme-page2-return-button").addEventListener("click", () => {
			console.log("about me page2 return button clicked");
			document.getElementById("dashboard-aboutme-page2").classList.add("hidden");
			document.getElementById("dashboard-home").classList.remove("hidden");
			document.getElementById("dashboard").style.height = "700px";
			/* ytVideoCSS3DObject.visible = false; */
		});

		// Set up a clock
		const clock = new THREE.Clock();
		// Start MindAR engine
		await mindarThree.start();
		// After MindAR engine has started, start renderer's loop to (re)render content for every video frame
		renderer.setAnimationLoop(() => {
			// Update dashboard's and video's position before re-rendering cssScene (dashboard is attached to cssScene)
			// so that dashboard and video always face towards camera
			dashboardCSS3DObject.lookAt(camera.position);

			// Rotate gltf model continuously around y-axis
			const delta = clock.getDelta(); // = time in secs since clock.getDelta() was last called
			plantGLTF.scene.rotation.set(0, plantGLTF.scene.rotation.y + delta/2, 0);

			// Re-render scene and cssScene
			renderer.render(scene, camera);
			cssRenderer.render(cssScene, camera);
		});
	};
	start();
});

