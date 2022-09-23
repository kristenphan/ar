import {loadGLTF} from "../../libs/loader.js"; // helper fx to load gltf and glb model
const THREE = window.MINDAR.FACE.THREE; // three.js is a dependency of mindar

// Load .js after html doc has loaded
document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    // Instantiate mindarThree object which auto instantiates renderer, scene, camera 
    const mindarThree = new window.MINDAR.FACE.MindARThree({
      container: document.body,
    });
    const {renderer, scene, camera} = mindarThree;

    // Add light to scene to light up 3d models. Otherwise, models will be completely dark
    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    // Load a transparent head occluder using Facebook's spark AR head occulder glb model
    // Although any 3D model with the shape of a head will work
    const occluder = await loadGLTF('../../assets/models/sparkar-occluder/headOccluder.glb');
    // not writing color to canvas which is different from setting opacity to 0. If opacity = 0, 
    // then we will see thru the visual head and the visual head won't be able to occlude the virtual glasses
    const occluderMaterial = new THREE.MeshBasicMaterial({colorWrite: false}); 
    occluder.scene.traverse((o) => { // 3d head is a hiararchy of objects, so need to traverse thru the hierarchy
      if (o.isMesh) {
	      o.material = occluderMaterial;
      }
    });

    // Scale and position the occluder
    occluder.scene.scale.multiplyScalar(0.065); // measure set thru trial-n-error
    occluder.scene.position.set(0, -0.3, 0.15); // measure set thru trial-n-error

    // The occluder object should be rendered before the glasses object model
    occluder.scene.renderOrder = 0;

    // Create an anchor which is attached to the physical head
    // using tensorflow's face landmarks detection with idx=168 (between the eyes)
    const occluderAnchor = mindarThree.addAnchor(168);
    occluderAnchor.group.add(occluder.scene);

    // Load 3d model of a pair of glasses and make the glasses
    // rendered second (renderOrder=1) after the virtual head occluder (renderOrder=0)
    const glasses = await loadGLTF('../../assets/models/glasses1/scene.gltf');
    glasses.scene.renderOrder = 1;
    glasses.scene.scale.set(0.01, 0.01, 0.01);

    // Create an anchor attached to the dot betweeen eyes idx=168
    const anchor = mindarThree.addAnchor(168);
    anchor.group.add(glasses.scene);

    // Start mindar engine and (re)render for every video frame
    // Note that the occluder is not perfect for several reasons
    // 1) virtual head occluder does not have the exact shape of physical human head
    // 2) virtual head occluder does not have the exact size of physical human head (occluder.scene.scale)
    // 3) virtual head occluder is not placed exactly on the physical human head 
    // as we choose an arbitary anchor for virtual head with idx=168 and occluder.scene.position
    // Commercial face tracking engine might be able to construct a virtual head from detected
    // physical head for more accurate occlusion effect
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
