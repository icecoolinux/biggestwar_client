
class UI
{
	constructor(gl, ctx2D, camera, control)
	{
		this.control = control;
		
		var alto = gl.canvas.height;
		this.posTmp = {x:0, y:0};
		this.dimTmp = {x:0, y:0};
		
		var ui = this;
		
		this.miniMap = new MiniMap(gl, camera);
		
		// To select one from selections.
		this.cantCalculatedSelection = 0;
		this.rowsSelection = 0;
		this.heightRowSelection = 0;
		this.amountRowSelection = 0;
			
		// Bar
		this.posBar = {x:0 , y: 0};
		this.imgBar = Textures.getCanvas("tablero");
		
		// Info.
		this.imgGreenObjects = Textures.getCanvas("objects_green");
		this.imgOrangeObjects = Textures.getCanvas("objects_orange");
		this.imgRedObjects = Textures.getCanvas("objects_red");
		this.imgYellowObjects = Textures.getCanvas("objects_yellow");
		this.posImgObject = {x:0, y:0};
		this.dimImgObject = {x:128, y:128};
		
		// Icons images.
		this.imgIcons = Textures.getCanvas("icons_white");
		this.imgGreenIcons = Textures.getCanvas("icons_green");
		this.imgIcons2 = Textures.getCanvas("icons");
		this.imgIconsClicked2 = Textures.getCanvas("icons_clicked");

		// Actions buttons.
		this.showRecollectorActionsButton = false;
		this.showSoldierActionsButton = false;
		this.showBaseActionsButton = false;
		this.showBarracaActionsButton = false;
		this.showUnitActionsButton = false;
		
		this.actionMoveTo = new Button(gl, 
										{x: UI.POS_ACTIONS.x, y: UI.POS_ACTIONS.y+UI.DIM_ACTIONS.y-UI.DIM_ACTIONS.x}, 
										{x:UI.DIM_ACTIONS.x, y:UI.DIM_ACTIONS.x});
		this.actionMoveTo.setImg(this.imgIcons, {x:0, y:0}, {x:64, y:64}, this.imgGreenIcons);
		this.actionMoveTo.setInfo(ctx2D, UI.infoMoveTo);
		
		this.actionAttack = new Button(gl, 
										{x: UI.POS_ACTIONS.x, y: UI.POS_ACTIONS.y+UI.DIM_ACTIONS.y-2*UI.DIM_ACTIONS.x}, 
										{x:UI.DIM_ACTIONS.x, y:UI.DIM_ACTIONS.x});
		this.actionAttack.setImg(this.imgIcons, {x:64, y:0}, {x:64, y:64}, this.imgGreenIcons);
		this.actionAttack.setInfo(ctx2D, UI.infoAttack);
		this.attackOneShot = true;
		
		this.actionMakeBase = new Button(gl, 
										{x: UI.POS_ACTIONS.x, y: UI.POS_ACTIONS.y+UI.DIM_ACTIONS.y-2*UI.DIM_ACTIONS.x}, 
										{x:UI.DIM_ACTIONS.x, y:UI.DIM_ACTIONS.x});
		this.actionMakeBase.setImg(this.imgIcons, {x:128, y:0}, {x:64, y:64}, this.imgGreenIcons);
		this.actionMakeBase.setInfo(ctx2D, UI.infoMakeBase);
		
		this.actionMakeBarraca = new Button(gl, 
										{x: UI.POS_ACTIONS.x, y: UI.POS_ACTIONS.y+UI.DIM_ACTIONS.y-3*UI.DIM_ACTIONS.x}, 
										{x:UI.DIM_ACTIONS.x, y:UI.DIM_ACTIONS.x});
		this.actionMakeBarraca.setImg(this.imgIcons, {x:192, y:0}, {x:64, y:64}, this.imgGreenIcons);
		this.actionMakeBarraca.setInfo(ctx2D, UI.infoMakeBarraca);
		
		this.actionMakeTorreta = new Button(gl, 
										{x: UI.POS_ACTIONS.x, y: UI.POS_ACTIONS.y+UI.DIM_ACTIONS.y-4*UI.DIM_ACTIONS.x}, 
										{x:UI.DIM_ACTIONS.x, y:UI.DIM_ACTIONS.x});
		this.actionMakeTorreta.setImg(this.imgIcons, {x:0, y:64}, {x:64, y:64}, this.imgGreenIcons);
		this.actionMakeTorreta.setInfo(ctx2D, UI.infoMakeTorreta);
		
		this.actionMakeRecolector = new Button(gl, 
										{x: UI.POS_ACTIONS.x, y: UI.POS_ACTIONS.y+UI.DIM_ACTIONS.y-UI.DIM_ACTIONS.x}, 
										{x:UI.DIM_ACTIONS.x, y:UI.DIM_ACTIONS.x});
		this.actionMakeRecolector.setImg(this.imgIcons, {x:64, y:64}, {x:64, y:64}, this.imgGreenIcons);
		this.actionMakeRecolector.setInfo(ctx2D, UI.infoMakeRecolector);
		
		this.actionMakeSoldadoRaso = new Button(gl, 
										{x: UI.POS_ACTIONS.x, y: UI.POS_ACTIONS.y+UI.DIM_ACTIONS.y-UI.DIM_ACTIONS.x}, 
										{x:UI.DIM_ACTIONS.x, y:UI.DIM_ACTIONS.x});
		this.actionMakeSoldadoRaso.setImg(this.imgIcons, {x:128, y:64}, {x:64, y:64}, this.imgGreenIcons);
		this.actionMakeSoldadoRaso.setInfo(ctx2D, UI.infoMakeSoldadoRaso);
		
		this.actionMakeSoldadoEntrenado = new Button(gl, 
										{x: UI.POS_ACTIONS.x, y: UI.POS_ACTIONS.y+UI.DIM_ACTIONS.y-2*UI.DIM_ACTIONS.x}, 
										{x:UI.DIM_ACTIONS.x, y:UI.DIM_ACTIONS.x});
		this.actionMakeSoldadoEntrenado.setImg(this.imgIcons, {x:192, y:64}, {x:64, y:64}, this.imgGreenIcons);
		this.actionMakeSoldadoEntrenado.setInfo(ctx2D, UI.infoMakeSoldadoEntrenado);
		
		this.actionMakeTanque = new Button(gl, 
										{x: UI.POS_ACTIONS.x, y: UI.POS_ACTIONS.y+UI.DIM_ACTIONS.y-3*UI.DIM_ACTIONS.x}, 
										{x:UI.DIM_ACTIONS.x, y:UI.DIM_ACTIONS.x});
		this.actionMakeTanque.setImg(this.imgIcons, {x:0, y:128}, {x:64, y:64}, this.imgGreenIcons);
		this.actionMakeTanque.setInfo(ctx2D, UI.infoMakeTanque);
		
		this.actionMakeTanquePesado = new Button(gl, 
										{x: UI.POS_ACTIONS.x, y: UI.POS_ACTIONS.y+UI.DIM_ACTIONS.y-4*UI.DIM_ACTIONS.x}, 
										{x:UI.DIM_ACTIONS.x, y:UI.DIM_ACTIONS.x});
		this.actionMakeTanquePesado.setImg(this.imgIcons, {x:64, y:128}, {x:64, y:64}, this.imgGreenIcons);
		this.actionMakeTanquePesado.setInfo(ctx2D, UI.infoMakeTanquePesado);
		
		this.showCancelButton = false;
		this.actionCancel = new Button(gl, {x: gl.canvas.width -UI.DIM_ACTIONS.x -10, y: gl.canvas.height -UI.DIM_ACTIONS.x -10}, {x:UI.DIM_ACTIONS.x, y:UI.DIM_ACTIONS.x});
		this.actionCancel.setInfo(ctx2D, UI.infoCancel);
		
		this.showCancelBuildingQueue = [];
		this.cancelBuildingQueue = [];
		for(var i=0; i<Construccion.MAX_QUEUE; i++)
		{
			this.showCancelBuildingQueue.push(false);
			this.cancelBuildingQueue.push(new Button(gl, {x: gl.canvas.width -UI.DIM_ACTIONS.x -3*(i+1)*UI.DIM_ACTIONS.x/4 -10 -3*(i+1)*5/4, y: gl.canvas.height -7*UI.DIM_ACTIONS.x/8 -10}, {x:3*UI.DIM_ACTIONS.x/4, y:3*UI.DIM_ACTIONS.x/4}));
			this.cancelBuildingQueue[i].setInfo(ctx2D, UI.infoCancel);
		}
		
		// Toggle buttons for selection or move (Just for mobile)
		if(Config.isMobile())
		{
			this.mobileSelectMode = new Button(gl, {x: gl.canvas.width - UI.DIM_ACTIONS.x, y: 2*UI.DIM_ACTIONS.x}, {x:UI.DIM_ACTIONS.x, y:UI.DIM_ACTIONS.x});
			this.mobileSelectMode.setImg(this.imgIcons2, {x:128, y:0}, {x:64, y:64}, this.imgIconsClicked2);
			this.mobileSelectMode.setPressed(true);
			this.mobileMoveMode = new Button(gl, {x: gl.canvas.width - UI.DIM_ACTIONS.x, y: UI.DIM_ACTIONS.x}, {x:UI.DIM_ACTIONS.x, y:UI.DIM_ACTIONS.x});
			this.mobileMoveMode.setImg(this.imgIcons2, {x:192, y:0}, {x:64, y:64}, this.imgIconsClicked2);
		}
		
		this.clear();
		
		
		// Game end variables.
		this.gameEnd = false;
		this.wantLeaveGame = false;
		this.surrender = false;
		this.win = false;
		this.lose = false;
		this.gameFinish = false;
		this.rank = -1;
		this.buttonOKEnd = new Button(gl, {x: gl.canvas.width*0.4, y: gl.canvas.height*0.15}, {x:gl.canvas.width*0.20, y:gl.canvas.height*0.10});
		this.buttonOKEnd.setText(ctx2D, "OK", gl.canvas.height*0.06, "#FFFFFFFF");
	}

