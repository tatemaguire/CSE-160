class World {

    model_matrix;

    world_data;
    cube_mesh_data;

    meshes;

    constructor(gl, world_data, model_matrix, mesh_data) {
        this.model_matrix = new Matrix4(model_matrix);

        this.world_size = 32;
        this.world_height = 4;

        this.world_data = world_data;
        this.cube_mesh_data = mesh_data;

        if (!this.world_data) {
            this.generateWorld();
        }

        this.verts = [];
        this.texcoords = [];
        this.tex_ids = [];

        this.mesh = null;
        this.mesh_data = null;

        this.gl = gl; // keep a reference

        this.generateMesh(gl);
    }

    parseInput(input, camera) {
        // If nothing pressed, return
        if (!input.place && !input.break) {
            return;
        }

        // Find location in front of camera
        let row = Math.floor(camera.at.elements[0]);
        let col = Math.floor(camera.at.elements[2]);

        // if out of bounds, cancel
        if (row < 0 || row >= this.world_size || col < 0 || col >= this.world_size) {
            input.place = false;
            input.break = false;
            return;
        }


        if (input.place) {
            // place block
            this.placeBlock(row, col);
            // Turn off input flag so it doesn't trigger next frame
            input.place = false;
        }
        
        if (input.break) {
            // break block
            this.breakBlock(row, col);
            // Turn off input flag so it doesn't trigger next frame
            input.break = false;
        }

        this.generateMesh(this.gl);
    }

    placeBlock(row, col) {
        let tile = this.world_data[row][col];
        if (tile.height < this.world_height) {
            tile.height++;
        }
    }

    breakBlock(row, col) {
        let tile = this.world_data[row][col];
        if (tile.height > 0) {
            tile.height--;
        }
    }

    generateWorld() {
        let WORLD_DATA = [];
        // Generate world
        for (let i = 0; i < this.world_size; i++) {
            let row = [];
            for (let j = 0; j < this.world_size; j++) {
                let rand = Math.random();
                let height = Math.floor(rand * rand * (this.world_height + 1));
                row.push({ height: height, tex_id: Math.floor(Math.random() * 2) });
            }
            WORLD_DATA.push(row);
        }
        this.world_data = WORLD_DATA;
    }

    generateMesh(gl) {
        this.verts = [];
        this.texcoords = [];
        this.tex_ids = [];

        for (let row in this.world_data) {
            for (let col in this.world_data[row]) {
                let tile = this.world_data[row][col];
                for (let y = 0; y < tile.height; y++) {
                    this.createCube(row, y, col, tile.tex_id);
                }
            }
        }

        this.mesh_data = new MeshData(gl, new Float32Array(this.verts), new Float32Array(this.texcoords), new Float32Array(this.tex_ids));
        this.mesh = new Mesh(this.mesh_data, this.model_matrix, [1,1,1,1], 0, 1);
    }

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