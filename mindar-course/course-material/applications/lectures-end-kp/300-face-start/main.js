const THREE = window.MINDAR.FACE.THREE; // three.js is a dependency of mindar

// Load .js code after html doc has loaded
document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    // Instantiate a mindarThree object which auto instantiates three.js renderer, scene, camera
    const mindarThree = new window.MINDAR.FACE.MindARThree({
      container: document.body,
    });
    const {renderer, scene, camera} = mindarThree;

    // Create a 3d sphere
    const geometry = new THREE.SphereGeometry(0.1, 32, 16);
    const material = new THREE.MeshBasicMaterial({color: 0x00ffff, 
                                                  transparent: true,
                                                  opacity: 0.5});
    const sphere = new THREE.Mesh(geometry, material);

    // Create an mindar anchor for human nose tip with face landmark idx=1
    // mindar face tracking engine is built on top of tensorflow's face landmarks detection model
    // https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection
    // Indices for all face landmarks detectable using this tensorflow model can be found here:
    // https://github.com/tensorflow/tfjs-models/blob/master/face-landmarks-detection/mesh_map.jpg
    const anchor = mindarThree.addAnchor(1);

    // Add the sphere to the anchor so that sphere appears on human nose tip
    anchor.group.add(sphere);

    // Start mindar engine and (re)render for every video frame
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
