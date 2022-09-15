import {loadGLTF} from '../../libs/loader.js';
import {mockWithVideo, mockWithImage} from '../../libs/camera-mock.js'; 

const THREE = window.MINDAR.IMAGE.THREE;

// Able to detect multiple markers, but only able to track one marker at a time and render a model on that marker at a time
// E.g., hold up image of raccoon first, put that image down, then hold up another image of bear
// For detecting and tracking multiple targets, see "multi-track"
document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    // Use an image as mock webcam for testing
    // Use one of these images to test at a time since there is only multi-detect and no multi-track
    // When testing multi-detect (not multi-track), use image/video with ONLY 1 marker on it, any marker, not all the markers
    // Otherwise, MindAR gets confused
    mockWithImage('../../assets/mock-videos/musicband-bear.png');
    
    // Instantiate mindarThree object which in turn auto instantiates renderer, scene, and camera
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targets/musicband-raccoon-bear.mind',
    });
    const {renderer, scene, camera} = mindarThree;

    // Add light to scene to make models "lit" instead of completely dark
    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    // Load, scale and position models
    const raccoon = await loadGLTF('../../assets/models/musicband-raccoon/scene.gltf');
    raccoon.scene.scale.set(0.1, 0.1, 0.1);
    raccoon.scene.position.set(0, -0.4, 0);

    const bear = await loadGLTF('../../assets/models/musicband-bear/scene.gltf');
    bear.scene.scale.set(0.1, 0.1, 0.1);
    bear.scene.position.set(0, -0.4, 0);

    // Create anchors: one for each image target using image target indices
    const raccoonAnchor = mindarThree.addAnchor(0);
    raccoonAnchor.group.add(raccoon.scene);
    const bearAnchor = mindarThree.addAnchor(1);
    bearAnchor.group.add(bear.scene);

    // Start MindAR engine after loading all models and re-render models for each video frame
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