	setEnd(surrender, win, lose, gameFinish, rank)
	{
		this.surrender = surrender;
		this.win = win;
		this.lose = lose;
		this.gameFinish = gameFinish;
		this.rank = rank;
		this.gameEnd = true;
	}
	
	userWantToLeave()
	{
		return this.wantLeaveGame;
	}
	
	isInUI(x, y)
	{
		if(x < UI.EDGE1.x)
		{
			if(y < UI.DIM_BAR.y)
				return true;
		}
		else if(x < UI.EDGE2.x)
		{
			if(y < UI.EDGE2.y)
				return true;
		}
		else if(x < UI.DIM_BAR.x)
		{
			if(y < UI.EDGE3.y)
				return true;
		}
		
		return false;
	}
	
	setFullscreen(enable)
	{
		this.miniMap.setFullscreen(enable);
	}
	isMiniMapFullscreen()
	{
		return this.miniMap.isFullscreen();
	}
	
	doZoomInMiniMap()
	{
		this.miniMap.doZoomIn();
	}
	
	doZoomOutMiniMap()
	{
		this.miniMap.doZoomOut();
	}
	
	isMobileSelectMode()
	{
		return this.mobileSelectMode.pressed;
	}
	
	isMobileMoveMode()
	{
		return this.mobileMoveMode.pressed;
	}
	
