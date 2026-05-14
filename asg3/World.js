class World {

    model_matrix;

    world_data;
    mesh_data;

    meshes;


    constructor(world_data, model_matrix, mesh_data) {
        this.model_matrix = model_matrix;

        this.world_size = 10;
        this.world_height = 1;

        this.world_data = world_data;
        this.mesh_data = mesh_data;

        if (!this.world_data) {
            this.generateWorld();
        }

        this.meshes = [];
        this.generateMeshes();
    }

    generateWorld() {
        let WORLD_DATA = [];
        // Generate world
        for (let i = 0; i < this.world_size; i++) {
            let row = [];
            for (let j = 0; j < this.world_size; j++) {
                let rand = Math.random();
                rand = 0.8; // TODO: remove
                let height = Math.floor(rand * rand * (this.world_height + 1));
                row.push({ height: height, tex_id: Math.floor(Math.random() * 2) });
            }
            WORLD_DATA.push(row);
        }
        this.world_data = WORLD_DATA;
    }

    generateMeshes() {
        this.meshes = [];
        for (let row in this.world_data) {
            for (let col in this.world_data) {
                let tile = this.world_data[row][col];
                for (let y = 0; y < tile.height; y++) {
                    this.createCube(row, y, col, tile.tex_id);
                }
            }
        }
    }

    createCube(x, y, z, tex_id) {
        let M = new Matrix4(this.model_matrix);
        M.translate(x, y, z);
        let cube = new Mesh(this.mesh_data, M, [1,1,1,1], tex_id, 1);
        this.meshes.push(cube);
    }

    render(gl, shader_var, camera) {
        this.meshes[0].simpleRenderSetup(gl, shader_var, camera);
        for (let mesh of this.meshes) {
            mesh.simpleRender(gl, shader_var, camera);
        }
    }
}