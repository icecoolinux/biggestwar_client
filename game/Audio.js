
//https://www.html5rocks.com/en/tutorials/webaudio/intro/

class Audio
{
	static init()
	{
		try {
			// Fix up for prefixing
			window.AudioContext = window.AudioContext||window.webkitAudioContext;
			Audio.context = new AudioContext();
		}
		catch(e) {
			alert('Web Audio API is not supported in this browser');
		}
	}
	
	static load(progressFunc, doneFunc)
	{
		function loadAudio(index)
		{
			Audio.loadBuffer(index, function(){loadNextAudio(index+1)});
		}
		function loadNextAudio(index)
		{
			if( index < Audio.audios.length)
				progressFunc(index/Audio.audios.length, function(){loadAudio(index)});
			else
				doneFunc();
		}
		loadNextAudio(0);
	}

	
	static play(name, volume=100, when=0)
	{
		for(var i=0; i<Audio.audios.length; i++)
		{
			if(Audio.audios[i].name == name)
			{
				if(Audio.audios[i].hasOwnProperty("buffer"))
				{
					try{
						var source = Audio.context.createBufferSource();
						source.buffer = Audio.audios[i].buffer;
						
						if(volume >= 100)
							source.connect(Audio.context.destination);
						else
						{
							var gainNode = Audio.context.createGain();
							gainNode.gain.value = volume / 100;
							source.connect(gainNode).connect(Audio.context.destination);
						}
						
						source.start(when); // noteOn(time);
					}
					catch(e) {
						console.log(e);
					}
				}
				return;
			}
		}
	}

	
	
	static loadBuffer(index, func) 
	{
		Audio.audios[index].buffer = null;
		
		// Load buffer asynchronously
		var request = new XMLHttpRequest();
		request.open("GET", Audio.audios[index].url, true);
		request.responseType = "arraybuffer";

		request.onload = function() {
			// Asynchronously decode the audio file data in request.response
			Audio.context.decodeAudioData(
				request.response,
				function(buffer) 
				{
					if (!buffer) 
						alert('error decoding file data: ' + Audio.audios[index].url);
					else
						Audio.audios[index].buffer = buffer;
					func();
				},
				function(error) {
					console.error('decodeAudioData error', error);
					func();
				}
			);
		}

		request.onerror = function() {
			alert('BufferLoader: XHR error');
			func();
		}

		request.send();
	}
}

Audio.context = null;

Audio.audios = [{name:"bullet_soldadoraso", url:"game/audio/bullet_soldadoraso.mp3"},
				{name:"bullet_soldadoentrenado", url:"game/audio/bullet_soldadoentrenado.mp3"}
				];
		


