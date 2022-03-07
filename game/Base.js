
class Base extends Construccion
{
	// id, type, pos, vida, creada, enemy, aliade
	constructor(params)
	{
		params.radio = Config.RADIO_BASE;
		super(params);
		
		this.model = Models.get('base');
		this.modelMake = Models.get('base_make');
		this.modelMake.setSpeedUp(6);
		
		this.alturaUi = Config.ALTURA_UI_BASE;
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
