class Camera {

    fov;
    eye;
    at;
    up;
    view_matrix;
    projection_matrix;

    constructor(aspect) {

        this.fov = 60;
        this.eye = new Vector3([0, 0, 0]);
        this.at = new Vector3([0, 0, -1]);
        this.up = new Vector3([0, 1, 0]);

        this.view_matrix = new Matrix4();
        this.updateViewMatrix();

        this.projection_matrix = new Matrix4();
        this.projection_matrix.setPerspective(this.fov, aspect, 0.1, 1000);
    }

    getVPMatrix() {
        let VP_matrix = new Matrix4(this.view_matrix);
        VP_matrix.multiply(this.projection_matrix);
        return VP_matrix;
    }

    updateViewMatrix() {
        this.view_matrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0], this.at.elements[1], this.at.elements[2],
            this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    }
}