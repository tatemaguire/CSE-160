import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Mountain } from "./Mountain.js";

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 50);
camera.position.z = 4;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.minDistance = 1;
controls.maxDistance = 30;
controls.enableDamping = true;
controls.dampingFactor = 0.15;
controls.update();

const scene = new THREE.Scene();

const dirLight = new THREE.DirectionalLight(0xFFFFFF, 3);
dirLight.position.set(-1, 2, 4);
scene.add(dirLight);

const ambLight = new THREE.AmbientLight(0xFFFFFF, 0.1);
scene.add(ambLight);

const mtn = new Mountain();
scene.add(mtn);


function main() {


    requestAnimationFrame(tick)
}
main();


function tick(time) {
    // time *= 0.001;
    
    if (resizeRendererToDisplaySize()) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    controls.update();
    renderer.render(scene, camera);

    requestAnimationFrame(tick);
}


// From [https://threejs.org/manual/#en/responsive]
function resizeRendererToDisplaySize() {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}