
class Shaders
{
	constructor(gl)
	{
		this.gl = gl;
		
		this.programs = Shaders.makePrograms(gl);
		this.currentProgram = this.programs[0];
		
		this.color = [1,1,1,1];
		
		// Atributos uniform, matrices de proyection y modelview.
		this.modelViewMatrix = mat4.create();
		this.projectionMatrix = mat4.create();
		this.normalMatrix = mat4.create();

		// Model view matrix and normal matrix stacks.
		this.stackModelViewMatrix = [];
		this.stackNormalMatrix = [];
	}
	
	// Asigna el shader para utilizarlo.
	// Programs: 
	//    'textureColor'
	//    'texture'
	//    'color'
	//    'lambert'
	//    'phong'
	//    'interpolationVertexLambert'
	//    'interpolationVertexPhong'
	set(gl, program)
	{
		this.currentProgram = this.programs[program];
		gl.useProgram(this.currentProgram.program);

		// Copio atributos uniform: matrices de projection, modelview y normal
		gl.uniformMatrix4fv(this.currentProgram.uniformLocations.projectionMatrix, false, this.projectionMatrix);
		gl.uniformMatrix4fv(this.currentProgram.uniformLocations.modelViewMatrix, false, this.modelViewMatrix);
		gl.uniformMatrix4fv(this.currentProgram.uniformLocations.normalMatrix, false, this.normalMatrix);
		
		if(this.currentProgram.uniformLocations.hasOwnProperty('color'))
			gl.uniform4fv(this.currentProgram.uniformLocations.color, this.color);
	}
	
	setColor(r, g, b, a)
	{
		this.color = [r,g,b,a];
		
		if(this.currentProgram.uniformLocations.hasOwnProperty('color'))
			gl.uniform4fv(this.currentProgram.uniformLocations.color, this.color);
	}
	
	clearColor()
	{
		this.color = [1,1,1,1];
		
		if(this.currentProgram.uniformLocations.hasOwnProperty('color'))
			gl.uniform4fv(this.currentProgram.uniformLocations.color, this.color);
	}
	
	// Setea matrix de proyeccion.
	setProjectionMatrix(gl, projectionMatrix)
	{
		mat4.copy(this.projectionMatrix, projectionMatrix);
		gl.uniformMatrix4fv(this.currentProgram.uniformLocations.projectionMatrix, false, projectionMatrix);
	}
	
	// Setea matriz de modelo.
	setModelViewMatrix(gl, modelViewMatrix)
	{
		mat4.copy(this.modelViewMatrix, modelViewMatrix);
		gl.uniformMatrix4fv(this.currentProgram.uniformLocations.modelViewMatrix, false, modelViewMatrix);
		
		// Normal matrix.
		mat4.invert(this.normalMatrix, this.modelViewMatrix);
		mat4.transpose(this.normalMatrix, this.normalMatrix);
		gl.uniformMatrix4fv(this.currentProgram.uniformLocations.normalMatrix, false, this.normalMatrix);
	}
	
	// Activa un atributo del shader y lo asocia al buffer.
	// attr: 'vertexPosition', 'vertexColor', 'textureCoord', 'vertexPosition2'
	enableBufferAttrib(gl, buffer, sizeComp, attr)
	{
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.vertexAttribPointer(this.currentProgram.attribLocations[attr], sizeComp, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.currentProgram.attribLocations[attr]);
	}
	
	
	// Aplica translacion a la matriz de view.
	move(deltaX, deltaY, deltaZ)
	{
		mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [deltaX, deltaY, deltaZ]);
		this.gl.uniformMatrix4fv(this.currentProgram.uniformLocations.modelViewMatrix, false, this.modelViewMatrix);
		
		// Normal matrix.
		mat4.invert(this.normalMatrix, this.modelViewMatrix);
		mat4.transpose(this.normalMatrix, this.normalMatrix);
		gl.uniformMatrix4fv(this.currentProgram.uniformLocations.normalMatrix, false, this.normalMatrix);
	}
	
	// Aplica rotacion a la matriz de view.
	rotate(angulo, ejeX, ejeY, ejeZ)
	{
		mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, this.torad(angulo), [ejeX, ejeY, ejeZ]);
		this.gl.uniformMatrix4fv(this.currentProgram.uniformLocations.modelViewMatrix, false, this.modelViewMatrix);
		
		// Normal matrix.
		mat4.invert(this.normalMatrix, this.modelViewMatrix);
		mat4.transpose(this.normalMatrix, this.normalMatrix);
		gl.uniformMatrix4fv(this.currentProgram.uniformLocations.normalMatrix, false, this.normalMatrix);
	}
	
	// Aplica escalada a la matriz de view.
	scale(ejeX, ejeY, ejeZ)
	{
		mat4.scale(this.modelViewMatrix, this.modelViewMatrix, [ejeX, ejeY, ejeZ]);
		this.gl.uniformMatrix4fv(this.currentProgram.uniformLocations.modelViewMatrix, false, this.modelViewMatrix);
		
		// Normal matrix.
		mat4.invert(this.normalMatrix, this.modelViewMatrix);
		mat4.transpose(this.normalMatrix, this.normalMatrix);
		gl.uniformMatrix4fv(this.currentProgram.uniformLocations.normalMatrix, false, this.normalMatrix);
	}
	
	// Recupera matriz modelView en el stack.
	popMatrix()
	{
		this.modelViewMatrix = this.stackModelViewMatrix.pop();
		this.normalMatrix = this.stackNormalMatrix.pop();
	}
	
	// Coloca matriz modelView en el stack.
	pushMatrix()
	{
		var mat = mat4.create();
		mat4.copy(mat, this.modelViewMatrix);
		this.stackModelViewMatrix.push(mat);
		
		mat = mat4.create();
		mat4.copy(mat, this.normalMatrix);
		this.stackNormalMatrix.push(mat);
	}
	
	torad(grad)
	{
		return grad*Math.PI / 180.0;
	}
}



Shaders.makePrograms = function(gl)
{
	var programs = {};

	programs.textureColor = TextureColorShader.load(gl);
	programs.texture = TextureShader.load(gl);
	programs.color = ColorShader.load(gl);
	
	programs.lambert = LambertShader.load(gl, Config.AMBIENT_COLOR, Config.SUN_COLOR, Config.SUN_DIR);
	programs.interpolationVertexLambert = InterpolationVertexLambertShader.load(gl, Config.AMBIENT_COLOR, Config.SUN_COLOR, Config.SUN_DIR);
	
	programs.phong = PhongShader.load(gl, Config.AMBIENT_COLOR, Config.SUN_COLOR, Config.SUN_DIR);
	programs.interpolationVertexPhong = InterpolationVertexPhongShader.load(gl, Config.AMBIENT_COLOR, Config.SUN_COLOR, Config.SUN_DIR);
	
	return programs;
}

Shaders.loadBufferFloat32 = function(gl, data, components)
{
	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
	
	return {
		buffer: buffer,
		size: components
	};
}

Shaders.loadBufferElementUint16 = function(gl, data, components)
{
	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
	
	return {
		buffer: buffer,
		size: components
	};
}






