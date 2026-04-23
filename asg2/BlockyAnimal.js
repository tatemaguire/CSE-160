// Vertex Shader Source GLSL ES
let VSHADER_SOURCE = `
uniform mat4 u_GlobalRotation;
uniform mat4 u_ModelMatrix;
attribute vec4 a_Position;
void main()
{
    gl_Position = u_GlobalRotation * u_ModelMatrix * a_Position;
}
`;

// Fragment Shader Source GLSL ES
let FSHADER_SOURCE = `
precision mediump float;
uniform vec4 u_FragColor;
void main()
{
    gl_FragColor = u_FragColor;
}
`;

// Cube Vertices
const cubeVertices = new Float32Array([
    -0.5, -0.5, -0.5,
    0.5, -0.5, -0.5,
    0.5, -0.5, 0.5,
    -0.5, -0.5, 0.5,
    -0.5, 0.5, -0.5,
    0.5, 0.5, -0.5,
    0.5, 0.5, 0.5,
    -0.5, 0.5, 0.5,
]);

// Cube Face Indices
const cubeFaces = new Uint8Array([
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

// Canvas/Context References
let canvas;
let gl;

// Shader Variable Locations
let a_Position;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotation;

// Buffer Locations
let cube_array_buffer;
let cube_element_buffer;

// Global Values
let global_rotation_matrix = new Matrix4();


// *************************
// Page Setup
// *************************


function main() {
    initProgram();
    initBuffers();

    // Setup input
    let globalRotationInput = document.getElementById("globalRotationInput");
    globalRotationInput.value = 180;
    globalRotationInput.addEventListener("input", updateGlobalRotation);

    renderScene();
}


// Get current input, set rotation matrix
function updateGlobalRotation(event) {
    let angle = event.target.value;
    // set angle range from -180 to 180
    angle -= 180;

    global_rotation_matrix = new Matrix4();
    global_rotation_matrix.rotate(angle, 0, 1, 0.2);

    renderScene();
}


// *************************
// WebGL Rendering
// *************************


// Sets up canvas, gl, and gets shader variable locations
function initProgram() {
    // --------------------------
    // Get WebGL Context
    // --------------------------

    canvas = document.getElementById("webgl");
    if (!canvas) {
        console.error('Failed to get the canvas element');
        return;
    }
    
    gl = getWebGLContext(canvas);
    if (!gl) {
        console.error('Failed to get the rendering context for WebGL');
        return;
    }

    // --------------------------
    // Parse Shaders
    // --------------------------

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('Failed to intialize shaders.');
        return;
    }

    // --------------------------
    // Get Shader Variable Locations
    // --------------------------

    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.error('Failed to get the storage location of a_Position');
        return;
    }

    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.error('Failed to get the storage location of u_FragColor');
        return;
    }

    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.error('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    u_GlobalRotation = gl.getUniformLocation(gl.program, 'u_GlobalRotation');
    if (!u_GlobalRotation) {
        console.error('Failed to get the storage location of u_GlobalRotation');
        return;
    }

    // -------------------------
    // Other Setup
    // -------------------------

    gl.enable(gl.DEPTH_TEST);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}


// Creates, Binds, and Writes to array and element buffers
function initBuffers() {
    // -------------------------
    // Init Array Buffer
    // -------------------------

    cube_array_buffer = gl.createBuffer();
    if (!cube_array_buffer) {
        console.error('Cube Vertex Buffer could not be created');
        return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, cube_array_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, cubeVertices, gl.STATIC_DRAW);

    // -------------------------
    // Init Element Buffer
    // -------------------------

    cube_element_buffer = gl.createBuffer();
    if (!cube_element_buffer) {
        console.error('Cube Element Buffer could not be created');
        return;
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube_element_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cubeFaces, gl.STATIC_DRAW);
}


// Draw a Cube
function drawCube(matrix, color) {
    // Set uniform variables
    gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, matrix.elements);
    gl.uniformMatrix4fv(u_GlobalRotation, false, global_rotation_matrix.elements);

    // Draw cube according to position indices in cube_element_buffer
    gl.drawElements(gl.TRIANGLES, cubeFaces.length, gl.UNSIGNED_BYTE, 0);
}


// Render the entire scene
function renderScene() {
    // ----------------------
    // Render Preparation
    // ----------------------

    // Clear screen
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Bind buffers to cube data
    gl.bindBuffer(gl.ARRAY_BUFFER, cube_array_buffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube_element_buffer);

    // Connect attributes to buffer
    gl.enableVertexAttribArray(a_Position);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    // ----------------------
    // Draw Ankylosaurus
    // ----------------------

    let M = new Matrix4();
    M.setScale(0.5, 1, 1);
    M.rotate(25, 1, 1, 0);

    let blue = [0.0, 0.5, 0.8, 1.0];

    drawCube(M, blue);

    M.setIdentity();
    M.translate(0.5, 0.5, 0.5);
    M.scale(0.1, 0.5, 0.2);
    M.rotate(18, 0.5, 0.2, 0.1);

    drawCube(M, blue);
}