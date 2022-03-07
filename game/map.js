
class Map
{
	constructor(gl, shaders, camera)
	{
		this.camera = camera;
		
		this.area = new Area();
		this.terrain = new Terrain(gl, shaders, camera);
		this.minerals = [];
		
		this.basesZones = [];
		
		this.baseZoneTexture = Textures.getGL("basezone");
		this.vertexBufferBaseZones = null;
		this.colorsBaseZones = [];
		for(var i=0; i<10; i++)
			this.colorsBaseZones.push( [1.0, 0 , 0, 0.5 - 0.3*(i/10)] );
		this.textureCoordBufferBaseZones = null;
		this.indexBufferBaseZones = null;
	}
	
	getArea()
	{
		return this.area;
	}
	
	setBasesZones(addBasesZones, delBasesZones)
	{
		for(var i=0; i<delBasesZones.length; i++)
		{
			for(var j=0; j<this.basesZones.length; j++)
			{
				if( Geom.dist(this.basesZones[j].pos, delBasesZones[i]) < this.basesZones[j].radio )
				{
					this.basesZones.splice(j,1);
					break;
				}
			}
		}
		
		for(var i=0; i<addBasesZones.length; i++)
			this.basesZones.push(addBasesZones[i]);
		
		if(this.basesZones.length > 0)
		{
			var vertices = [];
			var texCoords = [];
			var areaIndices = [];
			for(var i=0; i<this.basesZones.length; i++)
			{
				var bz = this.basesZones[i];
			
				// Vertices
				vertices.push(bz.pos.x -bz.radio, bz.pos.y -bz.radio, 0.2, // 0
							bz.pos.x +bz.radio, bz.pos.y -bz.radio, 0.2, // 1
							bz.pos.x +bz.radio, bz.pos.y +bz.radio, 0.2, // 2
							bz.pos.x -bz.radio, bz.pos.y +bz.radio, 0.2); // 3

				// Texture coords.
				texCoords.push(0,1, // 0
								1,1, // 1
								1,0, // 2
								0,0); // 3
				
				// Indices
				var baseIndex = (vertices.length/3) -4;
				areaIndices.push(baseIndex+0, baseIndex+1, baseIndex+3, baseIndex+1, baseIndex+3, baseIndex+2);
			}
			this.vertexBufferBaseZones = Shaders.loadBufferFloat32(gl, vertices, 3);
			this.textureCoordBufferBaseZones = Shaders.loadBufferFloat32(gl, texCoords, 2);
			this.indexBufferBaseZones = Shaders.loadBufferElementUint16(gl, areaIndices, 3);
		}
		else
		{
			this.vertexBufferBaseZones = null;
			this.textureCoordBufferBaseZones = null;
			this.indexBufferBaseZones = null;
		}
	}
	
	setPlayers(players)
	{
		this.terrain.setPlayers(players);
	}
	
	add(m)
	{
		this.minerals.push(m);
	}
	
	remove(id)
	{
		for(var i=0; i<this.minerals.length; i++)
		{
			if(this.minerals[i].id == id)
			{
				this.minerals.splice(i, 1);
				return;
			}
		}
	}
	
	getObjectById(id)
	{
		for(var i=0; i<this.minerals.length; i++)
		{
			if(this.minerals[i].id == id)
				return this.minerals[i];
		}
		return null;
	}
	
	update(ms)
	{
		this.terrain.update(ms);
		this.area.update(ms);
	}

	draw(gl, shaders)
	{
		this.terrain.draw(gl, shaders, this.area);
		
		for(var i=0; i<this.minerals.length; i++)
			this.minerals[i].draw(gl, shaders);
		
		/// Draw base zones
		if(this.basesZones.length > 0 && this.indexBufferBaseZones != null)
		{
			shaders.set(gl, 'texture');
			
			// Set color to base zones.
			var colorToUse = Math.floor(Date.now()/100)%18;
			if(colorToUse >= 10)
				colorToUse -= (colorToUse-9)*2;
			var colorArray = this.colorsBaseZones[colorToUse];
			shaders.setColor(colorArray[0], colorArray[1], colorArray[2], colorArray[3]);
			
			// Asigno posiciones, colores y coordenadas de textura de los vertices
			shaders.enableBufferAttrib(gl, this.vertexBufferBaseZones.buffer, this.vertexBufferBaseZones.size, 'vertexPosition');
			shaders.enableBufferAttrib(gl, this.textureCoordBufferBaseZones.buffer, this.textureCoordBufferBaseZones.size, 'textureCoord');
			
			// Asigno textura del terreno.
			this.baseZoneTexture.set(gl);
			gl.uniform1i(shaders.currentProgram.uniformLocations.uSampler, 0);
			
			// Asigno indices de los triangulos.
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBufferBaseZones.buffer);
			
			// Dibujo triangulos.
			for(var i=0; i<this.basesZones.length; i++)
			{
				if( Geom.dist(this.basesZones[i].pos, this.camera) < Config.ANCHO_PROJECTION)
					gl.drawElements(gl.TRIANGLES, 2*3, gl.UNSIGNED_SHORT, i*2*3*2);
			}
		}
		
		shaders.clearColor();
	}
	
	
	
	// Retorna objetos que intersecta con punto ui.
	intersectUI(gl, shaders, pos, dir)
	{
		var ret = [];
		
		for(var i=0; i<this.minerals.length; i++)
			if(this.minerals[i].intersectUI(gl, shaders, pos))
				ret.push(this.minerals[i]);
			
		return ret;
	}
	/*
	// Retorna objetos que intersecta con la recta.
	intersect(pos, dir)
	{
		var ret = [];
		
		for(var i=0; i<this.minerals.length; i++)
			if(this.minerals[i].intersect(pos, dir))
				ret.push(this.minerals[i]);
			
		return ret;
	}
	*/
	// Retorna objeto mas cercano del mapa.
	near(pos, ignoreId=-1)
	{
		var ret = {dist: Infinity, obj: null};
		
		// Busco minerales cercanos.
		for(var i=0; i<this.minerals.length; i++)
		{
			if(ignoreId >= 0 && this.minerals[i].id == ignoreId)
				continue;
			var dist = Geom.dist3(pos, this.minerals[i].pos);
			if(dist < ret.dist)
			{
				ret.dist = dist;
				ret.obj = this.minerals[i];
			}
		}
		
		return ret;
	}
	
	// Return minerals if it is inside ui area.
	insideAreaUI(gl, shaders, leftTop, rightBottom)
	{
		var ret = [];
		
		for(var i=0; i<this.minerals.length; i++)
			if(this.minerals[i].insideAreaUI(gl, shaders, leftTop, rightBottom))
				ret.push(this.minerals[i]);
			
		return ret;
	}
	/*
	// Return minerals if it is inside.
	insideArea(leftTop, rightTop, rightBottom, leftBottom)
	{
		var ret = [];
		
		for(var i=0; i<this.minerals.length; i++)
			if(this.minerals[i].insideArea(leftTop, rightTop, rightBottom, leftBottom))
				ret.push(this.minerals[i]);
			
		return ret;
	}
	*/
	// Return true if the object colisioned with minerals.
	checkColision(obj, ignoredObjs)
	{
		var c;
		for(var i=0; i<this.minerals.length; i++)
		{
			if(c = this.minerals[i].checkColision(obj))
			{
				var ignore = false;
				for(var j=0; j<ignoredObjs.length; j++)
				{
					if(ignoredObjs[j].id == c.id)
					{
						ignore = true;
						break;
					}
				}
				if(!ignore)
					return c;
			}
		}
		
		return null;
	}
}


