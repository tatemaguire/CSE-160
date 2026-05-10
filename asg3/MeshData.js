class MeshData {

    vert_buffer;
    face_buffer;
    num_verts;

    constructor(gl, verts, faces) {
        // Create Vertex Position Buffer
        this.vert_buffer = gl.createBuffer();
        if (!this.vert_buffer) {
            console.error("Couldn't create vert_buffer");
            return;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vert_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

        // Create Faces Buffer (of vertex indices)
        this.face_buffer = gl.createBuffer();
        if (!this.face_buffer) {
            console.error("Couldn't create face_buffer");
            return;
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.face_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, faces, gl.STATIC_DRAW);

        // Set num verts/faces
        this.num_verts = faces.length;
    }
}