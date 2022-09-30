import * as THREE from './libs/three.js-r132/build/three.module.js';
const loader = new THREE.TextureLoader(); // not using libs/loader.js/loadTexter bc it gives error: weak map
// Import ARButton + CSS3DObject + CSS3DRenderer as they are not part of three.js core api
import {ARButton} from './libs/three.js-r132/examples/jsm/webxr/ARButton.js';
import {CSS3DObject, CSS3DRenderer} from './libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js';

// Load .js code after html document has loaded
document.addEventListener('DOMContentLoaded', () => {
  const initialize = async() => {
    // Instantiate three.js scene, camera, and renderer
    const scene = new THREE.Scene();
    const cssScene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
    const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    const css3DRenderer = new CSS3DRenderer();
    /* console.log("renderer.type: ", renderer.type); // undefined
    console.log("cssRenderer.type: ", css3DRenderer.type); // undefined */

    // Make renderer full-screen
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Add light to scene so that we can see the color of objects
    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    /* const light = new THREE.DirectionalLight(0xFFFFFF, 1);
    light.position.set(-1, 2, 4);
    scene.add(light); */
    
    // Create ARButton to start/ end WebXR session
    const arButton = ARButton.createButton(renderer, {optionalFeatures: ['dom-overlay'], domOverlay: {root: document.body}});
    // Add renderer <canvas> and ARButton to document body
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(css3DRenderer.domElement);
    document.body.appendChild(arButton);

    // Enable WebXR
    renderer.xr.enabled = true;
    // Start renderer loop and (re)render for every video frame
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
      css3DRenderer.render(cssScene, camera);
    });

    // Create a controller and add it to scene
    const controller = renderer.xr.getController(0);
    scene.add(controller);

    // Create an array of loving messages corresponding to pics
    const quotes = ["I❤Y bc you are utterly silly", 
                  "I❤Y bc you asked",
                  "I❤Y bc you hold my hands",
                  "I❤Y bc you go explore with me",
                  "I❤Y bc you pulled me in when I crashed on your bunk bed",
                  "I❤Y bc you remember day 1 of our relationship",
                  "I❤Y bc you accept my love languages",
                  "I❤Y bc you teach me boundaries",
                  "I❤Y bc you rub stinky oil on your eyes every time but give me a massage anyway",
                  "I❤Y bc you cook for me. We then meditate and laugh",
                  "I❤Y bc you grow sweeter and more affectionate as our relationship grows",
                  "I❤Y bc you don't even like taking pics but send me yours anyway",
                  "I❤Y bc you hold my hands under the table",
                  "I❤Y bc you let me share big and small moments with you"];

    // Whenever user clicks on screen, place a 3d box there
    controller.addEventListener('select', async() => {
      // Get a random index for retrieving images and quotes[]
      const n = 14 // no of photos = no of quotes[]
      const idx = Math.floor(Math.random() * n);
      // Create a box of random color
      const geometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
      const material = new THREE.MeshBasicMaterial({map: loader.load(`./assets/images/${idx}.jpg`)});
      const box = new THREE.Mesh(geometry, material);
      // Position box at the controller's location
      box.position.applyMatrix4(controller.matrixWorld);
      // Rotate the box so it's facing us
      box.quaternion.setFromRotationMatrix(controller.matrixWorld);

      // Create a CSS3DObject from <div> to display quote retrieved by randomized index
      const quoteDiv = document.createElement("div");
      quoteDiv.innerHTML = quotes[idx];
      quoteDiv.style.background = "#FFFFFF";
      quoteDiv.style.padding = "30px";
      quoteDiv.style.fontSize = "600px";
      const quoteCSS3DObj = new CSS3DObject(quoteDiv); // quoteCSS3DObj.type = Object3D
      box.add(quoteCSS3DObj); // box.children = CSS3DObject
      quoteCSS3DObj.position.set(0, 0.06, 0);
      /* console.log("box.position = ", box.position);
      console.log("quoteCSS3DObject.position = ", quoteCSS3DObj.position); // show local space */     

      // Add box to scene. Add quoteCSS3DObj to cssScene
      scene.add(box);
      cssScene.add(quoteCSS3DObj);
    });
  }
  initialize();
});
