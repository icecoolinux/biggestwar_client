
class Action
{
	// params: type, subType, unit, unit2, build, build2, objectMap, unitID, unit2ID, buildID, build2ID, objectMapID, x, y, make
	constructor(params)
	{
		this.type = params.type;
		this.subType = params.subType;
		
		this.unit = params.unit;
		this.unit2 = params.unit2;
		this.build = params.build;
		this.build2 = params.build2;
		this.objectMap = params.objectMap;
		
		this.unitID = params.unitID;
		this.unit2ID = params.unit2ID;
		this.buildID = params.buildID;
		this.build2ID = params.build2ID;
		this.objectMapID = params.objectMapID;
		
		this.pos = {x:params.x, y:params.y};
		
		this.make = params.make;
		
		this.wasDeleted = false;
	}
	
	setDelete()
	{
		this.wasDeleted = true;
	}
	
	isWalking()
	{
		return this.subType == Action.MOVE_MOVE || 
				this.subType == Action.RECOLLECT_GORESOURCE || 
				this.subType == Action.RECOLLECT_GOBASE || 
				this.subType == Action.BUILD_GOTOBUILD || 
				this.subType == Action.ATTACK_GOTOATTACK;
	}
	
	isAttacking()
	{
		return this.subType == Action.ATTACK_ATTACKING;
	}
	
	isRecolectando()
	{
		return this.subType == Action.RECOLLECT_RECOLLECTING;
	}
	
	isMaking()
	{
		return this.subType == Action.BUILD_BUILDING;
	}

	setIds(players, map)
	{
		var ok = true;
		
		if(this.unit == null && this.unitID >= 1)
		{
			var ret = players.getObjectById(this.unitID);
			if( ret != null)
				this.unit = ret.object;
			else
				ok = false;
		}
		if(this.unit2 == null && this.unit2ID >= 1)
		{
			var ret = players.getObjectById(this.unit2ID);
			if( ret != null)
				this.unit2 = ret.object;
			else
				ok = false;
		}
		if(this.build == null && this.buildID >= 1)
		{
			var ret = players.getObjectById(this.buildID);
			if( ret != null)
				this.build = ret.object;
			else
				ok = false;
		}
		if(this.build2 == null && this.build2ID >= 1)
		{
			var ret = players.getObjectById(this.build2ID);
			if( ret != null)
				this.build2 = ret.object;
			else
				ok = false;
		}
		if(this.objectMap == null && this.objectMapID >= 1)
		{
			this.objectMap = map.getObjectById(this.objectMapID);
			
			if(this.objectMap == null)
				ok = false;
		}
		
		return ok;
	}
}


Action.MOVE = 1;
Action.RECOLLECT = 2;
Action.BUILD = 3;
Action.ATTACK = 4;
Action.NEWUNIT = 5;


Action.MOVE_MOVE = 1;
Action.RECOLLECT_GORESOURCE = 2;
Action.RECOLLECT_RECOLLECTING = 3;
Action.RECOLLECT_GOBASE = 4;
Action.RECOLLECT_PUTTOBASE = 5;
Action.BUILD_GOTOBUILD = 6;
Action.BUILD_BUILDING = 7;
Action.ATTACK_GOTOATTACK = 8;
Action.ATTACK_ATTACKING = 9;
Action.NEWUNIT_MAKEUNIT = 10;
