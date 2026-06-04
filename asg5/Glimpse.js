import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Mountain } from "./Mountain.js";
import { Grass } from "./Grass.js";


const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
const gltfLoader = new GLTFLoader();
const texLoader = new THREE.TextureLoader();

let mousepos = { x: 0, y: 0 };

let camera;
let controls;
let scene;

let grasses = [];
let spotlight = null;
let cursor = null;
let raycaster = null;

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

    // Setup 3D Cursor
    cursor = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
    cursor.scale.set(0.2, 0.2, 0.2);
    cursor.name = "cursor";
    cursor.visible = false;

    raycaster = new THREE.Raycaster();
    
    // Setup Scene
    scene = new THREE.Scene();
    scene.add(cursor);
    buildScene();
    loadBackground();
    

    // Run Program
    requestAnimationFrame(tick)

    canvas.addEventListener("mousemove", mouseMove);
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

    spotlight = new THREE.SpotLight(0xFFFFFF, 100, 10, 0.1, 0.5);
    spotlight.position.set(0, 5, 2);
    scene.add(spotlight);
    spotlight.target = cursor;

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

    // -------------- Grass -------------

    let grass = new Grass();
    grass.position.set(-0.05, 0.85, -0.45);
    grass.rotation.set(0, 0.4, 0);
    scene.add(grass);
    grasses.push(grass);

    grass = new Grass();
    grass.position.set(-0.85, 0.4, 0);
    scene.add(grass);
    grasses.push(grass);

    grass = new Grass();
    grass.position.set(-0.85, 0.4, 0);
    grass.rotation.set(0, Math.PI / 4, 0);
    grass.scale.set(2, 2, 2);
    scene.add(grass);
    grasses.push(grass);

    grass = new Grass();
    grass.position.set(0.15, 0.3, 0.4);
    grass.scale.y = 1.4;
    scene.add(grass);
    grasses.push(grass);

    grass = new Grass();
    grass.position.set(0.05, 0.15, 0.5);
    grass.rotation.y = -Math.PI / 4
    scene.add(grass);
    grasses.push(grass);

    grass = new Grass();
    grass.position.set(0.5, 0.6, -0.4);
    grass.scale.set(2, 2, 2);
    scene.add(grass);
    grasses.push(grass);

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


function tick(time) {
    time *= 0.001;
    
    // Handle resizing
    if (resizeRendererToDisplaySize()) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    // Animate
    grasses.forEach((grass) => {grass.update(time);});

    // Update
    spotlight.visible = update3DCursor();
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


function update3DCursor() {
    raycaster.setFromCamera(new THREE.Vector2(mousepos.x, -mousepos.y), camera);
    const results = raycaster.intersectObject(scene, true);

    if (!results[0]) return false;

    let p;
    if (results[0].name === "cursor") {
        p = results[0].point;
    }
    else {
        if (!results[1]) return false;
        p = results[1].point;
    }

    cursor.position.set(p.x, p.y, p.z);
    return true;
}


function mouseMove(ev) {
    let rawmousepos = { x: 0, y: 0};

    rawmousepos.x = ev.clientX;
    rawmousepos.y = ev.clientY;

    mousepos.x = rawmousepos.x / canvas.clientWidth;
    mousepos.y = rawmousepos.y / canvas.clientHeight;

    mousepos.x = mousepos.x * 2 - 1;
    mousepos.y = mousepos.y * 2 - 1;
}