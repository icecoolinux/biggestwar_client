
class Models
{
};

Models.models = {};

Models.load = function(gl, progressFunc, doneFunc)
{
	var names = [{name_model:'barraca', name_texture: 'barraca'},
				{name_model:'barraca_make', name_texture: 'barraca'},
				{name_model:'torreta_base', name_texture: 'torreta'},
				{name_model:'torreta_up', name_texture: 'torreta'},
				{name_model:'torreta_up_attack', name_texture: 'torreta'},
				{name_model:'recolector_walk', name_texture: 'recolector'},
				{name_model:'recolector', name_texture: 'recolector'},
				{name_model:'recolector_recolectando', name_texture: 'recolector'},
				{name_model:'base', name_texture: 'base'},
				{name_model:'base_make', name_texture: 'base'},
				{name_model:'mineral', name_texture: 'mineral'},
				{name_model:'soldado', name_texture: 'soldado'},
				{name_model:'soldadoentrenado', name_texture: 'soldadoentrenado'},
				{name_model:'soldadoentrenado_walk', name_texture: 'soldadoentrenado'},
				{name_model:'soldadoentrenado_attack', name_texture: 'soldadoentrenado'},
				{name_model:'soldadoraso', name_texture: 'soldadoraso'},
				{name_model:'soldadoraso_walk', name_texture: 'soldadoraso'},
				{name_model:'soldadoraso_attack', name_texture: 'soldadoraso'},
				{name_model:'tanque', name_texture: 'tanque'},
				{name_model:'tanque_attack', name_texture: 'tanque'},
				{name_model:'tanquepesado', name_texture: 'tanquepesado'},
				{name_model:'tanquepesado_attack', name_texture: 'tanquepesado'}];

	function loadModel(index)
	{
		Models.models[names[index].name_model] = new MD2(names[index].name_model, Textures.getGL(names[index].name_texture), 0);
		Models.models[names[index].name_model].load(gl, function(){loadNext(index+1)}, function(){});
	}
	function loadNext(index)
	{
		if( index < names.length)
			progressFunc((index/names.length)*100, function(){loadModel(index)});
		else
			doneFunc();
	}
	loadNext(0);
}

Models.get = function(name, texture_name=null)
{
	var texture = null;
	if(texture_name != null)
		texture = Textures.getGL(texture_name);
	return new Model3D(Models.models[name], texture);
}





