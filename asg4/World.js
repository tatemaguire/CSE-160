class World {

    model_matrix;

    world_data;
    cube_mesh_data;

    meshes;

    transform;

    constructor(gl, world_data, model_matrix, mesh_data) {
        this.model_matrix = new Matrix4(model_matrix);

        this.world_size = 8;
        this.world_height = 4;

        this.world_data = world_data;
        this.cube_mesh_data = mesh_data;

        this.verts = [];
        this.texcoords = [];
        this.tex_ids = [];

        this.mesh = null;
        this.mesh_data = null;

        this.transform = new Transform();

        this.gl = gl; // keep a reference

        this.generateMesh(gl);
    }

    generateMesh(gl) {
        this.verts = [];
        this.texcoords = [];
        this.tex_ids = [];

        for (let row in this.world_data) {
            for (let col in this.world_data[row]) {
                let height = this.world_data[row][col];
                for (let y = 0; y < height; y++) {
                    this.createCube(row, y, col, 1);
                }
            }
        }

        this.mesh_data = new MeshData(gl, new Float32Array(this.verts), new Float32Array(this.texcoords), new Float32Array(this.tex_ids));
        this.mesh = new Mesh(this.mesh_data, this.model_matrix, [1,1,1,1], 0, 1);
        this.mesh.transform = this.transform;
    }

    // appends cube at x,y,z to the end of verts, texcoords, and tex_ids
    createCube(x, y, z, tex_id) {
        let start_i = this.verts.length;
        
        for (let val of this.cube_mesh_data.verts) {
            this.verts.push(val);
        }

        for (let i = start_i; i < this.verts.length; i += 3) {
            // I have no idea why I have to cast as numbers
            this.verts[i] += Number(x);
            this.verts[i+1] += Number(y);
            this.verts[i+2] += Number(z);
        }

        for (let val of this.cube_mesh_data.texcoords) {
            this.texcoords.push(val);
            this.tex_ids.push(tex_id);
        }
    }

    render(gl, shader_var, camera) {
        this.mesh.render(gl, shader_var, camera);
    }
}

const WORLD_DATA = [
    [2,0,0,0,0,0,0,2],
    [3,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,3],
    [2,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,2],
    [3,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,3],
    [4,3,3,4,4,3,3,4],
];