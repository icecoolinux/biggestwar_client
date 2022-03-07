
class SoldadoEntrenado extends Soldado
{
	// id, type, pos, vida, creada, contruccionCreando, enemy, aliade
	constructor(params)
	{
		params.radio = Config.RADIO_SOLDADOENTRENADO;
		super(params);
		
		this.modelStop = Models.get('soldadoentrenado');
		this.modelWalk = Models.get('soldadoentrenado_walk');
		this.modelWalk.setSpeedUp(35);
		this.modelAttack = Models.get('soldadoentrenado_attack');
		this.modelAttack.setSpeedUp(4);
		this.modelAttack.setRepeat(false);
		
		this.alturaUi = Config.ALTURA_UI_SOLDADOENTRENADO;
	}
	
	setTsLastAttack(ts)
	{
		// It was a shot
		if(ts > this.tsLastAttack)
		{
			if(this.modelAttack != null)
				this.modelAttack.initAnimation();
			Audio.play("bullet_soldadoentrenado", 50);
		}
		super.setTsLastAttack(ts);
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