	clickDown(gl, x, y, funcCancelButton, funcCancelQueue)
	{
		if(this.gameEnd)
		{
			if(this.buttonOKEnd.click(x,y))
				this.wantLeaveGame = true;
			return true;
		}
		
		if(this.isMiniMapFullscreen())
		{
			this.miniMap.click(x, y, true);
			return true;
		}

		// Cancel button
		if( this.showCancelButton && this.actionCancel.click(x,y) )
		{
			// I must to cancel the unit's actions.
			if(funcCancelButton != null)
				funcCancelButton();
			
			this.showCancelButton = false;
			this.clear();
			return true;
		}
		
		// Cancel Queue button.
		for(var i=0; i<Construccion.MAX_QUEUE; i++)
		{
			if( this.showCancelBuildingQueue[i] && this.cancelBuildingQueue[i].click(x,y) )
			{
				// I must to cancel an element from queue.
				if(funcCancelQueue != null)
					funcCancelQueue(i);
				
				this.clear();
				return true;
			}
			
		}
		
		// Mobile action
		if(Config.isMobile())
		{
			// User wants switching to select mode
			if(!this.mobileSelectMode.pressed && this.mobileSelectMode.click(x,y))
			{
				this.mobileSelectMode.setPressed(true);
				this.mobileMoveMode.setPressed(false);
				return true;
			}
			// User wants to switch to move map mode
			else if(!this.mobileMoveMode.pressed && this.mobileMoveMode.click(x,y))
			{
				this.mobileMoveMode.setPressed(true);
				this.mobileSelectMode.setPressed(false);
				return true;
			}
		}
		
		if(!this.isInUI(x, y))
			return false;
		
		
		if(this.control.selection.length > 0)
		{
			if(this.showUnitActionsButton)
			{
				if(this.actionMoveTo.click(x,y)) 
				{
					var pressed = this.actionMoveTo.pressed;
					this.clear();
					this.actionMoveTo.setPressed(!pressed);
					return true;
				}
				else if(this.actionAttack.click(x,y)) 
				{
					var pressed = this.actionAttack.pressed;
					this.clear();
					this.actionAttack.setPressed(!pressed);
					if(this.actionAttack.pressed)
						this.attackOneShot = false;
					return true;
				}
			}
			else if(this.showRecollectorActionsButton)
			{
				if(this.actionMoveTo.click(x,y)) 
				{
					var pressed = this.actionMoveTo.pressed;
					this.clear();
					this.actionMoveTo.setPressed(!pressed);
					return true;
				}
				else if(this.actionMakeBase.click(x,y)) 
				{
					var pressed = this.actionMakeBase.pressed;
					this.clear();
					this.actionMakeBase.setPressed(!pressed);
					return true;
				}
				else if(this.actionMakeBarraca.click(x,y)) 
				{
					var pressed = this.actionMakeBarraca.pressed;
					this.clear();
					this.actionMakeBarraca.setPressed(!pressed);
					return true;
				}
				else if(this.actionMakeTorreta.click(x,y)) 
				{
					var pressed = this.actionMakeTorreta.pressed;
					this.clear();
					this.actionMakeTorreta.setPressed(!pressed);
					return true;
				}
			}
			else if(this.showSoldierActionsButton)
			{
				if(this.actionMoveTo.click(x,y)) 
				{
					var pressed = this.actionMoveTo.pressed;
					this.clear();
					this.actionMoveTo.setPressed(!pressed);
					return true;
				}
				else if(this.actionAttack.click(x,y)) 
				{
					var pressed = this.actionAttack.pressed;
					this.clear();
					this.actionAttack.setPressed(!pressed);
					if(this.actionAttack.pressed)
						this.attackOneShot = false;
					return true;
				}
			}
			else if(this.showBaseActionsButton)
			{
				if(this.actionMakeRecolector.click(x,y)) 
				{
					var pressed = this.actionMakeRecolector.pressed;
					this.clear();
					this.actionMakeRecolector.setPressed(!pressed);
					return true;
				}
			}
			else if(this.showBarracaActionsButton)
			{
				if(this.actionMakeSoldadoRaso.click(x,y)) 
				{
					var pressed = this.actionMakeSoldadoRaso.pressed;
					this.clear();
					this.actionMakeSoldadoRaso.setPressed(!pressed);
					return true;
				}
				else if(this.actionMakeSoldadoEntrenado.click(x,y)) 
				{
					var pressed = this.actionMakeSoldadoEntrenado.pressed;
					this.clear();
					this.actionMakeSoldadoEntrenado.setPressed(!pressed);
					return true;
				}
				else if(this.actionMakeTanque.click(x,y)) 
				{
					var pressed = this.actionMakeTanque.pressed;
					this.clear();
					this.actionMakeTanque.setPressed(!pressed);
					return true;
				}
				else if(this.actionMakeTanquePesado.click(x,y)) 
				{
					var pressed = this.actionMakeTanquePesado.pressed;
					this.clear();
					this.actionMakeTanquePesado.setPressed(!pressed);
					return true;
				}
			}
		}
		
		// More than one selected and want to clicked one.
		if(this.control.selection.length > 0)
		{
			// Coincident to prevent posible errors
			if(this.control.selection.length == this.cantCalculatedSelection)
			{
				// Find clicked object.
				var iterPos = {x: UI.POS_INFO.x, y: UI.POS_INFO.y + UI.DIM_INFO.y - this.heightRowSelection};
				var dimIterPos = {x:this.heightRowSelection, y:this.heightRowSelection};
				var posSelection = 0;
				for(var i=0; i<this.rowsSelection; i++)
				{
					if(posSelection >= this.control.selection.length)
							break;
					for(var j=0; j<this.amountRowSelection; j++)
					{
						if(posSelection >= this.control.selection.length)
							break;
						if(iterPos.x <= x && x <= (iterPos.x+dimIterPos.x) && iterPos.y <= y && y <= (iterPos.y+dimIterPos.y) )
						{
							this.control.setSelection([this.control.selection[posSelection]]);
							return true;
						}
						iterPos.x += this.heightRowSelection;
						posSelection++;
					}
					iterPos.x = UI.POS_INFO.x;
					iterPos.y -= this.heightRowSelection;
				}
			}
		}
			
		this.miniMap.click(x, y, true);
		
		return true;
	}
	
