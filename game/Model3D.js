
class Model3D
{
	constructor(md2Model, texture=null)
	{
		this.model = md2Model;
		this.custom_texture = texture;
		
		this.ms = 0;
		this.msPerFrame = 100;
		this.speedUp = 1;
		
		this.repeat = true;
	}
	
	initAnimation()
	{
		this.ms = 0;
	}
	
	// Default is true
	setRepeat(repeat)
	{
		this.repeat = repeat;
	}
	
	setSpeedUp(up)
	{
		this.speedUp = up;
	}
	
	update(ms)
	{
		this.ms += ms * this.speedUp;
		
		if( this.ms >= (this.model.nroFrames() * this.msPerFrame))
		{
			if(this.repeat)
				this.ms -= this.model.nroFrames() * this.msPerFrame;
			else
				this.ms = this.model.nroFrames() * this.msPerFrame -1;
		}
	}
	
	draw(gl, shaders, indexTex=0)
	{
		this.model.draw(gl, shaders, this.custom_texture, this.ms / this.msPerFrame, indexTex);
	}
}

