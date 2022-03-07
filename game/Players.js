
class Players
{
	constructor(gl, map)
	{
		this.map = map;
		this.aliados = [];
		this.enemigos = [];
		this.current = null;
		
		this.countPlayersByEquip = {};
		
		/*
		this.current = new Player(gl, "icecool", map, 1);
		
		// Genero mis cosas.
		var base = new Base({id: 1, pos: {x:5, y:5}, vida: 100, creada: 100, enemy: false, aliade: false});
		this.current.addBuilding(base);
		
		var unit = new Recolector({id: 2, pos: {x:110, y:110}, vida: 100, creada: 100, contruccionCreando: 100, enemy: false, aliade: false});
		this.current.addUnit(unit);
		var unit = new Recolector({id: 7, pos: {x:115, y:110}, vida: 100, creada: 100, contruccionCreando: 100, enemy: false, aliade: false});
		this.current.addUnit(unit);
		var unit = new Recolector({id: 8, pos: {x:120, y:110}, vida: 100, creada: 100, contruccionCreando: 100, enemy: false, aliade: false});
		this.current.addUnit(unit);
		
		this.current.setAction(new Action({type: Action.MOVE, subType: Action.MOVE_MOVE, unit: null, unit2: null, build: null, unitID: 2, unit2ID: -1, buildID: -1, x:-10, y:-10}));
		
		// Genero cosas del enemigo.
		var enemigo = new Player(gl, "malo", map, 0);
		this.enemigos.push(enemigo);
		
		var base = new Base({id: 3, pos: {x:30, y:165}, vida: 100, creada: 100, enemy: true, aliade: false});
		enemigo.addBuilding(base);
		
		var unit = new Recolector({id: 4, pos: {x:20, y:150}, vida: 100, creada: 100, contruccionCreando: 100, enemy: true, aliade: false});
		enemigo.addUnit(unit);*/
	}
	
	setCurrent(player)
	{
		if(this.current == null)
			this.current = player;
		
		this.addPlayerToCount(player.equip);
	}
	
	addPlayer(player)
	{
		if(player.equip == this.current.equip)
			this.aliados.push(player);
		else
			this.enemigos.push(player);
		
		if(this.current != null && this.current.username != player.username)
			this.addPlayerToCount(player.equip);
	}
	
	removePlayer(name)
	{
		for(var i=0; i<this.aliados.length; i++)
		{
			if(this.aliados[i].username == name)
			{
				this.delPlayerToCount(this.aliados[i].equip);
				this.aliados.splice(i, 1);
				return;
			}
		}
		for(var i=0; i<this.enemigos.length; i++)
		{
			if(this.enemigos[i].username == name)
			{
				this.delPlayerToCount(this.enemigos[i].equip);
				this.enemigos.splice(i, 1);
				return;
			}
		}
	}
	
	get(username)
	{
		if(this.current != null && (username == null || this.current.username == username) )
			return this.current;
		else
		{
			for(var i=0; i<this.aliados.length; i++)
				if(this.aliados[i].username == username)
					return this.aliados[i];
			for(var i=0; i<this.enemigos.length; i++)
				if(this.enemigos[i].username == username)
					return this.enemigos[i];
		}
		return null;
	}
	
	// Handle the player count by equip
	addPlayerToCount(equip)
	{
		var keyEquip = equip+"";
		if(keyEquip in this.countPlayersByEquip)
			this.countPlayersByEquip[keyEquip]++;
		else
			this.countPlayersByEquip[keyEquip] = 1;
	}
	delPlayerToCount(equip)
	{
		var keyEquip = equip+"";
		this.countPlayersByEquip[keyEquip]--;
	}
	getCountPlayersByEquip(equip)
	{
		var keyEquip = equip+"";
		if(keyEquip in this.countPlayersByEquip)
			return this.countPlayersByEquip[keyEquip];
		else
			return 0;
	}
	
	getEquips()
	{
		var maxEquip = 1;
		for(const key in this.countPlayersByEquip)
		{
			if(parseInt(key) > maxEquip)
				maxEquip = parseInt(key);
		}
		return maxEquip+1;
	}

	// Return: {object, player}
	getObjectById(id)
	{
		var ret = {object: null, player: null};
		
		if(this.current != null)
		{
			var obj = this.current.getObjectById(id);
			if( obj != null)
			{
				ret.object = obj;
				ret.player = this.current;
				return ret;
			}
		}
		for(var i=0; i<this.aliados.length; i++)
		{
			var obj = this.aliados[i].getObjectById(id);
			if( obj != null)
			{
				ret.object = obj;
				ret.player = this.aliados[i];
				return ret;
			}
		}
		for(var i=0; i<this.enemigos.length; i++)
		{
			var obj = this.enemigos[i].getObjectById(id);
			if( obj != null)
			{
				ret.object = obj;
				ret.player = this.enemigos[i];
				return ret;
			}
		}
		return null;
	}
	
