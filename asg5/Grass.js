import * as THREE from "three";

const SWAY_AMOUNT = Math.PI / 8;
const STRETCH_AMOUNT = 0.1;

class Grass extends THREE.Mesh {
    static grass_geometry = new THREE.PlaneGeometry(0.2, 0.2);
    static grass_texture = null;
    static grass_material = null;

    constructor() {

        if (!Grass.grass_texture) {
            const loader = new THREE.TextureLoader();
            Grass.grass_texture = loader.load("./assets/grass.png");
            Grass.grass_texture.wrapS = THREE.RepeatWrapping;
            Grass.grass_texture.colorSpace = THREE.SRGBColorSpace;
        }

        if (!Grass.grass_material) {
            Grass.grass_material = new THREE.MeshLambertMaterial({
                map: Grass.grass_texture,
                transparent: true
            });
        }

        super(Grass.grass_geometry, Grass.grass_material);

        // Backside
        const backside = new THREE.Mesh(Grass.grass_geometry, Grass.grass_material);
        backside.rotation.y = Math.PI;
        this.add(backside);

        // Animation
        this.pivot = new THREE.Vector3(0, -0.1, 0);
        this.timescale = Math.random() * 0.4 + 0.8;
        this.offset = Math.random() * Math.PI;
    }

    update(time) {
        let progress = time * this.timescale + this.offset;
        this.rotation.x = Math.sin(progress) * SWAY_AMOUNT;
        this.scale.x = 1 + Math.cos(progress) * STRETCH_AMOUNT;
    }
}

export { Grass };