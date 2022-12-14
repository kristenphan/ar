// Import mockWithImage, mockWithVideo for testing
import {mockWithVideo, mockWithImage} from '../../libs/camera-mock.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';
// three.js is a dependency of mindar-image-three.prod.js
const THREE = window.MINDAR.IMAGE.THREE;

function loadGLTF(path) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(path, (gltf) => {
      resolve(gltf);
    });
  });
}

// Load .js after html doc has loaded 
document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    // Create a mock image for testing 
    // Use either mockWithVideo or mockWithImage. Not both
    mockWithImage('../../assets/mock-videos/musicband-raccoon-bear.png');
    /* mockWithVideo('../../assets/mock-videos/musicband1.mp4'); */

    // Instantiate a mindarThree object
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body, // container spans the entire html doc
      imageTargetSrc: '../../assets/targets/musicband-raccoon.mind', // compiled image target
    });
    // When mindarThree is instantiated, renderer + scene + camera are auto instantiated
    const {renderer, scene, camera} = mindarThree;

    // Create light and add to scene. Without light, 3d model will be completely dark
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    // anchor is a THREE.GROUP element: a virtual representation of position + rotation
    // Create an an anchor using the first image target with idx=0 bc musicband-raccoon.mind only has 1 image (raccoonn) at idx=0
    // All AR contents part of this anchor will inherit the position + rotation of the anchor
    const anchor = mindarThree.addAnchor(0);

    // Load gltf model. Need to load all models before starting MindAR engine: mindarThree.start()
    // gltf.scene is a THREE.GROUP element itself containing smaller objects which make up .gltf model as a whole
    // gltf.scene.isGroup = TRUE
    // These scaling and position measures are decided by trial n error
    /* const gltf = await loadGLTF('../../assets/models/musicband-raccoon/scene.gltf'); */
    const gltf = await loadGLTF('../../assets/models/monstera/scene.gltf');
    /* gltf.scene.scale.set(0.1, 0.1, 0.1);  */
    gltf.scene.position.set(0, -0.4, 0);
    // Add gltf.scene to anchor 
    anchor.group.add(gltf.scene);

    // Start MindAR engine
    // Once MindAR engine's started, execute the callback function for every video frame to render AR scene
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
