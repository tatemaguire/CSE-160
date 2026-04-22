// Vertex Shader Source GLSL ES
let VSHADER_SOURCE = `
attribute vec4 a_Position;
void main()
{
    gl_Position = a_Position;
}
`;

// Fragment Shader Source GLSL ES
let FSHADER_SOURCE = `
uniform vec4 u_FragColor;
void main()
{
    gl_FragColor = u_FragColor;
}
`;

// Canvas/Context References
let canvas;
let gl;

// Shader Variable Locations
let a_Position;
let u_FragColor;

function main() {
    initProgram();
}

// Sets up canvas, gl, and gets shader variable locations
function initProgram() {
    // --------------------------
    // Get WebGL Context
    // --------------------------

    canvas = document.getElementById("webgl");
    
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
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }
}