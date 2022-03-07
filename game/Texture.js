

class Texture
{
	constructor(gl, url, done)
	{
        this.textures = [];
		if(Array.isArray(url))
		{
			const texture = this;
			function addNext(index)
			{
				if( index == (url.length-1) )
					texture.textures.push(texture.loadTexture(gl, url[index], done));
				else
					texture.textures.push(texture.loadTexture(gl, url[index], function(){addNext(index+1)} ));
			};
			addNext(0);
		}
		else
			this.textures.push(this.loadTexture(gl, url, done));
	}
	
	set(gl, index=0)
	{
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.textures[index]);
	}
	
	
	//
	// Initialize a texture and load an image.
	// When the image finished loading copy it into the texture.
	//
	loadTexture(gl, url, done) 
	{
		var tex = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, tex);

		// Because images have to be download over the internet
		// they might take a moment until they are ready.
		// Until then put a single pixel in the texture so we can
		// use it immediately. When the image has finished downloading
		// we'll update the texture with the contents of the image.
		const level = 0;
		const internalFormat = gl.RGBA;
		const width = 1;
		const height = 1;
		const border = 0;
		const srcFormat = gl.RGBA;
		const srcType = gl.UNSIGNED_BYTE;
		const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
		gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
						width, height, border, srcFormat, srcType,
						pixel);

		const image = new Image();
		const _this = this;
		image.onload = function()
		{
			gl.bindTexture(gl.TEXTURE_2D, tex);
			gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);

			// Generate mips.
			gl.generateMipmap(gl.TEXTURE_2D);

			done();
		};

		image.src = url;
		
		return tex;
	}
}




