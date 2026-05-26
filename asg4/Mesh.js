class Mesh {

    mesh_data;
    model_matrix;
    base_color;
    texture_id;
    tex_color_weight;

    constructor(mesh_data, model_matrix, base_color, texture_id, tex_color_weight) {
        this.mesh_data = mesh_data
        this.model_matrix = new Matrix4(model_matrix);
        this.base_color = new Float32Array(base_color);
        this.texture_id = texture_id;
        this.tex_color_weight = tex_color_weight;

        if (!mesh_data.vert_buffer || !mesh_data.texcoord_buffer || !mesh_data.num_verts) {
            console.error("Mesh data is invalid");
            return;
        }
    }

    // Draw using mesh data, model matrix, and base color
    render(gl, shader_var, camera) {
        this.simpleRenderSetup(gl, shader_var, camera);
        this.simpleRender(gl, shader_var, camera);
    }

    simpleRenderSetup(gl, shader_var, camera) {
        // Setup vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh_data.vert_buffer);
        gl.enableVertexAttribArray(shader_var.a_Position);
        gl.vertexAttribPointer(shader_var.a_Position, 3, gl.FLOAT, false, 0, 0);

        // Setup texcoord buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh_data.texcoord_buffer);
        gl.enableVertexAttribArray(shader_var.a_TexCoord);
        gl.vertexAttribPointer(shader_var.a_TexCoord, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh_data.tex_id_buffer);
        gl.enableVertexAttribArray(shader_var.a_TexID);
        gl.vertexAttribPointer(shader_var.a_TexID, 1, gl.FLOAT, false, 0, 0);
        
        // Set uniform variables (baseColor, TexColorWeight, ModelMatrix)
        gl.uniform4fv(shader_var.u_BaseColor, this.base_color);
        gl.uniform1f(shader_var.u_TexColorWeight, this.tex_color_weight);

        // set VP matrices
        gl.uniformMatrix4fv(shader_var.u_ProjectionMatrix, false, camera.projection_matrix.elements);
        gl.uniformMatrix4fv(shader_var.u_ViewMatrix, false, camera.view_matrix.elements);
    }

    simpleRender(gl, shader_var, camera) {
        // Setup texture uniform
        gl.uniform1i(shader_var.u_Sampler0, 0);
        gl.uniform1i(shader_var.u_Sampler1, 1);

        // Set model matrix matrices
        gl.uniformMatrix4fv(shader_var.u_ModelMatrix, false, this.model_matrix.elements);

        // draw it
        gl.drawArrays(gl.TRIANGLES, 0, this.mesh_data.num_verts);
    }
}