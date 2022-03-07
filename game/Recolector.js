
class Recolector extends Unidad
{
	// id, type, pos, vida, creada, contruccionCreando, enemy, aliade
	constructor(params)
	{
		params.radio = Config.RADIO_RECOLECTOR;
		super(params);
		
		this.modelStop = Models.get('recolector');
		this.modelWalk = Models.get('recolector_walk');
		this.modelWalk.setSpeedUp(10);
		this.modelRecolectandoAndMaking = Models.get('recolector_recolectando');
		this.modelRecolectandoAndMaking.setSpeedUp(5);

		this.alturaUi = Config.ALTURA_UI_RECOLECTOR;
	}
	
	update(ms)
	{
		super.update(ms);
	}
	
	draw(ctx, gl, shaders)
	{
		super.draw(ctx, gl, shaders);
	}
}
