class Transform {
    
    position;
    rotation;
    scale;

    modelMatrix;
    normalMatrix;

    constructor() {
        this.position = new Vector3(0, 0, 0);
        this.rotation = new Vector3(0, 0, 0);
        this.scale = new Vector3(1, 1, 1);

        this.modelMatrix = new Matrix4();
        this.normalMatrix = new Matrix4();
    }

    calculateMatrices() {
        this.modelMatrix
            .setTranslate(this.position[0], this.position[1], this.position[2])
            .rotate(this.rotation[0], 1, 0, 0)
            .rotate(this.rotation[1], 0, 1, 0)
            .rotate(this.rotation[2], 0, 0, 1)
            .scale(this.scale[0], this.scale[1], this.scale[2]);
        
        this.normalMatrix.setInverseOf(this.modelMatrix).transpose();
    }

}