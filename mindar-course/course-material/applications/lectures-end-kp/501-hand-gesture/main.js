import {loadGLTF} from "../../libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

// Load .js code after html doc is loaded
document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    // Instantiate mindarThree object with the compiled image target .mind
    // mindarThre auto instantiates renderer, scene, and camera
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targets/robot.mind',
    });
    const {renderer, scene, camera} = mindarThree;

    // Add light to scene to light up models. Otherwise, models will be completely dark
    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    // Load, scale, and position gltf model
    // This model comes with different animations: model-name.animations[i]
    const robot = await loadGLTF('../../assets/models/robot/RobotExpressive.glb');
    robot.scene.scale.set(0.2, 0.2, 0.2);
    robot.scene.position.set(0, -0.2, 0);

    // Create a MindAR anchor and add model to anchor
    // All AR objects associated with an anchor will be rendered according to anchor's position + orienatation
    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(robot.scene);

    // Create a mixer to allow intrinsic animations
    const mixer = new THREE.AnimationMixer(robot.scene);

    // Create clipAction for animations of interest
    // When appropriate hand gestures are detected, the corresponding actions will be played
    const idleAction = mixer.clipAction(robot.animations[2]);
    const jumpAction = mixer.clipAction(robot.animations[3]);
    const dieAction = mixer.clipAction(robot.animations[1]);
    const thumbsUpAction = mixer.clipAction(robot.animations[9]);
    const waveAction = mixer.clipAction(robot.animations[12]);
    
    // Except for idleAction, when hand is detected, play the action once and then return to idleAction
    jumpAction.loop = THREE.LoopOnce;
    dieAction.loop = THREE.LoopOnce;
    thumbsUpAction.loop = THREE.LoopOnce;
    waveAction.loop = THREE.LoopOnce;

    // Load hand pose tensorflow.js model to detect hand gestures and play different animations accordingly
    // Model returns landmarks of each finger
    // https://github.com/tensorflow/tfjs-models/tree/master/handpose
    const model = await handpose.load();

    // Define gestures with finger pose library by adding curl and direction for different fingers 
    // fingerpose library is built on top of the hand pose library
    // hand pose model returns landmarks of each finger. 
    // In the finger pose library, we can define use those landmarks to define custom gestures
    // https://github.com/andypotato/fingerpose
    const waveGesture = new fp.GestureDescription('wave');
    for (let finger of [fp.Finger.Thumb, fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
      waveGesture.addCurl(finger, fp.FingerCurl.NoCurl, 1.0);
      waveGesture.addDirection(finger, fp.FingerDirection.VerticalUp, 1.0);
    };
    const dieGesture = new fp.GestureDescription('die');
    for(let finger of [fp.Finger.Thumb, fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
      dieGesture.addCurl(finger, fp.FingerCurl.NoCurl, 1.0);
      dieGesture.addDirection(finger, fp.FingerDirection.HorizontalLeft, 1.0);
      dieGesture.addDirection(finger, fp.FingerDirection.HorizontalRight, 1.0);
    };
    const jumpGesture = new fp.GestureDescription('jump');
    jumpGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
    jumpGesture.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalUp, 1.0);
    jumpGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpRight, 1.0);
    jumpGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpLeft, 1.0);
    for(let finger of [fp.Finger.Thumb, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
      jumpGesture.addCurl(finger, fp.FingerCurl.FullCurl, 1.0);
      jumpGesture.addDirection(finger, fp.FingerDirection.VerticalUp, 1.0);
      jumpGesture.addDirection(finger, fp.FingerDirection.VerticalDown, 1.0);
    };

    // Create GestureEstimator GE with the above gestures
    const GE = new fp.GestureEstimator([fp.Gestures.ThumbsUpGesture, waveGesture, jumpGesture, dieGesture]);

    // Create a clock
    // Start mindar engine and (re)render model + animations based on time-elapsed as measured by clock.getDelta()
    const clock = new THREE.Clock();
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      mixer.update(delta);
      renderer.render(scene, camera);
    });

    // Create activeAction to indicate the current action with idleAction is the starting action
    let activeAction = idleAction;
    activeAction.play();

    // Create fade-in effect to make action transitions more natural; 
    // 1st param "action" = new action
    // 2nd param "duration" = fade-in duration
    const fadeToAction = (action, duration) => {
      // No need for fade-in if there is no change in action i.e. activeAction = new action
      if (activeAction == action) return; 
      // Otherwise, set the new action as activeAction
      activeAction = action;
      // Fade into the new action
      activeAction.reset().fadeIn(duration).play();
    };

    // Whenever an action finished playing, switch back to idleAction
    mixer.addEventListener('finished', () => {
      fadeToAction(idleAction, 0.2);
    });

    // Get camera stream
    const cameraStream = mindarThree.video;
    // Detect hand in camera stream. Estimate gestures of detected hand. Play actions accordingly
    let skipCount = 0;
    const detect = async () => {
      // If the current action is not idleAction, skip trying to detect hands
      // so that the current action can play out in its entirety
      if (activeAction !== idleAction) {
        window.requestAnimationFrame(detect);
        return;
      };
      // Use skipCount to skip detecting hands, which is an expensive operation, in #skipCount of video frames 
      if (skipCount < 10) {
        skipCount += 1;
        window.requestAnimationFrame(detect);
        return;
      }
      skipCount = 0;
      // Detect hands using hand pose model + camera stream
      // "predictions" is an array of objects describing each detected hand
      // as described here https://github.com/tensorflow/tfjs-models/tree/master/handpose
      const predictions = await model.estimateHands(cameraStream);
      // If hand is detected, estimate the gesture using the first hand detected idx=0
      // using threshold of 7.5 
      if (predictions.length > 0) {
        // Estimate the gestures of the detected hand with threshold of 7.5 (10=highest)
        const estimatedGestures = GE.estimate(predictions[0].landmarks, 7.5)
        // Find the best gesture based on estimated score
        if (estimatedGestures.gestures.length > 0) {
          const best = estimatedGestures.gestures.sort((g1, g2) => g2.confidence - g1.confidence)[0];
          // Play the animation according to the detected gesture with fade-in effect
          if (best.name === 'thumbs_up') {
            fadeToAction(thumbsUpAction, 0.5);
          } else if (best.name === 'wave') {
            fadeToAction(waveAction, 0.5);
          } else if (best.name === 'jump') {
            fadeToAction(jumpAction, 0.5);
          } else if (best.name === 'die') {
            fadeToAction(dieAction, 0.5);
          }
        }
      }
      window.requestAnimationFrame(detect);
    };
    window.requestAnimationFrame(detect);
  }
  start();
});
