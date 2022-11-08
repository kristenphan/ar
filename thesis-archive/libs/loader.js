import { GLTFLoader } from 'https://unpkg.com/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';

export const loadGLTF = (path) => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(path, (gltf) => {
      resolve(gltf);
    });
  });
}