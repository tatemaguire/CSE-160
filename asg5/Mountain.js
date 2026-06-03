import * as THREE from "three";

class Mountain extends THREE.Object3D {

    constructor(rock_texture) {
        super()

        this.rock_material = new THREE.MeshPhongMaterial({
            map: rock_texture
        });
        this._buildMountain();
    }

    _buildMountain() {
        this._pyramid = new THREE.ConeGeometry(1, 1, 4);
        this._icosahedron = new THREE.IcosahedronGeometry(1);

        this._addIco().position.set(-1, 0, 0);

        this._addPyr().position.set(1, 0, 0);
    }

    _addIco() {
        const i1 = new THREE.Mesh(this._icosahedron, this.rock_material);
        i1.scale.set(0.4, 0.4, 0.4);
        this.add(i1);
        return i1
    }
    
    _addPyr() {
        const p1 = new THREE.Mesh(this._pyramid, this.rock_material);
        p1.scale.set(0.4, 0.4, 0.4);
        this.add(p1);
        return p1;
    }
}

export { Mountain };