
var sock = null;
var infoUser = null; 
var infoGame = null;


window.onload = function()
{
	infoUser = localStorage.getItem("infoUser");
	if(infoUser != null)
	{
		infoUser = JSON.parse(infoUser);
		document.getElementById("userName").innerHTML = infoUser.user;
console.log(infoUser);
		handleResults();
		
		openSock(function(){ sock.send('login,'+infoUser.user+','+infoUser.pass+';'); });
	}
	else
		window.location.replace("login.html");
}

function enterGame()
{
	if(infoGame == null)
		sock.send('play;');
	else
		window.location.replace("game.html?user="+infoUser.user+"&token="+infoGame.token+"&uri="+infoGame.uri);
}

function closeSession()
{
	localStorage.removeItem("infoUser");
	window.location.replace("login.html");
}

function openSock(funcAfterOpen)
{
	sock = new WebSocket(urlServer);
	sock.onopen = () => {
		funcAfterOpen();
	}
	sock.onclose = () => {
		sock = null;
	}
	sock.onerror = () => {
		sock = null;
	}
	
	sock.onmessage = function (event) 
	{
console.log(event.data);
		var msgs = event.data.split(';');
		for(var i=0; i<msgs.length-1; i++)
		{
			var params = msgs[i].split(',');
			
			if(params[0] == 'error')
			{
				console.log("Error "+params[1]);
				if(params[1] == 'login')
					closeSession();
				else if(params[1] == 'play')
					document.getElementById('error_message').innerHTML = "Error to enter the game";
			}
			else if(params[0] == 'login')
			{
				// Get user statics
				infoUser.win = parseInt(params[1]);
				infoUser.lose = parseInt(params[2]);
				infoUser.points = parseInt(params[3]);
				document.getElementById('win').innerHTML = infoUser.win;
				document.getElementById('lose').innerHTML = infoUser.lose;
				document.getElementById('points').innerHTML = infoUser.points;

				// Get info current game.
				if(params[4] == 'true')
				{
					infoGame = {"uri": params[5], "token": params[6]};
					document.getElementById("buttonEnterGame").innerText = "Continue gaming";
				}
				else
				{
					infoGame = null;
					document.getElementById("buttonEnterGame").innerText = "Enter to a new game";
				}
				document.getElementById("buttonEnterGame").focus();
				
				// Results.
				var cantResults = parseInt(params[7]);
				for(var i=0; i<cantResults; i++)
				{
					var equip = parseInt(params[i*6+8]);
					var rank = parseInt(params[i*6+9]);
					var points = parseInt(params[i*6+10]);
					var surrender = params[i*6+11] == 'true';
					var teamWin = params[i*6+12] == 'true';
					var winToEnd = params[i*6+13] == 'true';
					infoUser.results.push({equip:equip, rank:rank, points:points, surrender:surrender, teamWin:teamWin, winToEnd:winToEnd});
				}
				
				handleResults();
				
				// Save it
				localStorage.setItem("infoUser", JSON.stringify(infoUser));
			}
			else if(params[0] == 'newplayerworld')
			{
				infoGame = {"uri": params[2], "token": params[4]};
				enterGame();
			}
		}
	}
}



function handleResults()
{
	if(infoUser.results.length > 0)
	{
		document.getElementById('results').innerHTML = "";
		
		while(infoUser.results.length > 0)
		{
			var r = infoUser.results[0];
			infoUser.results.shift();
			
			if(r.surrender)
				document.getElementById('results').innerHTML += "Te rendiste en un juego anterior con el equipo "+r.equip+", llegaste al ranking "+r.rank+", ganaste "+r.points+" puntos; ";
			else if(r.teamWin)
			{
				if(r.winToEnd)
					document.getElementById('results').innerHTML += "Buena, ganaste en juego anterior con el equipo "+r.equip+" y quedaste hasta el final, llegaste al ranking "+r.rank+", ganaste "+r.points+" puntos; ";
				else
					document.getElementById('results').innerHTML += "Buena, tu equipo gano en juego anterior con el equipo "+r.equip+", llegaste al ranking "+r.rank+", ganaste "+r.points+" puntos; ";
			}
			else
				document.getElementById('results').innerHTML += "Tu equipo perdio en juego anterior con el equipo "+r.equip+", llegaste al ranking "+r.rank+", ganaste "+r.points+" puntos; ";
		}
	}
}











