import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { mockWithVideo } from '../assets/libs/camera-mock';

const loadGLTF = (path) => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(path, (gltf) => {
      resolve(gltf);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    mockWithVideo("../assets/mock-videos/course-banner1.mp4");

    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../assets/targets/course-banner.mind',
    });
    const {renderer, scene, camera} = mindarThree;

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    const raccoon = await loadGLTF('../assets/models/musicband-raccoon/scene.gltf');
    raccoon.scene.scale.set(0.1, 0.1, 0.1);
    raccoon.scene.position.set(0, -0.4, 0);

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(raccoon.scene);

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
