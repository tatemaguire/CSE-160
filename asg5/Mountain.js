import * as THREE from "three";

class Mountain extends THREE.Object3D {
    constructor() {
        super()
        this._buildMountain();
    }

    _buildMountain() {
        const pyramid = new THREE.ConeGeometry(1, 1, 4);
        const material = new THREE.MeshPhongMaterial({ color: 0xAAAAAA });

        const p1 = new THREE.Mesh(pyramid, material);
        p1.scale.set(0.4, 0.4, 0.4);
        p1.position.set(-1, 0, 0);
        this.add(p1);

        const p2 = new THREE.Mesh(pyramid, material);
        p2.scale.set(0.4, 0.4, 0.4);
        p2.position.set(1, 0, 0);
        this.add(p2);
    }
}

export { Mountain };