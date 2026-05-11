class MeshData {

    vert_buffer;
    texcoord_buffer;
    face_buffer;
    num_verts;

    constructor(gl, verts, texcoords, faces) {

        // Create Vertex Position Buffer
        this.vert_buffer = gl.createBuffer();
        if (!this.vert_buffer) {
            console.error("Couldn't create vert_buffer");
            return;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vert_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

        // Create Texel Position Buffer
        this.texcoord_buffer = gl.createBuffer();
        if (!this.texcoord_buffer) {
            console.error("Couldn't create texcoord_buffer");
            return;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoord_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, texcoords, gl.STATIC_DRAW);

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

// PRIMARY GEOMETRIC SHAPES

// Cube
// Basic Vertices:
// const CUBE_VERTS = new Float32Array([
//     -0.5, -0.5, -0.5,
//      0.5, -0.5, -0.5,
//      0.5, -0.5,  0.5,
//     -0.5, -0.5,  0.5,
//     -0.5,  0.5, -0.5,
//      0.5,  0.5, -0.5,
//      0.5,  0.5,  0.5,
//     -0.5,  0.5,  0.5,
// ]);
const CUBE_VERTS = new Float32Array([
    // Face 0123
    -0.5, -0.5, -0.5,
     0.5, -0.5, -0.5,
     0.5, -0.5,  0.5,
    -0.5, -0.5,  0.5,
    // Face 3267
    -0.5, -0.5,  0.5,
     0.5, -0.5,  0.5,
     0.5,  0.5,  0.5,
    -0.5,  0.5,  0.5,
    // Face 7654
    -0.5,  0.5,  0.5,
     0.5,  0.5,  0.5,
     0.5,  0.5, -0.5,
    -0.5,  0.5, -0.5,
    // Face 4510
    -0.5,  0.5, -0.5,
     0.5,  0.5, -0.5,
     0.5, -0.5, -0.5,
    -0.5, -0.5, -0.5,
    // Face 2156
     0.5, -0.5,  0.5,
     0.5, -0.5, -0.5,
     0.5,  0.5, -0.5,
     0.5,  0.5,  0.5,
    // Face 7403
    -0.5,  0.5,  0.5,
    -0.5,  0.5, -0.5,
    -0.5, -0.5, -0.5,
    -0.5, -0.5,  0.5,
]);
const CUBE_TEXCOORD = new Float32Array([
    0, 0,
    1, 0,
    1, 1,
    0, 1,

    0, 0,
    1, 0,
    1, 1,
    0, 1,

    0, 0,
    1, 0,
    1, 1,
    0, 1,

    0, 0,
    1, 0,
    1, 1,
    0, 1,

    0, 0,
    1, 0,
    1, 1,
    0, 1,

    0, 0,
    1, 0,
    1, 1,
    0, 1,
]);
const CUBE_FACES = new Uint8Array([
    0, 1, 2,
    0, 2, 3,

    4, 5, 6,
    4, 6, 7,

    8, 9, 10,
    8, 10, 11,

    12, 13, 14,
    12, 14, 15,

    16, 17, 18,
    16, 18, 19,

    20, 21, 22,
    20, 22, 23,
]);