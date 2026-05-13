// Vertex Shader Source GLSL ES
let VSHADER_SOURCE = `
uniform mat4 u_ProjectionMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ModelMatrix;

attribute vec4 a_Position;
attribute vec3 a_Normal;
attribute vec2 a_TexCoord;

varying vec2 v_TexCoord;
varying vec3 v_Normal;

void main()
{
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
    v_TexCoord = a_TexCoord;

    vec3 worldNormal = (u_ModelMatrix * vec4(a_Normal, 1)).xyz;
    v_Normal = worldNormal;
}
`;

// Fragment Shader Source GLSL ES
let FSHADER_SOURCE = `
precision mediump float;

uniform vec4 u_BaseColor;
uniform sampler2D u_Sampler;
uniform float u_TexColorWeight;
uniform vec3 u_GlobalLight;

varying vec2 v_TexCoord;
varying vec3 v_Normal;

void main()
{
    vec4 texComponent = texture2D(u_Sampler, v_TexCoord) * u_TexColorWeight;
    vec4 baseComponent = u_BaseColor * (1.0 - u_TexColorWeight);

    float lv = dot(normalize(v_Normal), u_GlobalLight);
    lv = 1.0;
    vec4 lightMultiplier = vec4(lv, lv, lv, 1.0);

    gl_FragColor = (texComponent + baseComponent) * lightMultiplier;
}
`;

// Canvas/Context References
let canvas;
let gl;

// Variable Locations
let shader_var = {
    u_ProjectionMatrix: -1,
    u_ViewMatrix: -1,
    u_ModelMatrix: -1,
    u_GlobalLight: -1,
    a_Position: -1,
    a_Normal: -1,
    a_TexCoord: -1,
    u_BaseColor: -1,
    u_Sampler: -1,
    u_TexColorWeight: -1,
};

// DOM Elements
let rotation_input;
let texture_modifier_input;

// Globals
let camera = null;
let scene = []; // array of meshes
let world = null;


function main()
{
    initProgram();
    getShaderVariableLocations();

    let cube_mesh_data = new MeshData(gl, CUBE_VERTS, CUBE_NORMS, CUBE_TEXCOORD, CUBE_FACES);
    let redrock_texture = TextureLoader.requestTexture(gl, shader_var, './assets/redrock.png');
    let bluerock_texture = TextureLoader.requestTexture(gl, shader_var, './assets/bluerock.png');

    // Store global light direction
    gl.uniform3f(shader_var.u_GlobalLight, 0.8, 0.3, -1);

    // Create Camera
    camera = new Camera(canvas.width/canvas.height);

    // Create floor
    let M = new Matrix4();
    M.translate(2, -0.025, 2);
    M.scale(6, 0.05, 6);
    let floor = new Mesh(cube_mesh_data, M, [0.5, 0.5, 0.1, 1], bluerock_texture, 0);
    scene.push(floor);

    // create skybox
    M.setIdentity();
    M.scale(100, 100, 100);
    let skybox = new Mesh(cube_mesh_data, M, [0.2, 0.5, 0.8, 1], bluerock_texture, 0);
    scene.push(skybox);

    // create world
    M.setTranslate(0.5, 0.5, 0.5);
    let world = new World(WORLD_DATA, M, cube_mesh_data, redrock_texture);
    scene.push(world);

    // Set up keyboard input
    document.onkeydown = keydown;

    requestAnimationFrame(tick);
    // renderScene();
}


// ----------------------------------------------------------------------------
// Main Program Operations
// ----------------------------------------------------------------------------


// Called once per frame
function tick() {

    if (TextureLoader.isDoneLoading()) {
        renderScene();
    }
    else {
        console.log("loading...");
    }

    requestAnimationFrame(tick);
}


// Render all meshes
function renderScene() {

    // Clear previous frame
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // console.log(scene[0]);

    // Render meshes
    for (let mesh of scene) {
        mesh.render(gl, shader_var, camera);
    }
}


// Get keyboard input
function keydown(ev) {
    if (ev.key == 'w') {
        camera.moveForward();
    }
    if (ev.key == 's') {
        camera.moveBackward();
    }
    if (ev.key == 'a') {
        camera.moveLeft();
    }
    if (ev.key == 'd') {
        camera.moveRight();
    }
    if (ev.key == 'q') {
        camera.panLeft();
    }
    if (ev.key == 'e') {
        camera.panRight();
    }
}


// ----------------------------------------------------------------------------
// WebGL Initialization
// ----------------------------------------------------------------------------


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
    for (let var_name in shader_var) {
        // Get the variable location (depends on u/a prefix)
        if (var_name[0] === 'u') {
            shader_var[var_name] = gl.getUniformLocation(gl.program, var_name);
        }
        else if (var_name[0] === 'a') {
            shader_var[var_name] = gl.getAttribLocation(gl.program, var_name);
        }
        else {
            console.error("Variable name " + var_name + " not recognized");
        }

        // Throw error if not found
        if (shader_var[var_name] < 0) {
            console.error('Failed to get the storage location of' + var_name);
            return;
        }
    }
}