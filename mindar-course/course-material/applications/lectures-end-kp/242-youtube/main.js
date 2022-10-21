// Explicitly import CSS3DObject as it's not part of three.js core api
import { CSS3DObject } from '../../libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js';
import { mockWithImage, mockWithVideo } from '../../libs/camera-mock.js'; // helper fx to mock webcam
const THREE = window.MINDAR.IMAGE.THREE; // three.js is a dependency of mindar-image-three.prod.js

// Create createYoutube() using YT iframe api
// https://developers.google.com/youtube/iframe_api_reference
const createYoutube = () => {
  return new Promise((resolve, reject) => {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    const onYouTubeIframeAPIReady = () => {
      const player = new YT.Player('player', {
        videoId: '0CvjNNCv5_s',
        events: {
          onReady: () => {
            resolve(player);
          }
	      }
      });
    }
    window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
  });
}

// Load js code after html document has loaded
document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    // Use mock image for testing
    /* mockWithImage('../../assets/mock-videos/course-banner2.png'); // works */
    mockWithVideo('../../assets/mock-videos/course-banner1.mp4'); // does not work by clicking on video

    // Create a player 
    const player = await createYoutube();

    // Instantiate mindarThree object which in turn auto instantiates three.js renderer, cssRender, cssScene, camera
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body, // size of renderer <canvas>
      imageTargetSrc: '../../assets/targets/course-banner.mind', // compiled image target
    });
    const {renderer, cssRenderer, cssScene, camera} = mindarThree;

    // Create a css object: <div id="ar-div"> with an embeded <div id="player"> as required by
    // https://developers.google.com/youtube/iframe_api_reference
    const obj = new CSS3DObject(document.querySelector("#ar-div"));
    const cssAnchor = mindarThree.addCSSAnchor(0);
    cssAnchor.group.add(obj);

    /* // Play YT video when image target is detected. Pause when image target is lost
    // Because we're using the YT iframe api instead of html <iframe>, can only programtically start video using player.playVideo()
    cssAnchor.onTargetFound = () => {
      player.playVideo();
    }
    cssAnchor.onTargetLost = () => {
      player.pauseVideo();
    } */

    // TESTING: use raycasting to check if user clicks on the video. if yes, play video
    document.body.addEventListener('click', (e) => {
      // Calculate and normalize x- and y-coord of a click event
      const mouseX = (e.clientX / window.innerWidth) *2 - 1;
      const mouseY = -1 * ((e.clientY / window.innerHeight) *2 - 1); // Revert y-coord
      const mouse = new THREE.Vector2(mouseX, mouseY);
      console.log("mouse = ", mouse);
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(cssScene.children, true);
      console.log("intersects.length = ", intersects.length);
    });

    // Start MindAR engine and (re)render AR objects for every video frame
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      cssRenderer.render(cssScene, camera);
    });
  }
  start();
});
