import { mockWithVideo } from "./libs/camera-mock.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener("DOMContentLoaded", () => {
  const start = async() => {
    mockWithVideo("./assets/mock-videos/kp-horizontal.mp4");

    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: "./assets/targets/kp.mind",
    });
    const {renderer, cssRenderer, scene, cssScene, camera} = mindarThree;

    //  Add light to scene for better 3D effect
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);

    // Create a cube with lighting
    // MeshPhongMaterial is affected by light while MeshBasicMaterial does not
    const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const material = new THREE.MeshPhongMaterial({color: "gold"}); // 0xffd700 
    const cube = new THREE.Mesh(geometry, material);

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(cube);

    // Start MindAR engine
    await mindarThree.start();

    // Get a clock for calculating elapsed time
    const clock = new THREE.Clock();

    // Start rendering loop
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime(); // in secs
      cube.rotation.x = elapsed;
      cube.rotation.y = elapsed;
      renderer.render(scene, camera);
    });
  }; 
  start();
});