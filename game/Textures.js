
class Textures
{
};

Textures.glTex = {};
Textures.canvasTex = {};

Textures.load = function(gl, progressFunc, doneFunc)
{
	var namesGLTex = [{name:"terrain_grass", url:"game/img/terrain_grass.png"},
					{name:"terrain_arido", url:"game/img/terrain_arido.png"},
					{name:"barraca", url:["game/models/barraca_R.jpg", "game/models/barraca_G.jpg", "game/models/barraca_B.jpg"]},
					{name:"base", url:["game/models/base_R.jpg", "game/models/base_G.jpg", "game/models/base_B.jpg"]},
					{name:"mineral", url:"game/models/mineral.jpg"},
					{name:"recolector", url:["game/models/recolector_R.jpg", "game/models/recolector_G.jpg", "game/models/recolector_B.jpg"]},
					{name:"soldadoentrenado", url:["game/models/soldadoentrenado_R.jpg", "game/models/soldadoentrenado_G.jpg", "game/models/soldadoentrenado_B.jpg"]},
					{name:"soldadoraso", url:["game/models/soldadoraso_R.jpg", "game/models/soldadoraso_G.jpg", "game/models/soldadoraso_B.jpg"]},
					{name:"tanque", url:["game/models/tanque_R.jpg", "game/models/tanque_G.jpg", "game/models/tanque_B.jpg"]},
					{name:"tanquepesado", url:["game/models/tanquepesado_R.jpg", "game/models/tanquepesado_G.jpg", "game/models/tanquepesado_B.jpg"]},
					{name:"torreta", url:["game/models/torreta_R.jpg", "game/models/torreta_G.jpg", "game/models/torreta_B.jpg"]},
					{name:"basezone", url:"game/img/basezone.png"}
	];
	var namesCanvasTex = [{name:"icons_green", url:"game/img/icons_green.jpg"},
		{name:"icons_white", url:"game/img/icons_white.jpg"},
		{name:"objects_green", url:"game/img/objects_green.jpg"},
		{name:"objects_orange", url:"game/img/objects_orange.jpg"},
		{name:"objects_red", url:"game/img/objects_red.jpg"},
		{name:"objects_yellow", url:"game/img/objects_yellow.jpg"},
		{name:"icons", url:"game/img/icons.jpg"},
		{name:"icons_clicked", url:"game/img/icons_clicked.jpg"},
		{name:"tablero", url:"game/img/tablero.png"},
	];
	
	
	function loadGLTex(index)
	{
		Textures.glTex[namesGLTex[index].name] = new Texture(gl, namesGLTex[index].url, function(){loadNextGLTex(index+1)});
	}
	function loadNextGLTex(index)
	{
		if( index < namesGLTex.length)
			progressFunc((index/namesGLTex.length)*50, function(){loadGLTex(index)});
		else
			loadNextCanvasTex(0);
	}
	loadNextGLTex(0);
	
	
	function loadCanvasTex(index)
	{
		Textures.canvasTex[namesCanvasTex[index].name] = new Image();
		Textures.canvasTex[namesCanvasTex[index].name].onload = function(){
			loadNextCanvasTex(index+1);
		};
		Textures.canvasTex[namesCanvasTex[index].name].src = namesCanvasTex[index].url;
	}
	function loadNextCanvasTex(index)
	{
		if( index < namesCanvasTex.length)
			progressFunc( 50 + (index/namesCanvasTex.length)*50, function(){loadCanvasTex(index)});
		else
			doneFunc();
	}
}

Textures.getGL = function(tex)
{
	return Textures.glTex[tex];
}

Textures.getCanvas = function(tex)
{
	return Textures.canvasTex[tex];
}


