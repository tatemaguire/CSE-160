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
    camera.position.z = 3;

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
    loadBackground();

    // Run Program
    requestAnimationFrame(tick)
}


function buildScene() {

    // ------------ Lighting -------------

    const dirLight = new THREE.DirectionalLight(0xEEDDFF, 2);
    dirLight.position.set(10, 1, 4);
    scene.add(dirLight);

    const ambLight = new THREE.AmbientLight(0xAAAAFF, 0.4);
    scene.add(ambLight);

    const vaseLight = new THREE.PointLight(0xFFFF99, 0.5, 2);
    vaseLight.position.y = 0.5;

    // ------------ Meshes -------------

    const rock_texture = texLoader.load("./assets/rock.png");
    rock_texture.colorSpace = THREE.SRGBColorSpace;
    rock_texture.wrapS = THREE.RepeatWrapping;
    rock_texture.wrapT = THREE.RepeatWrapping;
    rock_texture.repeat.set(4, 1);

    const mtn = new Mountain(rock_texture);
    scene.add(mtn);

    const mtn2 = new Mountain(rock_texture);
    mtn2.position.set(0.2, 0.4, -0.7);
    mtn2.scale.set(1.2, 1.3, 1.2);
    mtn2.rotation.set(0.9, Math.PI, 0);
    scene.add(mtn2);

    // Vase
    gltfLoader.loadAsync("assets/vase.glb").then((gltf) => {
        const vase = gltf.scene;
        vase.scale.set(0.3, 0.3, 0.3);
        vase.attach(vaseLight);

        vase.position.set(0, 0.47, 0);
        vase.rotation.set(Math.PI * 0.47, 0, 0.3);

        scene.add(vase);
    });

    // -------------- Stream --------------

    const stream_geo = new THREE.PlaneGeometry(0.1, 1);
    const stream_mat = new THREE.MeshBasicMaterial({color: 0xFFFF00});
    const stream = new THREE.Mesh(stream_geo, stream_mat);
    stream.position.set(-0.2, -0.05, 0.6);
    scene.add(stream);

}


function loadBackground() {
    const cubeTexLoader = new THREE.CubeTextureLoader();
    const bgTexture = cubeTexLoader.load([
        "./assets/skybox/posx.jpg",
        "./assets/skybox/negx.jpg",
        "./assets/skybox/posy.jpg",
        "./assets/skybox/negy.jpg",
        "./assets/skybox/posz.jpg",
        "./assets/skybox/negz.jpg",
    ]);

    scene.background = bgTexture;
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