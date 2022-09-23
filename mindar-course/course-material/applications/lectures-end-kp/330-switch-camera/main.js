const THREE = window.MINDAR.FACE.THREE; // three.js is a dependency of mindar

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    // Instantiate mindarThree object which auto instantiates three.js renderer, scene, camera
    const mindarThree = new window.MINDAR.FACE.MindARThree({
      container: document.body,
    });
    const {renderer, scene, camera} = mindarThree;

    // Create a 3d sphere
    const geometry = new THREE.SphereGeometry( 0.1, 32, 16 );
    const material = new THREE.MeshBasicMaterial( {color: 0x00ffff, transparent: true, opacity: 0.5} );
    const sphere = new THREE.Mesh( geometry, material );

    // Create an anchor for physical human nose tip with face landmark idx=1
    // mindar face tracking engine is built on top of tensorflow's face landmarks detection model
    // all face landmark indices can be found at:
    // https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection
    const anchor = mindarThree.addAnchor(1);

    // Render a 3d sphere on top of human nose tip
    anchor.group.add(sphere);

    // If button is clicked, switch camera 
    document.querySelector("#switch").addEventListener("click", () => {
      mindarThree.switchCamera();
    });

    // Start mindar engine and (re)render for every video frame
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
