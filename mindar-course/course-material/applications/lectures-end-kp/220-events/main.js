import {loadGLTF} from "../../libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    // Instantiate mindarThree object with the compiled image(s) target
    // mindarThree will auto instantiate renderer, screne, camera
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targets/musicband.mind',
    });
    const {renderer, scene, camera} = mindarThree;

    // Add light to scene to light up model; otherwise, model will be completely dark
    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    // Load, scale, and position model
    const raccoon = await loadGLTF('../../assets/models/musicband-raccoon/scene.gltf');
    raccoon.scene.scale.set(0.1, 0.1, 0.1);
    raccoon.scene.position.set(0, -0.4, 0);

    // Add model to anchor
    // All models associated with an anchor will inherit anchor's position and orientation
    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(raccoon.scene);

    // Add event handlers using onTargetFound() and onTargetLost() exposed by MindAR
    anchor.onTargetFound = () => {
      console.log('found target');
    };
    anchor.onTargetLost = () => {
      console.log('lost target');
    };

    // Start MindAR engine and re-render model for each video frame
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
