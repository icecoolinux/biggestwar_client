
var canvas = null;
var gl = null;
var pantalla2d = null;
var ctxPantalla = null;
var game = null;

function start()
{
	// Set canvas size fitting on the window
	var canvas = document.getElementById("glcanvas");
	var canvas2d = document.getElementById("pantalla2d");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas2d.width = window.innerWidth;
	canvas2d.height = window.innerHeight;

	var url_string = window.location.href;
	var url = new URL(url_string);
	var user = url.searchParams.get("user");
	var token = url.searchParams.get("token");
	var uri = url.searchParams.get("uri");

	// Start audio.
	Audio.init();
	
	startGame(user, token, uri);
}

function startGame(user, token, uri)
{
	canvas = document.getElementById("glcanvas");
	pantalla2d = document.getElementById("pantalla2d");
	
	ctxPantalla = pantalla2d.getContext("2d");
	
	// Deshabilito menu con click derecho.
	canvas.oncontextmenu = function (e) {
		e.preventDefault();
	};
	pantalla2d.oncontextmenu = function (e) {
		e.preventDefault();
	};
	
	try {
		// Tratar de tomar el contexto estandar. Si falla, retornar al experimental.
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	}
	catch(e) {}

	// Si no tenemos ningun contexto GL, date por vencido ahora
	if (!gl) {
		alert("Imposible inicializar WebGL. Tu navegador puede no soportarlo.");
		gl = null;
	}
	
	
	// Inicializa el juego y entra en el loop principal.
	document.game = new Game(gl, canvas, ctxPantalla, pantalla2d);
	document.game.load(uri, user, token, function(){
		document.game.loop();
	});
}

