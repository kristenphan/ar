import { CSS3DObject } from '../../libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js';
import {mockWithVideo} from '../../libs/camera-mock.js';
import {loadGLTF, loadTexture, loadVideo} from '../../libs/loader.js';
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    // Start mock webcam for testing
    mockWithVideo('../../assets/mock-videos/portfolio1.mp4');

    // Initialize MindAR 
    // which in turn auto instantiates three.js renderer, cssRenderer, scene, cssScene, and camera
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targets/card.mind',
    });
    const {renderer, cssRenderer, scene, cssScene, camera} = mindarThree;

    // Add light to scene so that we can see 3D model. Otherwise model will be completely dark
    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    // Create a plane with image target picture
    const cardTexture = await loadTexture('../../assets/targets/card.png'); 
    const planeGeometry = new THREE.PlaneGeometry(1, 0.552);
    const cardMaterial = new THREE.MeshBasicMaterial({map: cardTexture});
    const card = new THREE.Mesh(planeGeometry, cardMaterial);
    /* console.log("cardTexture.type: ", cardTexture.type); // texture.type:  1009 */

    // Create and position circles with email, web, profile, and location icons
    const iconGeometry = new THREE.CircleGeometry(0.075, 32);
    const emailTexture = await loadTexture('../../assets/portfolio/icons/email.png');
    const emailMaterial = new THREE.MeshBasicMaterial({map: emailTexture});
    const emailIcon = new THREE.Mesh(iconGeometry, emailMaterial);
    emailIcon.position.set(0.14, -0.5, 0);

    const webTexture = await loadTexture('../../assets/portfolio/icons/web.png');
    const webMaterial = new THREE.MeshBasicMaterial({map: webTexture});
    const webIcon = new THREE.Mesh(iconGeometry, webMaterial);
    webIcon.position.set(-0.14, -0.5, 0);

    const profileTexture = await loadTexture('../../assets/portfolio/icons/profile.png');
    const profileMaterial = new THREE.MeshBasicMaterial({map: profileTexture});
    const profileIcon = new THREE.Mesh(iconGeometry, profileMaterial);
    profileIcon.position.set(-0.42, -0.5, 0);

    const locationTexture = await loadTexture('../../assets/portfolio/icons/location.png');
    const locationMaterial = new THREE.MeshBasicMaterial({map: locationTexture});
    const locationIcon = new THREE.Mesh(iconGeometry, locationMaterial);
    locationIcon.position.set(0.42, -0.5, 0);
    
    // Create and position circles with left and right icon (i.e. back/ next button)
    // NOT SURE WHY A CIRCLEGEOMETRY WORKS WITH SQUARE PIC OF LEFT/ RIGHT ARROW
    const leftTexture = await loadTexture('../../assets/portfolio/icons/left.png');
    const leftMaterial = new THREE.MeshBasicMaterial({map: leftTexture});
    const leftIcon = new THREE.Mesh(iconGeometry, leftMaterial);
    leftIcon.position.set(-0.7, 0, 0);

    const rightTexture = await loadTexture('../../assets/portfolio/icons/right.png');
    const rightMaterial = new THREE.MeshBasicMaterial({map: rightTexture});
    const rightIcon = new THREE.Mesh(iconGeometry, rightMaterial);
    rightIcon.position.set(0.7, 0, 0);

    // Create a plane with a video texture 
    const portfolioItem0Video = await loadVideo("../../assets/portfolio/portfolio/paintandquest.mp4");
    portfolioItem0Video.muted = true;
    const portfolioItem0VideoTexture = new THREE.VideoTexture(portfolioItem0Video);
    const portfolioItem0VideoMaterial = new THREE.MeshBasicMaterial({map: portfolioItem0VideoTexture});
    const portfolioItem0V = new THREE.Mesh(planeGeometry, portfolioItem0VideoMaterial); // video

    // Create a plane with a preview pic of the video, a coffee machine pic, and a peak pic
    const portfolioItem0Texture = await loadTexture('../../assets/portfolio/portfolio/paintandquest-preview.png'); 
    const portfolioItem0Material = new THREE.MeshBasicMaterial({map: portfolioItem0Texture}); 
    const portfolioItem0 = new THREE.Mesh(planeGeometry, portfolioItem0Material);

    const portfolioItem1Texture = await loadTexture('../../assets/portfolio/portfolio/coffeemachine-preview.png');
    const portfolioItem1Material = new THREE.MeshBasicMaterial({map: portfolioItem1Texture}); 
    const portfolioItem1 = new THREE.Mesh(planeGeometry, portfolioItem1Material);

    const portfolioItem2Texture = await loadTexture('../../assets/portfolio/portfolio/peak-preview.png');
    const portfolioItem2Material = new THREE.MeshBasicMaterial({map: portfolioItem2Texture});
    const portfolioItem2 = new THREE.Mesh(planeGeometry, portfolioItem2Material); 

    // Create a THREE.GROUP to group all portfolio items
    const portfolioGroup = new THREE.Group();
    portfolioGroup.position.set(0, 0.6, -0.01);

    // Add the preview pic of video (portfolioItem0), left icon, and right icon to the group
    // The previw pic of video will be later swapped for the actual video when user clicks on the preview pic
    // The preview pic of the video or the video will be later swapped for the coffee machine or peak picture 
    // when user clicks left/ right icon
    portfolioGroup.add(portfolioItem0);
    portfolioGroup.add(leftIcon); 
    portfolioGroup.add(rightIcon);

    // Load, scale, and position a gltf model
    // gltf.scene == THREE.Group
    const avatar = await loadGLTF('../../assets/models/softmind/scene.gltf');
    avatar.scene.scale.set(0.004, 0.004, 0.004);
    avatar.scene.position.set(0, -0.25, -0.3);

    // Create a MindAR anchor using an image target of idx=0 and add 3D objects to anchor
    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(avatar.scene);
    anchor.group.add(card);
    anchor.group.add(emailIcon);
    anchor.group.add(webIcon);
    anchor.group.add(profileIcon);
    anchor.group.add(locationIcon);
    anchor.group.add(portfolioGroup);

    // Create a <div> with css styling
    // No need to document.body.appendChild(): only appendChild(renderer.domElement) for webXR?
    const textElement = document.createElement("div");
    textElement.style.background = "#FFFFFF";
    textElement.style.padding = "30px"; // space around element's content
    textElement.style.fontSize = "60px";

    // Create a CSS3DObject "textObj" from a <div> "textElement" to store text to be displayed
    // for when profile, web, email, or location icon is clicked
    const textCSSObj = new CSS3DObject(textElement);
    textCSSObj.position.set(0, -1000, 0);
    // Make the textObj invisible before any of the profile, web, email, or location icon is clicked
    textCSSObj.visible = false;

    // Create a CSSAnchor from image target of idx=0 and add CSS3DObject to anchor
    const cssAnchor = mindarThree.addCSSAnchor(0);
    cssAnchor.group.add(textCSSObj);

    // Object3D is the base class for most objects in three.js including Mesh, Group (gltf.scene), CSS3DObject
    // which was used to create all objects in this scene
    // Object3D.userData stores custom data about an Object3D object
    // https://threejs.org/docs/#api/en/core/Object3D.userData
    // Specify the icons as clickable by adding .userData.clickable
    leftIcon.userData.clickable = true;
    rightIcon.userData.clickable = true;
    emailIcon.userData.clickable = true;
    webIcon.userData.clickable = true;
    profileIcon.userData.clickable = true;
    locationIcon.userData.clickable = true;
    portfolioItem0.userData.clickable = true;
    portfolioItem0V.userData.clickable = true;

    // Create an array to store all portfolio items which consists of the following in the beginning:
    // preview pic of video, coffee machine pic, peak pic
    // This array can be modified later: swapping out portfolioItem0 (preview pic of video)
    // for portfolioItem0V (the actual video) after user clicks on the preview pic of video
    const portfolioItems = [portfolioItem0, portfolioItem1, portfolioItem2]; 
    // This variable will specify which of the portfolio item will be displayed at a time. 
    // At the beginning, the preview pic of the video is displayed.  
    let currentPortfolio = 0;
    
    // Capture a click on the entire document body and identify which three.js object was clicked using raycasting
    document.body.addEventListener('click', (e) => {
      // Use raycasting to cast a virtual ray from the click event coordinates to the camera to see if the ray
      // intersects with any of the three.js 3DObjects
      const mouseX = (e.clientX / window.innerWidth) * 2 - 1; // normalize click event x-coord
      const mouseY = -(e.clientY / window.innerHeight) * 2 + 1; // normalize click event y-coord
      const mouse = new THREE.Vector2(mouseX, mouseY); // Create a vector from x- and y-coord
      const raycaster = new THREE.Raycaster(); // Create a virtual ray
      raycaster.setFromCamera(mouse, camera); // Cast the ray from click point "mouse" to "camera"
      const intersects = raycaster.intersectObjects(scene.children, true);

      // If raycaster identifies a number of objects being clicked
      if (intersects.length > 0) {
        // Always choose the first object at idx=0
        let o = intersects[0].object; 
        // Traverse up the hierarchy until a clickable 3DObject is found
        while (o.parent && !o.userData.clickable) {
          o = o.parent;
        }
        // Check again that the 3DObject is clickable and perform different actions depending on which object was clicked
        if (o.userData.clickable) {
          // Show a different portfolio item as left and right icon is clicked: 
          // either 1) video 2) coffee machine pic or 3) peak pic
          if (o === leftIcon || o === rightIcon) {
            // Determine which portfolio item should be displayed
            if (o === leftIcon) {
              currentPortfolio = (currentPortfolio - 1 + portfolioItems.length) % portfolioItems.length;
            } else {
              currentPortfolio = (currentPortfolio + 1) % portfolioItems.length;
            }
            // Pause the video
            portfolioItem0Video.pause();
            // Add the right portfolio item to portfolioGroup which should already have left and right icon
            for (let i = 0; i < portfolioItems.length; i++) {
              portfolioGroup.remove(portfolioItems[i]);
            }
            portfolioGroup.add(portfolioItems[currentPortfolio]); 
          } 
          // If the preview pic of the video was clicked, swap the preview pic of the video for the video and play the video
          else if (o === portfolioItem0) {
            portfolioGroup.remove(portfolioItem0); // remove preview pic from portfolioGroup (a THREE.Group)
            portfolioGroup.add(portfolioItem0V); // add video to portfolioGroup
            portfolioItems[0] = portfolioItem0V; // replace the preview pic with the video in portfolioItems[0]
            portfolioItem0Video.play();
          } 
          // If the video is clicked, pause/ resume the video
          else if (o === portfolioItem0V) {
            if (portfolioItem0Video.paused) {
              portfolioItem0Video.play();
            } else {
              portfolioItem0Video.pause();
            }
          } 
          // If any of the icons is clicked, make the CSS3DObject visible and update the content of CSS3DObject 
          else if (o === webIcon) {
            textCSSObj.visible = true;
            textElement.innerHTML = "https://github.com/hiukim/mind-ar-js";
          } 
          else if (o === emailIcon) {
            textCSSObj.visible = true;
            textElement.innerHTML = "hiukim528 [at] gmail";
          } 
          else if (o === profileIcon) {
            textCSSObj.visible = true;
            textElement.innerHTML = "https://hiukim.com";
          } 
          else if (o === locationIcon) {
            textCSSObj.visible = true;
            textElement.innerHTML = "Vancouver, Canada";
          }
        }
      }
    });

    // Get a clock for calculating elapsed time
    const clock = new THREE.Clock();
    // Start MindAR engine
    await mindarThree.start();
    // Start rendering loop
    renderer.setAnimationLoop(() => {
      // Calculate elapsed time since clock.getDelta() is last called 
      // https://threejs.org/docs/#api/en/core/Clock.getElapsedTime
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime(); // in seconds

      // Change the scale of the web, email,  profile, location icons
      const iconScale = 1 + 0.2 * Math.sin(elapsed*5);
      [webIcon, emailIcon, profileIcon, locationIcon].forEach((icon) => {
      	icon.scale.set(iconScale, iconScale, iconScale);
      });

      // Make .gltf model wiggle on the z-axis from original position 
      // avatar.scene.position.set(0, -0.25, -0.3);
      const avatarZ = Math.min(0.3, -0.3 + elapsed * 0.5);
      avatar.scene.position.set(0, -0.25, avatarZ);

      // (Re)render scene and cssScene for every available video frame
      renderer.render(scene, camera);
      cssRenderer.render(cssScene, camera);
    });
  }
  start();
});
