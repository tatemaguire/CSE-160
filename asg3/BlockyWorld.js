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

// Globals
let view_matrix = new Matrix4();
let scene = []; // array of meshes

function main()
{
    initProgram();
    getShaderVariableLocations();

    let cube_mesh_data = new MeshData(gl, CUBE_VERTS, CUBE_FACES);
    let pyramid_mesh_data = new MeshData(gl, CUBE_VERTS, PYRAMID_FACES);

    // Connect attributes to buffer
    gl.enableVertexAttribArray(shader_var.a_Position);
    gl.vertexAttribPointer(shader_var.a_Position, 3, gl.FLOAT, false, 0, 0);

    // Create objects
    
    let M = new Matrix4();
    let GREEN = [0, 1, 0, 1];

    let pyramid = new Mesh(pyramid_mesh_data, M, GREEN);
    scene.push(pyramid);

    M.translate(0.5, 0.5, 0);
    M.scale(0.5, 0.5, 0.5);
    let cube = new Mesh(cube_mesh_data, M, [1, 0, 1, 1]);
    scene.push(cube);


    renderScene();

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


// Render all meshes
function renderScene() {

    // Store view matrix
    gl.uniformMatrix4fv(shader_var.u_ViewMatrix, false, view_matrix.elements);

    // Render meshes
    for (let mesh of scene) {
        mesh.render(gl, shader_var);
    }
}