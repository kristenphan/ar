import {loadGLTF} from '../../libs/loader.js';
import {mockWithVideo} from '../../libs/camera-mock.js';
const THREE = window.MINDAR.IMAGE.THREE; // three.js is a dependency of mindar-image-three.prod.js

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    // Use mock video for testing
    mockWithVideo('../../assets/mock-videos/musicband1.mp4');
    
    // Instantiate mindarThree object which in turn auto instantiates three.js renderer, scene, camera
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body, // size of renderer canvas: full screen
      imageTargetSrc: '../../assets/targets/musicband.mind', // compiled image target
    });
    const {renderer, scene, camera} = mindarThree;

    // Add light to scene to light up models. Otherwise, models will be completely dark
    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    // Load, scale, and position model
    const gltf = await loadGLTF('../../assets/models/musicband-raccoon/scene.gltf');
    gltf.scene.scale.set(0.1, 0.1, 0.1); // exact config thru trial n error
    gltf.scene.position.set(0, -0.4, 0); // exact config thru trial n error

    // Create a MindAR anchor using an image target. Add model to anchor
    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(gltf.scene);

    // Use intrinsic animation: a model might come designed with multiple animations
    const mixer = new THREE.AnimationMixer(gltf.scene);
    const action = mixer.clipAction(gltf.animations[0]); // Use 1st animation with idx=0
    action.play();

    // Create a clock to measure elapsed time since last mixer's update
    const clock = new THREE.Clock();
    
    // Start MindAR engine and re-render model + animation for each video frame
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      // Calculate time elapsed since clock.getDelta() last called
      const delta = clock.getDelta(); 
      // Extrinsic animation: rotate model continously
      gltf.scene.rotation.set(0, gltf.scene.rotation.y + delta, 0); 
      // Intrinsic animations: param = elapsed time since last mixer's update
      mixer.update(delta); 
      // (re)render AR scene
      renderer.render(scene, camera);
    });
  }
  start();
});
