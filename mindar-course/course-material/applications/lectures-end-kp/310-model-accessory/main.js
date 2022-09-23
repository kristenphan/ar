// load helper fx which makes use of GTLFLoader and returns a Promise
import {loadGLTF} from "../../libs/loader.js"; 
// there.js is a dependency of mindar
const THREE = window.MINDAR.FACE.THREE; 

// Load .js code after html doc has loaded
document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    // Instantiate mindarthree object which auto instantiates renderer, scene, camera
    const mindarThree = new window.MINDAR.FACE.MindARThree({
      container: document.body,
    });
    const {renderer, scene, camera} = mindarThree;

    // Add light to scene to light up gltf model. Otherwise, model will be completely dark
    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    // Load a 3D pair of glasses
    const glasses = await loadGLTF('../../assets/models/glasses1/scene.gltf');
    glasses.scene.scale.multiplyScalar(0.01);

    // Create anchor before between the two eyes with face landmark idx=168
    const anchor = mindarThree.addAnchor(168);
    anchor.group.add(glasses.scene);

    // Start mindar engine and (re)render for every video frame
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
