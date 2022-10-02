import { CSS3DObject } from '../libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js';
import {mockWithVideo} from '../libs/camera-mock.js';
import {loadGLTF, loadTexture, loadVideo} from '../libs/loader.js';
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    // Start mock webcam for testing
    mockWithVideo("../assets/mock-videos/kp-horizontal.mp4");

    // Initialize MindAR 
    // which in turn auto instantiates three.js renderer, cssRenderer, scene, cssScene, and camera
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: "../assets/targets/kp.mind",
    });
    const {renderer, cssRenderer, scene, cssScene, camera} = mindarThree;

    // Create a plane with image target picture
    const cardTexture = await loadTexture('../assets/targets/kp.jpg'); 
    const planeGeometry = new THREE.PlaneGeometry(1, 1);
    const cardMaterial = new THREE.MeshBasicMaterial({map: cardTexture});
    const card = new THREE.Mesh(planeGeometry, cardMaterial);

    // Create and position circles with email, web, profile, and location icons
    const iconGeometry = new THREE.CircleGeometry(0.075, 32);
    const emailTexture = await loadTexture('../assets/images/email.png');
    const emailMaterial = new THREE.MeshBasicMaterial({map: emailTexture});
    const emailIcon = new THREE.Mesh(iconGeometry, emailMaterial); // // WORKS ONLY WITH iconGeometry
    emailIcon.position.set(0.14, -0.5, 0);

    // Create and position circles with left and right icon (i.e. back/ next button)
    // NOT SURE WHY A CIRCLEGEOMETRY WORKS WITH SQUARE PIC OF LEFT/ RIGHT ARROW
    const leftTexture = await loadTexture('../assets/images/left.png');
    const leftMaterial = new THREE.MeshBasicMaterial({map: leftTexture});
    const leftIcon = new THREE.Mesh(planeGeometry, leftMaterial); // WORKS WITH BOTH iconGeometry + planeGeometry
    leftIcon.position.set(-0.7, 0, 0);


    // Create a MindAR anchor using an image target of idx=0 and add 3D objects to anchor
    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(card);
    anchor.group.add(emailIcon);
    anchor.group.add(leftIcon);
    
    // Start MindAR engine
    await mindarThree.start();

    // Start rendering loop
    renderer.setAnimationLoop(() => {
      // (Re)render scene and cssScene for every available video frame
      renderer.render(scene, camera);
    });
  }
  start();
});
