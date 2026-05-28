class Transform {
    
    position;
    rotation;
    scale;

    model_matrix;
    normal_matrix;

    constructor() {
        this.position = new Vector3([0, 0, 0]);
        this.rotation = new Vector3([0, 0, 0]);
        this.scale = new Vector3([1, 1, 1]);

        this.model_matrix = new Matrix4();
        this.normal_matrix = new Matrix4();
    }

    // calculate model and normal matrices using position, rotation, scale
    calculateMatrices() {
        const pos = this.position.elements;
        const rot = this.rotation.elements;
        const sca = this.scale.elements;
        this.model_matrix
            .setTranslate(pos[0], pos[1], pos[2])
            .rotate(rot[0], 1, 0, 0)
            .rotate(rot[1], 0, 1, 0)
            .rotate(rot[2], 0, 0, 1)
            .scale(sca[0], sca[1], sca[2]);
        
        this.normal_matrix.set(this.model_matrix).invert().transpose();
    }

}