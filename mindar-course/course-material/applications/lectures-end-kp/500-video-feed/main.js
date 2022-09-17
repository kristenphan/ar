import {mockWithImage, mockWithVideo} from '../../libs/camera-mock.js';
const THREE = window.MINDAR.IMAGE.THREE;

// Load .js code after html document is loaded
// If a hand is detected, show a red plane. If not, show a blue plane
document.addEventListener('DOMContentLoaded', () => {
  // Use mock video for testing
  mockWithVideo('../../assets/mock-videos/course-banner2.mp4');

  // Create start() to start AR using MindAR engine
  const start = async() => {
    // Instantiate mindarThree object with the compiled image target .mind
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targets/course-banner.mind',
    });
    // mindarThree auto instantiates three.js renderer, scene, camera
    const {renderer, scene, camera} = mindarThree;

    // Create planes: plane = blue; plane2 = red
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.5});
    const plane = new THREE.Mesh(geometry, material);
    const material2 = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.5});
    const plane2 = new THREE.Mesh(geometry, material2);
    // Set plane2 invisible at first
    plane2.visible = false;

    // Create a MindAR anchor using 1st image target with idx=0
    const anchor = mindarThree.addAnchor(0);
    // Add planes to anchor
    anchor.group.add(plane);
    anchor.group.add(plane2);

    // Set up tensorflow.js hand pose model
    // Hand pose model requires the camera feed to run and detect hands
    const model = await handpose.load();

    // Start MindAR engine
    // (Re)render AR contents for every video frame using render loop
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
    // Get camera feed and later pass cameraFeed to model.estimateHands() to detect hands
    const cameraFeed = mindarThree.video;
        
    // Since model.estimateHands(cameraFeed) in detect() is computationally expensive, 
    // reduce number of estimateHands() using skipCount
    // Instead of calling estimateHands() every frame, call every #skipCount frames
    let skipCount = 0; 

    // Create detect() to recursively call window.requestAnimationFrame(detect)
    const detect = async () => {
      // estimateHands() every 10 frames
      if (skipCount < 10) { 
        skipCount += 1;
        window.requestAnimationFrame(detect);
	      return;
      }
      skipCount = 0;
      // Hand pose model can detect multiple hands by processing camera feed
      const predictions = await model.estimateHands(cameraFeed); 
      // Check if hand(s) have been detected
      const detected = predictions.length > 0;
      // If hand(s) is detected, make plane2=visible and plane1=invisible
      // which is opposite of initial state: plane2=invisible; plane1=visible
      plane2.visible = detected;
      plane.visible = !detected;
      // Recursively call detect() every time browser is ready for a repaint
      window.requestAnimationFrame(detect);
    }
    // Pass detect() to window.requestAnimationFrame()
    window.requestAnimationFrame(detect);
  }
  start();
});
