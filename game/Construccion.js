
class Construccion
{
	// id, type, pos, vida, fulllife, creada, construccionCreando, construccionFull, enemy, aliade, player
	constructor(params)
	{
		this.radio = params.radio;
		
		this.id = params.id;
		this.type = params.type;
		this.pos = params.pos;
		this.pos.z = 0;
		this.vida = params.vida;
		this.fullLife = params.fulllife;
		this.creada = params.creada;
		this.construccionCreando = params.construccionCreando;
		this.construccionFull = params.construccionFull;
		this.enemy = params.enemy;
		this.aliade = params.aliade;
		this.player = params.player;
		
		this.action = null;
		this.intentsQueue = [];
		this.tsSendIntent = -1;
	}
	
	isUnit() { return false; }
	isBuilding() { return true; }
	isEnemy() { return this.enemy; }
	isAliade() { return this.aliade; }
	isMineral() { return false; }
	isSoldier() { return false; }

	setPosNet(x, y)
	{
		this.pos.x = x;
		this.pos.y = y;
	}
	
	setAction(action)
	{
		if(this.action != null)
			this.action.setDelete();
		
		this.action = action;
		
		if(this.tsSendIntent > 0)
		{
			this.tsSendIntent = -1;
			this.intentsQueue.shift();
		}
	}
	
	deleteAction(net)
	{
		if(this.action != null)
			this.action.setDelete();
		this.action = null;
	}
	
	addIntent(intent)
	{
		if(this.intentsQueue.length < Construccion.MAX_QUEUE)
			this.intentsQueue.push(intent);
	}
	
	deleteIntent(index)
	{
		if(this.intentsQueue.length > index)
		{
			this.intentsQueue.splice(index,1);
			if(index == 0)
				this.tsSendIntent = -1;
		}
	}
	
	update(ms)
	{
		if(this.action != null && this.action.type == Action.NEWUNIT && this.modelMake != null)
			this.modelMake.update(ms);
		else if(this.model != null)
			this.model.update(ms);
		
		// If I dont have action, I have at least one intent in the queue and I dont send one before or it was more than one second then send it.
		if(this.action == null && this.intentsQueue.length > 0 && (this.tsSendIntent == -1 || ((Date.now() - this.tsSendIntent) > 1000) ) )
		{
			this.tsSendIntent = Date.now();
			document.game.net.sendIntentActions([this.intentsQueue[0]]);
		}
	}
	
	draw(ctx, gl, shaders)
	{
		shaders.pushMatrix();
		shaders.move(this.pos.x, this.pos.y, 0);

		if(this.action != null && this.action.type == Action.NEWUNIT)
		{
			if(this.modelMake != null)
				this.modelMake.draw(gl, shaders, this.player.equip);
		}
		else
		{
			if(this.model != null)
				this.model.draw(gl, shaders, this.player.equip);
		}

		shaders.popMatrix();
		
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
		
		if(this.creada < this.fullLife)
			info.push("Created: "+this.creada+" / "+this.fullLife);
		else
			info.push("Life: "+this.vida+" / "+this.fullLife);
		
		// Show information about the unit that is making
		if(this.action != null && this.action.type == Action.NEWUNIT && this.action.subType == Action.NEWUNIT_MAKEUNIT)
		{
			info.push("");
			info.push("Making unit: "+this.construccionCreando+" / "+this.construccionFull);
		}
		
		return info;
	}
	
	
	
	
	
	// Return true if the building is inside ui area.
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
	// Return true if the building is inside.
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

Construccion.MAX_QUEUE = 4;

