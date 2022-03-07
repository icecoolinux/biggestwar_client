
class TanquePesado extends Soldado
{
	// id, type, pos, vida, creada, contruccionCreando, enemy, aliade
	constructor(params)
	{
		params.radio = Config.RADIO_TANQUEPESADO;
		super(params);
		
		this.modelStop = Models.get('tanquepesado');
		this.modelWalk = Models.get('tanquepesado');
		this.modelAttack = Models.get('tanquepesado_attack');
		this.modelAttack.setSpeedUp(5);
		
		this.alturaUi = Config.ALTURA_UI_TANQUEPESADO;
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
