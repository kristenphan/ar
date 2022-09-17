import {CSS3DObject} from '../../libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js';
import {mockWithImage} from '../../libs/camera-mock.js';
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    // Use mock image for testing
    mockWithImage('../../assets/mock-videos/course-banner2.png');
    
    // Instantiate mindarThree which in turn auto instantiate renderer, cssRenderer, scene, cssScnee, camera
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targets/course-banner.mind',
    });
    const {renderer, cssRenderer, scene, cssScene, camera} = mindarThree;

    // Create cssObject: a <div> with embedded <iframe>
    const cssObj = new CSS3DObject(document.querySelector("#ar-div"));
    // Create cssAnchor using 1st compiled image target idx=0 and add cssObject to anchor
    // All objects associated with the anchor will be rendered according to the anchor's position and orientation
    const cssAnchor = mindarThree.addCSSAnchor(0);
    cssAnchor.group.add(cssObj);

    // Start MindAR engine and (re)render objects for every video frame
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      cssRenderer.render(cssScene, camera);
    });
  }
  start();
});
