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

        // // Create Normal Direction Buffer
        // this.norm_buffer = gl.createBuffer();
        // if (!this.norm_buffer) {
        //     console.error("Couldn't create norm_buffer");
        //     return;
        // }

        // gl.bindBuffer(gl.ARRAY_BUFFER, this.norm_buffer);
        // gl.bufferData(gl.ARRAY_BUFFER, norms, gl.STATIC_DRAW);

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
const CUBE_VERTS = new Float32Array([
    -0.5, -0.5, -0.5,
     0.5, -0.5, -0.5,
     0.5, -0.5,  0.5,
    -0.5, -0.5,  0.5,
    -0.5,  0.5, -0.5,
     0.5,  0.5, -0.5,
     0.5,  0.5,  0.5,
    -0.5,  0.5,  0.5,
]);
// const CUBE_NORMS = new Float32Array([
//     -0.577, -0.577, -0.577,
//      0.577, -0.577, -0.577,
//      0.577, -0.577,  0.577,
//     -0.577, -0.577,  0.577,
//     -0.577,  0.577, -0.577,
//      0.577,  0.577, -0.577,
//      0.577,  0.577,  0.577,
//     -0.577,  0.577,  0.577,
// ]);
const CUBE_FACES = new Uint8Array([
    0, 1, 2,
    0, 2, 3,
    0, 5, 1,
    0, 4, 5,
    0, 3, 7,
    0, 7, 4,
    1, 6, 2,
    1, 5, 6,
    2, 7, 3,
    2, 6, 7,
    4, 6, 5,
    4, 7, 6
]);

// Pyramid
// const PYRAMID_VERTS = new Float32Array([
//     -0.5, -0.5, -0.5,
//      0.5, -0.5, -0.5,
//      0.5, -0.5,  0.5,
//     -0.5, -0.5,  0.5,
//     -0.5,  0.5, -0.5,
//      0.5,  0.5, -0.5,
//      0.5,  0.5,  0.5,
//     -0.5,  0.5,  0.5,
//      0,    0.5,  0,
// ]);
// const PYRAMID_NORMS = new Float32Array([
//     -0.577, -0.577, -0.577,
//      0.577, -0.577, -0.577,
//      0.577, -0.577,  0.577,
//     -0.577, -0.577,  0.577,
//     -0.577,  0.577, -0.577,
//      0.577,  0.577, -0.577,
//      0.577,  0.577,  0.577,
//     -0.577,  0.577,  0.577,
//      0,      1,      0,
// ]);
// const PYRAMID_FACES = new Uint8Array([
//     0, 1, 2,
//     0, 2, 3,
//     0, 8, 1,
//     1, 8, 2,
//     2, 8, 3,
//     3, 8, 0,
// ]);