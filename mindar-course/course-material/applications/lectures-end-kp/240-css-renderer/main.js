// Import CSS3DObject explicitly as it is not part of three.js core api
import {CSS3DObject} from '../../libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js';
import {mockWithImage, mockWithVideo} from '../../libs/camera-mock.js'; // helper fx to mock webcam for testing
import {loadGLTF} from '../../libs/loader.js'; // helper fx to load GLTF
const THREE = window.MINDAR.IMAGE.THREE; // three.js is a dependency of mindar-image-three.prod.js

// Load .js code after html doc has loaded
document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    // Use mock image for testing
    /* mockWithImage('../../assets/mock-videos/course-banner2.png'); */
    mockWithVideo("../../assets/mock-videos/course-banner1.mp4");

    // Instantiate mindarThree object which in turn auto instantiates 
    // three.js renderer, cssRenderer, scene, cssScene, camera
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body, // size of renderer canvaas
      imageTargetSrc: '../../assets/targets/course-banner.mind', // compiled image target
    });
    const {renderer, cssRenderer, scene, cssScene, camera} = mindarThree;

    // Create a css object which is later added to cssAnchor
    // This css object has CSS styling: blue square <div>
    const cssObj = new CSS3DObject(document.querySelector('#ar-div'));
    // Use addCSSAnchor() to create a MindAR anchor for CSS content
    const cssAnchor = mindarThree.addCSSAnchor(0);
    cssAnchor.group.add(cssObj);

    // Add light to scene to light up gltf model
    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1);
    scene.add(light);

    // Load, scale, and position gltf model: model sitting above css object y=1 (0, 1, 0)
    const raccoon = await loadGLTF('../../assets/models/musicband-raccoon/scene.gltf');
    raccoon.scene.scale.set(0.1, 0.1, 0.1);
    raccoon.scene.position.set(0, 1, 0);
    // Create anchor and add gltf to anchor
    const raccoonAnchor = mindarThree.addAnchor(0);
    raccoonAnchor.group.add(raccoon.scene);

    // Start MindAR engine and re-render both CSS object and gltf model for each video frame
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      cssRenderer.render(cssScene, camera);
      renderer.render(scene, camera);
    });
  }
  start();
});
