import {loadGLTF, loadVideo} from "../../libs/loader.js"; // helper fx to load GLTF and audio
const THREE = window.MINDAR.IMAGE.THREE; // three.js is a dependency of mindar-image-three.prod.js

// Load .js code after html doc has loaded
document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    // Instantiate mindarThree object which in turn auto instantiates three.js renderer, scene, camera
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body, // size of renderer canvas
      imageTargetSrc: '../../assets/targets/sintel.mind', // compiled image target
    });
    const {renderer, scene, camera} = mindarThree;

    // Load video and create texture from the video
    const video = await loadVideo('../../assets/videos/sintel/sintel.mp4'); // returns html <video>
    const texture = new THREE.VideoTexture(video);

    // Create a plane (1, 240/480) to make the video perfectly overlaps the plane without overflow
    // "1" means plane width = image target width
    // "240/480" bc the ratio of the video is 480x240
    const geometry = new THREE.PlaneGeometry(1, 240/480);
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.5
    });
    const plane = new THREE.Mesh(geometry, material);

    // Create a MindAR anchor using an image target idx=0 and add plane to anchor
    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(plane);

    // Play/ pause video when image target is detected/ lost
    anchor.onTargetFound = () => {
      video.play();
    };
    anchor.onTargetLost = () => {
      video.pause();
    };

    // Start playing the video from the 6th sec
    // This is because the video frame at 6th sec was captured and used as the image target
    // So playing the video from 6th sec will give an effect that the image comes to life
    video.addEventListener('play', () => {
      video.currentTime = 6;
    });

    // Start MindAR engine and update the scene for every video frame
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
