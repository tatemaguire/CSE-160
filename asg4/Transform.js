class Transform {
    
    position;
    rotation;
    scale;

    modelMatrix;
    normalMatrix;

    constructor() {
        this.position = new Vector3([0, 0, 0]);
        this.rotation = new Vector3([0, 0, 0]);
        this.scale = new Vector3([1, 1, 1]);

        this.modelMatrix = new Matrix4();
        this.normalMatrix = new Matrix4();
    }

    // calculate model and normal matrices using position, rotation, scale
    calculateMatrices() {
        const pos = this.position.elements;
        const rot = this.rotation.elements;
        const sca = this.scale.elements;
        this.modelMatrix
            .setTranslate(pos[0], pos[1], pos[2])
            .rotate(rot[0], 1, 0, 0)
            .rotate(rot[1], 0, 1, 0)
            .rotate(rot[2], 0, 0, 1)
            .scale(sca[0], sca[1], sca[2]);
        
        this.normalMatrix.setInverseOf(this.modelMatrix).transpose();
    }

}