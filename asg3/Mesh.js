class Mesh {

    mesh_data;
    model_matrix;
    base_color;

    constructor(mesh_data, model_matrix, base_color) {
        this.mesh_data = mesh_data
        this.model_matrix = new Matrix4(model_matrix);
        this.base_color = new Float32Array(base_color);

        if (!mesh_data.vert_buffer || !mesh_data.texcoord_buffer || !mesh_data.face_buffer || !mesh_data.num_verts) {
            console.error("Mesh data is invalid");
            return;
        }
    }

    // Draw using mesh data, model matrix, and base color
    render(gl, shader_var) {

        
        // Setup vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh_data.vert_buffer);
        gl.enableVertexAttribArray(shader_var.a_Position);
        gl.vertexAttribPointer(shader_var.a_Position, 3, gl.FLOAT, false, 0, 0);

        // Setup texcoord buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh_data.texcoord_buffer);
        gl.enableVertexAttribArray(shader_var.a_TexCoord);
        gl.vertexAttribPointer(shader_var.a_TexCoord, 2, gl.FLOAT, false, 0, 0);

        // Setup face indices buffer
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh_data.face_buffer);

        // Set uniform variables
        gl.uniform4fv(shader_var.u_BaseColor, this.base_color);
        gl.uniformMatrix4fv(shader_var.u_ModelMatrix, false, this.model_matrix.elements);

        // Draw cube according to position indices in cube_element_buffer
        gl.drawElements(gl.TRIANGLES, this.mesh_data.num_verts, gl.UNSIGNED_BYTE, 0);
    }
}