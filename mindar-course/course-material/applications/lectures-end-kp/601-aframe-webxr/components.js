// reference: https://github.com/stspanho/aframe-hit-test

AFRAME.registerComponent('ar-reticle', {
  // 
  init: function () {
    this.xrHitTestSource = null;
    this.viewerSpace = null;
    this.refSpace = null;
    
    // Register a session end event to do some clean up
    this.el.sceneEl.renderer.xr.addEventListener('sessionend', (ev) => {
      this.viewerSpace = null;
      this.refSpace = null;
      this.xrHitTestSource = null;
    });

    // Register a session start event
    this.el.sceneEl.renderer.xr.addEventListener('sessionstart', (ev) => {
      let session = this.el.sceneEl.renderer.xr.getSession();

      // This 'select' event callback is triggered from the controller's 'select' action
      // Controller here for web AR with no additional AR hardware aside from mobile device
      // is the device's touch screen
      let element = this.el;
      session.addEventListener('select', function () {
        // Update the location of the box as the reticle's position?
        let position = element.getAttribute('position');
        document.getElementById('box').setAttribute('position', position);
        document.getElementById('box').setAttribute('visible', true);
      });

      // Request viewer reference space
      session.requestReferenceSpace('viewer').then((space) => {
        this.viewerSpace = space;
        // Request hit test source
        session.requestHitTestSource({space: this.viewerSpace}).then((hitTestSource) => {
          this.xrHitTestSource = hitTestSource;
      	});
      });

      // Request local reference space
      session.requestReferenceSpace('local').then((space) => {
        this.refSpace = space;
            });
          });
        },

  tick: function () {
    if (this.el.sceneEl.is('ar-mode')) {
      if (!this.viewerSpace) return;

      let frame = this.el.sceneEl.frame;
      let xrViewerPose = frame.getViewerPose(this.refSpace);

      // Perform a hit test
      if (this.xrHitTestSource && xrViewerPose) {
        let hitTestResults = frame.getHitTestResults(this.xrHitTestSource);
        // If there are hit points, select the 1st hit point
        if (hitTestResults.length > 0) { 
          let pose = hitTestResults[0].getPose(this.refSpace);
          
          // Use the hit point to update the reticle's position
          let inputMat = new THREE.Matrix4();
          inputMat.fromArray(pose.transform.matrix);

          let position = new THREE.Vector3();
          position.setFromMatrixPosition(inputMat);
          this.el.setAttribute('position', position);
          this.el.setAttribute('visible', true);
        } else {
          this.el.setAttribute('visible', false);
        }
      }
    }
  }
});
