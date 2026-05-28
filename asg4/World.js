class World {
    
    verts;
    tex_coords;
    mesh;
    
    transform;
    tex_id;

    constructor(gl, world_data, cube_mesh_data, tex_id) {
        
        this.verts = [];
        this.texcoords = [];
        this.mesh = null;
        
        this.transform = new Transform();
        this.tex_id = tex_id;

        this.generateMesh(gl, world_data, cube_mesh_data);
    }

    // creates one fat mesh out of world_data
    generateMesh(gl, world_data, cube_mesh_data) {
        this.verts = [];
        this.texcoords = [];
        this.norms = [];

        for (let row in world_data) {
            for (let col in world_data[row]) {
                let height = world_data[row][col];
                for (let y = 0; y < height; y++) {
                    this.createCube(cube_mesh_data, row, y, col);
                }
            }
        }

        const mesh_data = new MeshData(gl, 
            new Float32Array(this.verts), 
            new Float32Array(this.texcoords), 
            new Float32Array(this.norms));
        this.mesh = new Mesh(mesh_data, [1,1,1,1], this.tex_id, 1);
        this.mesh.transform = this.transform;
    }

    // appends cube at x,y,z to the end of verts, texcoords, and tex_ids
    createCube(mesh_data, x, y, z) {
        let start_i = this.verts.length;
        
        for (let val of mesh_data.verts) {
            this.verts.push(val);
        }

        for (let i = start_i; i < this.verts.length; i += 3) {
            // I have no idea why but I *have* to cast as numbers
            this.verts[i] += Number(x);
            this.verts[i+1] += Number(y);
            this.verts[i+2] += Number(z);
        }

        for (let val of mesh_data.texcoords) {
            this.texcoords.push(val);
        }

        for (let val of mesh_data.norms) {
            this.norms.push(val);
        }
    }

    render(gl, shader_var, camera) {
        this.mesh.render(gl, shader_var, camera);
    }
}


const WORLD_DATA_RED = [
    [2,0,0,0,0,0,0,2],
    [3,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,3],
    [2,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,2],
    [3,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,3],
    [4,3,3,4,4,3,3,4],
];
const WORLD_DATA_BLUE = [
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0],
    [0,1,1,0,0,0,2,0],
    [0,0,0,0,0,0,0,0],
];