
class Control
{
	constructor(gl, ctx2D, camera)
	{
		Control.instance = this;
		
		this.gl = gl;
		this.camera = camera;
		
		this.left = false;
		this.right = false;
		this.up = false;
		this.down = false;
		
		this.selectPoint = null;
		this.selectArea = null;
		this.selection = [];
		
		// Object's id that i must to keep receive updates despite i dont see them (building with queue for example)
		this.objectsKeepUpdate = [];
		
		this.ui = new UI(gl, ctx2D, camera, this);
		
		this.pointer = new ControlPointer(gl, camera, this.ui, this);
		
		this.numObjs = new NumerateObjects(gl, document.game.shaders, ctx2D, camera, this);
		
		this.modelBase = Models.get('base');
		this.modelBarraca = Models.get('barraca');
		this.modelTorretaBase = Models.get('torreta_base');
		this.modelTorretaUp = Models.get('torreta_up');
		
		this.gameEnd = false;
	}
	
	setEnd(surrender, win, lose, gameFinish, rank)
	{
		this.ui.setEnd(surrender, win, lose, gameFinish, rank);
		this.gameEnd = true;
	}
	
	userWantToLeave()
	{
		return this.ui.userWantToLeave();
	}
	
	isMiniMapFullscreen()
	{
		return this.ui.isMiniMapFullscreen();
	}
	
	update(ms)
	{
		var deltaX = 0;
		var deltaY = 0;
		var deltaZ = 0;
		
		if(this.left)
			deltaX -= Config.MOVIMIENTO_CAMARA_SEGUNDO;
		if(this.right)
			deltaX += Config.MOVIMIENTO_CAMARA_SEGUNDO;
		if(this.up)
			deltaY += Config.MOVIMIENTO_CAMARA_SEGUNDO;
		if(this.down)
			deltaY -= Config.MOVIMIENTO_CAMARA_SEGUNDO;
		
		deltaX *= (ms/1000.0);
		deltaY *= (ms/1000.0);
		deltaZ *= (ms/1000.0);

		this.camera.move(deltaX, deltaY, deltaZ);
		
		this.ui.update(ms);
		this.numObjs.update(ms);
	}

	destroyObject(id)
	{
		for(var i=0; i<this.selection.length; i++)
		{
			if(this.selection[i].id == id)
			{
				this.selection.splice(i, 1);
				break;
			}
		}
		var index = this.objectsKeepUpdate.indexOf(id);
		if(index >= 0)
			this.objectsKeepUpdate.splice(index,1);
		this.numObjs.destroyObject(id);
	}
	
	// Return object's ids that it must to keep the updated despite i dont see them
	getIdsMustToBeUpdated()
	{
		var ids = [];
		
		// Selected objects
		for(var i=0; i<this.selection.length; i++)
			ids.push(this.selection[i].id);
		
		// Add objects that I want to keep updates.
		var i=0;
		while(i<this.objectsKeepUpdate.length)
		{
			// Remove id if is a building that it has not already queue
			var obj = document.game.players.get(null).getObjectById(this.objectsKeepUpdate[i]);
			if(obj.isBuilding() && obj.intentsQueue.length == 0)
				this.objectsKeepUpdate.splice(i,1);
			else
			{
				if(!ids.includes(this.objectsKeepUpdate[i]))
					ids.push(this.objectsKeepUpdate[i]);
				i++;
			}
		}
		
		return ids;
	}
	
	setInvisibleObject(id, isEnemy)
	{
		if(isEnemy)
			this.destroyObject(id)
	}
	
	setVisibleObject(obj)
	{
		// Update object to selections
		for(var i=0; i<this.selection.length; i++)
		{
			if(this.selection[i].id == obj.id && this.selection[i] != obj)
			{
console.log("ACTUALIZO SELECTIONNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN")
				this.selection[i] = obj;
			}
		}
		this.numObjs.setVisibleObject(obj)
	}
	
	setSelection(newSelection)
	{
		this.selection = newSelection;
	}
	
	theresTypeInSelection(objType)
	{
		for(var i=0; i<this.selection.length; i++)
			if(this.selection[i].type == objType)
				return true;
		return false;
	}
					
	setMiniMap(img)
	{
		this.ui.setMiniMap(img);
	}
	
	keyDown(event) 
	{
		var key = event.keyCode || event.which;
		var keychar = String.fromCharCode(key);

		// Left.
		if (key == 37) 
		{
			this.left = true;
		}
		// Right.
		else if(key == 39)
		{
			this.right = true;
		}
		// Up.
		else if(key == 38)
		{
			this.up = true;
		}
		// Down.
		else if(key == 40)
		{
			this.down = true;
		}
		// Numbers
		else if(key >= 48 && key <= 57)
		{
			var number = key-48;
			if(event.ctrlKey)
				this.numObjs.setSelection(number);
			else
				this.numObjs.select(number);
		}
	}