	clickUp(gl, x, y)
	{
		if(this.gameEnd)
			return true;
		
		this.miniMap.click(x, y, false);
		
		if(!this.isMiniMapFullscreen() && !this.isInUI(x, y))
			return false;
		
		return true;
	}
	
	moveMouse(gl, x, y, pressed)
	{
		if(this.gameEnd)
		{
			this.buttonOKEnd.mouseMove(x,y);
			return;
		}
		
		if(pressed)
			this.miniMap.moveMouse(x, y);
		
		this.actionMoveTo.mouseMove(x, y);
		this.actionAttack.mouseMove(x, y);
		this.actionMakeBase.mouseMove(x, y);
		this.actionMakeBarraca.mouseMove(x, y);
		this.actionMakeTorreta.mouseMove(x, y);
		this.actionMakeRecolector.mouseMove(x, y);
		this.actionMakeSoldadoRaso.mouseMove(x, y);
		this.actionMakeSoldadoEntrenado.mouseMove(x, y);
		this.actionMakeTanque.mouseMove(x, y);
		this.actionMakeTanquePesado.mouseMove(x, y);
		this.actionCancel.mouseMove(x, y);
	}
	
	setMiniMap(img)
	{
		this.miniMap.setImg(img);
	}
	
	// Let a position over the minimap return the world's position.
	getPosWorldMiniMap(gl, shaders, x, y)
	{
		return this.miniMap.getPosWorld(gl, shaders, x, y);
	}
	
