import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Mountain } from "./Mountain.js";


const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
const gltfLoader = new GLTFLoader();
const texLoader = new THREE.TextureLoader();

let camera;
let controls;
let scene;

main();


function main() {

    // Setup camera
    camera = new THREE.PerspectiveCamera(75, 2, 0.1, 50);
    camera.position.z = 4;

    // Setup controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.minDistance = 1;
    controls.maxDistance = 30;
    controls.enableDamping = true;
    controls.dampingFactor = 0.15;
    controls.update();

    // Setup Scene
    scene = new THREE.Scene();
    buildScene();

    // Run Program
    requestAnimationFrame(tick)
}


function buildScene() {

    // ------------ Lighting -------------

    const dirLight = new THREE.DirectionalLight(0xFFFFFF, 3);
    dirLight.position.set(-1, 2, 4);
    scene.add(dirLight);

    const ambLight = new THREE.AmbientLight(0xFFFFFF, 0.1);
    scene.add(ambLight);

    // ------------ Meshes -------------

    const rock_texture = texLoader.load("./assets/rock.png");
    rock_texture.colorSpace = THREE.SRGBColorSpace;
    rock_texture.wrapS = THREE.RepeatWrapping;
    rock_texture.wrapT = THREE.RepeatWrapping;
    rock_texture.repeat.set(4, 1);

    const mtn = new Mountain(rock_texture);
    scene.add(mtn);

    // Vase
    gltfLoader.loadAsync("assets/vase.glb").then((gltf) => {
        const vase = gltf.scene;
        vase.scale.set(0.3, 0.3, 0.3);
        scene.add(vase);
    });

}


function tick() {
    
    // Handle resizing
    if (resizeRendererToDisplaySize()) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    // Update
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