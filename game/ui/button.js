
class Button
{
	constructor(gl, pos, dim)
	{
		this.whiteColor = [255, 255, 255, 1.0];
		
		this.pressed = false;
		
		this.gl = gl;
		this.pos = pos;
		this.dim = dim;
		
		this.img = null;
		this.pressedImg = null;
		this.posImg = null;
		this.dimImg = null;
		
		this.text = null;
		this.posText = {x:0,y:0};
		this.fontText = -1;
		this.colorText = "#FFFFFFFF";
		
		this.diluyendo = -1;
		this.dimDil = {x:0,y:0};
		this.posDil = {x:0,y:0};
		
		this.tsMouseUpStart = 0;
		this.posRectInfo = {x:0, y:0};
		this.posInfo = {x:0, y:0};
		this.dimInfo = {x:0, y:0};
		this.dimText = {x:0, y:0, lineHeight:1};
		this.borde = 2;
		this.info = null;
	}
	
	setInfo(ctx2D, info)
	{
		this.info = info;
		if(info != null)
		{
			Pantalla2D.dimText(ctx2D, this.info, this.dimText);
			
			if(Array.isArray(info) && info.length > 1)
				this.posInfo.y += this.dimText.y - this.dimText.lineHeight;

			this.borde = this.dimText.lineHeight / 4;
			this.dimInfo.x = this.dimText.x + this.borde * 2;
			this.dimInfo.y = this.dimText.y + this.borde * 2;
		}
	}
	
	setPressed(pressed)
	{
		this.pressed = pressed;
		
		if(pressed)
			this.startDiluyendo();
	}
	
	setText(ctx2D, text, font=-1, color="#FFFFFFFF")
	{
		this.text = [text];
		if(font > 0)
			this.fontText = font;
		this.colorText = color;
		
		var currentFontSize;
		if(this.fontText > 0)
		{
			currentFontSize = Pantalla2D.getFontSize();
			Pantalla2D.setFontSize(ctx2D, this.fontText);
		}
		
		Pantalla2D.dimText(ctx2D, text, this.posText);
		this.posText.x = this.pos.x + this.dim.x/2 - this.posText.x/2;
		this.posText.y = this.pos.y + this.dim.y/2 - this.posText.y/2;
		
		if(this.fontText > 0)
			Pantalla2D.setFontSize(ctx2D, currentFontSize);
	}
	
	setImg(img, pos, dim, pressedImg=null)
	{
		this.img = img;
		this.pressedImg = pressedImg;
		this.posImg = pos;
		this.dimImg = dim;
	}
	
	mouseMove(x,y)
	{
		this.posRectInfo.x = x;
		this.posRectInfo.y = y;
		
		// It's out of the screen
		if( (x+this.dimInfo.x) > this.gl.canvas.width)
			this.posRectInfo.x -= this.dimInfo.x;
		if( (y+this.dimInfo.y) > this.gl.canvas.height)
			this.posRectInfo.y -= this.dimInfo.y;
		
		if(x >= this.pos.x && x <= (this.pos.x+this.dim.x) && y >= this.pos.y && y <= (this.pos.y+this.dim.y))
		{
			this.posInfo.x = this.posRectInfo.x + this.borde;
			this.posInfo.y = this.posRectInfo.y + 2*this.borde;
			
			if(this.info != null && Array.isArray(this.info) && this.info.length > 1)
				this.posInfo.y += this.dimText.y - this.dimText.lineHeight;
			
			if(this.tsMouseUpStart == 0)
				this.tsMouseUpStart = Date.now();
		}
		else
			this.tsMouseUpStart = 0;
	}
	
	click(x, y)
	{
		if( x >= this.pos.x && x <= (this.pos.x+this.dim.x) && y >= this.pos.y && y <= (this.pos.y+this.dim.y) )
		{
			this.startDiluyendo();
			return true;
		}
		else
			return false;
	}
	
	update(ms)
	{
		if(this.diluyendo >= 0)
		{
			var delta = Button.VEL_DILUYENDO * ms;
			this.diluyendo += delta;
			
			if(this.diluyendo > 1.0)
			{
				this.diluyendo = -1;
			}
			else
			{
				this.dimDil.x += delta*0.5 * this.dim.x;
				this.dimDil.y += delta*0.5 * this.dim.y;
				this.posDil.x -= delta*0.25 * this.dim.x;
				this.posDil.y -= delta*0.25 * this.dim.y;
			}
		}
	}
	
	draw(ctx2D, back)
	{
		if(back)
		{
			if(this.pressed && this.pressedImg != null)
				Pantalla2D.drawRect(ctx2D, this.pos, this.dim, this.pressedImg, null, this.posImg, this.dimImg);
			else
				Pantalla2D.drawRect(ctx2D, this.pos, this.dim, this.img, null, this.posImg, this.dimImg);
			
			if(this.text != null)
			{
				var currentFontSize;
				if(this.fontText > 0)
				{
					currentFontSize = Pantalla2D.getFontSize();
					Pantalla2D.setFontSize(ctx2D, this.fontText);
				}
				
				Pantalla2D.drawText(ctx2D, this.text, this.posText.x, this.posText.y, this.colorText, true);
				
				if(this.fontText > 0)
					Pantalla2D.setFontSize(ctx2D, currentFontSize);
			}
		}
		else
		{
			if(this.info != null && this.tsMouseUpStart > 0 && (Date.now()-this.tsMouseUpStart) > 600 )
			{
				Pantalla2D.drawRect(ctx2D, this.posRectInfo, this.dimInfo, null, "white");
				Pantalla2D.drawText(ctx2D, this.info, this.posInfo.x, this.posInfo.y);
			}
			
			if(this.diluyendo > 0)
			{
				this.whiteColor[3] = 1.0 - this.diluyendo;
				Pantalla2D.drawRect(ctx2D, this.posDil, this.dimDil, this.img, this.whiteColor, this.posImg, this.dimImg);
			}
		}
	}
	
	startDiluyendo()
	{
		this.diluyendo = 0;
			
		this.dimDil.x = this.dim.x;
		this.dimDil.y = this.dim.y;
		this.posDil.x = this.pos.x;
		this.posDil.y = this.pos.y;
	}
}

Button.VEL_DILUYENDO = 0.003;


