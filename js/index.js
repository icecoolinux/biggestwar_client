

window.onload = function()
{
	var infoUser = localStorage.getItem("infoUser");
	if(infoUser != null)
	{
		infoUser = JSON.parse(infoUser);
		
		document.getElementById("playNow").style.display = "none";
		document.getElementById("goHome").innerHTML = "( "+infoUser.user+" )";
		document.getElementById("goHome").style.display = "inline";
	}
}

function playNow()
{
	window.location.replace("login.html");
}

function goHome()
{
	window.location.replace("homeUser.html");
}
