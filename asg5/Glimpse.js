import * as THREE from 'three';
import { Mountain } from "./Mountain.js";

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 5);
camera.position.z = 2;

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry();
const blueMaterial = new THREE.MeshPhongMaterial({color: 0x2211aa});
const cube = new THREE.Mesh(geometry, blueMaterial);
scene.add(cube);

const light = new THREE.DirectionalLight(0xFFFFFF, 3);
light.position.set(-1, 2, 4);
scene.add(light);

const mtn = new Mountain();
scene.add(mtn);


function main() {
    requestAnimationFrame(tick)
}
main();


function tick(time) {
    time *= 0.001;

    cube.rotation.y = time;
    cube.rotation.x = time;

    
    if (resizeRendererToDisplaySize()) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

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