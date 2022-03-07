
class Unidad
{
	// Creada es el porcentaje de creada la unidad, 0 recien creada, 100 ya esta creada.
	// id, type, pos, vida, fulllife, creada, enemy, aliade, player
	constructor(params)
	{
		this.radio = params.radio;
		
		this.id = params.id;
		this.type = params.type;
		this.posNet = params.pos;
		this.posNet.z = 0;
		this.vida = params.vida;
		this.fullLife = params.fulllife;
		this.creada = params.creada;
		this.enemy = params.enemy;
		this.aliade = params.aliade;
		this.player = params.player;
		this.action = null;
		
		// Velocity
		this.vel = 20;
		switch(this.type)
		{
			case Config.OT_RECOLECTOR:
				this.vel = Config.VEL_RECOLECTOR;
				break;
			case Config.OT_SOLDADO_RASO:
				this.vel = Config.VEL_SOLDADORASO;
				break;
			case Config.OT_SOLDADO_ENTRENADO:
				this.vel = Config.VEL_SOLDADOENTRENADO;
				break;
			case Config.OT_TANQUE:
				this.vel = Config.VEL_TANQUE;
				break;
			case Config.OT_TANQUE_PESADO:
				this.vel = Config.VEL_TANQUEPESADO;
				break;
		}
		
		// Display's variables.
		this.pos = Object.assign({}, this.posNet);
		this.targetAnguloDir = null;
		this.anguloDir = -135;
		
		this.modelStop = null;
		this.modelWalk = null;
		this.modelRecolectandoAndMaking = null;
		this.modelAttack = null;
		
		this.vectorTmp = {x:0, y:0};
	}
	
	isUnit() { return true; }
	isBuilding() { return false; }
	isEnemy() { return this.enemy; }
	isAliade() { return this.aliade; }
	isMineral() { return false; }
	isSoldier() 
	{
		return this.type == Config.OT_SOLDADO_RASO || 
				this.type == Config.OT_SOLDADO_ENTRENADO || 
				this.type == Config.OT_TANQUE || 
				this.type == Config.OT_TANQUE_PESADO;
	}
	
	setAction(action)
	{
		if(this.action != null)
			this.action.setDelete();
		
		this.action = action;
	}
	
	deleteAction()
	{
		if(this.action != null)
			this.action.setDelete();
		this.action = null;
	}
	
	setPosNet(x, y)
	{
		this.posNet.x = x;
		this.posNet.y = y;
	}
  
	update(ms)
	{
		if(this.action != null && this.action.isWalking() && this.modelWalk != null)
			this.modelWalk.update(ms);
		if(this.action != null && this.action.isAttacking() && this.modelAttack != null)
		{
			this.modelAttack.update(ms);
			
			// Put view direction to enemy.
			if(this.targetAnguloDir == null)
			{
				var objTmp = this.action.unit2;
				if(objTmp == null)
					objTmp = this.action.build2;

				// Puede estar yendo a un objeto pero el cliente (interfaz) no tiene la informacion del objeto.
				if(objTmp != null)
					this.targetAnguloDir = Geom.angleBetweenPoints(objTmp.pos, this.pos);
			}
		}
		if(this.action != null && (this.action.isRecolectando() || this.action.isMaking()) )
		{
			this.modelRecolectandoAndMaking.update(ms);
			
			// Put view direction to mineral or to building.
			if(this.targetAnguloDir == null)
			{
				var objTmp = this.action.objectMap;
				if(objTmp == null)
					objTmp = this.action.build2;

				// Puede estar yendo a un objeto pero el cliente (interfaz) no tiene la informacion del objeto.
				if(objTmp != null)
					this.targetAnguloDir = Geom.angleBetweenPoints(objTmp.pos, this.pos);
			}
		}
		else if(this.modelStop != null)
			this.modelStop.update(ms);
		
		// Go to posNet.
		if(Geom.dist(this.pos, this.posNet) > 0.001)
			this.moveTo(this.posNet, ms);
		
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
		var model = this.modelStop;
		if(this.modelWalk != null && this.action != null && this.action.isWalking())
			model = this.modelWalk;
		else if(this.modelAttack != null && this.action != null && this.action.isAttacking() )
			model = this.modelAttack;
		else if(this.modelRecolectandoAndMaking != null && this.action != null && (this.action.isRecolectando() || this.action.isMaking()) )
			model = this.modelRecolectandoAndMaking;

		if(model != null)
		{
			shaders.pushMatrix();
			shaders.move(this.pos.x, this.pos.y, 0);
			shaders.rotate(this.anguloDir, 0, 0, 1);
//shaders.scale(5,5,5);
			model.draw(gl, shaders, this.player.equip);
			shaders.popMatrix();
		}
		
		// Show the username
		//this.showUsername(ctx, gl, shaders);
	}
	
	showUsername(ctx, gl, shaders)
	{
		var dimUsername = {x:0, y:0};
		Pantalla2D.dimText(ctx, [this.player.username], dimUsername);
		var centerScreen = Colision.terrainToPantalla(gl, shaders, this.pos);
		var offsetScreen = this.radio * (gl.canvas.width/Config.ANCHO_PROJECTION);
		Pantalla2D.drawText(ctx, [this.player.username], centerScreen.x-dimUsername.x/2, centerScreen.y-offsetScreen-dimUsername.y/2, "green");
	}
	
