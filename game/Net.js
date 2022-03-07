

class Net
{
	constructor(uri, name)
	{
		this.urlServer = uri;
		this.sock = null;
		this.logged = false;
		this.updates = [];
		this.updatesBinary = [];
		this.playerName = name;
		
		this.posUpdateView = {x:-1000, y:-1000};
		this.lastSelection = [];
	}
	
	connect(user, token)
	{
		var net = this;
		this.sock = new WebSocket(this.urlServer);
		this.sock.onopen = () => {
			net.sock.send('login_game,'+user+','+token+';');
		}
		this.sock.onmessage = function (event) {
			net.setMessage(event);
		}
	}
	
	// Envia al servidor un intento de accion que desea el jugador.
	sendIntentActions(intents)
	{
		if(this.sock == null || !this.logged)
			return false;
		
		for(var i=0; i<intents.length; i++)
		{
			var int = intents[i];
			var msg = 'intent,'+int.action.type+','+int.action.subType+','+int.action.unitID+','+int.action.unit2ID+','+
						int.action.buildID+','+int.action.build2ID+','+int.action.objectMapID+','+int.action.pos.x+','+
						int.action.pos.y+','+int.action.make+';';
			this.sock.send(msg);
console.log(msg);
		}
		
		return true;
	}
	
	// Cancela acciones de unidades o construcciones.
	cancelAction(objectsIds)
	{
		if(this.sock == null || !this.logged)
			return false;
		
		for(var i=0; i<objectsIds.length; i++)
		{
			var msg = 'cancel_action,'+objectsIds[i]+';';
			this.sock.send(msg);
		}
		
		return true;
	}
	
	sendMiniMapSetting(res, zoom, pos)
	{
		var msg = 'minimap,'+res+','+zoom+','+pos.x+','+pos.y+';';
		this.sock.send(msg);
	}
	
