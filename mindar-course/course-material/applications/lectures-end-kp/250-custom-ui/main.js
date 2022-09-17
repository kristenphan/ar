import {mockWithImage} from '../../libs/camera-mock.js';
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    // Use mock image for testing
    mockWithImage('../../assets/mock-videos/musicband-raccoon.png');

    // Instantiate mindarThree object with the compiled image(s) target
    // Customize ui: uiScanning, uiLoading
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.querySelector("#container"),
      imageTargetSrc: '../../assets/targets/musicband.mind',
      uiScanning: "#scanning",
      uiLoading: "no"
    });
    const {renderer, scene, camera} = mindarThree;

    // Create a plane and add it to an anchor
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.5});
    const plane = new THREE.Mesh(geometry, material);
    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(plane);

    // Start MindAR engine and (re)render AR contents for every video frame
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
