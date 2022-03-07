
class InterpolationVertexLambertShader extends Shader
{
}

InterpolationVertexLambertShader.load = function(gl, ambientColor, lightColor, lightDir)
{
	var vsSource = `
		attribute vec4 aVertexPosition;
		attribute vec4 aVertexPosition2;
		attribute vec3 aVertexNormal;
		attribute vec3 aVertexNormal2;
		attribute vec2 aTextureCoord;

		uniform mat4 uModelViewMatrix;
		uniform mat4 uProjectionMatrix;
		uniform mat4 uNormalMatrix;
		uniform float interpolation;
	
		varying highp vec2 vTextureCoord;
		varying highp vec3 vLighting;
		
		void main() {
			gl_Position = (1.0-interpolation) * uProjectionMatrix * uModelViewMatrix * aVertexPosition + interpolation * uProjectionMatrix * uModelViewMatrix * aVertexPosition2;
			vTextureCoord = aTextureCoord;
			
			// Lighting.
			highp vec4 vNormal = (1.0-interpolation) * uNormalMatrix * vec4(aVertexNormal, 1.0) + interpolation * uNormalMatrix * vec4(aVertexNormal2, 1.0);
			highp vec3 ambientLight = vec3(`+ambientColor+`);
			highp vec3 directionalLightColor = vec3(`+lightColor+`);
			highp vec3 directionalVector = normalize(vec3(`+lightDir+`));

			highp float directional = max(dot(normalize(vNormal.xyz), directionalVector), 0.0);
			vLighting = ambientLight + (directionalLightColor * directional);
		}
	`;
	
	
	var fsSource = `
		varying highp vec2 vTextureCoord;
		varying highp vec3 vLighting;
		
		uniform highp vec4 uColor;
		uniform sampler2D uSampler;
		
		void main() {
			highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
			
			gl_FragColor = vec4(uColor.rgb * texelColor.rgb * vLighting, texelColor.a * uColor.a);
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
			vertexPosition2: gl.getAttribLocation(shaderProgram, 'aVertexPosition2'),
			vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
			vertexNormal2: gl.getAttribLocation(shaderProgram, 'aVertexNormal2'),
			textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord')
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
			modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
			normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
			uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
			color: gl.getUniformLocation(shaderProgram, 'uColor'),
			interpolation: gl.getUniformLocation(shaderProgram, 'interpolation')
		}
	};
}