	update(ms)
	{
		if(this.gameEnd)
		{
			this.buttonOKEnd.update(ms);
			return;
		}
		
		this.miniMap.update(ms);

		this.actionMoveTo.update(ms);
		this.actionAttack.update(ms);
		this.actionMakeBase.update(ms);
		this.actionMakeBarraca.update(ms);
		this.actionMakeTorreta.update(ms);
		this.actionMakeRecolector.update(ms);
		this.actionMakeSoldadoRaso.update(ms);
		this.actionMakeSoldadoEntrenado.update(ms);
		this.actionMakeTanque.update(ms);
		this.actionMakeTanquePesado.update(ms);
		
		/// Adjust cancel button.
		this.showCancelButton = false;
		if(!this.miniMap.isFullscreen())
		{
			var currentPlayer = document.game.players.get(null);
			
			// Check if all selection have the same action and they're mine.
			// Then draw cancel button action.
			if(currentPlayer != null && this.control.selection.length > 0)
			{
				var kindAction = null;
				for(var i=0; i<this.control.selection.length; i++)
				{
					// It's my object.
					var obj = this.control.selection[i];
					if( obj.player == currentPlayer )
					{
						// It has an action.
						var objAction = null;
						if( (obj.isUnit() || obj.isBuilding()) && obj.action != null)
							objAction = obj.action;
						if(objAction != null)
						{
							var kindActionTmp = null;
							if(objAction.type == Action.MOVE)
								kindActionTmp = "move";
							else if(objAction.type == Action.ATTACK)
								kindActionTmp = "attack";
							else if(objAction.type == Action.RECOLLECT)
								kindActionTmp = "recollect";
							else if(objAction.type == Action.BUILD || objAction.type == Action.NEWUNIT)
								kindActionTmp = "make_"+objAction.make;
							else
							{
								kindAction = null;
								break;
							}

							if(kindAction == null)
								kindAction = kindActionTmp;
							else if(kindAction != kindActionTmp)
							{
								kindAction = null;
								break;
							}
						}
						// It hasn't the same action.
						else
						{
							kindAction = null;
							break;
						}
					}
					// There isn't my unit.
					else
					{
						kindAction = null;
						break;
					}
				}

				if(kindAction != null)
				{
					if(kindAction == "move")
						this.actionCancel.setImg(this.imgIcons, {x:0, y:0}, {x:64, y:64});
					else if(kindAction == "attack")
						this.actionCancel.setImg(this.imgIcons, {x:64, y:0}, {x:64, y:64});
					else if(kindAction == "recollect")
						this.actionCancel.setImg(this.imgIcons, {x:64, y:64}, {x:64, y:64});
					else if(kindAction == "make_"+Config.OT_BASE)
						this.actionCancel.setImg(this.imgIcons, {x:128, y:0}, {x:64, y:64});
					else if(kindAction == "make_"+Config.OT_BARRACA)
						this.actionCancel.setImg(this.imgIcons, {x:192, y:0}, {x:64, y:64});
					else if(kindAction == "make_"+Config.OT_TORRETA)
						this.actionCancel.setImg(this.imgIcons, {x:0, y:64}, {x:64, y:64});
					else if(kindAction == "make_"+Config.OT_RECOLECTOR)
						this.actionCancel.setImg(this.imgIcons, {x:64, y:64}, {x:64, y:64});
					else if(kindAction == "make_"+Config.OT_SOLDADO_RASO)
						this.actionCancel.setImg(this.imgIcons, {x:128, y:64}, {x:64, y:64});
					else if(kindAction == "make_"+Config.OT_SOLDADO_ENTRENADO)
						this.actionCancel.setImg(this.imgIcons, {x:192, y:64}, {x:64, y:64});
					else if(kindAction == "make_"+Config.OT_TANQUE)
						this.actionCancel.setImg(this.imgIcons, {x:0, y:128}, {x:64, y:64});
					else if(kindAction == "make_"+Config.OT_TANQUE_PESADO)
						this.actionCancel.setImg(this.imgIcons, {x:64, y:128}, {x:64, y:64});

					this.showCancelButton = true;
				}
			}
		}
		this.actionCancel.update(ms);
		/// End adjust cancel button.
		
		
		// Adjust cancel queue button
		for(var i=0; i<Construccion.MAX_QUEUE; i++)
			this.showCancelBuildingQueue[i] = false;
		if(!this.miniMap.isFullscreen())
		{
			if(this.control.selection.length == 1)
			{
				var obj = this.control.selection[0];
				
				if( obj.player == document.game.players.get(null) && obj.isBuilding())
				{
					for(var i=0; i<obj.intentsQueue.length; i++)
					{
						switch(obj.intentsQueue[i].action.make)
						{
							case Config.OT_RECOLECTOR:
								this.cancelBuildingQueue[i].setImg(this.imgIcons, {x:64, y:64}, {x:64, y:64});
								break;
							case Config.OT_SOLDADO_RASO:
								this.cancelBuildingQueue[i].setImg(this.imgIcons, {x:128, y:64}, {x:64, y:64});
								break;
							case Config.OT_SOLDADO_ENTRENADO:
								this.cancelBuildingQueue[i].setImg(this.imgIcons, {x:192, y:64}, {x:64, y:64});
								break;
							case Config.OT_TANQUE:
								this.cancelBuildingQueue[i].setImg(this.imgIcons, {x:0, y:128}, {x:64, y:64});
								break;
							case Config.OT_TANQUE_PESADO:
								this.cancelBuildingQueue[i].setImg(this.imgIcons, {x:64, y:128}, {x:64, y:64});
								break;
						}

						this.showCancelBuildingQueue[i] = true;
					}
				}
			}
		}
		for(var i=0; i<Construccion.MAX_QUEUE; i++)
			this.cancelBuildingQueue[i].update(ms);
		
		
		// Show button actions depending object selection.
		var onlyRecollector = true;
		var thereIsRecollector = false;
		var onlySoldier = true;
		var thereIsSoldier = false;
		var onlyBase = true;
		var thereIsBase = false;
		var onlyBarraca = true;
		var thereIsBarraca = false;
		for(var i=0; i<this.control.selection.length; i++)
		{
			var obj = this.control.selection[i];
			if(obj.constructor.name == 'Recolector')
				thereIsRecollector = true;
			else if(obj.isUnit())
				onlyRecollector = false;
			if(obj.isSoldier())
				thereIsSoldier = true;
			else if(obj.isUnit())
				onlySoldier = false;
			if(obj.constructor.name == 'Base')
				thereIsBase = true;
			else
				onlyBase = false;
			if(obj.constructor.name == 'Barraca')
				thereIsBarraca = true;
			else
				onlyBarraca = false;
		}
		this.showRecollectorActionsButton = thereIsRecollector && onlyRecollector;
		this.showSoldierActionsButton = thereIsSoldier && onlySoldier;
		this.showBaseActionsButton = thereIsBase && onlyBase;
		this.showBarracaActionsButton = thereIsBarraca && onlyBarraca;
		this.showUnitActionsButton = thereIsSoldier && thereIsRecollector;
		
		
		// Adjust selection variables.
		if(this.control.selection.length != this.cantCalculatedSelection)
		{
			this.cantCalculatedSelection = this.control.selection.length;
			var maxObjectsSelection;
			this.rowsSelection = 0;
				do {
					this.rowsSelection++;
					this.heightRowSelection = UI.DIM_INFO.y / this.rowsSelection;
					this.amountRowSelection = Math.floor(UI.DIM_INFO.x / this.heightRowSelection);
					maxObjectsSelection = this.rowsSelection * this.amountRowSelection;
				}while(maxObjectsSelection < this.control.selection.length);
		}
	}
	
