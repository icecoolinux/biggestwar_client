
class Player
{
	constructor(gl, username, map, equip)
	{
		this.username = username;
		this.map = map;
		this.equip = equip;
		
		this.buildings = [];
		this.units = [];
		
		this.actionsWithoutId = [];
		
		this.minerals = 0;
		this.oil = 0;
	}
	
	getObjectById(id)
	{
		for(var i=0; i<this.buildings.length; i++)
			if(this.buildings[i].id == id)
				return this.buildings[i];
		
		for(var i=0; i<this.units.length; i++)
			if(this.units[i].id == id)
				return this.units[i];
			
		return null;
	}
	
	addUnit(unit)
	{
		this.units.push(unit);
	}
	
	removeUnit(id)
	{
		for(var i=0; i<this.units.length; i++)
		{
			if(this.units[i].id == id)
			{
				this.units.splice(i, 1);
				return;
			}
		}
	}
	
	addBuilding(building)
	{
		this.buildings.push(building);
	}
	
	removeBuilding(id)
	{
		for(var i=0; i<this.buildings.length; i++)
		{
			if(this.buildings[i].id == id)
			{
				this.buildings.splice(i, 1);
				return;
			}
		}
	}
	
	setAction(players, action)
	{
		if(!action.setIds(players, this.map))
			this.actionsWithoutId.push(action);

		// Make new unit or is attack of torreta
		if(action.type == Action.NEWUNIT || (action.build != null && action.build.type == Config.OT_TORRETA && action.type == Action.ATTACK) )
			action.build.setAction(action);
		// Then it's unit
		else
			action.unit.setAction(action);
	}
	
	update(ms, players)
	{
		var i=0;
		while(i<this.actionsWithoutId.length)
		{
			if(this.actionsWithoutId[i].wasDeleted)
				this.actionsWithoutId.splice(i, 1);
			else
			{
				if(this.actionsWithoutId[i].setIds(players, this.map))
					this.actionsWithoutId.splice(i, 1);
				else
					i++;
			}
		}
		
		for(i=0; i<this.buildings.length; i++)
			this.buildings[i].update(ms);
		
		for(i=0; i<this.units.length; i++)
			this.units[i].update(ms);
	}
	
	draw(ctx, gl, shaders)
	{
		for(var i=0; i<this.buildings.length; i++)
			this.buildings[i].draw(ctx, gl, shaders);
		
		for(var i=0; i<this.units.length; i++)
			this.units[i].draw(ctx, gl, shaders);
	}
	
	// Return units and building if it is inside ui area.
	insideAreaUI(gl, shaders, leftTop, rightBottom)
	{
		var ret = [];
		
		for(var i=0; i<this.units.length; i++)
			if(this.units[i].insideAreaUI(gl, shaders, leftTop, rightBottom))
				ret.push(this.units[i]);
			
		for(var i=0; i<this.buildings.length; i++)
			if(this.buildings[i].insideAreaUI(gl, shaders, leftTop, rightBottom))
				ret.push(this.buildings[i]);
			
		return ret;
	}
	/*
	// Return units and building if it is inside.
	insideArea(leftTop, rightTop, rightBottom, leftBottom)
	{
		var ret = [];
		
		for(var i=0; i<this.units.length; i++)
			if(this.units[i].insideArea(leftTop, rightTop, rightBottom, leftBottom))
				ret.push(this.units[i]);
			
		for(var i=0; i<this.buildings.length; i++)
			if(this.buildings[i].insideArea(leftTop, rightTop, rightBottom, leftBottom))
				ret.push(this.buildings[i]);
			
		return ret;
	}
	*/
	// Retorna objetos que intersecta con el punto ui.
	intersectUI(gl, shaders, pos)
	{
		var ret = [];
		
		for(var i=0; i<this.units.length; i++)
			if(this.units[i].intersectUI(gl, shaders, pos))
				ret.push(this.units[i]);
			
		for(var i=0; i<this.buildings.length; i++)
			if(this.buildings[i].intersectUI(gl, shaders, pos))
				ret.push(this.buildings[i]);
			
		return ret;
	}
	/*
	// Retorna objetos que intersecta con la recta.
	intersect(pos, dir)
	{
		var ret = [];
		
		for(var i=0; i<this.units.length; i++)
			if(this.units[i].intersect(pos, dir))
				ret.push(this.units[i]);
			
		for(var i=0; i<this.buildings.length; i++)
			if(this.buildings[i].intersect(pos, dir))
				ret.push(this.buildings[i]);
			
		return ret;
	}
	*/
	// Retorna el objecto mas cerca.
	near(pos, ignoreId=-1)
	{
		var ret = {dist: Infinity, obj: null};
		
		// Busco unidades cercanas.
		for(var i=0; i<this.units.length; i++)
		{
			if(ignoreId >= 0 && this.units[i].id == ignoreId)
				continue;
			var dist = Geom.dist3(pos, this.units[i].pos);
			if(dist < ret.dist)
			{
				ret.dist = dist;
				ret.obj = this.units[i];
			}
		}

		// Busco contrucciones cercanas.
		for(var i=0; i<this.buildings.length; i++)
		{
			if(ignoreId >= 0 && this.buildings[i].id == ignoreId)
				continue;
			var dist = Geom.dist3(pos, this.buildings[i].pos);
			if(dist < ret.dist)
			{
				ret.dist = dist;
				ret.obj = this.buildings[i];
			}
		}
		
		return ret;
	}
	
	// Return colisioned object if the object colisioned with units or buildings.
	checkColision(obj, ignoredObjs)
	{
		var c;
		for(var i=0; i<this.units.length; i++)
		{
			if(c = this.units[i].checkColision(obj))
			{
				var ignore = false;
				for(var j=0; j<ignoredObjs.length; j++)
				{
					if(ignoredObjs[j].id == c.id)
					{
						ignore = true;
						break;
					}
				}
				if(!ignore)
					return c;
			}
		}
		for(var i=0; i<this.buildings.length; i++)
		{
			if(c = this.buildings[i].checkColision(obj))
			{
				var ignore = false;
				for(var j=0; j<ignoredObjs.length; j++)
				{
					if(ignoredObjs[j].id == c.id)
					{
						ignore = true;
						break;
					}
				}
				if(!ignore)
					return c;
			}
		}
		
		return null;
	}
	
	// Return objects that is one type and is near to position.
	getObjectsByTypePosition(type, pos, dist)
	{
		var ret = [];
		
		for(var i=0; i<this.units.length; i++)
		{
			if( this.units[i].constructor.name == type && Geom.dist(pos, this.units[i].pos) <= dist)
				ret.push(this.units[i]);
		}
		
		if(ret.length == 0)
		{
			for(var i=0; i<this.buildings.length; i++)
			{
				if( this.buildings[i].constructor.name == type && Geom.dist(pos, this.buildings[i].pos) <= dist)
					ret.push(this.buildings[i]);
			}
		}
		
		return ret;
	}
}












