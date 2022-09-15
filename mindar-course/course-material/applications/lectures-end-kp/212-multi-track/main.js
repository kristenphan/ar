import {loadGLTF} from "../../libs/loader.js";
import {mockWithImage, mockWithVideo} from '../../libs/camera-mock.js';
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    // Test using either mock image or mock video
    /* mockWithImage('../../assets/mock-videos/musicband-raccoon-bear.png'); */
    mockWithVideo('../../assets/mock-videos/musicband2.mp4');

    // Instantiate mindarThree object which in turn auto instantiates renderer, scene, camera
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targets/musicband.mind',
      maxTrack: 2,
    });
    const {renderer, scene, camera} = mindarThree;

    // Add light to scene to light up models; otherwise, models will be completely dark
    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    // Load, scale, and position models
    const raccoon = await loadGLTF("../../assets/models/musicband-raccoon/scene.gltf");
    raccoon.scene.scale.set(0.1, 0.1, 0.1);
    raccoon.scene.position.set(0, -0.4, 0);

    const bear = await loadGLTF("../../assets/models/musicband-bear/scene.gltf");
    bear.scene.scale.set(0.1, 0.1, 0.1);
    bear.scene.position.set(0, -0.4, 0);

    // Add models to their respective anchors
    const raccoonAnchor = mindarThree.addAnchor(0);
    raccoonAnchor.group.add(raccoon.scene);

    const bearAnchor = mindarThree.addAnchor(1);
    bearAnchor.group.add(bear.scene);

    // Start MindAR engine and re-render models for each video frame
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
