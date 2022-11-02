// TODO: replace CSS3DRender.js with CDN link
import { CSS3DObject } from "../../mindar-course/course-material/applications/libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js";
import { mockWithImage, mockWithVideo } from "../libs/camera-mock.js";
/* import { GLTFLoader } from 'https://unpkg.com/three@0.136.0/examples/jsm/loaders/GLTFLoader.js'; */
import { GLTFLoader } from "../libs/three.js-r132/examples/jsm/loaders/GLTFLoader.js";
const THREE = window.MINDAR.IMAGE.THREE;

// Call GLFTLoader.js to load a gltf model and return a Promise
function loadGLTF(path) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(path, (gltf) => {
      resolve(gltf);
    });
  });
}

// Load .js after html doc has loaded
document.addEventListener("DOMContentLoaded", () => {
  const start = async() => {
		// Use mock webcam for testing: mockWithVideo is more stable
		/* mockWithImage("../assets/mock-videos/kp-horizontal.png"); */
		/* mockWithImage("../assets/mock-videos/kp-vertical.png"); */
    mockWithVideo("../assets/mock-videos/kp-horizontal.mp4");
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
		// Make gltf model invisible until "About Me" button on the Home dashboard is clicked
		plantGLTF.scene.children[0].visible = false;
		// Mark GLTF model as clickable and with an URL so that a webpage is opened when users click on the model
		plantGLTF.scene.userData.clickable = true;
		plantGLTF.scene.userData.URL = "https://liquidstudio.nl/";
		// Add a MindAr anchor for the first image target idx=0 and add gltf to anchor
		const anchor = mindarThree.addAnchor(0);
		anchor.group.add(plantGLTF.scene); // causing error

		// Add event listeners for dashboard-home-button
		document.getElementById("home-waterme-button").addEventListener("click", () => {
				console.log("home water me button clicked");
				window.location.href = "./water-me.html";
			});

		document.getElementById("home-viewhistory-button").addEventListener("click", () => {
			console.log("home view history button clicked");
			document.getElementById("dashboard-home").classList.add("hidden");
			document.getElementById("dashboard-viewhistory").classList.remove("hidden");
		});

		document.getElementById("home-aboutme-button").addEventListener("click", () => {
			console.log("home about me button clicked");
			// Resize dashboard
			document.getElementById("dashboard").style.height = "730px";

			// Change dashboard content
			document.getElementById("dashboard-home").classList.add("hidden");
			document.getElementById("dashboard-aboutme-page1").classList.remove("hidden");
			// Render gltf model
			plantGLTF.scene.children[0].visible = true;
		});

		document.getElementById("home-getupdates-button").addEventListener("click", () => {
			console.log("home get updates button clicked");
			// Display updated moisture reading
			const moisturePercentage = 10; // TODO: replace with real-time data from iot
			document.getElementById("moisture-reading").innerHTML = `Soil moisture: ${moisturePercentage}%`; 

			// Display the time when the moisture reading was recorded
			const moistureTimestamp = "31/10/22 8:00 AM"; // TODO: replace with real-time timestamp from iot
			document.getElementById("moisture-timestamp").innerHTML = `Last update: ${moistureTimestamp}`; 

			// Update water cup image depending on the moisture reading
			if (moisturePercentage < 30) {
				document.getElementById("water-cup").src = "../assets/images/water-low.png";	
			} else if (moisturePercentage <= 30 && moisturePercentage < 60) {
				document.getElementById("water-cup").src = "../assets/images/water-medium.png";	
			} else {
				document.getElementById("water-cup").src = "../assets/images/water-high.png";
			}
		});

		document.getElementById("aboutme-page1-back-button").addEventListener("click", () => {
			console.log("about me page1 back button clicked");
			document.getElementById("dashboard-home").classList.remove("hidden");
			document.getElementById("dashboard-aboutme-page1").classList.add("hidden");
			document.getElementById("dashboard").style.height = "700px";
			plantGLTF.scene.children[0].visible = false;
		});

		document.getElementById("aboutme-page1-next-button").addEventListener("click", () => {
			console.log("about me page1 next button clicked");
			document.getElementById("dashboard-aboutme-page2").classList.remove("hidden");
			document.getElementById("dashboard-aboutme-page1").classList.add("hidden");
			document.getElementById("dashboard").style.height = "930px";
			plantGLTF.scene.children[0].visible = false;
		});

		document.getElementById("aboutme-page2-back-button").addEventListener("click", () => {
			console.log("about me page2 back button clicked");
			document.getElementById("dashboard-aboutme-page2").classList.add("hidden");
			document.getElementById("dashboard-aboutme-page1").classList.remove("hidden");
			document.getElementById("dashboard").style.height = "730px";
			plantGLTF.scene.children[0].visible = true;
		});

		document.getElementById("aboutme-page2-return-button").addEventListener("click", () => {
			console.log("about me page2 return button clicked");
			document.getElementById("dashboard-aboutme-page2").classList.add("hidden");
			document.getElementById("dashboard-home").classList.remove("hidden");
			document.getElementById("dashboard").style.height = "700px";
		});

		document.getElementById("viewhistory-return-button").addEventListener("click", () => {
			console.log("view history return button clicked");
			document.getElementById("dashboard-viewhistory").classList.add("hidden");
			document.getElementById("dashboard-home").classList.remove("hidden");
		});

		/* // Use raycasting to check if GLTF model is clicked. If yes, open a webpage from a hyperlink
		document.body.addEventListener("click", (e) => {
			// Calculate and normalize the x- and y-coord of the click event on html document body i.e., the three.js renderer canvas
			const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
			const mouseY = -1 * ((e.clientY / window.innerHeight) *2 - 1);
      const mouse = new THREE.Vector2(mouseX, mouseY);
			// Cast a virtual ray from camera to click event coords and check if this ray intersects with the plant GLTF model
			const raycaster = new THREE.Raycaster();
			raycaster.setFromCamera(mouse, camera);
			const intersects = raycaster.intersectObjects(scene.children, true);
			console.log("intersects.length = ", intersects.length);
			if (intersects.length > 0) {
				let o = intersects[0].object;
				while (o.parent && !o.userData.clickable) {
					o = o.parent;
				}
				if (o.userData.clickable) {
					if (o === plantGLTF.scene) {
						window.open(o.userData.URL);
					}
				}
			}
		}); */

		// Set up a clock
		const clock = new THREE.Clock();
		// Start MindAR engine
		await mindarThree.start();
		// After MindAR engine has started, start renderer's loop to (re)render content for every video frame
		renderer.setAnimationLoop(() => {
			// Update dashboard's position before re-rendering cssScene (dashboard is attached to cssScene)
			// so that dashboard always face towards camera
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