	// Actualiza mapa y jugadores con directivas del servidor.
	update(gl, shaders, ms, map, players, camera, control, game)
	{
		// Process text message.
		while(this.updates.length > 0)
		{
			var u = this.updates.shift();
			var params = u.split(',');

			if(params[0] == 'change')
			{
				var id = parseInt(params[1]);
				var tmp = players.getObjectById(id);
				var obj = null;
				var player = null;
				if(tmp != null)
				{
					obj = tmp.object;
					player = tmp.player;
				}
				else
				{
					obj = map.getObjectById(id);
					if(obj == null)
						console.log("Error, object "+id+"not exists");
				}
				
				if(obj != null)
				{
					var pos = 2;
					while(pos < params.length)
					{
						if(params[pos] == 'pos')
						{
							obj.setPosNet(parseFloat(params[pos+1]), parseFloat(params[pos+2]))
							pos += 3;
						}
						else if(params[pos] == 'life')
						{
							obj.vida = parseInt(params[pos+1]);
							pos += 2;
						}
						else if(params[pos] == 'fulllife')
						{
							obj.fullLife = parseInt(params[pos+1]);
							pos += 2;
						}
						else if(params[pos] == 'creada')
						{
							obj.creada = parseInt(params[pos+1]);
							pos += 2;
						}
						else if(params[pos] == 'construccioncreando')
						{
							obj.construccionCreando = parseInt(params[pos+1]);
							obj.construccionFull = parseInt(params[pos+2]);
							pos += 3;
						}
						else if(params[pos] == 'tslastattack')
						{
							obj.setTsLastAttack(parseInt(params[pos+1]));
							pos += 2;
						}
						else if(params[pos] == 'collected')
						{
							obj.collected = parseInt(params[pos+1]);
							pos += 2;
						}
						else if(params[pos] == 'amount')
						{
							obj.amount = parseInt(params[pos+1]);
							pos += 2;
						}
						
						// Actions.
						else if(params[pos] == 'deleteaction')
						{
							obj.deleteAction(this);
							pos ++;
						}
						else if(params[pos] == 'newaction')
						{
							// newaction,actiontype,%d, 0-1-2
							//           actionsubtype,%d, 3-4
							//           actionunitid,%llu, 5-6
							//           actionunit2id,%llu, 7-8
							//           actionbuildid,%llu, 9-10
							//           actionbuild2id,%llu, 11-12
							//           actionobjectmapid,%llu, 13-14
							//           actionpos,%f,%f, 15-16-17
							//           actionmake,%d, 18-19
							var params = {type: parseInt(params[pos+2]), subType: parseInt(params[pos+4]), unit: null, unit2: null, build: null, build2: null, objectMap: null, 
											unitID: parseInt(params[pos+6]), unit2ID: parseInt(params[pos+8]), buildID: parseInt(params[pos+10]), 
											build2ID: parseInt(params[pos+12]), objectMapID: parseInt(params[pos+14]), 
											x: parseFloat(params[pos+16]), y: parseFloat(params[pos+17]), make: parseInt(params[pos+19])};

							var a = new Action(params);
							player.setAction(players, a);
							pos+=21;
						}
						else
							pos++;
					}
				}
			}
			else if(params[0] == 'new')
			{
				var id = parseInt(params[1]);
				var player = players.get(params[3]);
				var type, life, fulllife, creada, construccioncreando, construccionfull, collected, amount;
				var posNew = {x:0, y:0};
				var action = null;
				
				var pos = 4;
				while(pos < params.length)
				{
					if(params[pos] == 'type')
					{
						type = parseInt(params[pos+1]);
						pos += 2;
					}
					else if(params[pos] == 'pos')
					{
						posNew.x = parseFloat(params[pos+1]);
						posNew.y = parseFloat(params[pos+2]);
						pos += 3;
					}
					else if(params[pos] == 'life')
					{
						life = parseInt(params[pos+1]);
						pos += 2;
					}
					else if(params[pos] == 'fulllife')
					{
						fulllife = parseInt(params[pos+1]);
						pos += 2;
					}
					else if(params[pos] == 'creada')
					{
						creada = parseInt(params[pos+1]);
						pos += 2;
					}
					else if(params[pos] == 'construccioncreando')
					{
						construccioncreando = parseInt(params[pos+1]);
						construccionfull = parseInt(params[pos+2]);
						pos += 3;
					}
					else if(params[pos] == 'collected')
					{
						collected = parseInt(params[pos+1]);
						pos += 2;
					}
					else if(params[pos] == 'amount')
					{
						amount = parseInt(params[pos+1]);
						pos += 2;
					}
					else if(params[pos] == 'newaction')
					{
						// newaction,actiontype,%d, 0-1-2
						//           actionsubtype,%d, 3-4
						//           actionunitid,%llu, 5-6
						//           actionunit2id,%llu, 7-8
						//           actionbuildid,%llu, 9-10
						//           actionbuild2id,%llu, 11-12
						//           actionobjectmapid,%llu, 13-14
						//           actionpos,%f,%f, 15-16-17
						//           actionmake,%d, 18-19
						var params = {type: parseInt(params[pos+2]), subType: parseInt(params[pos+4]), unit: null, unit2: null, build: null, build2: null, objectMap: null, 
										unitID: parseInt(params[pos+6]), unit2ID: parseInt(params[pos+8]), buildID: parseInt(params[pos+10]), 
										build2ID: parseInt(params[pos+12]), objectMapID: parseInt(params[pos+14]), 
										x: parseFloat(params[pos+16]), y: parseFloat(params[pos+17]), make: parseInt(params[pos+19])};

						action = new Action(params);
						pos+=21;
					}
					else 
						pos++;
				}
				
				// Calculate if is enemy or aliade.
				var enemy = false;
				var aliade = false;
				if(type != Config.OT_MINERAL)
				{
					if(player.equip == players.get(null).equip)
					{
						if(player != players.get(null))
							aliade = true;
					}
					else
						enemy = true;
				}

				var obj = null;
				if(type == Config.OT_MINERAL)
				{
					obj = new Mineral({id: id, type: type, pos: posNew, amount: amount});
					map.add(obj);
				}
				else if(type == Config.OT_BASE)
				{
					obj = new Base({id: id, type: type, pos: posNew, vida: life, fulllife: fulllife, creada: creada, construccionCreando: construccioncreando, construccionFull: construccionfull, enemy: enemy, aliade: aliade, player: player});
					player.addBuilding(obj);
				}
				else if(type == Config.OT_BARRACA)
				{
					obj = new Barraca({id: id, type: type, pos: posNew, vida: life, fulllife: fulllife, creada: creada, construccionCreando: construccioncreando, construccionFull: construccionfull, enemy: enemy, aliade: aliade, player: player});
					player.addBuilding(obj);
				}
				else if(type == Config.OT_TORRETA)
				{
					obj = new Torreta({id: id, type: type, pos: posNew, vida: life, fulllife: fulllife, creada: creada, construccionCreando: construccioncreando, construccionFull: construccionfull, enemy: enemy, aliade: aliade, player: player});
					player.addBuilding(obj);
				}
				else if(type == Config.OT_RECOLECTOR)
				{
					obj = new Recolector({id: id, type: type, pos: posNew, vida: life, fulllife: fulllife, creada: creada, enemy: enemy, aliade: aliade, player: player});
					player.addUnit(obj);
				}
				else if(type == Config.OT_SOLDADO_RASO)
				{
					obj = new SoldadoRaso({id: id, type: type, pos: posNew, vida: life, fulllife: fulllife, creada: creada, enemy: enemy, aliade: aliade, player: player});
					player.addUnit(obj);
				}
				else if(type == Config.OT_SOLDADO_ENTRENADO)
				{
					obj = new SoldadoEntrenado({id: id, type: type, pos: posNew, vida: life, fulllife: fulllife, creada: creada, enemy: enemy, aliade: aliade, player: player});
					player.addUnit(obj);
				}
				else if(type == Config.OT_TANQUE)
				{
					obj = new Tanque({id: id, type: type, pos: posNew, vida: life, creada: creada, fulllife: fulllife, enemy: enemy, aliade: aliade, player: player});
					player.addUnit(obj);
				}
				else if(type == Config.OT_TANQUE_PESADO)
				{
					obj = new TanquePesado({id: id, type: type, pos: posNew, vida: life, fulllife: fulllife, creada: creada, enemy: enemy, aliade: aliade, player: player});
					player.addUnit(obj);
				}
				
				// Add action.
				if(action != null)
					player.setAction(players, action);
				
				// Add object as visible to Control.
				control.setVisibleObject(obj);
			}
			else if(params[0] == 'delete')
			{
				var destroyed = params[1] == 'destroyed';
				var id = parseInt(params[2]);
				var tmp = players.getObjectById(id);
				var obj = null;
				var player = null;
				var isEnemy = false;
				
				// Objeto de algun player.
				if(tmp != null)
				{
					obj = tmp.object;
					player = tmp.player;
					
					if(obj.isUnit())
						player.removeUnit(id);
					else if(obj.isBuilding())
						player.removeBuilding(id);
					
					isEnemy = player.equip != players.get(null).equip;
				}
				else
				{
					obj = map.getObjectById(id);
					if(obj == null)
						console.log("Error, object "+id+"not exists");
					else
						map.remove(id);
				}
				
				// Remove object or remove visibility from control.
				if(destroyed)
					control.destroyObject(id);
				else
					control.setInvisibleObject(id, isEnemy);
			}
			else if(params[0] == 'newplayercurrent')
			{
				var player = new Player(gl, params[1], map, parseInt(params[2]));
				players.setCurrent(player);
				this.logged = true;
				
				var deltaX = parseInt(params[3]) - camera.x;
				var deltaY = parseInt(params[4]) - camera.y;
				camera.move(deltaX, deltaY, 0);
			}
			else if(params[0] == 'newplayer')
			{
				var player = new Player(gl, params[1], map, parseInt(params[2]));
				players.addPlayer(player);
			}
			else if(params[0] == 'removeplayer')
			{
				players.removePlayer(params[1]);
			}
			else if(params[0] == 'resources')
			{
				player = players.get(null);
				player.minerals = parseInt(params[1]);
				player.oil = parseInt(params[2]);
			}
			else if(params[0] == 'area')
			{
				var closing = params[1]=='1';
				var msToClose = parseInt(params[2]);
				var futureCenterX = parseFloat(params[3]);
				var futureCenterY = parseFloat(params[4]);
				var currentBottom = parseInt(params[5]);
				var currentTop = parseInt(params[6]);
				var currentLeft = parseInt(params[7]);
				var currentRight = parseInt(params[8]);
				var futureBottom = parseInt(params[9]);
				var futureTop = parseInt(params[10]);
				var futureLeft = parseInt(params[11]);
				var futureRight = parseInt(params[12]);
				var speedBottom = parseFloat(params[13]);
				var speedTop = parseFloat(params[14]);
				var speedLeft = parseFloat(params[15]);
				var speedRight = parseFloat(params[16]);
				
				map.getArea().set(closing, msToClose, futureCenterX, futureCenterY, currentBottom, currentTop, currentLeft, currentRight, 
									futureBottom, futureTop, futureLeft, futureRight, speedBottom, speedTop, speedLeft, speedRight);
			}
			else if(params[0] == 'baseszones')
			{
				var amountBases = parseInt(params[1]);
				var pos = 2;
				var addBasesZones = [];
				var delBasesZones = [];
				for(var i=0; i<amountBases; i++)
				{
					if(params[pos] == 'add')
					{
						pos++;
						addBasesZones.push({equip: parseInt(params[pos]), pos:{x: parseInt(params[pos+1]), y: parseInt(params[pos+2])}, radio: parseInt(params[pos+3]) });
						pos += 4;
					}
					else
					{
						pos++;
						delBasesZones.push({x: parseInt(params[pos]), y: parseInt(params[pos+1])});
						pos += 2;
					}
				}
				map.setBasesZones(addBasesZones, delBasesZones);
			}
			else if(params[0] == 'config')
			{
				var pos = 1;
				while(pos < params.length)
				{
					if(params[pos] == 'radio_mineral')
					{
						Config.RADIO_MINERAL = parseFloat(params[pos+1]);
						pos += 2;
					}
					else if(params[pos] == 'radio_base')
					{
						Config.RADIO_BASE = parseFloat(params[pos+1]);
						pos += 2;
					}
					else if(params[pos] == 'radio_barraca')
					{
						Config.RADIO_BARRACA = parseFloat(params[pos+1]);
						pos += 2;
					}
					else if(params[pos] == 'radio_torreta')
					{
						Config.RADIO_TORRETA = parseFloat(params[pos+1]);
						pos += 2;
					}
					else if(params[pos] == 'radio_recolector')
					{
						Config.RADIO_RECOLECTOR = parseFloat(params[pos+1]);
						pos += 2;
					}
					else if(params[pos] == 'radio_soldadoraso')
					{
						Config.RADIO_SOLDADORASO = parseFloat(params[pos+1]);
						pos += 2;
					}
					else if(params[pos] == 'radio_soldadoentrenado')
					{
						Config.RADIO_SOLDADOENTRENADO = parseFloat(params[pos+1]);
						pos += 2;
					}
					else if(params[pos] == 'radio_tanque')
					{
						Config.RADIO_TANQUE = parseFloat(params[pos+1]);
						pos += 2;
					}
					else if(params[pos] == 'radio_tanquepesado')
					{
						Config.RADIO_TANQUEPESADO = parseFloat(params[pos+1]);
						pos += 2;
					}
					else if(params[pos] == 'max_amount_recollect_recolector')
					{
						Config.MAX_AMOUNT_RECOLLECT_RECOLECTOR = parseFloat(params[pos+1]);
						pos += 2;
					}
					else if(params[pos] == 'visibility_distance')
					{
						Config.VISIBILITY_DISTANCE = parseFloat(params[pos+1]);
						pos += 2;
					}
					else if(params[pos] == 'vel_recolector')
					{
						Config.VEL_RECOLECTOR = parseFloat(params[pos+1]);
						pos += 2;
					}
					else if(params[pos] == 'full_life_base')
					{
						Config.FULL_LIFE_BASE = parseInt(params[pos+1]);
						pos += 2;
					}
					else if(params[pos] == 'full_life_barraca')
					{
						Config.FULL_LIFE_BARRACA = parseInt(params[pos+1]);
						pos += 2;
					}
					else if(params[pos] == 'full_life_torreta')
					{
						Config.FULL_LIFE_TORRETA = parseInt(params[pos+1]);
						pos += 2;
					}
					else if(params[pos] == 'full_life_recolector')
					{
						Config.FULL_LIFE_RECOLECTOR = parseInt(params[pos+1]);
						pos += 2;
					}
					else if(params[pos] == 'full_life_soldadoraso')
					{
						Config.FULL_LIFE_SOLDADORASO = parseInt(params[pos+1]);
						pos += 2;
					}
					else if(params[pos] == 'full_life_soldadoentrenado')
					{
						Config.FULL_LIFE_SOLDADOENTRENADO = parseInt(params[pos+1]);
						pos += 2;
					}
					else if(params[pos] == 'full_life_tanque')
					{
						Config.FULL_LIFE_TANQUE = parseInt(params[pos+1]);
						pos += 2;
					}
					else if(params[pos] == 'full_life_tanquepesado')
					{
						Config.FULL_LIFE_TANQUEPESADO = parseInt(params[pos+1]);
						pos += 2;
					}
					else 
						pos++;
				}
			}
			else if(params[0] == 'endgame')
			{
				var surrender = params[1] == 'true';
				var win = params[2] == 'true';
				var lose = params[3] == 'true';
				var gameFinish = params[4] == 'true';
				var rank = parseInt(params[5]);
				game.setEnd(surrender, win, lose, gameFinish, rank);
			}
		}
		
		// Process binary message.
		while(this.updatesBinary.length > 0)
		{
			var u = this.updatesBinary.shift();
			var command = new TextDecoder("utf-8").decode(u.slice(0,50)).split(',')[0];
			
			// Minimap.
			if(command == "minimap")
				control.setMiniMap(u.slice("minimap,".length));
		}
		
		// Update view.
		// Send update when the camera moves much.
		// Each one quinte of movement i send update with one quarter of border, TODO see this for improvement
		if(this.sock != null && this.logged && Geom.dist(this.posUpdateView, {x:camera.x, y:camera.y}) >= (Config.ANCHO_PROJECTION/5) )
		{
			this.posUpdateView.x = camera.x;
			this.posUpdateView.y = camera.y;
			
			var border = (Config.ANCHO_PROJECTION/4) * gl.canvas.width/Config.ANCHO_PROJECTION;
			var xInitScreen = 0-border;
			var yInitScreen = 0-border;
			var widthScreen = gl.canvas.width+border;
			var heightScreen = gl.canvas.height+border;
			
			var upLeft = Colision.pantallaToTerrain(gl, shaders, xInitScreen, heightScreen);
			var downLeft = Colision.pantallaToTerrain(gl, shaders, xInitScreen, yInitScreen);
			var downRight = Colision.pantallaToTerrain(gl, shaders, widthScreen, yInitScreen);
			var upRight = Colision.pantallaToTerrain(gl, shaders, widthScreen, heightScreen);
			var xMin = upLeft.x;
			var xMax = downRight.x;
			var yMin = downLeft.y;
			var yMax = upRight.y;
			var msgUpdate = 'update,'+Math.ceil(xMin)+','+Math.ceil(xMax)+','+Math.ceil(yMin)+','+Math.ceil(yMax)+';';
			this.sock.send(msgUpdate);
console.log(msgUpdate);
		}
		
		// Update select, only send when change select.
		var currentSelection = control.getIdsMustToBeUpdated();
		currentSelection.sort();
		var changeSelection = currentSelection.length != this.lastSelection.length;
		if(!changeSelection)
		{
			for(var i=0; i<currentSelection.length; i++)
			{
				if(currentSelection[i] != this.lastSelection[i])
				{
					changeSelection = true;
					break;
				}
			}
		}
		if(changeSelection)
		{
			this.lastSelection = currentSelection;
			
			// Send selection.
			var msgSelection = "selection,"+currentSelection.length;
			for(var i=0; i<currentSelection.length; i++)
				msgSelection += ","+currentSelection[i];
			msgSelection += ";";
			this.sock.send(msgSelection);
console.log(msgSelection);
		}
	}
	
	// Receive message from server.
	setMessage(event)
	{
console.log(event.data);
		var net = this;
		
		// It's binary message.
		if(event.data instanceof Blob)
		{
			// Read blob.
			var reader = new FileReader();
			reader.addEventListener("loadend", function() 
			{
				var bytes = new Uint8Array(reader.result);
				net.updatesBinary.push(bytes);
			});
			reader.readAsArrayBuffer(event.data);
		}
		
		// Is text message.
		else
		{
			var msgs = event.data.split(';');
			for(var i=0; i<msgs.length-1; i++)
				this.updates.push(msgs[i]);
		}
	}
}

