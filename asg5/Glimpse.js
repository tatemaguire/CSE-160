import * as THREE from 'three';


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


function main() {
    requestAnimationFrame(tick)
}
main();


function tick(time) {
    time *= 0.001;

    cube.rotation.y = time;
    cube.rotation.x = time;

    renderer.render(scene, camera);

    requestAnimationFrame(tick);
}
