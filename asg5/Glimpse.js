import * as THREE from 'three';

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

    const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 5);
    camera.position.z = 2;

    const scene = new THREE.Scene();

    const geometry = new THREE.BoxGeometry();
    const blueMaterial = new THREE.MeshBasicMaterial({color: 0x3310AA})
    const cube = new THREE.Mesh(geometry, blueMaterial);

    scene.add(cube);

    renderer.render(scene, camera);
}

main();