class World {

    model_matrix;

    world_data;
    mesh_data;
    texture;

    meshes;


    constructor(world_data, model_matrix, mesh_data, texture) {
        this.model_matrix = model_matrix;

        this.world_data = world_data;
        this.mesh_data = mesh_data;
        this.texture = texture;

        this.meshes = [];
        this.generateMeshes();
    }

    generateMeshes() {
        this.meshes = [];
        for (let row in this.world_data) {
            for (let col in this.world_data) {
                let height = this.world_data[row][col];
                for (let y = 0; y < height; y++) {
                    this.createCube(row, y, col);
                }
            }
        }
    }

    createCube(x, y, z) {
        let M = new Matrix4(this.model_matrix);
        M.translate(x, y, z);
        let cube = new Mesh(this.mesh_data, M, [1,1,1,1], this.texture, 1);
        this.meshes.push(cube);
    }

    render(gl, shader_var, camera) {
        // console.log(this.meshes);
        for (let mesh of this.meshes) {
            mesh.render(gl, shader_var, camera);
        }
    }
}

const WORLD_DATA = [
    [2, 0, 0, 1],
    [1, 1, 0, 1],
    [1, 0, 0, 2],
    [1, 1, 1, 1],
]