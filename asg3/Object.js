class GameObject {
    // Static Buffer Setup

    static vert_buffer = null;
    static face_buffer = null;
    static num_verts = 0;

    static initializeBuffers(gl, verts, faces) {

        // Delete existing buffers
        if (GameObject.vert_buffer) {
            gl.deleteBuffer(this.vert_buffer);
            GameObject.vert_buffer = null;
        }
        if (GameObject.face_buffer) {
            gl.deleteBuffer(this.face_buffer);
            GameObject.face_buffer = null;
        }

        // Create Vertex Position Buffer
        GameObject.vert_buffer = gl.createBuffer();
        if (!GameObject.vert_buffer) {
            console.error("Couldn't create vert_buffer");
            return;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, GameObject.vert_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

        // Create Faces Buffer (of vertex indices)
        GameObject.face_buffer = gl.createBuffer();
        if (!GameObject.face_buffer) {
            console.error("Couldn't create face_buffer");
            return;
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, GameObject.face_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, faces, gl.STATIC_DRAW);

        // Set num verts/faces
        GameObject.num_verts = faces.length;
    }

    // Fields
    model_matrix;
    base_color;

    constructor(model_matrix, base_color) {
        this.model_matrix = model_matrix;
        this.base_color = base_color;

        if (!GameObject.vert_buffer || !GameObject.face_buffer || !GameObject.num_verts) {
            console.error("Can't construct object without initializing buffers");
            return;
        }
    }

    // Draw using current buffers, model matrix, and base color
    render(gl, shader_var) {

        gl.bindBuffer(gl.ARRAY_BUFFER, GameObject.vert_buffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, GameObject.face_buffer);

        // Set uniform variables
        gl.uniform4f(shader_var.u_FragColor, this.base_color[0], this.base_color[1], this.base_color[2], this.base_color[3]);
        gl.uniformMatrix4fv(shader_var.u_ModelMatrix, false, this.model_matrix.elements);

        // Draw cube according to position indices in cube_element_buffer
        gl.drawElements(gl.TRIANGLES, GameObject.num_verts, gl.UNSIGNED_BYTE, 0);
    }
}