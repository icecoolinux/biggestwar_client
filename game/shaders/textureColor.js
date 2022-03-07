
class TextureColorShader extends Shader{
}

TextureColorShader.load = function(gl)
{
	var vsSource = `
		attribute vec4 aVertexPosition;
		attribute vec4 aVertexColor;
		attribute vec2 aTextureCoord;

		uniform mat4 uModelViewMatrix;
		uniform mat4 uProjectionMatrix;

		varying lowp vec4 vColor;
		varying highp vec2 vTextureCoord;
		
		void main() {
			gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
			vColor = aVertexColor;
			vTextureCoord = aTextureCoord;
		}
	`;
	
	var fsSource = `
		varying lowp vec4 vColor;
		varying highp vec2 vTextureCoord;

		uniform sampler2D uSampler;
		
		void main() {
			gl_FragColor = vColor * texture2D(uSampler, vTextureCoord);
		}
	`;
	
	var vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource);
	var fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

	// Create the shader program
	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	// If creating the shader program failed, alert
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
		return null;
	}

	return {
		program: shaderProgram,
		attribLocations: {
			vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
			vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
			textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord')
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
			modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
			uSampler: gl.getUniformLocation(shaderProgram, 'uSampler')
		}
	};
}




