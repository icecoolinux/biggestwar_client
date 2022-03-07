
class Terrain
{
	constructor(gl, shaders, camera)
	{
		this.gl = gl;
		this.shaders = shaders;
		this.camera = camera;
		
		this.clusters = [];
		
		this.players = null;
		this.visibility = null;
		this.xMinVisibility = 0;
		this.xMaxVisibility = 0;
		this.yMinVisibility = 0;
		this.yMaxVisibility = 0;
		this.tsUpdatedVisibility = 0;
		this.posCameraUpdatedVisibility = {x:0, y:0};
		
		this.texTerrain = Textures.getGL(Config.TEXTURE_TERRAIN);
		
		// Area and out edge buffers
		var areaColor = [];
		for(var i=0; i<3*2*4; i++) // 4 quare, two triangles each, 3 points for triangle
			areaColor.push(0.8, 0.0, 0.0, 0.5);
		this.areaColorBuffer = Shaders.loadBufferFloat32(gl, areaColor, 4);
		var areaIndices = [0, 1, 5, 0, 5, 4, //Bottom
							1, 2, 5, 2, 6, 5, // Right
							2, 3, 6, 3, 7, 6, // Top
							0, 4, 3, 4, 7, 3 // Left
						  ];
		this.areaIndexBuffer = Shaders.loadBufferElementUint16(gl, areaIndices, 3);
		this.areaVertexBuffer = null;
	}

	setPlayers(players)
	{
		this.players = players;
	}
	
	// Return if these position is visible for the user.
	isVisible(x,y)
	{
		if( x <= this.xMinVisibility || x >= this.xMaxVisibility || y <= this.yMinVisibility || y >= this.yMaxVisibility )
			return false;
		if( x < 0 || x > Config.METROS_LADO_MAPA || y < 0 || y > Config.METROS_LADO_MAPA)
			return false;
		
		var iVis = Math.floor((x-this.xMinVisibility) / Config.METROS_LADO_CUAD_MAPA);
		var jVis = Math.floor((y-this.yMinVisibility) / Config.METROS_LADO_CUAD_MAPA);

try {
  return this.visibility[iVis][jVis];
} catch (error) {
console.log("A"+iVis+" "+x+" "+this.xMinVisibility+" "+this.xMaxVisibility);
console.log("B"+jVis+" "+y+" "+this.yMinVisibility+" "+this.yMaxVisibility);
throw error;
}
		
	}
	
	update(ms)
	{
		// Update visibility when took a time (1 second) or when the camera move enough (METROS_LADO_CUAD_MAPA).
		if( (Date.now()-this.tsUpdatedVisibility) > 500 || Geom.dist(this.posCameraUpdatedVisibility, this.camera) > Config.METROS_LADO_CUAD_MAPA )
		{
			this.calculateVisibility(this.gl, this.shaders);

			// Update clusters color too.
			this.updateClustersColor(this.gl);
			
			this.tsUpdatedVisibility = Date.now();
			this.posCameraUpdatedVisibility.x = this.camera.x;
			this.posCameraUpdatedVisibility.y = this.camera.y;
		}
	}

