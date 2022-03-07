

class Game
{
	// Inicializa el juego.
	constructor(gl, canvas, ctxPantalla, pantalla2d)
	{
		var game = this;

		this.gl = gl;
		this.ctxPantalla = ctxPantalla;

		Pantalla2D.init(this.ctxPantalla);
		
		// Setea shaders.
		this.shaders = new Shaders(gl);
		this.shaders.set(gl, 'lambert');

		// Inicializa camara.
		this.camera = new Camera(gl, this.shaders);
		this.camera.move(-Config.INIT_POS_X, -Config.INIT_POS_Y, -Config.INIT_POS_Z);
				
		gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // Establecer el color base en negro, totalmente opaco
		gl.clearDepth(1.0); 
		gl.enable(gl.DEPTH_TEST);                               // Habilitar prueba de profundidad
		gl.depthFunc(gl.LEQUAL);                                // Objetos cercanos opacan objetos lejanos
		gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);      // Limpiar el buffer de color asi como el de profundidad

		gl.viewport(0, 0, canvas.width, canvas.height);

		this.time = new Date();
		
		this.gameEnd = false;
	}
	
	// Load objects, textures, models, audio, etc.
	load(uri, user, token, done)
	{
		var game = this;
		Load.loop(this.gl, this.ctxPantalla, function()
			{
				game.control = new Control(gl, ctxPantalla, game.camera);
				
				// Seteo eventos del mouse.
				window.addEventListener("mousedown", function(e){game.control.pointer.mouseDown(e);}, false);
				window.addEventListener("mouseup", function(e){game.control.pointer.mouseUp(e);}, false);
				window.addEventListener("mousemove", function(e){game.control.pointer.mouseMove(e);}, false);
				if(Config.isMobile())
				{
					window.addEventListener("touchstart", function(e){game.control.pointer.touchStart(e);}, false);
					window.addEventListener("touchend", function(e){game.control.pointer.touchEnd(e);}, false);
					window.addEventListener("touchcancel", function(e){game.control.pointer.touchCancel(e);}, false);
					window.addEventListener("touchmove", function(e){game.control.pointer.touchMove(e);}, false);
				}
				
				// Creo el mapa.
				game.map = new Map(gl, game.shaders, game.camera);

				// Crea jugadores.
				game.players = new Players(gl, game.map);
				game.map.setPlayers(game.players);
				
				// Hub.
				game.hub = new Hub(ctxPantalla, game.players);
				
				game.net = new Net(uri, user);
				game.net.connect(user, token);
		
				done();
			});
	}
	
	setEnd(surrender, win, lose, gameFinish, rank)
	{
		this.control.setEnd(surrender, win, lose, gameFinish, rank);
		this.gameEnd = true;
	}
	
	// Loop que ajusta y dibuja juego.
	loop()
	{
		var this_ = this;
		
		// Calculo tiempo entre frames.
		var time_tmp = new Date();
		var ms = time_tmp - this.time;
		this.time = time_tmp;

		this.update(ms);
		this.draw(ms);
		
		
		if(Config.FPS <= 0)
			window.requestAnimationFrame(function(){this_.loop();});
		else
		{
			var msSleep = 1000 / Config.FPS;
			setTimeout(function(){
					window.requestAnimationFrame(function(){this_.loop();});
				}, msSleep);
		}
	}

	
	// Actualiza juego.
	update(ms)
	{
		this.hub.update(ms);
		this.control.update(ms);
		
		if(this.gameEnd)
		{
			// Go to main window.
			if(this.control.userWantToLeave())
			{
				const urlParams = new URLSearchParams(window.location.search);
				window.location.replace("index.html");
			}
		}
		else
		{
			this.net.update(this.gl, this.shaders, ms, this.map, this.players, this.camera, this.control, this);
			this.players.update(ms);
			this.map.update(ms);
		}
	}

	// Dibuja juego.
	draw(ms)
	{
		var gl = this.gl;

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		Pantalla2D.clear(this.ctxPantalla);

		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

//this.shaders.rotate(1, 1,1,1);
		if(this.control.isMiniMapFullscreen())
		{
			this.control.draw(gl, this.shaders, this.ctxPantalla, this.map.getArea());
		}
		else
		{
			this.players.draw(this.ctxPantalla, gl, this.shaders);
			this.map.draw(gl, this.shaders);
		
			this.hub.draw(this.camera, this.map.getArea());
			this.control.draw(gl, this.shaders, this.ctxPantalla, this.map.getArea());
		}
	}
}
