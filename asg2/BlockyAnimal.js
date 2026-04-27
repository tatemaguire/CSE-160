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

// Colors
const BLUE = [0.2, 0.4, 0.6, 1.0];
const PURPLE = [0.3, 0.15, 0.3, 1.0];
const IVORY = [0.6, 0.6, 0.5, 1.0];

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

// Animation Angles
let globalRotationAngle = 0;
let global_rotation_matrix = null;

let thighJointAngle = 0;
let calfJointAngle = 0;
let footJointAngle = 0;
let tailJointAngle = 0;
let headJointAngle = 0;

// Animation State
let lastTime = 0;
let timeElapsed = 0;
let isAnimating = false;


// *************************
// Page Setup
// *************************


function main() {
    initProgram();
    initBuffers();

    // Set Up Animation Checkbox
    let animationCheckbox = document.getElementById("animationInput");
    animationCheckbox.addEventListener("click", (ev) => {
        isAnimating = ev.target.checked;
    });
    isAnimating = animationCheckbox.checked;

    getJointInput();

    lastTime = Date.now();
    tick();
}

function tick() {
    // Calculate deltaTime
    let now = Date.now();
    let deltaTime = now - lastTime;
    lastTime = now;

    getGlobalRotationInput();

    if (isAnimating) {
        animateJoints(deltaTime);
    } else {
        getJointInput();
    }

    renderScene();

    requestAnimationFrame(tick);
}


function animateJoints(dt) {
    timeElapsed += dt / 1000;

    let speed = 5;

    // t, s, and slowT are measures of the frame of the animation cycle
    let t = Math.sin(timeElapsed * speed);
    let s = Math.cos(timeElapsed * speed);
    let doubleT = Math.sin(timeElapsed * speed / 2);

    thighJointAngle = t * 30;
    calfJointAngle = s * 20;
    footJointAngle = t * (-10);
    tailJointAngle = doubleT * 20;
    headJointAngle = Math.abs(t * 20) - 20;
}


// ****************
// Input Handlers
// ****************

// Setup input
let globalRotationInput = document.getElementById("globalRotationInput");
let thighJointInput = document.getElementById("thighJointInput");
let calfJointInput = document.getElementById("calfJointInput");
let footJointInput = document.getElementById("footJointInput");
let tailJointInput = document.getElementById("tailJointInput");
let headJointInput = document.getElementById("headJointInput");

// Get data from all input
function getJointInput() {
    thighJointAngle = thighJointInput.value;
    calfJointAngle = calfJointInput.value;
    footJointAngle = footJointInput.value;
    tailJointAngle = tailJointInput.value;
    headJointAngle = headJointInput.value;
}

function getGlobalRotationInput() {
    globalRotationAngle = -globalRotationInput.value;
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

    // Global Rotation
    let global_rotation_M = new Matrix4();
    global_rotation_M.rotate(globalRotationAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_GlobalRotation, false, global_rotation_M.elements);

    // ----------------------
    // Draw Ankylosaurus
    // ----------------------

    let M = new Matrix4();

    // Center plate
    drawBackplate(M);

    // Front Center Plate
    M.setIdentity();
    M.translate(0.225, -0.03, 0);
    M.scale(0.8, 0.8, 0.8);
    drawBackplate(M);

    // Back Center Plate
    M.setIdentity();
    M.translate(-0.225, -0.03, 0);
    M.scale(0.8, 0.8, 0.8);
    drawBackplate(M);

    // Front Plate
    M.setIdentity();
    M.translate(0.4, -0.06, 0);
    M.scale(0.6, 0.6, 0.6);
    drawBackplate(M);

    // Back Plate
    M.setIdentity();
    M.translate(-0.4, -0.06, 0);
    M.scale(0.6, 0.6, 0.6);
    drawBackplate(M);


    // Belly
    M.setIdentity();
    M.translate(0, -0.15, 0);
    M.scale(0.8, 0.1, 0.6);
    drawCube(M, BLUE);


    // Back Right Leg
    M.setTranslate(-0.3, -0.2, -0.24);
    drawLeg(M, thighJointAngle, calfJointAngle, footJointAngle);

    // Back Left Leg
    M.setTranslate(-0.3, -0.2, 0.24);
    drawLeg(M, -thighJointAngle, -calfJointAngle, -footJointAngle);

    // Front Right Leg
    M.setTranslate(0.3, -0.25, -0.31);
    M.scale(0.8, 0.8, 0.8);
    drawLeg(M, -thighJointAngle, -calfJointAngle, -footJointAngle);

    // Front Left Leg
    M.setTranslate(0.3, -0.25, 0.31);
    M.scale(0.8, 0.8, 0.8);
    drawLeg(M, thighJointAngle, calfJointAngle, footJointAngle);


    // Tail

    M.setTranslate(-0.53, -0.07, 0);
    M.rotate(tailJointAngle, 0, 1, 0);
    M.scale(0.45, 0.45, 0.45);
    drawBackplate(M);

    for (let i = 0; i < 6; i++) {
        M.translate(-0.22, 0, 0);
        M.scale(0.85, 0.85, 0.85);
        drawBackplate(M);
    }


    // Neck
    M.setTranslate(0.53, -0.07, 0);
    M.rotate(headJointAngle/2, 0, 0, 1);
    M.scale(0.45, 0.45, 0.45);
    drawBackplate(M);

    // Head
    M.translate(0.25, 0, 0);
    M.rotate(headJointAngle/2, 0, 0, 1);
    M.scale(0.5, 0.4, 0.5);
    drawCube(M, BLUE);

    // Hat
    M.translate(0, 0.5, 0);
    M.scale(1.1, 0.5, 1.1);
    drawCube(M, PURPLE);
    let hat_M = new Matrix4(M);

    // Right Head Horn
    M.translate(0.2, 0.4, -0.5);
    M.scale(0.25, 0.5, 0.25);
    drawCube(M, IVORY);

    // Left Head Horn
    M = hat_M;
    M.translate(0.2, 0.4, 0.5);
    M.scale(0.25, 0.5, 0.25);
    drawCube(M, IVORY);

}