	draw(gl, ctx2D, control, area)
	{
		if(this.miniMap.isFullscreen())
		{
			this.miniMap.draw(ctx2D, area);
		}
		else
		{
			var alto = gl.canvas.height;
			
			Pantalla2D.drawRect(ctx2D, this.posBar, UI.DIM_BAR, this.imgBar, null);
			
			// Info of selection.
			if(control.selection.length > 0)
			{
				// If only one.
				if(control.selection.length == 1)
				{
					// Draw the object.
					this.posTmp.x = UI.POS_INFO_IMG_OBJECT.x;
					this.posTmp.y = UI.POS_INFO_IMG_OBJECT.y;

					this.getPosImgObject(control.selection[0].constructor.name, this.posImgObject);
					Pantalla2D.drawRect(ctx2D, this.posTmp, UI.DIM_INFO_IMG_OBJECT, this.getTextureObjectImage(control.selection[0]), null, this.posImgObject, this.dimImgObject);

					// Show info.
					Pantalla2D.drawText(ctx2D, control.selection[0].getInfo(), 
										UI.POS_INFO.x +UI.DIM_INFO_IMG_OBJECT.x +UI.DIM_INFO.x*0.05, 
										UI.POS_INFO.y +UI.DIM_INFO.y -(Config.FONT_HEIGHT+0.02)*alto,
										color=this.getObjectInfoColor(control.selection[0]));
				}
				// More than one.
				else
				{
					// There is coincident for prevent posible errors.
					if(this.control.selection.length == this.cantCalculatedSelection)
					{
						// Draw selection.
						var iterDraw = {x: UI.POS_INFO.x, y: UI.POS_INFO.y + UI.DIM_INFO.y - this.heightRowSelection};
						var dimDraw = {x:this.heightRowSelection, y:this.heightRowSelection};
						var posSelection = 0;
						for(var i=0; i<this.rowsSelection; i++)
						{
							if(posSelection >= control.selection.length)
									break;
							for(var j=0; j<this.amountRowSelection; j++)
							{
								if(posSelection >= control.selection.length)
									break;
								this.getPosImgObject(control.selection[posSelection].constructor.name, this.posImgObject);
								Pantalla2D.drawRect(ctx2D, iterDraw, dimDraw, this.getTextureObjectImage(control.selection[posSelection]), null, this.posImgObject, this.dimImgObject);
								iterDraw.x += this.heightRowSelection;
								posSelection++;
							}
							iterDraw.x = UI.POS_INFO.x;
							iterDraw.y -= this.heightRowSelection;
						}
					}
				}
			}
			
			this.miniMap.draw(ctx2D, area);
			
			// Actions.
			if(this.control.selection.length > 0)
			{
				if(this.showUnitActionsButton)
				{
					this.actionMoveTo.draw(ctx2D, true);
					this.actionAttack.draw(ctx2D, true);
					this.actionMoveTo.draw(ctx2D, false);
					this.actionAttack.draw(ctx2D, false);
				}
				else if(this.showRecollectorActionsButton)
				{
					this.actionMoveTo.draw(ctx2D, true);
					this.actionMakeBase.draw(ctx2D, true);
					this.actionMakeBarraca.draw(ctx2D, true);
					this.actionMakeTorreta.draw(ctx2D, true);
					this.actionMoveTo.draw(ctx2D, false);
					this.actionMakeBase.draw(ctx2D, false);
					this.actionMakeBarraca.draw(ctx2D, false);
					this.actionMakeTorreta.draw(ctx2D, false);
				}
				else if(this.showSoldierActionsButton)
				{
					this.actionMoveTo.draw(ctx2D, true);
					this.actionAttack.draw(ctx2D, true);
					this.actionMoveTo.draw(ctx2D, false);
					this.actionAttack.draw(ctx2D, false);
				}
				else if(this.showBaseActionsButton)
				{
					this.actionMakeRecolector.draw(ctx2D, true);
					this.actionMakeRecolector.draw(ctx2D, false);
				}
				else if(this.showBarracaActionsButton)
				{
					this.actionMakeSoldadoRaso.draw(ctx2D, true);
					this.actionMakeSoldadoEntrenado.draw(ctx2D, true);
					this.actionMakeTanque.draw(ctx2D, true);
					this.actionMakeTanquePesado.draw(ctx2D, true);
					this.actionMakeSoldadoRaso.draw(ctx2D, false);
					this.actionMakeSoldadoEntrenado.draw(ctx2D, false);
					this.actionMakeTanque.draw(ctx2D, false);
					this.actionMakeTanquePesado.draw(ctx2D, false);
				}
			}
			
			// Cancel buttons ( back and front )
			if(this.showCancelButton)
				this.actionCancel.draw(ctx2D, true);
			for(var i=0; i<Construccion.MAX_QUEUE; i++)
				if(this.showCancelBuildingQueue[i])
					this.cancelBuildingQueue[i].draw(ctx2D, true);
			if(this.showCancelButton)
				this.actionCancel.draw(ctx2D, false);
			for(var i=0; i<Construccion.MAX_QUEUE; i++)
				if(this.showCancelBuildingQueue[i])
					this.cancelBuildingQueue[i].draw(ctx2D, false);
				
			// Actions for mobile.
			if(Config.isMobile())
			{
				this.mobileSelectMode.draw(ctx2D, true);
				this.mobileMoveMode.draw(ctx2D, true);
				this.mobileSelectMode.draw(ctx2D, false);
				this.mobileMoveMode.draw(ctx2D, false);
			}
		}
		
		if(this.gameEnd)
		{
			// Draw black background.
			this.posTmp.x = 0;
			this.posTmp.y = 0;
			this.dimTmp.x = ctx2D.canvas.width;
			this.dimTmp.y = ctx2D.canvas.height;
			Pantalla2D.drawRect(ctx2D, this.posTmp, this.dimTmp, null, "00000055");
			
			
			var fontCurrent = Pantalla2D.getFontSize();
			Pantalla2D.setFontSize(ctx2D, ctx2D.canvas.height * 0.1 );
			
			var textEnd = "";
			var textRank = ["Tu ranking: "+this.rank];
			var color = "white";
			if(this.surrender)
			{
				textEnd = "Te rendiste";
				color = "red";
			}
			else if(this.win)
			{
				if(this.gameFinish)
				{
					textEnd = "Ganaste hasta el final";
					color = "green";
				}
				else
				{
					textEnd = "Tu equipo gano";
					color = "green";
				}
			}
			else if(this.lose)
			{
				textEnd = "Tu equipo perdio";
				color = "red";
			}
			textEnd = [textEnd];
			
			Pantalla2D.dimText(ctx2D, textEnd, this.posTmp);
			Pantalla2D.drawText(ctx2D, textEnd, ctx2D.canvas.width/2 -this.posTmp.x/2, ctx2D.canvas.height/2, color, true);
			Pantalla2D.dimText(ctx2D, textRank, this.posTmp);
			Pantalla2D.drawText(ctx2D, textRank, ctx2D.canvas.width/2 -this.posTmp.x/2, ctx2D.canvas.height/2 - this.posTmp.y, color, true);
			
			Pantalla2D.setFontSize(ctx2D, fontCurrent);
			
			// Draw OK button.
			this.buttonOKEnd.draw(ctx2D, true);
			this.buttonOKEnd.draw(ctx2D, false);
		}
	}

