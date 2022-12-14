import * as THREE from 'three';
// Import ARButton as it is not part of three.js core api
import {ARButton} from 'https://unpkg.com/three@0.144.0/examples/jsm/webxr/ARButton.js';

// Load .js code after html document has loaded
document.addEventListener('DOMContentLoaded', () => {
  const initialize = async() => {
    // Instantiate three.js scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
    const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    // Make renderer full-screen
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Add light to scene so that we can see the color of objects
    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);
    
    // Create ARButton to start/ end WebXR session
    const arButton = ARButton.createButton(renderer, {optionalFeatures: ['dom-overlay'], domOverlay: {root: document.body}});
    // Add renderer <canvas> and ARButton to document body
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(arButton);

    // Enable WebXR
    renderer.xr.enabled = true;
    // Start renderer loop and (re)render for every video frame
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    // Create a controller and add it to scene
    const controller = renderer.xr.getController(0);
    scene.add(controller);

    // Whenever user clicks on screen, place a 3d box there
    controller.addEventListener('select', () => {
      // Create a box of random color
      const geometry = new THREE.BoxGeometry(0.06, 0.06, 0.06);
      const material = new THREE.MeshBasicMaterial({color: 0xffffff * Math.random()});
      const box = new THREE.Mesh(geometry, material);
      // Position box at the controller's location
      box.position.applyMatrix4(controller.matrixWorld);
      // Rotate the box so it's facing us
      box.quaternion.setFromRotationMatrix(controller.matrixWorld);
      // Add box to scene
      scene.add(box);
    });
  }
  initialize();
});
