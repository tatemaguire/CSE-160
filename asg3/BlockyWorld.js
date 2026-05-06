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

function main() {
    initProgram();
}

// Sets up canvas, gl, and gets shader variable locations
function initProgram() {
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