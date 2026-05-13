class Camera {

    fov;
    aspect;
    eye;
    at;
    up;

    view_matrix;
    projection_matrix;

    speed;
    angular_speed;

    constructor(aspect) {
        this.fov = 60;
        this.aspect = aspect;

        this.eye = new Vector3([-3, 1.5, 2]);
        this.at = new Vector3([-2, 1.5, 2]);
        this.up = new Vector3([0, 1, 0]);

        this.view_matrix = new Matrix4();
        this.updateViewMatrix();

        this.projection_matrix = new Matrix4();
        this.updateProjectionMatrix();

        this.speed = 0.1;
        this.angular_speed = 5;
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
        let forward = new Vector3();
        forward.set(this.at);
        forward.sub(this.eye);

        forward.mul(this.speed);

        // Move in the forward direction
        this.at.add(forward);
        this.eye.add(forward);

        this.updateViewMatrix();
    }

    moveBackward() {
        let forward = new Vector3();
        forward.set(this.at);
        forward.sub(this.eye);

        forward.mul(-this.speed);

        // Move in the forward direction
        this.at.add(forward);
        this.eye.add(forward);

        this.updateViewMatrix();
    }

    moveLeft() {
        let forward = new Vector3();
        forward.set(this.at);
        forward.sub(this.eye);

        let right = forward.cross(this.up);
        right.normalize();
        right.mul(-this.speed);
        
        this.at.add(right);
        this.eye.add(right);

        this.updateViewMatrix();
    }

    moveRight() {
        let forward = new Vector3();
        forward.set(this.at);
        forward.sub(this.eye);

        let right = forward.cross(this.up);
        right.normalize();
        right.mul(this.speed);
        
        this.at.add(right);
        this.eye.add(right);

        this.updateViewMatrix();
    }

    panLeft() {
        let forward = new Vector3();
        forward.set(this.at);
        forward.sub(this.eye);

        let rotate_M = new Matrix4();
        rotate_M.setRotate(this.angular_speed, this.up.elements[0], this.up.elements[1], this.up.elements[2]);

        let new_forward = rotate_M.multiplyVector3(forward);

        this.at.set(this.eye);
        this.at.add(new_forward);

        this.updateViewMatrix();
    }

    panRight() {
        let forward = new Vector3();
        forward.set(this.at);
        forward.sub(this.eye);

        let rotate_M = new Matrix4();
        rotate_M.setRotate(-this.angular_speed, this.up.elements[0], this.up.elements[1], this.up.elements[2]);

        let new_forward = rotate_M.multiplyVector3(forward);

        this.at.set(this.eye);
        this.at.add(new_forward);

        this.updateViewMatrix();
    }
}