	keyUp(event)
	{
		var key = event.keyCode || event.which;
		var keychar = String.fromCharCode(key);

		// Left.
		if (key == 37) 
		{
			this.left = false;
		}
		// Right.
		else if(key == 39)
		{
			this.right = false;
		}
		// Up.
		else if(key == 38)
		{
			this.up = false;
		}
		// Down.
		else if(key == 40)
		{
			this.down = false;
		}
		// Escape.
		else if(key == 27)
		{
			// Quito fullscreen map.
			if(this.ui.isMiniMapFullscreen())
				this.ui.setFullscreen(false);
			// Quit action.
			else if(this.ui.hasAction())
				this.ui.clear();
		}
		// ZoomIn
		else if(key == 107 || key==187)
		{
			this.ui.doZoomInMiniMap();
		}
		// ZoomOut
		else if(key == 109 || key==189)
		{
			this.ui.doZoomOutMiniMap();
		}
		// Want attack.
		else if(keychar == UI.keyAttack)
		{
			// Only if into selection there are soliders.
			var thereAreSoldiers = false;
			for(var i=0; i<this.selection.length; i++)
			{
				if(this.selection[i].isUnit() && this.selection[i].isSoldier())
				{
					thereAreSoldiers = true;
					break;
				}
			}
			if(thereAreSoldiers)
				this.ui.setAttack();
		}
		// Want make base.
		else if(keychar == UI.keyMakeBase)
		{
			if(this.theresTypeInSelection(Config.OT_RECOLECTOR))
				this.ui.setMakeBase();
		}
		// Want make barraca.
		else if(keychar == UI.keyMakeBarraca)
		{
			if(this.theresTypeInSelection(Config.OT_RECOLECTOR))
				this.ui.setMakeBarraca();
		}
		// Want make torreta.
		else if(keychar == UI.keyMakeTorreta)
		{
			if(this.theresTypeInSelection(Config.OT_RECOLECTOR))
				this.ui.setMakeTorreta();
		}
		// Want make recolector.
		else if(keychar == UI.makeRecolector)
		{
			this.ui.setMakeRecolector();
		}
		// Want make soldado raso.
		else if(keychar == UI.makeSoldadoRaso)
		{
			this.ui.setMakeSoldadoRaso();
		}
		// Want make soldado entrenado.
		else if(keychar == UI.makeSoldadoEntrenado)
		{
			this.ui.setMakeSoldadoEntrenado();
		}
		// Want make tanque.
		else if(keychar == UI.makeTanque)
		{
			this.ui.setMakeTanque();
		}
		// Want make tanque pesado.
		else if(keychar == UI.makeTanquePesado)
		{
			this.ui.setMakeTanquePesado();
		}
		// Toggle minimap fullscreen.
		else if(keychar == UI.miniMapFullscreen)
		{
			if(this.isMiniMapFullscreen())
				this.ui.setFullscreen(false);
			else
				this.ui.setFullscreen(true);
		}
		
		
		this.executeOneShotAction();
	}

	// Cuando pierde el foco la ventana.
	blur(e)
	{
		console.log(e);
	}