	update(ms)
	{
		for(var i=0; i<this.aliados.length; i++)
			this.aliados[i].update(ms, this);
		
		for(var i=0; i<this.enemigos.length; i++)
			this.enemigos[i].update(ms, this);
		
		if(this.current != null)
			this.current.update(ms, this);
	}
	
	draw(ctx, gl, shaders)
	{
		for(var i=0; i<this.aliados.length; i++)
			this.aliados[i].draw(ctx, gl, shaders);
		
		for(var i=0; i<this.enemigos.length; i++)
			this.enemigos[i].draw(ctx, gl, shaders);
		
		if(this.current != null)
			this.current.draw(ctx, gl, shaders);
	}
	
	// Retorna objetos que intersecta con el punto UI.
	intersectUI(gl, shaders, pos)
	{
		var ret = [];
		
		if(this.current != null)
			ret = this.current.intersectUI(gl, shaders, pos);
		
		for(var i=0; i<this.aliados.length; i++)
			ret = ret.concat(this.aliados[i].intersectUI(gl, shaders, pos));
		for(var i=0; i<this.enemigos.length; i++)
			ret = ret.concat(this.enemigos[i].intersectUI(gl, shaders, pos));

		return ret;
	}
	/*
	// Retorna objetos que intersecta con la recta.
	intersect(pos, dir)
	{
		var ret = [];
		
		if(this.current != null)
			ret = this.current.intersect(pos, dir);
		
		for(var i=0; i<this.aliados.length; i++)
			ret = ret.concat(this.aliados[i].intersect(pos, dir));
		for(var i=0; i<this.enemigos.length; i++)
			ret = ret.concat(this.enemigos[i].intersect(pos, dir));

		return ret;
	}
	*/
	// Return units and building if it is inside ui area.
	insideAreaUI(gl, shaders, leftTop, rightBottom)
	{
		var ret = [];
		
		if(this.current != null)
			ret = this.current.insideAreaUI(gl, shaders, leftTop, rightBottom);
		
		for(var i=0; i<this.aliados.length; i++)
			ret = ret.concat(this.aliados[i].insideAreaUI(gl, shaders, leftTop, rightBottom));
		for(var i=0; i<this.enemigos.length; i++)
			ret = ret.concat(this.enemigos[i].insideAreaUI(gl, shaders, leftTop, rightBottom));

		return ret;
	}
	/*
	// Return units and building if it is inside.
	insideArea(leftTop, rightTop, rightBottom, leftBottom)
	{
		var ret = [];
		
		if(this.current != null)
			ret = this.current.insideArea(leftTop, rightTop, rightBottom, leftBottom);
		
		for(var i=0; i<this.aliados.length; i++)
			ret = ret.concat(this.aliados[i].insideArea(leftTop, rightTop, rightBottom, leftBottom));
		for(var i=0; i<this.enemigos.length; i++)
			ret = ret.concat(this.enemigos[i].insideArea(leftTop, rightTop, rightBottom, leftBottom));

		return ret;
	}
	*/
	// Retorna objeto mas cercano de los jugadores.
	// Retorna: {dist, obj}
	near(pos, ignoreId=-1)
	{
		var ret = {dist: Infinity, obj: null};
		
		if(this.current != null)
		{
			var retTmp = this.current.near(pos, ignoreId);
			if(retTmp.dist < ret.dist)
				ret = retTmp;
		}
		for(var i=0; i<this.aliados.length; i++)
		{
			retTmp = this.aliados[i].near(pos, ignoreId);
			if(retTmp.dist < ret.dist)
				ret = retTmp;
		}
		for(var i=0; i<this.enemigos.length; i++)
		{
			retTmp = this.enemigos[i].near(pos, ignoreId);
			if(retTmp.dist < ret.dist)
				ret = retTmp;
		}

		return ret;
	}
	
	// Return colisioned object if the object colisioned with players.
	checkColision(obj, ignoredObjs)
	{
		var c = null;
		if(this.current != null)
			c = this.current.checkColision(obj, ignoredObjs);
		
		if(c != null)
			return c;
		else
		{
			for(var i=0; i<this.aliados.length; i++)
				if(c = this.aliados[i].checkColision(obj, ignoredObjs))
					return c;
			for(var i=0; i<this.enemigos.length; i++)
				if(c = this.enemigos[i].checkColision(obj, ignoredObjs))
					return c;
		}
		
		return null;
	}
}


