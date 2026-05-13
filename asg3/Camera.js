class Camera {

    fov;
    aspect;
    eye;
    at;
    up;

    view_matrix;
    projection_matrix;

    speed;
    look_speed;
    pan_speed;

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

        this.speed = 0.05;
        this.look_speed = 0.7;
        this.pan_speed = 2;
    }

    update(input) {
        let move = [0, 0]; // control vector
        if (input.left) move[0]--;
        if (input.right) move[0]++;
        if (input.up) move[1]++;
        if (input.down) move[1]--;

        let turn = 0;
        if (input.turn_left) turn++;
        if (input.turn_right) turn--;


        if (move[0] == 1) {
            this.move(1, 0);
        }
        if (move[0] == -1) {
            this.move(-1, 0);
        }

        if (move[1] == 1) {
            this.move(0, 1);
        }
        if (move[1] == -1) {
            this.move(0, -1);
        }

        if (turn == 1) {
            this.rotateLook(-this.pan_speed, 0);
        }
        if (turn == -1) {
            this.rotateLook(this.pan_speed, 0);
        }
    }

    rotateLook(x, y) {
        let forward = new Vector3();
        forward.set(this.at);
        forward.sub(this.eye);

        let right = forward.cross(this.up);

        let rotate_M = new Matrix4();
        rotate_M.setRotate(-x * this.look_speed, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        rotate_M.rotate(-y * this.look_speed, right.elements[0], right.elements[1], right.elements[2]);

        let new_forward = rotate_M.multiplyVector3(forward);

        this.at.set(this.eye);
        this.at.add(new_forward);

        this.updateViewMatrix();
    }

    // move along the x-z plane. depends on look direction
    move(x, y) {
        let forward = this.getForwardDirection();
        let right = this.getRightDirection();

        // eliminate y-component
        forward.elements[1] = 0;
        forward.normalize();
        right.elements[1] = 0;
        right.normalize();

        // set velocity
        forward.mul(this.speed * y);
        right.mul(this.speed * x);

        // apply movement
        this.at.add(forward);
        this.eye.add(forward);

        this.at.add(right);
        this.eye.add(right);

        this.updateViewMatrix();
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
        forward.normalize();

        let right = forward.cross(this.up);
        right.normalize();
        right.mul(this.speed);
        
        this.at.add(right);
        this.eye.add(right);

        this.updateViewMatrix();
    }

    getForwardDirection() {
        let forward = new Vector3();
        forward.set(this.at);
        forward.sub(this.eye);
        forward.normalize();

        return forward;
    }

    getRightDirection() {
        let forward = this.getForwardDirection();

        let right = forward.cross(this.up);
        right.normalize();
        right.mul(this.speed);

        return right;
    }
}