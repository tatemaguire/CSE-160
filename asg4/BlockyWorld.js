// Vertex Shader Source GLSL ES
let VSHADER_SOURCE = `
uniform mat4 u_ProjectionMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ModelMatrix;
uniform mat4 u_NormalMatrix;

attribute vec4 a_Position;
attribute vec2 a_TexCoord;
attribute vec3 a_Normal;

varying vec3 v_Position;
varying vec2 v_TexCoord;
varying vec3 v_Normal;

void main()
{
    vec4 worldPosition = u_ModelMatrix * a_Position;

    gl_Position = u_ProjectionMatrix * u_ViewMatrix * worldPosition;

    v_Position = worldPosition.xyz;
    v_TexCoord = a_TexCoord;
    v_Normal = (u_NormalMatrix * vec4(a_Normal, 1.0)).xyz;
}
`;

// Fragment Shader Source GLSL ES
let FSHADER_SOURCE = `
precision mediump float;

uniform sampler2D u_Sampler0;
uniform sampler2D u_Sampler1;

uniform vec4 u_BaseColor;
uniform int u_TexID;
uniform float u_TexColorWeight;

uniform vec3 u_LightPosition;
uniform vec4 u_LightColor;
uniform float u_LightIntensity;

varying vec3 v_Position;
varying vec2 v_TexCoord;
varying vec3 v_Normal;

void main()
{
    // Get pixel color from texture
    vec4 image;
    if (u_TexID == 0) {
        image = texture2D(u_Sampler0, v_TexCoord);
    }
    else {
        image = texture2D(u_Sampler1, v_TexCoord);
    }
    
    // Combine texture and base color into "color"
    vec4 texComponent = image * u_TexColorWeight;
    vec4 baseComponent = u_BaseColor * (1.0 - u_TexColorWeight);
    vec4 color = texComponent + baseComponent;

    // Lighting
    vec3 normal = normalize(v_Normal);
    vec3 lightDistance = u_LightPosition - v_Position;
    vec3 lightDir = normalize(lightDistance);
    float NdotL = dot(normal, lightDir);

    NdotL *=  (1.0 - length(lightDistance) / 10.0);
    NdotL = clamp(NdotL, 0.0, 1.0);

    color *= NdotL;

    gl_FragColor = vec4(color.xyz, 1);
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
    u_NormalMatrix: -1,
    a_Position: -1,
    a_TexCoord: -1,
    a_Normal: -1,
    u_Sampler0: -1,
    u_Sampler1: -1,
    u_BaseColor: -1,
    u_TexID: -1,
    u_TexColorWeight: -1,
    u_LightPosition: -1,
    u_LightColor: -1,
    u_LightIntensity: -1,
};

// Input Status
let input = {
    left: false,
    right: false,
    up: false,
    down: false,
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

    buildScene();

    // Set up keyboard input
    document.onkeydown = keydown;
    document.onkeyup = keyup;
    canvas.onmousemove = mousemove;

    requestAnimationFrame(tick);
}


// ----------------------------------------------------------------------------
// Main Program Operations
// ----------------------------------------------------------------------------


function buildScene() {
    // Mesh and texture loading
    let cube_mesh_data = new MeshData(gl, CUBE_VERTS, CUBE_TEXCOORD, CUBE_NORMS);
    let redrock_texture = TextureLoader.requestTexture(gl, shader_var, './assets/redrock.png', 0);
    let bluerock_texture = TextureLoader.requestTexture(gl, shader_var, './assets/bluerock.png', 1);

    // Setup texture uniform
    gl.uniform1i(shader_var.u_Sampler0, 0);
    gl.uniform1i(shader_var.u_Sampler1, 1);

    // Setup global light
    gl.uniform3f(shader_var.u_LightPosition, 0, 5, 5);
    gl.uniform4f(shader_var.u_LightColor, 1, 1, 1, 1);
    gl.uniform1f(shader_var.u_LightIntensity, 1);

    // Create cube at light position
    let lightCube = new Mesh(cube_mesh_data, [1, 1, 1, 1], 0, 0);
    lightCube.transform.position.set([0, 5, 5]);
    lightCube.transform.scale.set([0.5, 0.5, 0.5]);
    scene.push(lightCube);

    // Create Camera
    camera = new Camera(canvas.width/canvas.height);

    const world_size = WORLD_DATA_RED.length;

    // create skybox
    let skybox = new Mesh(cube_mesh_data, [0.2, 0.5, 0.8, 1], 0, 0);
    // skybox.transform.scale = new Vector3([100, 100, 100]);
    skybox.transform.scale.set([100, 100, 100]);
    scene.push(skybox);

    // create world
    world = new World(gl, WORLD_DATA_RED, cube_mesh_data, 0);
    world.transform.position.set([0.5, 0.5, 0.5]);
    scene.push(world);

    let blue_world = new World(gl, WORLD_DATA_BLUE, cube_mesh_data, 1);
    blue_world.transform.position.set([0.5, 0.5, 0.5]);
    scene.push(blue_world);

    // Create floor
    let floor = new Mesh(cube_mesh_data, [0.5, 0.5, 0.1, 1], 0, 0);
    floor.transform.position.set([world_size / 2, -0.025, world_size / 2]);
    floor.transform.scale.set([world_size + 2, 0.05, world_size + 2]);
    scene.push(floor);
}

// Called once per frame
function tick() {
    stats.begin();

    camera.parseInput(input);
    let camPos = camera.eye.elements;
    gl.uniform3f(shader_var.u_LightPosition, camPos[0], camPos[1], camPos[2]);

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