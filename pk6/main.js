import * as THREE from './libs/three.js-r132/build/three.module.js';
// Import ARButton + CSS3DObject + CSS3DRenderer as they are not part of three.js core api
import {ARButton} from './libs/three.js-r132/examples/jsm/webxr/ARButton.js';
import {CSS3DObject, CSS3DRenderer} from './libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js';
import {TextGeometry} from './libs/three.js-r132/examples/jsm/geometries/TextGeometry.js';
import {FontLoader, Font} from './libs/three.js-r132/examples/jsm/loaders/FontLoader.js';
import {loadFont} from './libs/loader.js';
const textureLoader = new THREE.TextureLoader(); // not using libs/loader.js/loadTexter bc it gives error: weak map

// Load .js code after html document has loaded
document.addEventListener('DOMContentLoaded', () => {
  const initialize = async() => {
    // Instantiate three.js scene, camera, and renderer
    const scene = new THREE.Scene(); // cssScene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
    const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true}); // renderer.type/cssRenderer.type = undefined 
    // new css3DRenderer = new CSS3DRenderer();

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
    const quotes = ["I❤U bc you are utterly silly", 
                  "I❤U bc you asked",
                  "I❤U bc you hold my hands",
                  "I❤U bc you go explore with me",
                  "I❤U bc you pulled me in when I crashed on your bunk bed",
                  "I❤U bc you remember day 1 of our relationship",
                  "I❤U bc you accept my love languages",
                  "I❤U bc you teach me boundaries",
                  "I❤U bc you rub stinky oil on your eyes every time but give me a massage anyway",
                  "I❤U bc you cook for me. We then meditate and laugh",
                  "I❤U bc you grow sweeter and more affectionate as our relationship grows",
                  "I❤U bc you don't even like taking pics but send me yours anyway",
                  "I❤U bc you hold my hands under the table",
                  "I❤U bc you let me share big and small moments with you"];

    // Whenever user clicks on screen, place a 3d box there
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

      // POSTPONE USING CSS3DOBJECT SINCE IDK HOW TO ENABLE WEBXR FOR CSS3DRENDERER
      // NEED TO RELY ONLY ON RENDERER FOR NOW BY USING TEXTGEOMETRY
      // Create a CSS3DObject from <div> to display quote retrieved by randomized index
      /* const quoteDiv = document.createElement("div");
      quoteDiv.innerHTML = quotes[idx];
      quoteDiv.style.background = "#FFFFFF";
      quoteDiv.style.padding = "30px";
      quoteDiv.style.fontSize = "60px"; 
      const quoteCSS3DObj = new CSS3DObject(quoteDiv); // quoteCSS3DObj.type = Object3D
      const {x, y, z} = box.position;
      quoteCSS3DObj.position.set(x, y + 1, z); 
      console.log('box.position = ', box.position);
      console.log('quoteCSS3DObj.position = ', quoteCSS3DObj.position); 
      cssScene.add(quoteCSS3DObj);*/

      // Create text geometry
      // Added libs/loader.js/loadFont();
      const quote = quotes[idx];
      const font = await loadFont('./assets/fonts/gentilis_regular.typeface.json'); // font.type = Font
      const textGeometry = new TextGeometry(quote, {font: font, size: 0.005, height: 0.0005});
      const textMaterial = new THREE.MeshBasicMaterial({color: "red", side: THREE.DoubleSide});
      const text = new THREE.Mesh(textGeometry, textMaterial);
      text.position.set(box.position["x"], box.position["y"] - 0.04, box.position["z"]);

      const cubeGeometry = new THREE.BoxGeometry(0.01, 0.01, 0.01);
      const cubeMaterial = new THREE.MeshBasicMaterial({color: "gold", transparent: true, opacity: 0.2});
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.set(text.position["x"], text.position["y"], text.position["z"]);

      console.log("box.position = ", box.position);
      console.log("text.position = ", text.position);
      console.log("cube.position = ", cube.position);

      // Make quote lookAt(camera)

      // Add to scene
      scene.add(box);
      scene.add(text);
      scene.add(cube);
    });
    // Start renderer loop and (re)render for every video frame
    renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
    });
  }
  initialize();
});
