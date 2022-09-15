import {loadGLTF, loadAudio} from "../../libs/loader.js";
import { mockWithVideo } from "../../libs/camera-mock.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    // Use a mock video for testing
    mockWithVideo('../../assets/mock-videos/musicband1.mp4');

    // Instantiate mindarThree object with the compiled image(s) target
    // mindarThree auto instantiates renderer, scene, camera
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targets/musicband.mind',
    });
    const {renderer, scene, camera} = mindarThree;
    // Add light to scene to light up models. Otherwise, models will be completely dark
    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    // Load, scale, and position model
    const raccoon = await loadGLTF('../../assets/models/musicband-raccoon/scene.gltf');
    raccoon.scene.scale.set(0.1, 0.1, 0.1);
    raccoon.scene.position.set(0, -0.4, 0);
    // Create an anchor and add model to anchor
    // All models associated with an anchor will be rendered 
    // according to the anchor's position and orientation
    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(raccoon.scene);

    // Load audio using loader.js>loadAudio()
    // which makes use of three.js' audioLoader and returns a Promise
    const audioClip = await loadAudio('../../assets/sounds/musicband-background.mp3');

    // Create a listener to create positional audio effect:
    // when marker is close, audio sounds louser
    const listener = new THREE.AudioListener();
    const audio = new THREE.PositionalAudio(listener);
    // Add listener to camera:
    // camera captures the position of the marker, so when adding listener 
    // i.e., our ears to the camera, we can create positional sound effect
    camera.add(listener);
    // Add audio to anchor
    anchor.group.add(audio);

    // Set reference distance to instruct three.js 
    // to start diminishing the volume at this distance
    // This distance has a different scale from the physical world.
    // General rule of thumb, put 100.
    // But better to experiment with differnet reference distance value
    audio.setRefDistance(100);
    
    // Play audio when target is found. Pause audio when target is lost
    anchor.onTargetFound = () => {
      audio.play();
    };
    anchor.onTargetLost = () => {
      audio.play();
    };

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
