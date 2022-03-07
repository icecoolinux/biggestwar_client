

class Pantalla2D
{
	constructor(ctx)
	{
		this.fontSize = 16;
	}
}

Pantalla2D.init = function(ctx)
{
	this.fontSize = Math.ceil(Config.FONT_HEIGHT * ctx.canvas.height);
	ctx.font = this.fontSize+"px Arial, sans-serif";
}


Pantalla2D.setFontSize = function(ctx, size)
{
	this.fontSize = size;
	ctx.font = this.fontSize+"px Arial, sans-serif";
}
Pantalla2D.getFontSize = function()
{
	return this.fontSize;
}

Pantalla2D.clear = function(ctx)
{
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

Pantalla2D.drawText = function(ctx, text, x, y, color="green", withDepth=false)
{
	var alto = ctx.canvas.height;
	for(var i=0; i<text.length; i++)
	{
		if(withDepth)
		{
			ctx.fillStyle = "black";
			ctx.fillText(text[i], x+1, alto -y +1 +i*this.fontSize*1.2);
		}
		
		if(Array.isArray(color))
			ctx.fillStyle = color[i];
		else
			ctx.fillStyle = color;
		ctx.fillText(text[i], x, alto -y +i*this.fontSize*1.2);
	}
	
	//ctx.strokeStyle = "black";
	//ctx.strokeText(text, x, y);
}

Pantalla2D.dimText = function(ctx, text, dim)
{
	dim.x = 0;
	dim.y = 0;
	dim.lineHeight = this.fontSize*1.2;
	
	if(Array.isArray(text))
	{
		for(var i=0; i<text.length; i++)
		{
			var width = ctx.measureText(text[i]).width;
			if(width > dim.x)
				dim.x = width;
			dim.y += this.fontSize*1.2;
		}
	}
	else
	{
		dim.x = ctx.measureText(text).width;
		dim.y = this.fontSize;
	}
}

Pantalla2D.drawPoint = function(ctx, p, color)
{
	ctx.fillStyle = color;
	ctx.fillRect(p.x, p.y, 3,3);
	
	
	//ctx.strokeStyle = "black";
	//ctx.strokeText(text, x, y);
}

Pantalla2D.drawLines = function(ctx, points, color)
{
	var alto = ctx.canvas.height;
	
	ctx.strokeStyle = color;
	
	ctx.beginPath();
	ctx.moveTo(points[0].x, alto-points[0].y);
	for(var i=1; i<points.length; i++)
		ctx.lineTo(points[i].x, alto-points[i].y);
	ctx.stroke();

	
	//ctx.strokeStyle = "black";
	//ctx.strokeText(text, x, y);
}

Pantalla2D.drawRect = function(ctx, pos, dim, img, color, posImg=null, dimImg=null)
{
	var alto = ctx.canvas.height;
	
	if(color != null)
	{
		if(Array.isArray(color))
			ctx.fillStyle = "rgba("+color[0]+","+color[1]+","+color[2]+","+color[3]+")";
		else
			ctx.fillStyle = color;
	}
	 
	if(img != null)
	{
		if(color != null)
			ctx.globalAlpha = color[3];
		
		if(posImg != null)
			ctx.drawImage(img, posImg.x, posImg.y, dimImg.x, dimImg.y, pos.x, alto-pos.y, dim.x, -dim.y);
		else
			ctx.drawImage(img, pos.x, alto-pos.y, dim.x, -dim.y);
		
		if(color != null)
			ctx.globalAlpha = 1;
	}
	else
		ctx.fillRect(pos.x, alto-pos.y, dim.x, -dim.y);
}






