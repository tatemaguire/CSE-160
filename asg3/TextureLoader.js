class TextureLoader {
    static textures_currently_loading = 0;
    static most_recent_request_time = 0;

    static requestTexture(gl, shader_var, filename) {
        let texture = gl.createTexture();

        let image = new Image();
        image.onload = function() { TextureLoader.loadTexture(gl, shader_var, texture, image); }

        // Make the request
        TextureLoader.textures_currently_loading++;
        TextureLoader.most_recent_request_time = Date.now();
        image.src = filename;

        return texture;
    }

    static loadTexture(gl, shader_var, texture, image) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

        TextureLoader.textures_currently_loading--;
    }

    static isDoneLoading() {
        let is_done = TextureLoader.textures_currently_loading === 0;
        
        if (is_done) {
            return true;
        }

        // If not done, check for timeout
        let time_passed = Date.now() - TextureLoader.most_recent_request_time;
        if (time_passed > 5000) {
            console.error("TextureLoader: timeout - textures haven't loaded after 5s");

            TextureLoader.textures_currently_loading = 0;
            return true;
        }

        return false;
    }
}