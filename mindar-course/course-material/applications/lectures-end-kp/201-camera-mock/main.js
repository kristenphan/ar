const THREE = window.MINDAR.IMAGE.THREE;
import {mockWithVideo, mockWithImage} from '../../libs/camera-mock.js';

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    // Create a mock webcam instead of starting the webcam for testing 
    mockWithVideo('../../assets/mock-videos/course-banner1.mp4');

    // Create a mock image for testing 
    // Use either mockWithVideo or mockWithImage. Not both
    // mockWithImage('../../assets/mock-videos/course-banner1.png');

    // Start MindAR engine and render a blue, semi-transparent plane on image target
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targets/course-banner.mind',
    });
    const {renderer, scene, camera} = mindarThree;

    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.5});
    const plane = new THREE.Mesh(geometry, material);

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(plane);
    
    await mindarThree.start(); // Start mindAR engine
    renderer.setAnimationLoop(() => { // Once mindAR engine's started, this callback fx will be executed for every video frame
      renderer.render(scene, camera);
    });
  }
  start();
});
