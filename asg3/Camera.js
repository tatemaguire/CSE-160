class Camera {

    fov;
    aspect;
    eye;
    at;
    up;
    view_matrix;
    projection_matrix;

    constructor(aspect) {

        this.fov = 60;
        this.aspect = aspect;

        this.eye = new Vector3([0, 0, 0]);
        this.at = new Vector3([0, 0, -1]);
        this.up = new Vector3([0, 1, 0]);

        this.view_matrix = new Matrix4();
        this.updateViewMatrix();

        this.projection_matrix = new Matrix4();
        this.updateProjectionMatrix();
    }

    // Set view matrix after updating eye/at/up
    updateViewMatrix() {
        this.view_matrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0], this.at.elements[1], this.at.elements[2],
            this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    }

    // Set projection matrix after updating fov/aspect
    updateProjectionMatrix() {
        this.projection_matrix.setPerspective(this.fov, this.aspect, 0.1, 1000);
    }

    // Move 'eye' forward
    moveForward() {
        console.log(this.at);
        console.log(this.eye);
        let forward = this.at.sub(this.eye);
        console.log(forward);
    }

    moveBackward() {

    }

    moveLeft() {

    }

    moveRight() {

    }
}