	draw(gl, shaders, area)
	{
		/// Calculo clusters que tengo que dibujar.
		// Obtengo puntos mas alejados de la pantalla.
		var leftBottom = Colision.pantallaToTerrain(gl, shaders, 0, 0);
		var leftTop = Colision.pantallaToTerrain(gl, shaders, 0, gl.canvas.height);
		var rightBottom = Colision.pantallaToTerrain(gl, shaders, gl.canvas.width, 0);
		var rightTop = Colision.pantallaToTerrain(gl, shaders, gl.canvas.width, gl.canvas.height);
		var xMin = leftTop.x;
		var xMax = rightBottom.x;
		var yMin = leftBottom.y;
		var yMax = rightTop.y;

		// Calculo mesh de clusters.
		var xClusterMin = Math.floor((xMin / Config.METROS_LADO_CUAD_MAPA) / Config.CUADS_POR_CLUSTER_MAPA);
		var xClusterMax = Math.floor((xMax / Config.METROS_LADO_CUAD_MAPA) / Config.CUADS_POR_CLUSTER_MAPA);
		var yClusterMin = Math.floor((yMin / Config.METROS_LADO_CUAD_MAPA) / Config.CUADS_POR_CLUSTER_MAPA);
		var yClusterMax = Math.floor((yMax / Config.METROS_LADO_CUAD_MAPA) / Config.CUADS_POR_CLUSTER_MAPA);
/*
xClusterMin = 3;
xClusterMax = 3;
yClusterMin = 7;
yClusterMax = 8;
*/

/*
xClusterMin = Math.floor(( ((xMin+xMax)/2) / Config.METROS_LADO_CUAD_MAPA) / Config.CUADS_POR_CLUSTER_MAPA);
xClusterMax = Math.floor(( ((xMin+xMax)/2) / Config.METROS_LADO_CUAD_MAPA) / Config.CUADS_POR_CLUSTER_MAPA);
yClusterMin = Math.floor(( ((yMin+yMax)/2) / Config.METROS_LADO_CUAD_MAPA) / Config.CUADS_POR_CLUSTER_MAPA);
yClusterMax = Math.floor(( ((yMin+yMax)/2) / Config.METROS_LADO_CUAD_MAPA) / Config.CUADS_POR_CLUSTER_MAPA);
*/

		// Recorro mesh de cluster, si hay alguno nuevo lo genero.
		for(var xCluster = xClusterMin; xCluster <= xClusterMax; xCluster++)
		{
			for(var yCluster = yClusterMin; yCluster <= yClusterMax; yCluster++)
			{
				// Si no esta el cluster lo calculo.
				var esta = false;
				for(var i=0; i<this.clusters.length; i++)
				{
					if(this.clusters[i].x == xCluster && this.clusters[i].y == yCluster)
					{
						esta = true;
						break;
					}
				}
				if(!esta)
					this.clusters.push(this.crearCluster(xCluster, yCluster, gl));
			}
		}

		// Recorro array de clusters, si hay uno generado que no esta en la mesh lo borro.
		var i=0;
		while(i<this.clusters.length)
		{
			// Si no esta el cluster en la mesh lo borro.
			if(this.clusters[i].x < xClusterMin || this.clusters[i].x > xClusterMax || this.clusters[i].y < yClusterMin || this.clusters[i].y > yClusterMax)
				this.clusters.splice(i, 1);
			else
				i++;
		}


        // Dibujo clusters.
        shaders.set(gl, 'textureColor');
		
        for(var i=0; i<this.clusters.length; i++)
		{
			var c = this.clusters[i];
		
			// Asigno posiciones de los vertices.
			shaders.enableBufferAttrib(gl, c.positions.buffer, c.positions.size, 'vertexPosition');
			
			// Asigno colores de los vertices.
			shaders.enableBufferAttrib(gl, c.color.buffer, c.color.size, 'vertexColor');
		
			// Asigno coordinada de texturas.
			shaders.enableBufferAttrib(gl, c.textureCoord.buffer, c.textureCoord.size, 'textureCoord');
	
			// Asigno textura del terreno.
			this.texTerrain.set(gl);
			gl.uniform1i(shaders.currentProgram.uniformLocations.uSampler, 0);
			
			// Asigno indices de los triangulos.
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, c.indexes.buffer);
			
			// Dibujo triangulos.
			gl.drawElements(gl.TRIANGLES, c.nVerts, gl.UNSIGNED_SHORT, c.offset);
			//gl.drawArrays(gl.TRIANGLE_FAN, 0, 40*40);
		}
		
