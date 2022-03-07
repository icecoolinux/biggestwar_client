
class ControlPointer
{
	constructor(gl, camera, ui, control)
	{
		ControlPointer.instance = this;
		
		this.gl = gl;
		this.camera = camera;
		this.ui = ui;
		this.control = control;
		
		this.clickLeft = null;
		this.clickRight = null;
		this.posPointer = {x: -1, y:-1};
		this.pastPosPointer = {x: -1, y:-1};
		
		// Double click
		// Under units select all the same king 
		this.timeLeftClick_DoubleClick = 0;
		
		this.currentTouchId = -1;
		
		// temporal variables for optimization
		this.p1SelectionTmp = {x:0, y:0};
		this.posPointerSelectionTmp = {x:0, y:0};
		this.p2SelectionTmp = {x:0, y:0};
	}
	
	
	// Se presiono puntero.
	pointerDown(left, middle, right, x, y, ctrlKey)
	{
		y = this.gl.canvas.height - y;

		this.posPointer.x = x;
		this.posPointer.y = y;
		
		if(left)
		{
			// If there is move/attack action and click to the minimap then i must to apply action
			// instead to move the camera.
			var applyAction = false;
			if(this.ui.isMoveTo() || this.ui.isAttack())
			{
				if(this.ui.isInUI(x, y))
				{
					var pos = this.ui.getPosWorldMiniMap(this.gl, document.game.shaders, x, y);
					if(pos != null)
					{
						applyAction = true;
						
						// Get intent actions.
						var intentActions = IntentAction.get(document.game, this.control.selection, pos, this.ui, null);
							
						// Send its to server.
						if(intentActions != null)
							document.game.net.sendIntentActions(intentActions);
						
						// If it's a one shot attack then clear the action.
						if(this.ui.isAttack() && this.ui.isAttackOneShot())
							this.ui.clear();
					}
				}
			}
			
			// If I didnt apply an action then check other options
			if(!applyAction)
			{
				// Did the user do click on the UI?
				var cancelAction = false;
				var cancelQueue = -1;
				// First check click on UI.
				if( this.ui.clickDown(this.gl, x, y, function(){cancelAction = true;}, function(index){cancelQueue = index;}) ) 
				{
					// The user want to cancel the action.
					if(cancelAction)
					{
						var idsCancelAction = [];
						for(var i=0; i<this.control.selection.length; i++)
							idsCancelAction.push(this.control.selection[i].id);
						document.game.net.cancelAction(idsCancelAction);
					}
					// Cancel queue
					if(cancelQueue >= 0)
						this.control.selection[0].deleteIntent(cancelQueue);
				}
				else
				{
					this.clickLeft = {x:x, y:y};
					
					// If it's mobile and the user wants to move map
					if(Config.isMobile() && this.ui.isMobileMoveMode())
					{
						//
					}
					// Else if it's not mobile or the user wants to select an area
					else
					{
						// It hasn't action then clear selection.
						if(!this.ui.hasAction())
						{
							// And it's not ctrl pressed
							if(!ctrlKey)
								this.control.selection = [];
						}
					}
				}
			}
		}
		else if(right)
		{
			// For actions that release right button.
			this.clickRight = {x:x, y:y};
			
			// There're objects selection.
			if(this.control.selection.length > 0)
			{
				var obj = null;
				var pos = null;
				
				// Click over the UI.
				if(this.ui.isMiniMapFullscreen() || this.ui.isInUI(this.clickRight.x, this.clickRight.y))
				{
					var pos = this.ui.getPosWorldMiniMap(this.gl, document.game.shaders, this.clickRight.x, this.clickRight.y);
					
					if(pos != null)
					{
						// Set move.
						this.ui.setMoveTo();
						
						// Get intent actions.
						var intentActions = IntentAction.get(document.game, this.control.selection, pos, this.ui, null);
							
						// Send its to server.
						if(intentActions != null)
							document.game.net.sendIntentActions(intentActions);
						
						// I already did the action, clear future actions.
						this.ui.clear();
						this.clickRight = null;
					}
				}
			}
		}
		
		this.control.executeOneShotAction();
	}

