import {loadGLTF} from '../../libs/loader.js';
import {mockWithVideo} from '../../libs/camera-mock.js';
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  // Use mock video for testing
  mockWithVideo('../../assets/mock-videos/musicband1.mp4');

  const start = async() => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targets/musicband.mind',
    });
    const {renderer, scene, camera} = mindarThree;

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    const gltf = await loadGLTF('../../assets/models/musicband-raccoon/scene.gltf');
    gltf.scene.scale.set(0.1, 0.1, 0.1);
    gltf.scene.position.set(0, -0.4, 0);

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(gltf.scene);

    // Use intrinsic animation
    // A model can contain different animations
    const mixer = new THREE.AnimationMixer(gltf.scene);
    const action = mixer.clipAction(gltf.animations[0]); // Use the 1st animation with idx=0
    action.play()

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
      renderer.render(scene, camera);
    });
  }
  start();
});