		// Dibujo area y terreno que esta afuera
		shaders.set(gl, 'color');
		if(area.isClosing() || this.areaVertexBuffer == null)
		{
			var left = area.getCurrentLeft();
			var right = area.getCurrentRight();
			var bottom = area.getCurrentBottom();
			var top = area.getCurrentTop();
			
			// Adjust them with the map edge
			if(left < 0) left = 0;
			if(right > Config.METROS_LADO_MAPA) right = Config.METROS_LADO_MAPA;
			if(bottom < 0) bottom = 0;
			if(top > Config.METROS_LADO_MAPA) top = Config.METROS_LADO_MAPA;
			
			var vertices = [-Config.METROS_LADO_MAPA, -Config.METROS_LADO_MAPA, 0.2, // 0
							2*Config.METROS_LADO_MAPA, -Config.METROS_LADO_MAPA, 0.2, // 1
							2*Config.METROS_LADO_MAPA, 2*Config.METROS_LADO_MAPA, 0.2, // 2
							-Config.METROS_LADO_MAPA, 2*Config.METROS_LADO_MAPA, 0.2, // 3
							left, bottom, 0.2, // 4
							right, bottom, 0.2, // 5
							right, top, 0.2, // 6
							left, top, 0.2 // 7
						];
			this.areaVertexBuffer = Shaders.loadBufferFloat32(gl, vertices, 3);
		}
		shaders.enableBufferAttrib(gl, this.areaVertexBuffer.buffer, this.areaVertexBuffer.size, 'vertexPosition');
		shaders.enableBufferAttrib(gl, this.areaColorBuffer.buffer, this.areaColorBuffer.size, 'vertexColor');
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.areaIndexBuffer.buffer);
		gl.drawElements(gl.TRIANGLES, 8*3, gl.UNSIGNED_SHORT, 0);
	}
	
	// Crea un cluster del mapa, el cluster (x,y)
	crearCluster(x,y, gl)
	{
		var cantVertices = Config.CUADS_POR_CLUSTER_MAPA * Config.CUADS_POR_CLUSTER_MAPA * 6;

		// Vertices del cluster (posiciones y color).
		// Recorro primero posiciones X, para cada una recorre
		// posiciones Y, en ambos casos de menor a mayor.
		var verts = [];
		var colors = [];
		var texCoords = [];

		// Para cada vertice de la malla del cluster.
		for(var i=0; i<(Config.CUADS_POR_CLUSTER_MAPA+1); i++)
		{
			// Posicion x absoluta en metros 
			var posX = Config.METROS_LADO_CUAD_MAPA * (Config.CUADS_POR_CLUSTER_MAPA * x + i);

			for(var j=0; j<(Config.CUADS_POR_CLUSTER_MAPA+1); j++)
			{
				// Posicion y absoluta en metros.
				var posY = Config.METROS_LADO_CUAD_MAPA * (Config.CUADS_POR_CLUSTER_MAPA * y + j);
				
				verts.push(posX, posY, 0);

				// The quad is known or not.
				if(this.isVisible(posX, posY))
					colors.push(1.0, 1.0, 1.0, 1.0);
				else
					colors.push(0.5, 0.5, 0.5, 1.0);

				texCoords.push(posX / Config.METROS_LADO_TEXTURA_TERRENO);
				texCoords.push(-posY / Config.METROS_LADO_TEXTURA_TERRENO);
			}
		}

		var indices = [];
		
		for(var i=0; i<Config.CUADS_POR_CLUSTER_MAPA; i++)
		{
			for(var j=0; j<Config.CUADS_POR_CLUSTER_MAPA; j++)
			{
				var a = i*(Config.CUADS_POR_CLUSTER_MAPA+1) + j;

				indices.push(a);
				indices.push(a+Config.CUADS_POR_CLUSTER_MAPA+1);
				indices.push(a+Config.CUADS_POR_CLUSTER_MAPA+2);
				
				indices.push(a);
				indices.push(a+Config.CUADS_POR_CLUSTER_MAPA+2);
				indices.push(a+1);
			}
		}

		// Posicion.
		var vertexBuffer = Shaders.loadBufferFloat32(gl, verts, 3);
		
		// Color.
		var colorBuffer = Shaders.loadBufferFloat32(gl, colors, 4);
  
		// Texture coords.
		var textureCoordBuffer = Shaders.loadBufferFloat32(gl, texCoords, 2);

		// Index buffer.
		var indexBuffer = Shaders.loadBufferElementUint16(gl, indices, 3);

		var cluster = {x: x, y:y, 
						positions: vertexBuffer, 
						color: colorBuffer, 
						textureCoord: textureCoordBuffer,
						indexes: indexBuffer,
						offset: 0,
						nVerts: cantVertices, 
						primtype: gl.TRIANGLE_STRIP};
		return cluster;
	}
	
	updateClustersColor(gl)
	{
		for(var c=0; c<this.clusters.length; c++)
		{
			var colors = [];
			
			var x = this.clusters[c].x;
			var y = this.clusters[c].y;
			
			// Para cada vertice de la malla del cluster.
			for(var i=0; i<(Config.CUADS_POR_CLUSTER_MAPA+1); i++)
			{
				// Posicion x absoluta en metros 
				var posX = Config.METROS_LADO_CUAD_MAPA * (Config.CUADS_POR_CLUSTER_MAPA * x + i);

				for(var j=0; j<(Config.CUADS_POR_CLUSTER_MAPA+1); j++)
				{
					// Posicion y absoluta en metros.
					var posY = Config.METROS_LADO_CUAD_MAPA * (Config.CUADS_POR_CLUSTER_MAPA * y + j);
					
					// The quad is known or not.
					if(this.isVisible(posX, posY))
						colors.push(1.0, 1.0, 1.0, 1.0);
					else
						colors.push(0.5, 0.5, 0.5, 1.0);
				}
			}
			
			this.clusters[c].color = Shaders.loadBufferFloat32(gl, colors, 4);
		}
	}
	
	// Calculate the visiblity info, only that user watch.
	calculateVisibility(gl, shaders)
	{
		var leftTopUI = {x:-gl.canvas.width * 0.05, y:gl.canvas.height*1.05};
		var rightBottomUI = {x:gl.canvas.width * 1.05, y:-gl.canvas.height*0.05};
		
		var leftTop = Colision.pantallaToTerrain(gl, shaders, leftTopUI.x, leftTopUI.y);
		var rightBottom = Colision.pantallaToTerrain(gl, shaders, rightBottomUI.x, rightBottomUI.y);
		
		this.xMinVisibility = leftTop.x;
		this.xMaxVisibility = rightBottom.x;
		this.yMinVisibility = rightBottom.y;
		this.yMaxVisibility = leftTop.y;

		// Quad steps.
		this.xMinVisibility = Math.floor(this.xMinVisibility/Config.METROS_LADO_CUAD_MAPA)*Config.METROS_LADO_CUAD_MAPA;
		this.xMaxVisibility = Math.floor(this.xMaxVisibility/Config.METROS_LADO_CUAD_MAPA)*Config.METROS_LADO_CUAD_MAPA;
		this.yMinVisibility = Math.floor(this.yMinVisibility/Config.METROS_LADO_CUAD_MAPA)*Config.METROS_LADO_CUAD_MAPA;
		this.yMaxVisibility = Math.floor(this.yMaxVisibility/Config.METROS_LADO_CUAD_MAPA)*Config.METROS_LADO_CUAD_MAPA;
		
		// Make visibility struct for once.
		if(this.visibility == null)
		{
			this.visibility = new Array( Math.ceil((this.xMaxVisibility-this.xMinVisibility)/Config.METROS_LADO_CUAD_MAPA) );
			for(var i=0; i<this.visibility.length; i++)
				this.visibility[i] = new Array( Math.ceil((this.yMaxVisibility-this.yMinVisibility)/Config.METROS_LADO_CUAD_MAPA) );
		}
		
		// Init.
		for(var i=0; i<this.visibility.length; i++)
			for(var j=0; j<this.visibility[i].length; j++)
				this.visibility[i][j] = false;
		
		// Add VISIBILITY_DISTANCE border to the border for select objects.
		leftTop.x -= Config.VISIBILITY_DISTANCE;
		leftTop.y += Config.VISIBILITY_DISTANCE;
		rightBottom.x += Config.VISIBILITY_DISTANCE;
		rightBottom.y -= Config.VISIBILITY_DISTANCE;
		var leftTopObjUI = Colision.terrainToPantalla(gl, shaders, leftTop);
		var rightBottomObjUI = Colision.terrainToPantalla(gl, shaders, rightBottom);
		var objects = this.players.insideAreaUI(gl, shaders, leftTopObjUI, rightBottomObjUI);

		// For each object.
		for(var o=0; o<objects.length; o++)
		{
			// If it's enemy ignore.
			if(objects[o].isEnemy())
				continue;
			
			var xMinObj = objects[o].pos.x - Config.VISIBILITY_DISTANCE;
			var yMinObj = objects[o].pos.y - Config.VISIBILITY_DISTANCE;

			// For each posible visible quad.
			var posQuad = {x:0, y:0};
			for(posQuad.x=xMinObj; posQuad.x<(xMinObj+2*Config.VISIBILITY_DISTANCE); posQuad.x+=Config.METROS_LADO_CUAD_MAPA)
			{
				for(posQuad.y=yMinObj; posQuad.y<(yMinObj+2*Config.VISIBILITY_DISTANCE); posQuad.y+=Config.METROS_LADO_CUAD_MAPA)
				{
					var dist = Geom.dist(objects[o].pos, posQuad);

					if(dist < Config.VISIBILITY_DISTANCE &&  posQuad.x>this.xMinVisibility && posQuad.x< this.xMaxVisibility && posQuad.y>this.yMinVisibility && posQuad.y<this.yMaxVisibility)
					{
						var i = Math.floor( (posQuad.x-this.xMinVisibility) / Config.METROS_LADO_CUAD_MAPA);
						var j = Math.floor( (posQuad.y-this.yMinVisibility) / Config.METROS_LADO_CUAD_MAPA);
						this.visibility[i][j] = true;
					}
				}
			}
		}
	}
}


