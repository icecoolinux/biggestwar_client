
class Soldado extends Unidad
{
	// id, type, pos, vida, creada, contruccionCreando, enemy, aliade
	constructor(params)
	{
		super(params);
		
		this.tsLastAttack = 0;
		
		this.model = Models.get('soldado');
	}
	
	setTsLastAttack(ts)
	{
		// It was a shot
		if(ts > this.tsLastAttack)
		{
			this.tsLastAttack = ts;
		}
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
