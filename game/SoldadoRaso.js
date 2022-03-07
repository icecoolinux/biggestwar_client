
class SoldadoRaso extends Soldado
{
	// id, type, pos, vida, creada, contruccionCreando, enemy, aliade
	constructor(params)
	{
		params.radio = Config.RADIO_SOLDADORASO;
		super(params);
		
		this.modelStop = Models.get('soldadoraso');
		this.modelWalk = Models.get('soldadoraso_walk');
		this.modelWalk.setSpeedUp(30);
		this.modelAttack = Models.get('soldadoraso_attack');
		this.modelAttack.setSpeedUp(7);
		this.modelAttack.setRepeat(false);
		
		this.alturaUi = Config.ALTURA_UI_SOLDADORASO;
	}
	
	setTsLastAttack(ts)
	{
		// It was a shot
		if(ts > this.tsLastAttack)
		{
			if(this.modelAttack != null)
				this.modelAttack.initAnimation();
			Audio.play("bullet_soldadoraso", 50, 1.35);
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