function drawLeg(matrix, thighAngle, calfAngle, footAngle) {
    let M = new Matrix4(matrix);

    // Thigh
    // M.setTranslate(-0.3, -0.2, -0.31);
    rotateAround(M, thighAngle, 0, 0, 1, 0, 0.125, 0);
    let unscaled_M = new Matrix4(M);
    M.scale(0.2, 0.25, 0.2);
    drawCube(M, BLUE);

    // Calf
    M = unscaled_M;
    rotateAround(M, calfAngle, 0, 0, 1, 0, -0.1, 0);
    M.translate(0, -0.2, 0);
    unscaled_M = new Matrix4(M);
    M.scale(0.15, 0.2, 0.15);
    drawCube(M, BLUE);

    // Foot
    M = unscaled_M;
    rotateAround(M, footAngle, 0,0,1, 0,-0.1,0);
    M.translate(0.05, -0.1, 0);
    M.scale(0.25, 0.1, 0.15);
    drawCube(M, BLUE);
}

// Draw backplate piece
function drawBackplate(matrix) {
    // Base Plate
    let M = new Matrix4(matrix);
    M.translate(0, 0.05, 0);
    M.scale(0.25, 0.4, 0.8);
    drawCube(M, PURPLE);

    // Center Horn
    M.set(matrix);
    M.translate(0, 0.26, 0);
    M.scale(0.1, 0.1, 0.1);
    drawCube(M, IVORY);

    // Left Center Horn
    M.set(matrix);
    M.translate(0, 0.245, 0.2);
    M.scale(0.1, 0.1, 0.1);
    drawCube(M, IVORY);

    // Right Center Horn
    M.set(matrix);
    M.translate(0, 0.245, -0.2);
    M.scale(0.1, 0.1, 0.1);
    drawCube(M, IVORY);

    // Left Horn
    M.set(matrix);
    M.translate(0, 0.23, 0.39);
    M.scale(0.08, 0.08, 0.08);
    drawCube(M, IVORY);

    // Right Horn
    M.set(matrix);
    M.translate(0, 0.23, -0.39);
    M.scale(0.08, 0.08, 0.08);
    drawCube(M, IVORY);

    // Left Side Horn
    M.set(matrix);
    M.translate(0, 0.05, 0.39);
    M.scale(0.08, 0.08, 0.08);
    drawCube(M, IVORY);

    // Right Side Horn
    M.set(matrix);
    M.translate(0, 0.05, -0.39);
    M.scale(0.08, 0.08, 0.08);
    drawCube(M, IVORY);
}

// *******************
// Helper Functions
// *******************

// rotate about a specific point
function rotateAround(M, angle, x, y, z, px, py, pz) {
    M.translate(px, py, pz);
    M.rotate(angle, x, y, z);
    M.translate(-px, -py, -pz);
}