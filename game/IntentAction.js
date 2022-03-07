
class IntentAction
{
	// params: type, subType, unit, unit2, build, build2, unitID, unit2ID, buildID, build2ID, objectMapID, x, y, make
	constructor(params)
	{
		this.action = new Action(params);
	}
	
}

// Add an intent action.
IntentAction.get = function(game, selection, pos, actions, objAction)
{
	var ret = [];

	// There is action.
	if(actions.hasAction())
	{
		// Build a building.
		if(actions.isBuild())
		{
			// Select the first recolector.
			for(var i=0; i<selection.length; i++)
			{
				if(selection[i].type == Config.OT_RECOLECTOR && !selection[i].isEnemy() && !selection[i].isAliade())
				{
					var make = 0;
					if(actions.isMakeBase())
						make = Config.OT_BASE;
					else if(actions.isMakeBarraca())
						make = Config.OT_BARRACA;
					else if(actions.isMakeTorreta())
						make = Config.OT_TORRETA;
					
					if(make != 0 && (objAction == null || make == objAction.type) )
					{
						ret.push(new IntentAction({type: Action.BUILD, 
													subType: Action.BUILD_GOTOBUILD, 
													unit: selection[i], 
													unit2: null, 
													build: null, 
													build2: objAction,
													objectMap: null,
													unitID: selection[i].id, 
													unit2ID: 0, 
													buildID: 0, 
													build2ID: objAction == null ? 0 : objAction.id, 
													objectMapID: 0,
													x: pos.x, 
													y: pos.y,
													make: make}));
					}
					break;
				}
			}
		}
		// Make a new unit.
		else if(actions.isMakeUnit())
		{
			// Check if the selection is one and it's a building.
			if(selection.length == 1 && selection[0].isBuilding() && !selection[0].isEnemy() && !selection[0].isAliade())
			{
				// It's a Base and make recolector.
				if(selection[0].type == Config.OT_BASE && actions.isMakeRecolector())
				{
					ret.push(new IntentAction({type: Action.NEWUNIT, 
												subType: Action.NEWUNIT_MAKEUNIT, 
												unit: null, 
												unit2: null, 
												build: selection[0], 
												build2: null,
												objectMap: null,
												unitID: 0, 
												unit2ID: 0, 
												buildID: selection[0].id, 
												build2ID: 0, 
												objectMapID: 0,
												x: pos.x, 
												y: pos.y,
												make: Config.OT_RECOLECTOR}));
				}
				// It's a Barraca and make military.
				else if(selection[0].type == Config.OT_BARRACA && (actions.isMakeSoldadoRaso() || actions.isMakeSoldadoEntrenado() || actions.isMakeTanque() || actions.isMakeTanquePesado()) )
				{
					var make = 0;
					if(actions.isMakeSoldadoRaso())
						make = Config.OT_SOLDADO_RASO;
					else if(actions.isMakeSoldadoEntrenado())
						make = Config.OT_SOLDADO_ENTRENADO;
					else if(actions.isMakeTanque())
						make = Config.OT_TANQUE;
					else if(actions.isMakeTanquePesado())
						make = Config.OT_TANQUE_PESADO;


					if(make != 0)
					{
						ret.push(new IntentAction({type: Action.NEWUNIT, 
													subType: Action.NEWUNIT_MAKEUNIT, 
													unit: null, 
													unit2: null, 
													build: selection[0], 
													build2: null,
													objectMap: null,
													unitID: 0,
													unit2ID: 0, 
													buildID: selection[0].id,
													build2ID: 0,
													objectMapID: 0,
													x: pos.x, 
													y: pos.y,
													make: make}));
					}
				}
			}
			
		}
		// Attack.
		else if(actions.isAttack())
		{
			// Add an intent action for my each unit.
			for(var i=0; i<selection.length; i++)
			{
				if(selection[i].isUnit() && !selection[i].isEnemy() && !selection[i].isAliade())
				{
					ret.push(new IntentAction({type: Action.ATTACK, 
												subType: Action.ATTACK_GOTOATTACK, 
												unit: selection[i], 
												unit2: objAction != null && objAction.isUnit() ? objAction: null, 
												build: null,
												build2: objAction != null && objAction.isBuilding() ? objAction: null,
												objectMap: null,
												unitID: selection[i].id, 
												unit2ID: objAction != null && objAction.isUnit() ? objAction.id: 0, 
												buildID: 0,
												build2ID: objAction != null && objAction.isBuilding() ? objAction.id: 0,
												objectMapID: 0,
												x: pos.x, 
												y: pos.y,
													make: 0 }));
				}
			}
		}
		// Move.
		else if(actions.isMoveTo())
		{
			// Add an intent action for my each unit.
			for(var i=0; i<selection.length; i++)
			{
				if(selection[i].isUnit() && !selection[i].isEnemy() && !selection[i].isAliade())
				{
					// If it's a recollector that move to unfinished building then it's a build action.
					if(objAction != null && selection[i].type == Config.OT_RECOLECTOR && objAction.isBuilding() && 
						(!objAction.isEnemy() && !objAction.isAliade()) && objAction.creada < objAction.fullLife )
					{
						ret.push(new IntentAction({type: Action.BUILD, 
													subType: Action.BUILD_GOTOBUILD, 
													unit: selection[i], 
													unit2: null, 
													build: null, 
													build2: objAction,
													objectMap: null,
													unitID: selection[i].id, 
													unit2ID: 0, 
													buildID: 0, 
													build2ID: objAction.id, 
													objectMapID: 0,
													x: pos.x, 
													y: pos.y,
													make: objAction.type}));
					}
					// If it's a recollector that move to mineral then it's a recollect action.
					else if(objAction != null && objAction.isMineral() && selection[i].type == Config.OT_RECOLECTOR)
					{
						ret.push(new IntentAction({type: Action.RECOLLECT, 
													subType: Action.RECOLLECT_GORESOURCE, 
													unit: selection[i], 
													unit2: null, 
													build: null,
													build2: null,
													objectMap: objAction,
													unitID: selection[i].id, 
													unit2ID: 0, 
													buildID: 0,
													build2ID: 0,
													objectMapID: objAction.id,
													x: pos.x, 
													y: pos.y,
													make: 0 }));
					}
					else
					{
						ret.push(new IntentAction({type: Action.MOVE, 
													subType: Action.MOVE_MOVE, 
													unit: selection[i], 
													unit2: objAction != null && objAction.isUnit() ? objAction: null, 
													build: null,
													build2: objAction != null && objAction.isBuilding() ? objAction: null,
													objectMap: null,
													unitID: selection[i].id, 
													unit2ID: objAction != null && objAction.isUnit() ? objAction.id: 0, 
													buildID: 0,
													build2ID: objAction != null && objAction.isBuilding() ? objAction.id: 0,
													objectMapID: 0,
													x: pos.x, 
													y: pos.y,
													make: 0 }));
					}
				}
			}
		}
	}
	
	
	
	
	
	
	
	
	// There isn't action. Make action depending of context.
	else
	{
		for(var i=0; i<selection.length; i++)
		{
			// For each my units.
			if(selection[i].isUnit() && !selection[i].isEnemy() && !selection[i].isAliade())
			{
				// Attack if my unit is a soldier and the object is enemy.
				if(selection[i].isSoldier() && objAction != null && objAction.isEnemy() )
				{
					ret.push(new IntentAction({type: Action.ATTACK, 
												subType: Action.ATTACK_GOTOATTACK, 
												unit: selection[i], 
												unit2: objAction != null && objAction.isUnit() ? objAction: null, 
												build: null,
												build2: objAction != null && objAction.isBuilding() ? objAction: null,
												objectMap: null,
												unitID: selection[i].id, 
												unit2ID: objAction != null && objAction.isUnit() ? objAction.id: 0, 
												buildID: 0,
												build2ID: objAction != null && objAction.isBuilding() ? objAction.id: 0,
												objectMapID: 0,
												x: pos.x, 
												y: pos.y,
												make: 0 }));
				}
				// Make if the action is to building, the unit is recolector, the building is mine and it isn't finished.
				else if(objAction != null && selection[i].type == Config.OT_RECOLECTOR && objAction.isBuilding() && 
						(!objAction.isEnemy() && !objAction.isAliade()) && objAction.creada < objAction.fullLife )
				{
					ret.push(new IntentAction({type: Action.BUILD, 
												subType: Action.BUILD_GOTOBUILD, 
												unit: selection[i], 
												unit2: null, 
												build: null, 
												build2: objAction,
												objectMap: null,
												unitID: selection[i].id, 
												unit2ID: 0, 
												buildID: 0, 
												build2ID: objAction.id, 
												objectMapID: 0,
												x: pos.x, 
												y: pos.y,
												make: objAction.type}));
				}
				// Recollect if it's a Recolector.
				else if(objAction != null && objAction.isMineral() && selection[i].type == Config.OT_RECOLECTOR)
				{
					ret.push(new IntentAction({type: Action.RECOLLECT, 
												subType: Action.RECOLLECT_GORESOURCE, 
												unit: selection[i], 
												unit2: null, 
												build: null,
												build2: null,
												objectMap: objAction,
												unitID: selection[i].id, 
												unit2ID: 0, 
												buildID: 0,
												build2ID: 0,
												objectMapID: objAction.id,
												x: pos.x, 
												y: pos.y,
												make: 0 }));
				}
				// Move by default.
				else
				{
					ret.push(new IntentAction({type: Action.MOVE, 
												subType: Action.MOVE_MOVE, 
												unit: selection[i], 
												unit2: objAction != null && objAction.isUnit() ? objAction: null, 
												build: null,
												build2: objAction != null && objAction.isBuilding() ? objAction: null,
												objectMap: null,
												unitID: selection[i].id, 
												unit2ID: objAction != null && objAction.isUnit() ? objAction.id: 0, 
												buildID: 0,
												build2ID: objAction != null && objAction.isBuilding() ? objAction.id: 0,
												objectMapID: 0,
												x: pos.x, 
												y: pos.y,
												make: 0 }));
				}
			}
		}
	}
	
	
	return ret;
}
