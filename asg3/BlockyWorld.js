// Vertex Shader Source GLSL ES
let VSHADER_SOURCE = `
uniform mat4 u_ViewMatrix;
uniform mat4 u_ModelMatrix;
attribute vec4 a_Position;
void main()
{
    gl_Position = u_ViewMatrix * u_ModelMatrix * a_Position;
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
const vertices = new Float32Array([
    -0.5, -0.5, -0.5,
    0.5, -0.5, -0.5,
    0.5, -0.5, 0.5,
    -0.5, -0.5, 0.5,
    -0.5, 0.5, -0.5,
    0.5, 0.5, -0.5,
    0.5, 0.5, 0.5,
    -0.5, 0.5, 0.5,
    0, 0.5, 0,
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

// Variable Locations
let shader_var = {
    u_ViewMatrix: -1,
    u_ModelMatrix: -1,
    a_Position: -1,
    u_FragColor: -1
};

function main()
{
    initProgram();
    getShaderVariableLocations();

    Mesh.initializeBuffers(gl, vertices, cubeFaces);

    // Connect attributes to buffer
    gl.enableVertexAttribArray(shader_var.a_Position);
    gl.vertexAttribPointer(shader_var.a_Position, 3, gl.FLOAT, false, 0, 0);

    let M = new Matrix4();

    let GREEN = [0, 1, 0, 1];
    let my_obj = new Mesh(M, GREEN);

    let camera = new Matrix4();
    // camera.setTranslate(0, 0, 2);

    gl.uniformMatrix4fv(shader_var.u_ViewMatrix, false, camera.elements);

    my_obj.render(gl, shader_var);

}

// Sets up canvas, gl, and gets shader variable locations
function initProgram()
{
    // Get Canvas
    canvas = document.getElementById("webgl");
    if (!canvas) {
        console.error('Failed to get the canvas element');
        return;
    }
    
    // Get WebGL Context
    gl = getWebGLContext(canvas);
    if (!gl) {
        console.error('Failed to get the rendering context for WebGL');
        return;
    }

    // Parse Shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('Failed to intialize shaders.');
        return;
    }

    // Program Settings
    gl.enable(gl.DEPTH_TEST);

    // Initial Clear
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

// Gets variable locations from webgl, stores in shader_var object
function getShaderVariableLocations()
{
    shader_var.u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (shader_var.u_ViewMatrix < 0) {
        console.error('Failed to get the storage location of u_ViewMatrix');
        return;
    }

    shader_var.u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (shader_var.u_ModelMatrix < 0) {
        console.error('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    shader_var.a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (shader_var.a_Position < 0) {
        console.error('Failed to get the storage location of a_Position');
        return;
    }

    shader_var.u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (shader_var.u_FragColor < 0) {
        console.error('Failed to get the storage location of u_FragColor');
        return;
    }
}