	getPosImgObject(name, pos)
	{
		if(name == 'Recolector')
		{
			pos.x = 0;
			pos.y = 128;
		}
		else if(name == 'Base')
		{
			pos.x = 128;
			pos.y = 0;
		}
		else if(name == 'Barraca')
		{
			pos.x = 256;
			pos.y = 0;
		}
		else if(name == 'Torreta')
		{
			pos.x = 384;
			pos.y = 0;
		}
		else if(name == 'Mineral')
		{
			pos.x = 0;
			pos.y = 0;
		}
		else if(name == 'SoldadoRaso')
		{
			pos.x = 128;
			pos.y = 128;
		}
		else if(name == 'SoldadoEntrenado')
		{
			pos.x = 256;
			pos.y = 128;
		}
		else if(name == 'Tanque')
		{
			pos.x = 384;
			pos.y = 128;
		}
		else if(name == 'TanquePesado')
		{
			pos.x = 0;
			pos.y = 256;
		}
	}
	
	getTextureObjectImage(obj)
	{
		var life = 1;
		
		if(obj.isMineral())
			return this.imgYellowObjects;
		else if(obj.isUnit())
			life = obj.vida / obj.fullLife;
		else if(obj.isBuilding())
		{
			if(obj.creada < obj.fullLife)
				life = obj.creada / obj.fullLife;
			else
				life = obj.vida / obj.fullLife;
		}
		
		if(life >= 0.66)
			return this.imgGreenObjects;
		else if(life >= 0.33)
			return this.imgOrangeObjects;
		else
			return this.imgRedObjects;
	}
	
	getObjectInfoColor(obj)
	{
		if(obj.isMineral())
			return "#D9D900";
		if(obj.isEnemy())
			return "#FF0000";
		if(obj.isAliade())
			return "#004DFF";
		return "green";
	}
	

	clear()
	{
		this.actionMoveTo.setPressed(false);
		this.actionAttack.setPressed(false);
		this.actionMakeBase.setPressed(false);
		this.actionMakeBarraca.setPressed(false);
		this.actionMakeTorreta.setPressed(false);
		this.actionMakeRecolector.setPressed(false);
		this.actionMakeSoldadoRaso.setPressed(false);
		this.actionMakeSoldadoEntrenado.setPressed(false);
		this.actionMakeTanque.setPressed(false);
		this.actionMakeTanquePesado.setPressed(false);
		this.actionCancel.setPressed(false);
		for(var i=0; i<Construccion.MAX_QUEUE; i++)
			this.cancelBuildingQueue[i].setPressed(false);
	}
	
