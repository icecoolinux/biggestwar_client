
class Torreta extends Construccion
{
	// id, type, pos, vida, creada, enemy, aliade
	constructor(params)
	{
		params.radio = Config.RADIO_TORRETA;
		super(params);
		
		this.tsLastAttack = 0;
		
		this.modelBase = Models.get('torreta_base');
		this.modelUp = Models.get('torreta_up');
		this.modelUpAttack = Models.get('torreta_up_attack');
		this.modelUpAttack.setSpeedUp(5);

		this.targetAnguloDir = null;
		this.anguloDir = 0;
		
		this.alturaUi = Config.ALTURA_UI_TORRETA;
	}
	
	setTsLastAttack(ts)
	{
		// It was a shot
		if(ts > this.tsLastAttack)
		{
			this.tsLastAttack = ts;
//Audio.play("bullet_soldadoraso");
		}
	}
	
	update(ms)
	{
		super.update(ms);
		
		if(this.action != null && this.action.type == Action.ATTACK && this.modelUpAttack != null)
		{
			this.modelUpAttack.update(ms);
		
			// Put view direction to the enemy
			if(this.targetAnguloDir == null)
			{
				var objTmp = this.action.unit2;
				if(objTmp == null)
					objTmp = this.action.build2;

				// Puede estar atacando a un objeto pero el cliente (interfaz) no tiene la informacion del objeto.
				if(objTmp != null)
				{
					this.targetAnguloDir = Geom.angleBetweenPoints(objTmp.pos, this.pos);
					this.targetAnguloDir += 135;
					if(this.targetAnguloDir > 365)
						this.targetAnguloDir -= 365;
				}
			}
		}
//console.log(this.anguloDir+" "+this.targetAnguloDir);
		// Make a smooth turn.
//this.anguloDir +=4;
		if(this.targetAnguloDir != null)
		{
			var ret = Geom.setAngleSmooth(this.anguloDir, this.targetAnguloDir, Unidad.VELOCIDAD_ANGULAR_ROTACION_MS * ms);
			this.anguloDir = ret.angle;
			if(ret.reach)
				this.targetAnguloDir = null;
		}
	}
	
	draw(ctx, gl, shaders)
	{
		if(this.modelBase != null && this.modelUp != null)
		{
			shaders.pushMatrix();
			
			shaders.move(this.pos.x, this.pos.y, 0);
			
			this.modelBase.draw(gl, shaders, this.player.equip);
			
			shaders.rotate(this.anguloDir, 0, 0, 1);
			if(this.action != null && this.action.type == Action.ATTACK)
				this.modelUpAttack.draw(gl, shaders, this.player.equip);
			else
				this.modelUp.draw(gl, shaders, this.player.equip);
			
			shaders.popMatrix();
		}
	}
}
