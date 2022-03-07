
class Tanque extends Soldado
{
	// id, type, pos, vida, creada, contruccionCreando, enemy, aliade
	constructor(params)
	{
		params.radio = Config.RADIO_TANQUE;
		super(params);
		
		this.modelStop = Models.get('tanque');
		this.modelWalk = Models.get('tanque');
		this.modelAttack = Models.get('tanque_attack');
		this.modelAttack.setSpeedUp(5);
		
		this.alturaUi = Config.ALTURA_UI_TANQUE;
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
