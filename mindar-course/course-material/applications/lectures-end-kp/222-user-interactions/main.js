import {loadGLTF, loadAudio} from "../../libs/loader.js";
import { mockWithVideo } from "../../libs/camera-mock.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    // Use mock video for testing
    mockWithVideo('../../assets/mock-videos/musicband1.mp4');

    // Instantiate mindarThree object with the compiled image(s) target
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targets/musicband.mind',
    });
    // mindarThree auto instantiates renderer, scene, camera
    const {renderer, scene, camera} = mindarThree;

    // Add light to camera to light up models. Otherwise, models will be completely dark
    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    // Load, scale, and position model
    const raccoon = await loadGLTF('../../assets/models/musicband-raccoon/scene.gltf');
    raccoon.scene.scale.set(0.1, 0.1, 0.1);
    raccoon.scene.position.set(0, -0.4, 0);
    // Add a flag inside model's userData for any model that we want to
    // capture a click event
    raccoon.scene.userData.clickable = true;

    // Add an anchor by referencing an image target in .mind by idx
    const anchor = mindarThree.addAnchor(0);
    // Add model to anchor. All models associated with an anchor will be rendered
    // according to anchor's position and orientation
    anchor.group.add(raccoon.scene);

    // Add a listener (ie. virtual ears) to camera [to create positional sound effect?]
    const listener = new THREE.AudioListener();
    camera.add(listener);

    // Load audioClip and assign it to audio buffer
    const audioClip = await loadAudio('../../assets/sounds/musicband-drum-set.mp3');
    const audio = new THREE.Audio(listener);
    audio.setBuffer(audioClip);

    // Add click event listener on <canvas> container
    // click event callback contains the x- and y-coordinate of the click location 
    // as in e.clientX and e.clientY
    // e.clientX value ranges from [0, container width]
    // e.clientY value ranges from [0, container height]
    // container witdh = window.innerWidth bc container = document.body; similar for container height
    // Need to normalize e.clientX and e.clientY i.e., value between [-1, 1]
    // Need to revert y-coord bc in DOM, y-axis goes from top to bottom 
    // while y-axis in canvas goes from bottom to top 
    document.body.addEventListener('click', (e) => {
      // Calculate and normalize x- and y-coord of a click event
      const mouseX = (e.clientX / window.innerWidth) *2 - 1;
      const mouseY = -1 * ((e.clientY / window.innerHeight) *2 - 1); // Revert y-coord
      const mouse = new THREE.Vector2(mouseX, mouseY);
      // After getting x- and y-coord of click event, check if the click was performed on
      // an object of interest using RayCasting
      // Raycasting = a virtual ray from camera to click event coords and check if this ray
      // intersects with an object of interest
      const raycaster = new THREE.Raycaster();
      // This Raycaster object needs the mouse position to be normalized 
      // That's why need to normalize mouseX, mouseY
      raycaster.setFromCamera(mouse, camera);
      // 1st param = list of objects of interest
      // 2nd param: whether to recursively check for all descendant objects
      // Scene is organized as a hierarchy of objects
      // E.g., there's a 3D object in a scene. this 3D object then contains smaller objects
      // intersects = list of all objects along the hierarchy that the raycaster hits
      const intersects = raycaster.intersectObjects(scene.children, true);
      console.log('intersects.length = ', intersects.length);

      // intersects = sorted by distance from camera; the closest object = intersect[0].object
      // if intersects includes an object of interest ie. object was clicked, play audio
      if (intersects.length > 0) {
        let o = intersects[0].object;
        // Since o might be a descendant object of the object of interest, raccoon,
        // need to recursively go up the hierarchy through the parent 
        // and check if any of the parent object = raccoon
        while (o.parent && !o.userData.clickable) { // Recursively go up if o has a parent && not clickable
          o = o.parent;
        }
        // Doublecheck if a clickable object has been reached
        if (o.userData.clickable) {
          // Check which model was clicked
          if (o === raccoon.scene) {
            audio.play();
          };
        };
      };
    });

    // Start MindAR engine and re-render objects + audio based on target image's position + orientation
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
