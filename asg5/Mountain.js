import * as THREE from "three";

class Mountain extends THREE.Object3D {

    constructor(rock_texture) {
        super()

        this.rock_material = new THREE.MeshPhongMaterial({
            map: rock_texture
        });
        this.basic_material = new THREE.MeshPhongMaterial({
            map: rock_texture
        });

        this._buildMountain();
    }

    _buildMountain() {
        const primitive_size = 0.4;

        this._pyramid = new THREE.ConeGeometry(primitive_size, primitive_size*1.5, 4);
        this._icosahedron = new THREE.IcosahedronGeometry(primitive_size);
        this._dodecahedron = new THREE.DodecahedronGeometry(primitive_size);
        this._cube = new THREE.BoxGeometry(primitive_size, primitive_size, primitive_size);


        let rock;

        rock = this._addIcos();
        rock.position.set(-1, 0, 0);

        rock = this._addIcos();
        rock.position.set(0.4, 0, 0);
        rock.rotation.set(0, 0.5, 0);

        rock = this._addPyra();
        rock.position.set(1, 0, 0);

        rock = this._addDode();
        rock.position.set(-0.8, -0.2, -0.7);

        rock = this._addPyra();
        rock.position.set(-0.45, 0.2, -0.14);
        rock.rotation.x = 0.4;

        rock = this._addCube();
        rock.scale.set(2, 1, 2);

        rock = this._addCube();
        rock.position.set(-1.2, 0.1, 0.1);
        rock.rotation.set(0.8, 0.2, 0.2);
        rock.scale.set(0.4, 0.6, 0.3);

        rock = this._addIcos();
        rock.position.set(0.3, -0.07, 0.4);
        rock.scale.set(1, 0.6, 0.9);
        rock.rotation.set(0.9, 0, 0.2);

        rock = this._addIcos();
        rock.position.set(-0.3, -0.07, 0.4);
        rock.scale.set(0.7, 0.6, 0.9);
        rock.rotation.set(-0.9, 0, 0.2);

        rock = this._addPyra();
        rock.position.set(-0.6, 0, 0.4);
        rock.scale.set(0.8, 0.9, 1.2);
        rock.rotation.set(1, 0.4, 0.1);

        rock = this._addDode();
        rock.position.set(0, 0.1, 0.3);
        rock.scale.set(0.6, 0.6, 0.6);
    }
    
    _addPyra() {
        const p1 = new THREE.Mesh(this._pyramid, this.rock_material);
        this.add(p1);
        return p1;
    }

    _addIcos() {
        const i1 = new THREE.Mesh(this._icosahedron, this.rock_material);
        this.add(i1);
        return i1
    }

    _addDode() {
        const d1 = new THREE.Mesh(this._dodecahedron, this.rock_material);
        this.add(d1);
        return d1;
    }

    _addCube() {
        const c1 = new THREE.Mesh(this._cube, this.basic_material);
        this.add(c1);
        return c1;
    }
}

export { Mountain };