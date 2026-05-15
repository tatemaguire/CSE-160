// Vertex Shader Source GLSL ES
let VSHADER_SOURCE = `
uniform mat4 u_ProjectionMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ModelMatrix;

attribute vec4 a_Position;
attribute vec2 a_TexCoord;
attribute float a_TexID;

varying vec2 v_TexCoord;
varying float v_TexID;

void main()
{
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
    v_TexCoord = a_TexCoord;
    v_TexID = a_TexID;
}
`;

// Fragment Shader Source GLSL ES
let FSHADER_SOURCE = `
precision mediump float;

uniform vec4 u_BaseColor;
uniform sampler2D u_Sampler0;
uniform sampler2D u_Sampler1;
uniform float u_TexColorWeight;

varying vec2 v_TexCoord;
varying float v_TexID;

void main()
{
    float tex_id = v_TexID;
    vec4 image0 = texture2D(u_Sampler0, v_TexCoord) * tex_id;
    vec4 image1 = texture2D(u_Sampler1, v_TexCoord) * (1.0 - tex_id);
    vec4 texComponent = (image0 + image1) * u_TexColorWeight;
    vec4 baseComponent = u_BaseColor * (1.0 - u_TexColorWeight);

    gl_FragColor = texComponent + baseComponent;
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
    a_Position: -1,
    a_TexCoord: -1,
    a_TexID: -1,
    u_BaseColor: -1,
    u_Sampler0: -1,
    u_Sampler1: -1,
    u_TexColorWeight: -1,
};

// Input Status
let input = {
    left: false,
    right: false,
    up: false,
    down: false,
    turn_left: false,
    turn_right: false,
    place: false,
    break: false,
};

// Globals
let camera = null;
let scene = []; // array of meshes
let world = null;

let stats = new Stats();


function main()
{
    // Set up stats object
    stats.dom.style.left = "auto";
    stats.dom.style.right = "0";
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    // Start WebGL
    initProgram();
    getShaderVariableLocations();

    // Store global light direction
    gl.uniform3f(shader_var.u_GlobalLight, 0.8, 0.3, -1);

    buildScene();

    // Set up keyboard input
    document.onkeydown = keydown;
    document.onkeyup = keyup;
    canvas.onmousemove = mousemove;

    requestAnimationFrame(tick);
    // renderScene();
}


// ----------------------------------------------------------------------------
// Main Program Operations
// ----------------------------------------------------------------------------


function buildScene() {
    // Mesh and texture loading
    let cube_mesh_data = new MeshData(gl, CUBE_VERTS, CUBE_TEXCOORD);
    let redrock_texture = TextureLoader.requestTexture(gl, shader_var, './assets/redrock.png', 0);
    let bluerock_texture = TextureLoader.requestTexture(gl, shader_var, './assets/bluerock.png', 1);

    // Create Camera
    camera = new Camera(canvas.width/canvas.height);

    let M = new Matrix4();

    // create skybox
    M.setIdentity();
    M.scale(100, 100, 100);
    let skybox = new Mesh(cube_mesh_data, M, [0.2, 0.5, 0.8, 1], 0, 0);
    scene.push(skybox);

    // create world
    M.setTranslate(0.5, 0.5, 0.5);
    world = new World(gl, null, M, cube_mesh_data, 0);
    scene.push(world);

    // Create floor
    M.setTranslate(world.world_size / 2, -0.025, world.world_size / 2);
    M.scale(world.world_size + 2, 0.05, world.world_size + 2);
    let floor = new Mesh(cube_mesh_data, M, [0.5, 0.5, 0.1, 1], 0, 0);
    scene.push(floor);
}

// Called once per frame
function tick() {
    stats.begin();

    camera.parseInput(input);
    world.parseInput(input, camera);

    if (TextureLoader.isDoneLoading()) {
        renderScene();
    }
    else {
        console.log("loading...");
    }

    stats.end();

    requestAnimationFrame(tick);
}


// Render all meshes
function renderScene() {

    // Clear previous frame
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Render meshes
    for (let mesh of scene) {
        mesh.render(gl, shader_var, camera);
    }
}

// ----------------------------------------------------------------------------
// Input
// ----------------------------------------------------------------------------


// Get keyboard input
function keydown(ev) {
    if (ev.key == 'w') {
        input.up = true;
    }
    if (ev.key == 's') {
        input.down = true;
    }
    if (ev.key == 'a') {
        input.left = true;
    }
    if (ev.key == 'd') {
        input.right = true;
    }
    if (ev.key == 'q') {
        input.turn_left = true;
    }
    if (ev.key == 'e') {
        input.turn_right = true;
    }
    if (ev.key == 'r') {
        input.place = true;
    }
    if (ev.key == 'f') {
        input.break = true;
    }
}

function keyup(ev) {
    if (ev.key == 'w') {
        input.up = false;
    }
    if (ev.key == 's') {
        input.down = false;
    }
    if (ev.key == 'a') {
        input.left = false;
    }
    if (ev.key == 'd') {
        input.right = false;
    }
    if (ev.key == 'q') {
        input.turn_left = false;
    }
    if (ev.key == 'e') {
        input.turn_right = false;
    }
}

function mousemove(ev) {
    // console.log(ev.movementX, ev.movementY);
    if (ev.buttons & 1) {
        camera.rotateLook(ev.movementX, ev.movementY);
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