	// Se libero puntero.
	pointerUp(left, middle, right, x, y, ctrlKey)
	{
		y = this.gl.canvas.height - y;

		this.posPointer.x = x;
		this.posPointer.y = y;

		if(left)
		{
			// First check click in UI.
			if(this.ui.clickUp(this.gl, x, y)) {}
			// Then it's not click on UI
			else if(this.clickLeft != null) 
			{
				// We're in move mode.
				if(Config.isMobile() && this.ui.isMobileMoveMode())
				{
					//
				}
				// It's selection mode
				else
				{
					// If the user didn't move or move a little then it's a left click.
					var diff = Math.sqrt(Math.pow(this.clickLeft.x-x, 2) + Math.pow(this.clickLeft.y-y, 2));
					if(diff <= ControlPointer.MAX_PIXELS_DIFF_TO_BE_A_CLICK)
					{
						// There is action and object selection.
						if(this.ui.hasAction() && this.control.selection.length > 0)
						{
							// Get unit or building there.
							var obj = Colision.getObject(document.game, this.clickLeft);
							
							// Get terrain pos.
							var pos = Colision.pantallaToTerrain(this.gl, document.game.shaders, this.clickLeft.x, this.clickLeft.y);
							
							// Get intent actions.
							var intentActions = IntentAction.get(document.game, this.control.selection, pos, this.ui, obj);

							// Send its to server.
							if(intentActions != null)
								document.game.net.sendIntentActions(intentActions);
							
							// Don't clear if it's move or no one shot action.
							if(this.ui.isMoveTo() || (this.ui.isAttack() && !this.ui.isAttackOneShot()) ){ }
							else
								this.ui.clear();
						}
						// It hasn't action then select the object.
						else
						{
							// Check what is here.
							var obj = Colision.getObject(document.game, this.clickLeft);
							if(obj != null)
							{
								var d = new Date();
								
								// Double click, only when is unit, when is mine and is fast click.
								if( obj.isUnit() && (!obj.isEnemy() && !obj.isAliade()) && (d.getTime()-this.timeLeftClick_DoubleClick) < 240 )
								{
									this.timeLeftClick_DoubleClick = 0;
									this.control.selection = document.game.players.get(null).getObjectsByTypePosition(obj.constructor.name, obj.pos, Config.DIST_DOUBLE_CLICK);
								}
								else
								{
									this.timeLeftClick_DoubleClick = d.getTime();
									if(ctrlKey)
									{
										if(this.control.indexObjectInList(this.control.selection, obj) < 0)
										{
											if(obj.isMineral())
												this.control.addToSelection([], [obj]);
											else
												this.control.addToSelection([obj], []);
										}
										else
											this.control.selection.splice(this.control.indexObjectInList(this.control.selection, obj), 1);
									}
									else
										this.control.selection = [obj];
								}
							}
						}
					}
				}
			}
		
			this.clickLeft = null;
		}
		else if(right && this.clickRight != null)
		{
			// If the user didn't move or move a little then it's a right click.
			var diff = Math.sqrt(Math.pow(this.clickRight.x-x, 2) + Math.pow(this.clickRight.y-y, 2));
			if(diff <= ControlPointer.MAX_PIXELS_DIFF_TO_BE_A_CLICK)
			{
				// There are objects selection.
				if(this.control.selection.length > 0)
				{
					// Over the world.
					if(!this.ui.isMiniMapFullscreen() && !this.ui.isInUI(this.clickRight.x, this.clickRight.y))
					{
						// Get unit or building there.
						var obj = Colision.getObject(document.game, this.clickRight);

						// Get terrain pos.
						var pos = Colision.pantallaToTerrain(this.gl, document.game.shaders, this.clickRight.x, this.clickRight.y);

						// Get intent actions.
						var intentActions = IntentAction.get(document.game, this.control.selection, pos, this.ui, obj);
							
						// Send its to server.
						if(intentActions != null)
							document.game.net.sendIntentActions(intentActions);
						
						this.ui.clear();
					}
				}
			}
			
			this.clickRight = null;
		}
	}

	// Se mueve puntero.
	pointerMove(pressed, x, y, ctrlKey)
	{
		y = this.gl.canvas.height - y;
		
		this.pastPosPointer.x = this.posPointer.x;
		this.pastPosPointer.y = this.posPointer.y;
		this.posPointer.x = x;
		this.posPointer.y = y;
		
		// Move mode.
		var itsMoveMode = Config.isMobile() && this.ui.isMobileMoveMode();

		// There is selection area.
		var thereIsSelection = !itsMoveMode && this.clickLeft != null && Math.sqrt(Math.pow(this.clickLeft.x-this.posPointer.x, 2) + Math.pow(this.clickLeft.y-this.posPointer.y, 2)) > ControlPointer.MAX_PIXELS_DIFF_TO_BE_A_CLICK;

		// First move on UI if there arent move mode neither selection.
		if(!itsMoveMode || !thereIsSelection)
			this.ui.moveMouse(this.gl, x, y, pressed);
		
		// Left click pressed.
		if(this.clickLeft != null)
		{
			if(itsMoveMode)
			{
				var pastMove = Colision.pantallaToTerrain(this.gl, document.game.shaders, this.pastPosPointer.x, this.pastPosPointer.y);
				var currentMove = Colision.pantallaToTerrain(this.gl, document.game.shaders, this.posPointer.x, this.posPointer.y);
				this.camera.move(pastMove.x-currentMove.x, pastMove.y-currentMove.y, 0);
			}
			else if(thereIsSelection)
			{
				// Check object selected.
				var objectsSelected = Colision.getObjectsArea(document.game, this.clickLeft, this.posPointer);
				var objectsPlayers = objectsSelected[0];
				var objectsMap = objectsSelected[1];
				
				// Add new objects to the current selection
				if(ctrlKey)
					this.addToSelection(objectsPlayers, objectsMap);
				
				// Just players or then objects map
				else
				{
					if(objectsPlayers.length > 0)
						this.control.selection = objectsPlayers;
					else
						this.control.selection = objectsMap;
				}
				
				this.ui.clear();
			}
		}
	}
	
