
var sock = null;
var infoUser = {name: null, 
				pass: null, 
				win: 0,
				lose: 0,
				points: 0,
				results: [] };

window.onload = function()
{
	openSock(null);
}

function enterLogin()
{
	if(sock == null)
	{
		retry();
		return;
	}
	
	document.querySelector(".messages").innerHTML = "";
	
	document.querySelector(".inner-loader").style.display = "block";
	
	infoUser.user = document.getElementById('user').value;
	infoUser.pass = document.getElementById('pass').value;
	sock.send('login,'+infoUser.user+','+infoUser.pass+';');
}

function enterRegister()
{
}

function retry()
{
	document.querySelector(".messages").innerHTML = "";
	openSock(function(){enterLogin();});
}

function openSock(func)
{
	sock = new WebSocket(urlServer);
	sock.onopen = () => {
		if(func != null)
			func();
	}
	sock.onclose = () => {
		document.querySelector(".inner-loader").style.display = "none";
		sock = null;
	}
	sock.onerror = () => {
		document.querySelector(".inner-loader").style.display = "none";
		sock = null;
		document.querySelector(".messages").innerHTML = "Error to connect to the server <a href='#' onclick='retry();'>Retry<\a> ";
	}
	
	sock.onmessage = function (event) 
	{
		document.querySelector(".inner-loader").style.display = "none";
console.log(event.data);
		var msgs = event.data.split(';');
		for(var i=0; i<msgs.length-1; i++)
		{
			var params = msgs[i].split(',');
			
			if(params[0] == 'error')
			{
				console.log("Error "+params[1]);
				if(params[1] == 'login')
					document.querySelector(".messages").innerHTML = "User or password wrong";
			}
			else if(params[0] == 'login')
			{
				// Get user statics
				infoUser.win = parseInt(params[1]);
				infoUser.lose = parseInt(params[2]);
				infoUser.points = parseInt(params[3]);

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
				
				localStorage.setItem('infoUser', JSON.stringify(infoUser));
				
				window.location.replace("homeUser.html");
			}
		}
	}
}