	// Move to position.
	moveTo(pos, ms)
	{
		var distDest = Geom.dist(this.pos, pos);
		if(distDest <= 0)
			return;
		
		var distStep = this.vel * (ms/1000.0);
		
		// If the distance if huge (it have more than 3 seconds) then move quickly.
		if(distDest >= (this.vel*3.0))
			distStep = distDest;
		
		if(distDest < distStep)
			distStep = distDest;
		
		var dir = {x: pos.x - this.pos.x, 
					y: pos.y - this.pos.y};
		Geom.normalize(dir);
		
		// Move.
		var beforePos = Object.assign({}, this.pos);
		this.pos.x += dir.x * distStep;
		this.pos.y += dir.y * distStep;
		
		// Calcula angulo de la direccion
		if( Math.abs(this.pos.x - beforePos.x) > 0.1 || Math.abs(this.pos.y - beforePos.y) > 0.1)
		{
			// The default position is (1,0).
			var dir = {x:this.pos.x - beforePos.x, y: this.pos.y - beforePos.y};
			Geom.normalize(dir);
			this.targetAnguloDir = Math.acos( dir.x );
			this.targetAnguloDir /=  (Math.PI / 180);
			
			if(dir.y < 0)
				this.targetAnguloDir *= -1;
			
			if(this.targetAnguloDir > 270)
				this.targetAnguloDir -= 90;
			else
				this.targetAnguloDir += 270;
			
			if(this.targetAnguloDir >= 360)
				this.targetAnguloDir -= 360;
			if(this.targetAnguloDir <= -360)
				this.targetAnguloDir += 360;
		}
	}
	
	getInfo()
	{
		var info = [];
		
		var name = this.player.username;
		if(this.aliade)
			name += " (Aliade)";
		else if(this.enemy)
			name += " (Enemy)";
		info.push(name);
		info.push("");
		
		info.push("Life: "+this.vida+"/"+this.fullLife);
		
		return info;
	}
	
	
	
	// Retorna true si intersecta con el punto ui.
	intersectUI(gl, shaders, pos)
	{
		var centerUI = Colision.terrainToPantalla(gl, shaders, this.pos);
		var radio = this.radio * (gl.canvas.width/Config.ANCHO_PROJECTION);
		var altura = this.alturaUi * (gl.canvas.width/Config.ANCHO_PROJECTION);
		
		return pos.x >= (centerUI.x-radio) && pos.x <= (centerUI.x+radio) && 
				pos.y >= centerUI.y-radio*0.707 && pos.y <= centerUI.y+altura;
	}
	/*
	// Retorna true si intersecta con la linea definida.
	intersect(pos, dir)
	{
		return Geom.intersectLineSphere(this.pos, this.radio, pos, dir);
	}
	*/
	// Return true if the unit is inside ui area.
	insideAreaUI(gl, shaders, leftTop, rightBottom)
	{
		var centerUI = Colision.terrainToPantalla(gl, shaders, this.pos);
		var radio = this.radio * (gl.canvas.width/Config.ANCHO_PROJECTION);
		var altura = this.alturaUi * (gl.canvas.width/Config.ANCHO_PROJECTION);
		
		var leftUnit = centerUI.x - radio;
		var rightUnit = centerUI.x + radio;
		var topUnit = centerUI.y + altura;
		var bottomUnit = centerUI.y - radio*0.707;
		
		return leftUnit <= rightBottom.x && rightUnit >= leftTop.x &&
				topUnit >= rightBottom.y && bottomUnit <= leftTop.y;
	}
	/*
	// Return true if the unit is inside.
	insideArea(leftTop, rightTop, rightBottom, leftBottom)
	{
		// Left plane.
		var dir = {x: rightTop.x - leftTop.x, 
					y: rightTop.y - leftTop.y,
					z: rightTop.z - leftTop.z};
		Geom.normalize3(dir);
		if(Geom.sphereOutsidePlane(leftTop, dir, this.pos, this.radio))
			return false;
		
		// Top plane.
		var dir = {x: leftBottom.x - leftTop.x, 
					y: leftBottom.y - leftTop.y,
					z: leftBottom.z - leftTop.z};
		Geom.normalize3(dir);
		if(Geom.sphereOutsidePlane(leftTop, dir, this.pos, this.radio))
			return false;
		
		// Right plane.
		var dir = {x: leftBottom.x - rightBottom.x, 
					y: leftBottom.y - rightBottom.y,
					z: leftBottom.z - rightBottom.z};
		Geom.normalize3(dir);
		if(Geom.sphereOutsidePlane(rightBottom, dir, this.pos, this.radio))
			return false;
		
		// Bottom plane.
		var dir = {x: rightTop.x - rightBottom.x, 
					y: rightTop.y - rightBottom.y,
					z: rightTop.z - rightBottom.z};
		Geom.normalize3(dir);
		if(Geom.sphereOutsidePlane(rightBottom, dir, this.pos, this.radio))
			return false;
		
		return true;
	}
	*/
	// Return this if the object colisioned.
	checkColision(obj)
	{
		// The object is me.
		if(obj.id == this.id)
			return null;
		
		if(Geom.dist(this.pos, obj.pos) < (this.radio+obj.radio))
			return this;
		else
			return null;
	}
}

Unidad.VELOCIDAD_ANGULAR_ROTACION_MS = 0.8;
