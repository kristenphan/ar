// main.js

// Import three.js AR rendering engine
import * as THREE from '../../libs/three.js-r132/build/three.module.js';
// Import three.js ARButton which is not part of three.js core api
import {ARButton} from '../../libs/three.js-r132/examples/jsm/webxr/ARButton.js';

// Load .js code after html doc has loaded
document.addEventListener('DOMContentLoaded', () => {
  const initialize = async() => {
    // Instantiate three.js scene, camera, renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();
    const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    // Set renderer as full-screen and attach renderer to document body
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // Create a 3d cube
    const geometry = new THREE.BoxGeometry(0.06, 0.06, 0.06); 
    const material = new THREE.MeshBasicMaterial({color: 0xFFFF00});
    const cube = new THREE.Mesh(geometry, material);
    // Position the cube and add it to scene
    cube.position.set(0, 0, -0.3);
    scene.add(cube);
    // Add light to scene so we can see the color on the cube
    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    // Enable WebXR
    renderer.xr.enabled = true;
    // Start rendering loop
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    // Create a variable for WebXR current session
    let currentSession = null;
    
    // Create a WebXR button from three.js to start/ end a WebXR session when arButton is clicked    
    const arButton = ARButton.createButton(renderer, {optionFeatures: ['dom-overlay'], domOverlay: {root: document.body}});
    // Attach renderer and ARButton to document body
    document.body.appendChild(arButton);
    document.body.appendChild(renderer.domElement);
  }
  initialize();
});
