import * as THREE from './libs/three.js-r132/build/three.module.js';
// Import ARButton + CSS3DObject + CSS3DRenderer as they are not part of three.js core api
import {ARButton} from './libs/three.js-r132/examples/jsm/webxr/ARButton.js';
import {TextGeometry} from './libs/three.js-r132/examples/jsm/geometries/TextGeometry.js';
import {loadFont} from './libs/loader.js';
const textureLoader = new THREE.TextureLoader(); // not using libs/loader.js/loadTexter bc it gives error: weak map

// Load .js code after html document has loaded
document.addEventListener('DOMContentLoaded', () => {
  const initialize = async() => {
    // Instantiate three.js scene, camera, and renderer
    const scene = new THREE.Scene(); // const cssScene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
    const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true}); // const css3DRenderer = new CSS3DRenderer(); 
    

    // Make renderer full-screen
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Enable WebXR
    renderer.xr.enabled = true;
    
    // Add light to scene so that we can see the color of objects
    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    
    // Create ARButton to start/ end WebXR session
    const arButton = ARButton.createButton(renderer, {optionalFeatures: ['dom-overlay'], domOverlay: {root: document.body}});
    
    // Add renderer <canvas> and ARButton to document body
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(arButton);

    // Create a controller and add it to scene
    const controller = renderer.xr.getController(0);
    scene.add(controller);

    // Create an array of loving messages corresponding to pics
    const messages = ["ILY bc you are utterly silly", 
                  "ILY bc you asked",
                  "ILY bc you hold my hands",
                  "ILY bc you go explore with me",
                  "ILY bc you pulled me in when I crashed on your bunk bed",
                  "ILY bc you remember day 1 of our relationship",
                  "ILY bc you accept my love languages",
                  "ILY bc you teach me boundaries",
                  "ILY bc you rub stinky oil on your eyes every time but give me a massage anyway",
                  "ILY bc you cook for me. We then meditate and laugh",
                  "ILY bc you grow sweeter and more affectionate as our relationship grows",
                  "ILY bc you don't even like taking pics but send me yours anyway",
                  "ILY bc you hold my hands under the table",
                  "ILY bc you let me share big and small moments with you"];

    // Whenever user clicks on screen, place a 3d box and text at the click point. Text is rendered below box.
    controller.addEventListener('select', async() => {
      // Get a random index for retrieving images and quotes[]
      const n = 14 // no of photos = no of quotes[]
      const idx = Math.floor(Math.random() * n);
      // Create a box with image text
      const boxGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
      const boxMaterial = new THREE.MeshBasicMaterial({map: textureLoader.load(`./assets/images/${idx}.jpg`)});
      const box = new THREE.Mesh(boxGeometry, boxMaterial);
      // Position box at the controller's location
      box.position.applyMatrix4(controller.matrixWorld);
      // Rotate the box so it's facing us
      box.quaternion.setFromRotationMatrix(controller.matrixWorld);

      // Create text geometry to display a message underneath a box
      // Text and box are rendered after user taps device screen
      // THREE.DoubleSide = render both sides of text. Otherwise, text might disappear when looking at text from the back
      const message = messages[idx];
      const font = await loadFont('./assets/fonts/gentilis_regular.typeface.json'); // font.type = Font
      const textGeometry = new TextGeometry(message, {font: font, size: 0.0018, height: 0.00018});
      const textMaterial = new THREE.MeshBasicMaterial({color: "black", side: THREE.DoubleSide}); 
      const text = new THREE.Mesh(textGeometry, textMaterial);
      text.position.set(box.position["x"] - 0.025, box.position["y"] - 0.04, box.position["z"]);

      // Add box + text to scene
      scene.add(box);
      scene.add(text);
    });
    // Start renderer loop and (re)render for every video frame
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  initialize();
});