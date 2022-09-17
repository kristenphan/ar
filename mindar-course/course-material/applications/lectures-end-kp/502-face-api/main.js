import * as faceapi from '../../libs/faceapi/face-api.esm.js';
import {loadTexture} from '../../libs/loader.js';
const THREE = window.MINDAR.FACE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    // Load face api mode and build required assets
    // https://justadudewhohacks.github.io/face-api.js/docs/index.html
    const optionsTinyFace = new faceapi.TinyFaceDetectorOptions({
        inputSize: 128, 
        scoreThreshold: 0.3,
    });
    const modelPath = '../../libs/faceapi/model';
    await faceapi.nets.tinyFaceDetector.load(modelPath);
    await faceapi.nets.faceLandmark68Net.load(modelPath);
    await faceapi.nets.faceExpressionNet.load(modelPath);

    // Initialize MindAR 
    const mindarThree = new window.MINDAR.FACE.MindARThree({
      container: document.body
    });
    const {renderer, scene, camera} = mindarThree;

    // Load emojis as textures to be used for creating planes of emoji 2d images
    const textures = {}
    textures['happy'] = await loadTexture('../../assets/openmoji/1F600.png');
    textures['angry'] = await loadTexture('../../assets/openmoji/1F621.png');
    textures['sad'] = await loadTexture('../../assets/openmoji/1F625.png');
    textures['neutral'] = await loadTexture('../../assets/openmoji/1F610.png');

    // Create planes to contain emoji 2d image with the default being neutral emoji
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({map: textures['neutral']});
    const plane = new THREE.Mesh(geometry, material);

    // Create MindAR face tracking anchor to track forehead with idx=151
    const anchor = mindarThree.addAnchor(151);
    // Add plane containing emoji 2d image to forehead tracking anchor
    anchor.group.add(plane);

    // start AR
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    // Get camera stream
    const cameraStream = mindarThree.video;
    
    // Create a list of expressions and set the default expression as neutral
    const expressions = ['happy', 'angry', 'sad', 'neutral'];
    let lastExpression = 'neutral';

    // Create detect() to detect face expressions using faceapi
    const detect = async () => {
      const results = await faceapi.detectSingleFace(cameraStream, optionsTinyFace)
                                    .withFaceLandmarks()
                                    .withFaceExpressions();
      // Assign the first detected expression with confidence > 0.5 to newExpression
      if (results && results.expressions) {
        let newExpression = 'neutral';
        for (let i = 0; i < expressions.length; i++) {
          if (results.expressions[expressions[i]] > 0.5) {
            newExpression = expressions[i];
          };
        };
        // Update the emoji rendered on the plane
        if (newExpression !== lastExpression) {
          material.map = textures[newExpression];
          material.needsUpdates = true;
        };
      };
      // Recursively call detect()
      window.requestAnimationFrame(detect);
    };

    // Pass detect() to requestAnimationFrame()
    window.requestAnimationFrame(detect);
  }
  start();
});
