import {mockWithVideo} from '../libs/camera-mock.js';
import { loadGLTF,loadTexture } from "../libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    mockWithVideo("../assets/mock-videos/kp-horizontal.mp4");

    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: "../assets/targets/kp.mind",
    });
    const {renderer, scene, camera} = mindarThree;
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    // Create a round shape
    let x = 1; let y = 1; let width = 50; let height = 50; let radius = 20        
    let shape = new THREE.Shape();
    shape.moveTo( x, y + radius );
    shape.lineTo( x, y + height - radius );
    shape.quadraticCurveTo( x, y + height, x + radius, y + height );
    shape.lineTo( x + width - radius, y + height );
    shape.quadraticCurveTo( x + width, y + height, x + width, y + height - radius );
    shape.lineTo( x + width, y + radius );
    shape.quadraticCurveTo( x + width, y, x + width - radius, y );
    shape.lineTo( x + radius, y );
    shape.quadraticCurveTo( x, y, x, y + radius );

    // Creat a round button from round shape
    const geometry = new THREE.ShapeBufferGeometry(shape);
    const material = new THREE.MeshBasicMaterial({color: 0x00ffff});
    const button = new THREE.Mesh(geometry, material);
    /* console.log(button.type) */ // console: MESH

    // Load gltf
    const gltf = await loadGLTF("../assets/models/musicband-raccoon/scene.gltf");
    gltf.scene.scale.set(0.1, 0.1, 0.1); 
    gltf.scene.position.set(0, -0.4, 0);

    // Creat a MindAR anchor and add button to anchor
    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(button);
    anchor.group.add(gltf.scene);

    // Start MindAR engine
    await mindarThree.start();

    // Start rendering loop
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  };
  start()
});
