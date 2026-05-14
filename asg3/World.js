class World {

    model_matrix;

    world_data;
    mesh_data;
    texture;

    meshes;


    constructor(world_data, model_matrix, mesh_data, texture) {
        this.model_matrix = model_matrix;

        this.world_size = 10;
        this.world_height = 1;

        this.world_data = world_data;
        this.mesh_data = mesh_data;
        this.texture = texture;

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
                row.push(Math.floor(rand * rand * (this.world_height + 1)));
            }
            WORLD_DATA.push(row);
        }
        this.world_data = WORLD_DATA;
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
        this.meshes[0].simpleRenderSetup(gl, shader_var, camera);
        for (let mesh of this.meshes) {
            mesh.simpleRender(gl, shader_var, camera);
        }
    }
}