import * as THREE from '../../libs/three.js-r132/build/three.module.js';

document.addEventListener('DOMContentLoaded', () => {
  const initialize = async() => {
    // Get ar-button to control WebXR session
    const arButton = document.querySelector('#ar-button');

    // Check if browser supports WebXR. If not, change arButton to "Not supported"
    // and disable arButton
    const supported = navigator.xr && await navigator.xr.isSessionSupported('immersive-ar');
    if (!supported) {
      arButton.textContent = "Not supported";
      arButton.ariaDisabled = true;
      return;
    };

    // Initialize three.js scene, camera, render
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();
    const renderer = new THREE.WebGL1Renderer({alpha: true});

    // Set rendererer <canvas> as full-screen
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    // Attach renderer to html document body 
    document.body.appendChild(renderer.domElement);

    // Create a 3d box
    const geometry = new THREE.BoxGeometry(0.06, 0.06, 0.06);
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    const mesh = new THREE.Mesh(geometry, material);
    // Set box's position and add box to scene
    mesh.position.set(0, 0, -0.3); // 0.3 meter in front of the starting position
    scene.add(mesh);

    // Add light to scene to see color of the object
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbff, 1);
    scene.add(light);

    // three.js has built-in support for webxr e.g., WebXR manager == "renderer.xr"
    // Similar to how MindAR and other AR libraries work, XR Manager helps update 
    // the pose of the "scene" and the "camera" continuously
    // so that rendered objects appear to be anchored to a physical location
    // three.js does not have tracking ability, so three.js requires WebXR to function
    // As WebXR developers, we only need to focus on building our AR "scene"
    let currentSession = null;

    // Start a WebXR session as triggered when arButton is clicked
    const start = async() => {
      // Request a WebXR session with optionalFeatures and domOverlay so that we can access
      // DOM elements, which is arButton that we need here to start/ stop an WebXR session
      currentSession = await navigator.xr.requestSession('immersive-ar', 
                                                          {optionalFeatures: ['dom-overlay'], 
                                                          domOverlay: {root: document.body}});
      renderer.xr.enabled = true; // Enable WebXR Manager
      renderer.xr.setReferenceSpaceType('local'); // "local" is the only choice for AR. most other options are for VR
      await renderer.xr.setSession(currentSession); // Set WebXR session

      // Update arButton text
      arButton.textContent = 'End';
      // Start the rendering loop
      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });
    };

    // Stop a WebXR session as triggered when arButton is clicked
    const end = async() => {
      currentSession.end();
      renderer.clear();
      renderer.setAnimationLoop(null);
      // When ending WebXR session, hide arButton
      arButton.style.display = 'none';
    };

    arButton.addEventListener('click', () => {
      if (currentSession) { // If there is a currentSession, end the session
        end();
      } else { // If there is no currentSession, start a new WebXR session
        start();
      };
    });

  }
  initialize();
});
