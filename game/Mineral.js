
class Mineral
{
	// Params: id, type, pos, amount
	constructor(params)
	{
		this.radio = Config.RADIO_MINERAL;
		
		this.id = params.id;
		this.type = params.type;
		this.pos = params.pos;
		this.pos.z = 0;
		this.amount = params.amount;
		
		if(this.mineral == null)
			this.model = Models.get('mineral');
		
		this.alturaUi = Config.ALTURA_UI_MINERAL;
	}
	
	isUnit() { return false; }
	isBuilding() { return false; }
	isEnemy() { return false; }
	isAliade() { return false; }
	isMineral() { return true; }
	isSoldier() { return false; }
	
	setPosNet(x, y)
	{
		this.pos.x = x;
		this.pos.y = y;
	}
	
	getInfo()
	{
		var info = [];
		info.push("Mineral");
		info.push("Amount: "+this.amount);
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
	// Return true if the mineral is inside ui area.
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
	// Return true if the mineral is inside.
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
	
	update(ms)
	{
		
	}
	
	draw(gl, shaders)
	{
		if(this.model != null)
		{
			shaders.pushMatrix();
			shaders.move(this.pos.x, this.pos.y, 0);
			this.model.draw(gl, shaders);
			shaders.popMatrix();
		}
	}
}

Mineral.model = null;