	draw(gl, shaders, ctx2D, area)
	{
		if(this.gameEnd)
		{
			this.ui.draw(gl, ctx2D, this, area);
		}
		else if(this.ui.isMiniMapFullscreen())
		{
			this.ui.draw(gl, ctx2D, this, area);
		}
		else
		{
			if(this.selection.length > 0)
			{
				// Draw building that will be made
				if(this.ui.isMakeBase() || this.ui.isMakeBarraca() || this.ui.isMakeTorreta())
				{
					// Get terrain pos and near object.
					var pos = Colision.pantallaToTerrain(gl, shaders, this.pointer.posPointer.x, this.pointer.posPointer.y);
					var nearObj = Colision.near(document.game, pos, this.selection[0].id);
					
					shaders.pushMatrix();
					shaders.move(pos.x, pos.y, 0);
					shaders.setColor(1, 1, 1, 0.8);
					
					var minerals = document.game.players.get(null).minerals;
					var myEquip = document.game.players.get(null).equip;
					
					if(this.ui.isMakeBase())
					{
						if( (minerals < Config.MINERALS_COST_BASE) || (nearObj.obj != null && nearObj.dist <= (Config.RADIO_BASE + nearObj.obj.radio +2.0)) )
							shaders.setColor(1, 0.4, 0.4, 0.8);
						this.modelBase.draw(gl, shaders, myEquip);
					}
					else if(this.ui.isMakeBarraca())
					{
						if( (minerals < Config.MINERALS_COST_BARRACA) || (nearObj.obj != null && nearObj.dist <= (Config.RADIO_BARRACA + nearObj.obj.radio +2.0)) )
							shaders.setColor(1, 0.4, 0.4, 0.8);
						this.modelBarraca.draw(gl, shaders, myEquip);
					}
					else if(this.ui.isMakeTorreta())
					{
						if( (minerals < Config.MINERALS_COST_TORRETA) || (nearObj.obj != null && nearObj.dist <= (Config.RADIO_TORRETA + nearObj.obj.radio +2.0)) )
							shaders.setColor(1, 0.4, 0.4, 0.8);
						this.modelTorretaBase.draw(gl, shaders, myEquip);
						this.modelTorretaUp.draw(gl, shaders, myEquip);
					}
					
					shaders.clearColor();
					shaders.popMatrix();
				}
			
				for(var i=0; i<this.selection.length; i++)
				{
					var center = Colision.terrainToPantalla(gl, shaders, this.selection[i].pos);
					var radio = this.selection[i].radio * (gl.canvas.width/Config.ANCHO_PROJECTION);
					var altura = this.selection[i].alturaUi * (gl.canvas.width/Config.ANCHO_PROJECTION);
					var p1 = {x: center.x-radio, y: center.y+altura};
					var p2 = {x: center.x+radio, y: center.y+altura};
					var p3 = {x: center.x+radio, y: center.y-radio*0.707};
					var p4 = {x: center.x-radio, y: center.y-radio*0.707};

					var color = "#00FF00";
					if(this.selection[i].isEnemy())
						color = "#FF0000";
					else if(this.selection[i].isAliade())
						color = "#0000FF";
					
					// Dibujo cuadrado.
					Pantalla2D.drawLines(ctx2D, [p1, p2, p3, p4, p1], color);
				}
			}
			
			// Mobile move mode
			if(Config.isMobile() && this.ui.isMobileMoveMode())
			{
				//
			}
			// Draw mouse area selection.
			else
				this.pointer.draw(gl, ctx2D);
			
			this.ui.draw(gl, ctx2D, this, area);
		}
	}
	
	executeOneShotAction()
	{
		if(this.ui.hasAction() && this.ui.isMakeUnit())
		{
			// Get objects.
			
			
			// Get intent actions.
			var intentActions = IntentAction.get(document.game, this.selection, {x:-1, y:-1}, this.ui, null);
			
			// Do build unit queue.
			var i=0;
			while(i<intentActions.length)
			{
				// If it's to make a unit then check if the building is busy with an action, if it's busy then I queue the intent.
				if(intentActions[i].action.type == Action.NEWUNIT && intentActions[i].action.build.action != null)
				{
					var int = intentActions.splice(i,1)[0];
					int.action.build.addIntent(int);
					// Add building as object to keep update
					if(!this.objectsKeepUpdate.includes(int.action.build.id))
						this.objectsKeepUpdate.push(int.action.build.id);
				}
				else
					i++;
			}
				
			// Send its to server.
			if(intentActions != null && intentActions.length > 0)
				document.game.net.sendIntentActions(intentActions);
					
			this.ui.clear();
		}
	}
	
	
	// Return index of obj in list
	indexObjectInList(list, obj)
	{
		for(var i=0; i<list.length; i++)
			if(list[i].id == obj.id)
				return i;
		return -1;
	}
	
	// Concat two list and prevent there's no repeat
	concatListObject(list1, list2)
	{
		var ret = [];
		for(var i=0; i<list1.length; i++)
			ret.push(list1[i]);
		for(var i=0; i<list2.length; i++)
			if(this.indexObjectInList(list1, list2[i]) < 0)
				ret.push(list2[i]);
		return ret;
	}
	
	// Add to selection objects keeping logic
	addToSelection(playersObjects, objectsMaps)
	{
		// Add to the selection the new players.
		this.selection = this.concatListObject(this.selection, playersObjects);
		
		// Check if there's players and/or objects map
		var theresPlayers = false;
		var theresObjectMap = false;
		for(var i=0; i<this.selection.length; i++)
		{
			if(this.selection[i].isMineral())
				theresObjectMap = true;
			else
				theresPlayers = true;
		}
		
		// If there's object map and players, then remove object map.
		if(theresPlayers && theresObjectMap)
		{
			var i=0;
			while(i<this.selection.length)
			{
				if(this.selection[i].isMineral())
					this.selection.splice(i,1);
				else
					i++;
			}
		}
		// Else if there's only object map then concat new object map.
		else if( !theresPlayers && theresObjectMap)
			this.selection = this.concatListObject(this.selection, objectsMaps);
		
		// There's no player neither object map.
		else if( !theresPlayers && !theresObjectMap)
			this.selection = objectsMaps;
	}
}

Control.instance = null;

Control.keyDown = function(event)
{
	if(Control.instance != null)
		Control.instance.keyDown(event);
}

Control.keyUp = function(event)
{
	if(Control.instance != null)
		Control.instance.keyUp(event);
}















