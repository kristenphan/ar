// Import CSS3DObject explicitly as it is not part of three.js core api
import {CSS3DObject} from "../../mindar-course/course-material/applications/libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js";
import {mockWithVideo} from '../libs/camera-mock.js'; // helper fx to mock webcam for testing
const THREE = window.MINDAR.IMAGE.THREE; // three.js is a dependency of mindar-image-three.prod.js

// Load .js code after html doc has loaded
document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    // Use mock image for testing
    mockWithVideo("../assets/mock-videos/course-banner1.mp4");

    // Instantiate mindarThree object which in turn auto instantiates 
    // three.js renderer, cssRenderer, scene, cssScene, camera
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body, // size of renderer canvas
      imageTargetSrc: '../assets/targets/course-banner.mind', // compiled image target
    });
    const {renderer, cssRenderer, scene, cssScene, camera} = mindarThree;

    // Create a css object which is later added to cssAnchor
    // This css object has CSS styling: blue square <div>
    const cssObj = new CSS3DObject(document.querySelector('#ar-div'));
    // Use addCSSAnchor() to create a MindAR anchor for CSS content
    const cssAnchor = mindarThree.addCSSAnchor(0);
    cssAnchor.group.add(cssObj);

    // Start MindAR engine and re-render both CSS object and gltf model for each video frame
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      cssRenderer.render(cssScene, camera);
    });
  }
  start();
});
