class MeshData {

    verts;
    texcoords;

    vert_buffer;
    texcoord_buffer;
    num_verts;

    constructor(gl, verts, texcoords) {

        this.vert_buffer = initBuffer(gl, gl.ARRAY_BUFFER, verts);
        this.texcoord_buffer = initBuffer(gl, gl.ARRAY_BUFFER, texcoords);

        // Set num verts
        this.num_verts = verts.length / 3;

        this.verts = verts;
        this.texcoords = texcoords;
    }
}

function initBuffer(gl, target, data) {
    // Create buffer
    let buffer = gl.createBuffer();
    if (!buffer) {
        console.error("Couldn't create buffer");
        return;
    }

    // Put data in buffer
    gl.bindBuffer(target, buffer);
    gl.bufferData(target, data, gl.STATIC_DRAW);

    return buffer;
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
    -0.5, -0.5, -0.5,
     0.5, -0.5,  0.5,
    -0.5, -0.5,  0.5,
    // Face 3267
    -0.5, -0.5,  0.5,
     0.5, -0.5,  0.5,
     0.5,  0.5,  0.5,
    -0.5, -0.5,  0.5,
     0.5,  0.5,  0.5,
    -0.5,  0.5,  0.5,
    // Face 7654
    -0.5,  0.5,  0.5,
     0.5,  0.5,  0.5,
     0.5,  0.5, -0.5,
    -0.5,  0.5,  0.5,
     0.5,  0.5, -0.5,
    -0.5,  0.5, -0.5,
    // Face 4510
    -0.5,  0.5, -0.5,
     0.5,  0.5, -0.5,
     0.5, -0.5, -0.5,
    -0.5,  0.5, -0.5,
     0.5, -0.5, -0.5,
    -0.5, -0.5, -0.5,
    // Face 2156
     0.5, -0.5,  0.5,
     0.5, -0.5, -0.5,
     0.5,  0.5, -0.5,
     0.5, -0.5,  0.5,
     0.5,  0.5, -0.5,
     0.5,  0.5,  0.5,
    // Face 7403
    -0.5,  0.5,  0.5,
    -0.5,  0.5, -0.5,
    -0.5, -0.5, -0.5,
    -0.5,  0.5,  0.5,
    -0.5, -0.5, -0.5,
    -0.5, -0.5,  0.5,
]);
const CUBE_TEXCOORD = new Float32Array([
    0, 0,
    1, 0,
    1, 1,
    0, 0,
    1, 1,
    0, 1,

    0, 0,
    1, 0,
    1, 1,
    0, 0,
    1, 1,
    0, 1,

    0, 0,
    1, 0,
    1, 1,
    0, 0,
    1, 1,
    0, 1,

    0, 0,
    1, 0,
    1, 1,
    0, 0,
    1, 1,
    0, 1,

    0, 0,
    1, 0,
    1, 1,
    0, 0,
    1, 1,
    0, 1,

    0, 0,
    1, 0,
    1, 1,
    0, 0,
    1, 1,
    0, 1,
]);
// const CUBE_FACES = new Uint8Array([
//     0, 1, 2,
//     0, 2, 3,

//     4, 5, 6,
//     4, 6, 7,

//     8, 9, 10,
//     8, 10, 11,

//     12, 13, 14,
//     12, 14, 15,

//     16, 17, 18,
//     16, 18, 19,

//     20, 21, 22,
//     20, 22, 23,
// ]);