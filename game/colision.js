
class Colision
{
	constructor()
	{
		
	}
}

// Dado un punto en la pantalla (x,y) retorna el punto que pertenece en el terreno (X,Y,Z).
Colision.pantallaToTerrain = function(gl, shaders, x, y)
{
	x -= gl.canvas.width/2;
	y -= gl.canvas.height/2;
	
	var ratioScreen = gl.canvas.width / gl.canvas.height;
	x = x * Config.ANCHO_PROJECTION / gl.canvas.width;
	y = y * (Config.ANCHO_PROJECTION/ratioScreen) / gl.canvas.height;
	
	var m00 = shaders.modelViewMatrix[0];
	var m01 = shaders.modelViewMatrix[4];
	var m02 = shaders.modelViewMatrix[8];
	var m03 = shaders.modelViewMatrix[12];
	var m10 = shaders.modelViewMatrix[1];
	var m11 = shaders.modelViewMatrix[5];
	var m13 = shaders.modelViewMatrix[13];
	var m20 = shaders.modelViewMatrix[2];
	var m21 = shaders.modelViewMatrix[6];
	var m22 = shaders.modelViewMatrix[10];
	var m23 = shaders.modelViewMatrix[14];
	
	var Y = ( (m10*x/m00) -(m10*m03/m00) +m13 -y) / ( (m10*m01/m00) -m11);
	var X = (x -m01*Y -m03) / m00;
	//var Z = (-m23 -m20*X -m21*Y) / m22;
	var Z = 0;
	
	return {x:X, y:Y, z:Z};
}

// Dado un punto en terrain (X,Y,Z) retorna en la pantalla su correspondiente.
Colision.terrainToPantalla = function(gl, shaders, pos)
{
	var m00 = shaders.modelViewMatrix[0];
	var m01 = shaders.modelViewMatrix[4];
	var m02 = shaders.modelViewMatrix[8];
	var m03 = shaders.modelViewMatrix[12];
	var m10 = shaders.modelViewMatrix[1];
	var m11 = shaders.modelViewMatrix[5];
	var m12 = shaders.modelViewMatrix[9];
	var m13 = shaders.modelViewMatrix[13];
	var m20 = shaders.modelViewMatrix[2];
	var m21 = shaders.modelViewMatrix[6];
	var m22 = shaders.modelViewMatrix[10];
	var m23 = shaders.modelViewMatrix[14];
	var m30 = shaders.modelViewMatrix[3];
	var m31 = shaders.modelViewMatrix[7];
	var m32 = shaders.modelViewMatrix[11];
	var m33 = shaders.modelViewMatrix[15];
	
	var x = m00*pos.x + m01*pos.y + m02*pos.z + m03;
	var y = m10*pos.x + m11*pos.y + m12*pos.z + m13;
	var z = m20*pos.x + m21*pos.y + m22*pos.z + m23;
	var w = m30*pos.x + m31*pos.y + m32*pos.z + m33;
//console.log(x, y, z);
	var ratioScreen = gl.canvas.width / gl.canvas.height;
	x = x * gl.canvas.width / Config.ANCHO_PROJECTION;
	y = y * gl.canvas.height / (Config.ANCHO_PROJECTION/ratioScreen);
	
	x += gl.canvas.width/2;
	y += gl.canvas.height/2;

	return {x:x, y:y};
}

// Retorna objeto que fue seleccionado.
// Objectos que intersectan en la linea pos del terreno y su proyeccion en la camara.
// Si hay mas de uno retorna el mas cercano a la camara.
Colision.getObject = function(game, pos)
{
	var retList = game.players.intersectUI(game.gl, game.shaders, pos);
	retList = retList.concat(game.map.intersectUI(game.gl, game.shaders, pos));
	
	var ret = null;
	var distMinima = 9999999;
	for(var i=0; i<retList.length; i++)
	{
		var dist = retList[i].pos.y * 0.707 - retList[i].pos.x * 0.707;
		if(dist < distMinima)
		{
			distMinima = dist;
			ret = retList[i];
		}
	}
	
	return ret;
}

// Retorna objetos que fueron seleccionados en un area.
// Return a list of list, first is players objects and second objects map list
var leftTopTmp={x:0,y:0};
var rightBottomTmp={x:0,y:0};
Colision.getObjectsArea = function(game, v, w)
{
	if(v.x < w.x)
	{
		leftTopTmp.x = v.x;
		rightBottomTmp.x = w.x;
	}
	else
	{
		leftTopTmp.x = w.x;
		rightBottomTmp.x = v.x;
	}
	if(v.y < w.y)
	{
		leftTopTmp.y = w.y;
		rightBottomTmp.y = v.y;
	}
	else
	{
		leftTopTmp.y = v.y;
		rightBottomTmp.y = w.y;
	}

	var retPlayers = game.players.insideAreaUI(game.gl, game.shaders, leftTopTmp, rightBottomTmp);
	var retObjectsMaps = game.map.insideAreaUI(game.gl, game.shaders, leftTopTmp, rightBottomTmp);
	
	return [retPlayers, retObjectsMaps];
}

// Retorna objeto mas cercano.
// Retorna: {dist, obj}
Colision.near = function(game, pos, ignoreId=-1)
{
	var nearPlayers = game.players.near(pos, ignoreId);
	var nearMap = game.map.near(pos, ignoreId);
	
	if(nearPlayers.obj != null && nearMap.obj != null)
	{
		if(nearPlayers.dist < nearMap.dist)
			return nearPlayers;
		else
			return nearMap;
	}
	else if(nearPlayers.obj != null)
		return nearPlayers;
	else if(nearMap.obj != null)
		return nearMap;
	else
		return {dist: Infinity, obj: null};
}