	draw(gl, ctx2D)
	{
		if(this.clickLeft != null)
		{
			var diff = Math.sqrt(Math.pow(this.clickLeft.x-this.posPointer.x, 2) + Math.pow(this.clickLeft.y-this.posPointer.y, 2));
			if(diff > ControlPointer.MAX_PIXELS_DIFF_TO_BE_A_CLICK)
			{
				/// Adjust selection rect.
				if(this.posPointer.x < 2)
					this.posPointerSelectionTmp.x = 2;
				else if(this.posPointer.x > (gl.canvas.width-2))
					this.posPointerSelectionTmp.x = gl.canvas.width-2;
				else
					this.posPointerSelectionTmp.x = this.posPointer.x;
				
				if(this.posPointer.y < 2)
					this.posPointerSelectionTmp.y = 2;
				else if(this.posPointer.y > (gl.canvas.height-2))
					this.posPointerSelectionTmp.y = gl.canvas.height-2;
				else
					this.posPointerSelectionTmp.y = this.posPointer.y;
				
				
				this.p1SelectionTmp.x = this.clickLeft.x;
				this.p1SelectionTmp.y = this.posPointerSelectionTmp.y;
				this.p2SelectionTmp.x = this.posPointerSelectionTmp.x;
				this.p2SelectionTmp.y = this.clickLeft.y;

				// Dibujo cuadrado
				Pantalla2D.drawLines(ctx2D, [this.clickLeft, this.p1SelectionTmp, this.posPointerSelectionTmp, this.p2SelectionTmp, this.clickLeft], "#00FF00");
			}
		}
	}
	
	
	// Handle user actions from the mouse
	mouseDown(e)
	{
		var left = e.button == 0;
		var middle = e.button == 1;
		var right = e.button == 2;
		var x = e.offsetX;
		var y = e.offsetY;
		var ctrlKey = e.ctrlKey;
		this.pointerDown(left, middle, right, x, y, ctrlKey);
	}
	mouseUp(e)
	{
		var left = e.button == 0;
		var middle = e.button == 1;
		var right = e.button == 2;
		var x = e.offsetX;
		var y = e.offsetY;
		var ctrlKey = e.ctrlKey;
		this.pointerUp(left, middle, right, x, y, ctrlKey);
	}
	mouseMove(e)
	{
		var x = e.offsetX;
		var y = e.offsetY;
		var ctrlKey = e.ctrlKey;
		var pressed = e.buttons == 1;
		this.pointerMove(pressed, x, y, ctrlKey);
	}
	
	// Handle actions from the user through th touch screen
	// https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
	touchStart(e)
	{
		if(this.currentTouchId < 0 && e.changedTouches.length > 0)
		{
			this.currentTouchId = e.changedTouches[0].identifier;
			this.pointerDown(true, false, false, e.changedTouches[0].pageX, e.changedTouches[0].pageY, false);
			console.log("START "+e.changedTouches[0].pageX +" "+ e.changedTouches[0].pageY);
		}
	}
	touchMove(e)
	{
		if(this.currentTouchId >= 0)
		{
			var touches = e.changedTouches;
			for (var i = 0; i < touches.length; i++)
			{
				if(touches[i].identifier == this.currentTouchId)
				{
					this.pointerMove(true, touches[i].pageX, touches[i].pageY, false);
					console.log("MOVE "+touches[i].pageX +" "+ touches[i].pageY);
					break;
				}
			}
		}
	}
	touchEnd(e)
	{
		if(this.currentTouchId >= 0)
		{
			var touches = e.changedTouches;
			for (var i = 0; i < touches.length; i++)
			{
				if(touches[i].identifier == this.currentTouchId)
				{
					this.pointerUp(true, false, false, touches[i].pageX, touches[i].pageY, false);
					this.currentTouchId = -1;
					console.log("END "+touches[i].pageX +" "+ touches[i].pageY);
					break;
				}
			}
		}
	}
	touchCancel(e)
	{
		if(this.currentTouchId >= 0)
		{
			var touches = e.changedTouches;
			for (var i = 0; i < touches.length; i++)
			{
				if(touches[i].identifier == this.currentTouchId)
				{
					this.currentTouchId = -1;
					console.log("CANCEL "+touches[i].pageX +" "+ touches[i].pageY);
					break;
				}
			}
		}
	}
}

ControlPointer.instance = null;

ControlPointer.MAX_PIXELS_DIFF_TO_BE_A_CLICK = 10;