	isMoveTo() {
		return this.actionMoveTo.pressed;
	}
	isAttack() {
		return this.actionAttack.pressed;
	}
	isAttackOneShot(){
		return this.attackOneShot;
	}
	isMakeBase() {
		return this.actionMakeBase.pressed;
	}
	isMakeBarraca() {
		return this.actionMakeBarraca.pressed;
	}
	isMakeTorreta() {
		return this.actionMakeTorreta.pressed;
	}
	isMakeRecolector() {
		return this.actionMakeRecolector.pressed;
	}
	isMakeSoldadoRaso() {
		return this.actionMakeSoldadoRaso.pressed;
	}
	isMakeSoldadoEntrenado() {
		return this.actionMakeSoldadoEntrenado.pressed;
	}
	isMakeTanque() {
		return this.actionMakeTanque.pressed;
	}
	isMakeTanquePesado() {
		return this.actionMakeTanquePesado.pressed;
	}
	
	hasAction()
	{
		return this.actionMoveTo.pressed || 
				this.actionAttack.pressed || 
				this.actionMakeBase.pressed || 
				this.actionMakeBarraca.pressed || 
				this.actionMakeTorreta.pressed || 
				this.actionMakeRecolector.pressed || 
				this.actionMakeSoldadoRaso.pressed || 
				this.actionMakeSoldadoEntrenado.pressed || 
				this.actionMakeTanque.pressed || 
				this.actionMakeTanquePesado.pressed;
	}
	
	isBuild()
	{
		return this.actionMakeBase.pressed || this.actionMakeBarraca.pressed || this.actionMakeTorreta.pressed;
	}
	
	isMakeUnit()
	{
		return this.actionMakeRecolector.pressed || this.actionMakeSoldadoRaso.pressed || this.actionMakeSoldadoEntrenado.pressed || this.actionMakeTanque.pressed || this.actionMakeTanquePesado.pressed;
	}
	
	setMoveTo()
	{
		this.clear();
		this.actionMoveTo.setPressed(true);
console.log("move");
	}
	
	setAttack()
	{
		this.clear();
		this.actionAttack.setPressed(true);
		this.attackOneShot = true;
console.log("attack");
	}
	
	setMakeBase()
	{
		this.clear();
		this.actionMakeBase.setPressed(true);
console.log("base");
	}
	
	setMakeBarraca()
	{
		this.clear();
		this.actionMakeBarraca.setPressed(true);
console.log("barraca");
	}
	
	setMakeTorreta()
	{
		this.clear();
		this.actionMakeTorreta.setPressed(true);
console.log("torreta");
	}
	
	setMakeRecolector()
	{
		this.clear();
		this.actionMakeRecolector.setPressed(true);
console.log("recolector");
	}
	
	setMakeSoldadoRaso()
	{
		this.clear();
		this.actionMakeSoldadoRaso.setPressed(true);
console.log("sr");
	}
	
	setMakeSoldadoEntrenado()
	{
		this.clear();
		this.actionMakeSoldadoEntrenado.setPressed(true);
console.log("se");
	}
	
	setMakeTanque()
	{
		this.clear();
		this.actionMakeTanque.setPressed(true);
console.log("t");
	}
	
	setMakeTanquePesado()
	{
		this.clear();
console.log("tp");
		this.actionMakeTanquePesado.setPressed(true);
	}
}

UI.POS_INFO = {x:276, y:10};
UI.DIM_INFO = {x:400, y:150};
UI.POS_ACTIONS = {x:687, y:10};
UI.DIM_ACTIONS = {x: 52, y:200};
UI.DIM_BAR = {x:750, y:290};

UI.EDGE1 = {x:284, y:183};
UI.EDGE2 = {x:663, y:183};
UI.EDGE3 = {x:663, y:236};

UI.POS_INFO_IMG_OBJECT = {x:UI.POS_INFO.x+10, y:UI.POS_INFO.y+10};
UI.DIM_INFO_IMG_OBJECT = {x:UI.DIM_INFO.y-20, y:UI.DIM_INFO.y-20};

UI.keyAttack = "A";
UI.keyMakeBase = "B";
UI.keyMakeBarraca = "F";
UI.keyMakeTorreta = "R";
UI.makeRecolector = "G";
UI.makeSoldadoRaso = "S";
UI.makeSoldadoEntrenado = "E";
UI.makeTanque = "T";
UI.makeTanquePesado = "H";
UI.miniMapFullscreen = "M";


UI.infoMoveTo = ["Move to"];
UI.infoAttack = ["Attack (A)"];
UI.infoMakeBase = ["Make Base (B)", "Minerals: "+Config.MINERALS_COST_BASE];
UI.infoMakeBarraca = ["Make Barrack (F)", "Minerals: "+Config.MINERALS_COST_BARRACA];
UI.infoMakeTorreta = ["Make Torret (R)", "Minerals: "+Config.MINERALS_COST_TORRETA];
UI.infoMakeRecolector = ["Make Gathered (G)", "Minerals: "+Config.MINERALS_COST_RECOLECTOR];
UI.infoMakeSoldadoRaso = ["Make Soldier (S)", "Minerals: "+Config.MINERALS_COST_SOLDADO_RASO];
UI.infoMakeSoldadoEntrenado = ["Make Trained Solider (E)", "Minerals: "+Config.MINERALS_COST_SOLDADO_ENTRENADO];
UI.infoMakeTanque = ["Make Tank (T)", "Minerals: "+Config.MINERALS_COST_SOLDADO_TANQUE];
UI.infoMakeTanquePesado = ["Make Huge Tank (H)", "Minerals: "+Config.MINERALS_COST_SOLDADO_TANQUE_PESADO];
UI.infoCancel = ["Cancel"];











