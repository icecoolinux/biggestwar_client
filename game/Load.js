
class Load
{
};

// Draw load screen.
Load.drawLoad = function(ctx, textures, models, audio, progress)
{
	progress = Math.trunc(progress);
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	Pantalla2D.clear(ctx);
	
	var text = "Loading...";
	if(textures)
		text = "Loading textures ("+progress+"%)...";
	else if(models)
		text = "Loading models ("+progress+"%)...";
	else if(audio)
		text = "Loading audio ("+progress+"%)...";
	
	Pantalla2D.drawText(ctx, [text], 50, 50, color="#00cc00", withDepth=true);
}

Load.loop = function(gl, ctx, funcDone)
{
	Load.drawLoad(ctx, true, false, false, 0);
	
	// Start to load
	Textures.load(gl, progressTexturesFunc, doneTexturesFunc);
	
	// Load textures
	function progressTexturesFunc(progress, func)
	{
		Load.drawLoad(ctx, true, false, false, progress);
		func();
	}
	function doneTexturesFunc()
	{
		Load.drawLoad(ctx, false, true, false, 0);
		Models.load(gl, progressModelsFunc, doneModelsFunc);
	}
	
	// Load models
	function progressModelsFunc(progress, func)
	{
		Load.drawLoad(ctx, false, true, false, progress);
		func();
	}
	function doneModelsFunc()
	{
		Load.drawLoad(ctx, false, false, true, 0);
		Audio.load(progressAudioFunc, doneAudioFunc);
	}
	
	// Load audio
	function progressAudioFunc(progress, func)
	{
		Load.drawLoad(ctx, false, false, true, progress);
		func();
	}
	function doneAudioFunc()
	{
		funcDone();
	}
}


