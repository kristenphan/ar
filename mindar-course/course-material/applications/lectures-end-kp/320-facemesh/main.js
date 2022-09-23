import {loadGLTF, loadTexture} from "../../libs/loader.js"; // Helper fx to load gltf and texture
const THREE = window.MINDAR.FACE.THREE; // three.js is a dependency of mindar

// Load .js after html doc has loaded
document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    // Instantiate mindarThree object which auto instantiates three.js renderer, scene, camera
    const mindarThree = new window.MINDAR.FACE.MindARThree({
      container: document.body,
    });
    const {renderer, scene, camera} = mindarThree;

    // Add light to scene to "light up" 3d models. Otherwise, models will be completely dark
    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    // .addFaceMesh() works different from .addAnchor()
    const faceMesh = mindarThree.addFaceMesh();
    const texture = await loadTexture("../../assets/facemesh/face-mask-template/Face_Mask_Template.png");
    faceMesh.material.map = texture;
    faceMesh.material.transparent = true;
    faceMesh.material.needsUpdate = true;
    scene.add(faceMesh);

    // Start mindar engine and (re)render for every video frame
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
