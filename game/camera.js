
class Camera
{
	constructor(gl, shaders)
	{
		this.gl = gl;
		this.shaders = shaders;
		
		this.x = 30;//Config.LADO_MAPA/2;
		this.y = 30;//Config.LADO_MAPA/2;
		
		// Matriz de projection.
		var ratioScreen = gl.canvas.width / gl.canvas.height;
		const left = -Config.ANCHO_PROJECTION/2;//-gl.canvas.width/2;
		const right = Config.ANCHO_PROJECTION/2;//gl.canvas.width/2;
		const bottom = -(Config.ANCHO_PROJECTION/ratioScreen)/2; //-gl.canvas.height/2;
		const top = (Config.ANCHO_PROJECTION/ratioScreen)/2;//gl.canvas.height/2;
		const near = Config.NEAR_ORTHO;
		const far = Config.FAR_ORTHO;
		this.projectionMatrix = mat4.create();
		mat4.ortho(this.projectionMatrix, left, right, bottom, top, near, far);
		
		// Coloco la camara en el mundo.
		var anguloX = -45;
		//var anguloZ = -45;
		var modelViewMatrix = mat4.create();
		mat4.rotate(modelViewMatrix, modelViewMatrix, this.torad(anguloX), [1, 0, 0]);
		//mat4.rotate(modelViewMatrix, modelViewMatrix, this.torad(anguloZ), [0, 0, 1]);
		mat4.translate(modelViewMatrix, modelViewMatrix, [-this.x, -this.y, 0]);
		
		shaders.setProjectionMatrix(gl, this.projectionMatrix);
		shaders.setModelViewMatrix(gl, modelViewMatrix);
	}

	// Muevo la camara.
	move(deltaX, deltaY, deltaZ)
	{
		this.x += deltaX;
		this.y += deltaY;
		
		// Mueve todo el mundo al lado contrario.
		this.shaders.move(-deltaX, -deltaY, -deltaZ);
	}
	
	torad(grad)
	{
		return grad*Math.PI / 180.0;
	}
}


