
class Hub
{
	constructor(ctx, players)
	{
		this.ctx = ctx;
		this.players = players;
		this.posTmp = {x:0,y:0};
		
		this.ticks = 0;
		this.ticksShowing = 1;
		this.msAcumulado = 0;
	}

	update(ms)
	{
		this.msAcumulado += ms;
		this.ticks ++;
		
		if(this.msAcumulado >= 500)
		{
			this.ticksShowing = this.ticks * 2;
			this.ticks = 0;
			this.msAcumulado -= 500;
		}
	}
	
	draw(camera, area)
	{
		var info = [];
		info.push("X:"+Math.floor(camera.x)+", Y:"+Math.floor(camera.y));
		info.push("FPS: "+this.ticksShowing);
		Pantalla2D.dimText(this.ctx, info, this.posTmp);
		Pantalla2D.drawText(this.ctx, info, this.ctx.canvas.width -this.posTmp.x -20, this.ctx.canvas.height-30, "#00cc00", true);
		
		var me = this.players.get(null);
		if(me != null)
		{
			info = [];
			var colors = [];
			
			// Minerals and Oil
			info.push("Mineral: "+me.minerals);
			colors.push("#00cc00");
			info.push("Oil: "+me.oil);
			colors.push("#00cc00");
			info.push("");
			colors.push("#00cc00");
			
			// Buildings and units.
			info.push("Buildings: "+me.buildings.length);
			colors.push("#00cc00");
			info.push("Units: "+me.units.length);
			colors.push("#00cc00");
			info.push("");
			colors.push("#00cc00");
			
			// Equips and players
			for(var i=0; i<this.players.getEquips(); i++)
			{
				var count = this.players.getCountPlayersByEquip(i);
				if(i == me.equip)
				{
					info.push("Equip "+i+": "+count+" players (aliades)");
					//colors.push("#004DFF");
					colors.push("#00cc00");
				}
				else
				{
					info.push("Equip "+i+": "+count+" players");
					//colors.push("#aa0000");
					colors.push("#00cc00");
				}
			}
			Pantalla2D.drawText(this.ctx, info, 20, this.ctx.canvas.height -30, colors, true);
		}
		
		info = [];
		if(area.isClosing())
			info.push("Closing...");
		else
			info.push( parseInt((area.getTsToClose()-Date.now())/1000) + " seconds left to close");
		Pantalla2D.dimText(this.ctx, info, this.posTmp);
		Pantalla2D.drawText(this.ctx, info, this.ctx.canvas.width/2 -this.posTmp.x/2, this.ctx.canvas.height -30, "#00cc00", true);
	}
}
