
class Barraca extends Construccion
{
	// id, type, pos, vida, creada, enemy, aliade
	constructor(params)
	{
		params.radio = Config.RADIO_BARRACA;
		super(params);
		
		this.model = Models.get('barraca');
		this.modelMake = Models.get('barraca_make');
		this.modelMake.setSpeedUp(6);
		
		this.alturaUi = Config.ALTURA_UI_BARRACA;
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
