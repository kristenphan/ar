import {mockWithVideo} from '../../libs/camera-mock.js';

const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    // Use mock video for testing
    mockWithVideo('../../assets/mock-videos/course-banner1.mp4');

    // Instantiate mindarThree object using the compiled image target .mind
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      // Instead of using container: document.body, 
      // making the whole document as AR container, contain AR window to div 
      container: document.querySelector('#my-ar-container'),
      imageTargetSrc: '../../assets/targets/course-banner.mind',
    });
    // mindarThree object auto instantiates renderer, scene, camera
    const {renderer, scene, camera} = mindarThree;

    // Create a plane and add it to MindAR anchor (THREE.GROUP) of a image target
    // All objects added to this anchor will be (re)rendered according the image target's position and orientation
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.5});
    const plane = new THREE.Mesh(geometry, material);
    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(plane);

    // Once MindAR engine has started, execute the callback fx inside .setAnimationLoop() for every video frame
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
