import * as THREE from '../../libs/three.js-r132/build/three.module.js';
import {ARButton} from '../../libs/three.js-r132/examples/jsm/webxr/ARButton.js';

// Load .js code after html doc has loaded
document.addEventListener('DOMContentLoaded', () => {
  const initialize = async() => {
    // Initialize three.js scene and camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();
    // Add light to scene to light up models. Otherwise, models will be completely dark
    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1);
    scene.add(light);

    // Create a reticle ring to highlight the physical spot where there has been a hit from hit test
    // Rotate ring by 90 degree (- Math.PI/2)
    const reticleGeometry = new THREE.RingGeometry( 0.08, 0.1, 32 ).rotateX(- Math.PI / 2);
    const reticleMaterial = new THREE.MeshBasicMaterial();
    const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
    // Do not auto update the location of reticle because reticle location will be the position 
    // of the detected hit point?
    // Add reticle to scene
    reticle.matrixAutoUpdate = false; 
    reticle.visible = false; // Invisible at the beginning
    scene.add(reticle);

    // Initialize a three.js rendender which is a html <canvas>
    const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight); // full screen mode
    // Enable WebXR
    renderer.xr.enabled = true;

    const arButton = ARButton.createButton(renderer, {requiredFeatures: ['hit-test'], optionalFeatures: ['dom-overlay'], domOverlay: {root: document.body}});
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(arButton);
    
    // controller for web AR on mobile device without additional AR hardware idx=0 is the device's touch screen
    // When touch screen is tapped, render a box at the location of the reticle
    const controller = renderer.xr.getController(0);
    scene.add(controller);
    controller.addEventListener('select', () => {
      const geometry = new THREE.BoxGeometry(0.06, 0.06, 0.06);
      const material = new THREE.MeshBasicMaterial({color: 0xffffff * Math.random()});
      const box = new THREE.Mesh(geometry, material);
      box.position.setFromMatrixPosition(reticle.matrix);
      box.scale.y = Math.random() * 2 + 1;
      scene.add(box);
    });

    // When hit test returns a hit point, render a reticle at the point's location to indicate hit found
    // When user sees the reticle, user taps the touch screen, which triggers a 'select' event 
    // for touch screen controller .getController(0) and a box is rendered at the reticle's location
    renderer.xr.addEventListener('sessionstart', async(e) => {
      // Get current session
      const session = renderer.xr.getSession();
      
      // Viewer space is position of mobile device, which is where we will fire a virtual ray to physical world for hit test
      // 'local' space is the starting point
      // When WexXR session first starts, viewer space == local space
      const viewerReferenceSpace = await session.requestReferenceSpace('viewer');
      const hitTestSource = await session.requestHitTestSource({space: viewerReferenceSpace});

      // timestamp = time when this callback fx is called
      // frame = contains all info about the physical envi at timestamp
      renderer.setAnimationLoop((timestamp, frame) => {
        // If frame is not ready, return
        if (!frame) {console.log('frame not ready'); return} else { console.log('frame ready')}; 
        // Otherwise, get hit test results[]
        const hitTestResults = frame.getHitTestResults(hitTestSource);
        if (hitTestResults.length > 0) {
          console.log('hit found');
          // Obtain the first hit
          const hit = hitTestResults[0];
          // Get local reference space
          const referenceSpace = renderer.xr.getReferenceSpace();
          // Get pose relative to the referenceSpace
          const hitPose = hit.getPose(referenceSpace);
          // Set reticle position according to hitPose
          reticle.visible = true; // Visible when there's a hit
          reticle.matrix.fromArray(hitPose.transform.matrix);
        } else {
          reticle.visible = false;
          console.log('no hit');
        };
        renderer.render(scene, camera);
      });
    });

    renderer.xr.addEventListener('sessionend', async() => {
      console.log('session end');
    });
  }

  initialize();
});
