
class MiniMap
{
	constructor(gl, camera)
	{
		this.EDGE_POSITION_PERCENTAGE_TO_UPDATE_MINIMAP = 0.4;
		this.tsUpdateNewPosition = 0;
		
		this.gl = gl;
		this.camera = camera;
		
		this.fullscreen = false;
		this.zoom = 1;
		this.posTextZoom = {x:0, y:0};
		this.zoomText = [this.zoom+"x"];
		this.moving = false;
		this.loading = false;
		
		// Minimap.
		this.imgMiniMap = new Image();
		
		this.posCameraUpdated = {x: this.camera.x, y: this.camera.y};
		this.pos = {x:10, y:10};
		this.dim = {x:256, y:256};
		this.posWindow = {x:0, y:0};
		this.dimWindow = {x:Config.METROS_LADO_MAPA, y:Config.METROS_LADO_MAPA};
		 
		this.view1 = {x:0,y:0};
		this.view2 = {x:0,y:0};
		this.view3 = {x:0,y:0};
		this.view4 = {x:0,y:0};
		this.updateView();
		
		// Buttons.
		var posZoomIn = {};
		var posZoomOut = {};
		var dimZoom = {};
		dimZoom.x = 64;
		dimZoom.y = 64;
		if(this.gl.canvas.width > this.gl.canvas.height)
		{
			posZoomIn.x = this.gl.canvas.width - (this.gl.canvas.width - this.gl.canvas.height)/2;
			posZoomIn.y = this.gl.canvas.height - dimZoom.y;
			posZoomOut.x = posZoomIn.x;
			posZoomOut.y = posZoomIn.y - dimZoom.y;
		}
		else
		{
			posZoomOut.x = this.gl.canvas.width - dimZoom.x;
			posZoomOut.y = this.gl.canvas.height - (this.gl.canvas.height - this.gl.canvas.width)/2;
			posZoomIn.x = posZoomOut.x - dimZoom.x;
			posZoomIn.y = posZoomOut.y;
		}
		this.imgIcons = Textures.getCanvas("icons");
		this.imgIconsClicked = Textures.getCanvas("icons_clicked");
		this.zoomIn = new Button(gl, posZoomIn, dimZoom);
		this.zoomIn.setImg(this.imgIcons, {x:0, y:0}, {x:64, y:64}, this.imgIconsClicked);
		this.zoomOut = new Button(gl,posZoomOut, dimZoom);
		this.zoomOut.setImg(this.imgIcons, {x:64, y:0}, {x:64, y:64}, this.imgIconsClicked);
		
		// Temporal variables.
		this.pos_ = {x:0, y:0};
		this.dim_ = {x:0, y:0};
	}
	
	setFullscreen(enable)
	{
		this.fullscreen = enable;

		this.sendSettingNet();
			
		if(enable)
		{
			if(this.gl.canvas.width > this.gl.canvas.height)
			{
				this.dim.x = this.gl.canvas.height;
				this.dim.y = this.gl.canvas.height;
				this.pos.x = (this.gl.canvas.width - this.gl.canvas.height)/2;
				this.pos.y = 0;
			}
			else
			{
				this.dim.x = this.gl.canvas.width;
				this.dim.y = this.gl.canvas.width;
				this.pos.x = 0;
				this.pos.y = (this.gl.canvas.height - this.gl.canvas.width)/2;
			}
		}
		else
		{
			this.pos.x = 10;
			this.pos.y = 10;
			this.dim.x = 256;
			this.dim.y = 256;
			
			this.moving = false;
		}
		
		this.updateView();
	}
	
	isFullscreen()
	{
		return this.fullscreen;
	}
	
	doZoomIn()
	{
		if(this.zoom < 3)
		{
			this.zoom++;
			this.setZoom();
			this.sendSettingNet();
			this.zoomText = [this.zoom+"x"];
		}
	}
	
	doZoomOut()
	{
		if(this.zoom > 1)
		{
			this.zoom--;
			this.setZoom();
			this.sendSettingNet();
			this.zoomText = [this.zoom+"x"];
		}
	}
	
	setImg(img)
	{
		var mm = this;
		
		var blob = new Blob([img.buffer]);
		
		var reader = new FileReader();
		reader.onload = function(e) 
		{
			mm.imgMiniMap.onload = function(e)
				{
					mm.loading = false;
				};
			mm.imgMiniMap.src = e.target.result;
		};
		reader.readAsDataURL(blob);
	}
	
	updateView()
	{
		// Transform camera position to minimap position with zoom.
		var x = (this.camera.x-this.posWindow.x)/Config.METROS_LADO_MAPA;
		var y = (this.camera.y-this.posWindow.y)/Config.METROS_LADO_MAPA;
		x *= Math.pow(2,this.zoom-1);
		y *= Math.pow(2,this.zoom-1);
		
		// Transform minimap position to ui position.
		x = x * this.dim.x + this.pos.x;
		y = y * this.dim.y + this.pos.y;
		
		var widthMap = (Config.ANCHO_PROJECTION*0.5)/Config.METROS_LADO_MAPA * this.dim.x;
		
		// Apply zoom.
		widthMap *= Math.pow(2,this.zoom-1);

		this.view1.x = x-widthMap;
		this.view1.y = y+widthMap;
			
		this.view2.x = x+widthMap;
		this.view2.y = y+widthMap;
			
		this.view3.x = x+widthMap;
		this.view3.y = y-widthMap;
			
		this.view4.x = x-widthMap;
		this.view4.y = y-widthMap;
		
		this.posCameraUpdated.x = this.camera.x;
		this.posCameraUpdated.y = this.camera.y;
	}
	
	setZoom()
	{
		this.calculatePosDimWorld(this.posWindow, this.dimWindow);
		this.updateView();
	}
	
	moveMouse(x,y)
	{
		if(this.moving)
			this.moveCameraFromUIPosition(x, y);
	}
	
	click(x, y, down)
	{
		if(down)
		{
			// Is zoom?
			if(this.zoomIn.click(x, y))
			{
				this.doZoomIn();
				return true;
			}
			else if(this.zoomOut.click(x, y))
			{
				this.doZoomOut();
				return true;
			}
			else
			{
				if(this.moveCameraFromUIPosition(x, y))
				{
					this.moving = true;
					return true;
				}
			}
		}
		else
			this.moving = false;

		return false;
	}
	
	// Calcula la posicion y dimension en coordenadas de mundo.
	calculatePosDimWorld(posRet, dimRet)
	{
		dimRet.x = Config.METROS_LADO_MAPA;
		dimRet.y = Config.METROS_LADO_MAPA;
		
		for(var i=1; i<this.zoom; i++)
		{
			dimRet.x = Math.floor(dimRet.x / 2);
			dimRet.y = Math.floor(dimRet.y / 2);
		}
		
		posRet.x = this.camera.x - dimRet.x/2;
		posRet.y = this.camera.y - dimRet.y/2;
		
		if(posRet.x < 0)
			posRet.x = 0;
		if(posRet.y < 0)
			posRet.y = 0;
		if( (posRet.x+dimRet.x) >= Config.METROS_LADO_MAPA)
			posRet.x = Config.METROS_LADO_MAPA - dimRet.x;
		if( (posRet.y+dimRet.y) >= Config.METROS_LADO_MAPA)
			posRet.y = Config.METROS_LADO_MAPA - dimRet.y;
	}
	
	moveCameraFromUIPosition(x, y)
	{
		if( (x-this.pos.x) < 0)
			x = this.pos.x;
		if( (x-this.pos.x) > this.dim.x)
			x = this.pos.x + this.dim.x;
		if( (y-this.pos.y) < 0)
			y = this.pos.y;
		if( (y-this.pos.y) > this.dim.y)
			y = this.pos.y + this.dim.y;
			
		var pMap={x:0, y:0};
		this.pointUItoMap(x, y, pMap);
		
		if( pMap.x >= 0 && pMap.x <= Config.METROS_LADO_MAPA && pMap.y <= Config.METROS_LADO_MAPA && pMap.y >= 0)
		{
			this.camera.move(pMap.x-this.camera.x, pMap.y-this.camera.y, 0);
			this.updateView();
			return true;
		}
		return false;
	}
	
	// Let a position over the minimap return the world's position.
	pointUItoMap(x, y, ret)
	{
		// UI to normalize (0,1).
		x -= this.pos.x;
		y -= this.pos.y;
		x /= this.dim.x;
		y /= this.dim.y;

		// Normalize to minimap image, considering zoom.
		x *= this.dimWindow.x;
		y *= this.dimWindow.y;
		x += this.posWindow.x;
		y += this.posWindow.y;
		
		ret.x = x;
		ret.y = y;
	}
	getPosWorld(gl, shaders, x, y)
	{
		var ret = {x:0, y:0};
		this.pointUItoMap(x,y,ret);

		if(ret.x < 0 || ret.x > Config.METROS_LADO_MAPA || ret.y < 0 || ret.y > Config.METROS_LADO_MAPA)
			return null;
		
		return ret;
	}
	
	update(ms)
	{
		// Update new start minimap position
		var distLeft = this.posWindow.x +this.dimWindow.x/2 -this.camera.x;
		var distRight = this.camera.x -this.posWindow.x -this.dimWindow.x/2;
		var distBottom = this.posWindow.y +this.dimWindow.y/2 -this.camera.y;
		var distTop = this.camera.y -this.posWindow.y -this.dimWindow.y/2;
		if( (this.posWindow.x > 1 && distLeft > this.EDGE_POSITION_PERCENTAGE_TO_UPDATE_MINIMAP*this.dimWindow.x) || // Move to left
			(this.posWindow.x < (Config.METROS_LADO_MAPA-this.dimWindow.x-1) && distRight > this.EDGE_POSITION_PERCENTAGE_TO_UPDATE_MINIMAP*this.dimWindow.x) || // Move to right
			(this.posWindow.y > 1 && distBottom > this.EDGE_POSITION_PERCENTAGE_TO_UPDATE_MINIMAP*this.dimWindow.y) || // Move to bottom
			(this.posWindow.y < (Config.METROS_LADO_MAPA-this.dimWindow.y-1) && distTop > this.EDGE_POSITION_PERCENTAGE_TO_UPDATE_MINIMAP*this.dimWindow.y) ) // Move to top
		{
			this.moving = false;
			this.calculatePosDimWorld(this.posWindow, this.dimWindow);
			this.updateView();
			this.sendSettingNet();
			this.tsUpdateNewPosition = Date.now();
		}
		// Update green quad
		else if( (Math.abs(this.posCameraUpdated.x-this.camera.x) + Math.abs(this.posCameraUpdated.y-this.camera.y)) > 5)
			this.updateView();
		
		if(this.fullscreen)
		{
			this.zoomIn.update(ms);
			this.zoomOut.update(ms);
		}
	}
	
	draw(ctx2D, area)
	{
		if(this.fullscreen)
		{
			// Limpia fondo de gris.
			gl.clearColor(0.4, 0.4, 0.4, 1.0);
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.clearColor(0.0, 0.0, 0.0, 1.0);
		}

		// Draw mini map.
		Pantalla2D.drawRect(ctx2D, this.pos, this.dim, this.imgMiniMap, null);
		
		/// Draw Area
		if(area.isStartToClose())
		{
			// Draw left.
			var left = ( (area.getCurrentLeft()-this.posWindow.x) / this.dimWindow.x) * this.dim.x;
			if(left > this.dim.x)
				left = this.dim.x;
			if(left < 0)
				left = 0;
			this.pos_.x = this.pos.x;
			this.pos_.y = this.pos.y;
			this.dim_.x = left;
			this.dim_.y = this.dim.y;
			Pantalla2D.drawRect(ctx2D, this.pos_, this.dim_, null, "#FF000077");
			
			// Draw right.
			var right = ( (area.getCurrentRight()-this.posWindow.x) / this.dimWindow.x) * this.dim.x;
			if(right < 0)
				right = 0;
			if(right > this.dim.x)
				right = this.dim.x;
			this.pos_.x = this.pos.x + right;
			this.pos_.y = this.pos.y;
			this.dim_.x = this.dim.x - right;
			this.dim_.y = this.dim.y;
			Pantalla2D.drawRect(ctx2D, this.pos_, this.dim_, null, "#FF000077");
			
			// Draw bottom.
			var bottom = ( (area.getCurrentBottom()-this.posWindow.y) / this.dimWindow.y) * this.dim.y;
			if(bottom > this.dim.y)
				bottom = this.dim.y;
			if(bottom < 0)
				bottom = 0;
			this.pos_.x = this.pos.x + left;
			this.pos_.y = this.pos.y;
			this.dim_.x = right - left;
			this.dim_.y = bottom
			Pantalla2D.drawRect(ctx2D, this.pos_, this.dim_, null, "#FF000077");
			
			// Draw top.
			var top = ( (area.getCurrentTop()-this.posWindow.y) / this.dimWindow.y) * this.dim.y;
			if(top < 0)
				top = 0;
			if(top > this.dim.y)
				top = this.dim.y;
			this.pos_.x = this.pos.x + left;
			this.pos_.y = this.pos.y + top;
			this.dim_.x = right - left; 
			this.dim_.y = this.dim.y - top;
			Pantalla2D.drawRect(ctx2D, this.pos_, this.dim_, null, "#FF000077");
			
			// Draw future.
			var leftFuture = ( (area.getFutureLeft()-this.posWindow.x) / this.dimWindow.x) * this.dim.x;
			var bottomFuture = ( (area.getFutureBottom()-this.posWindow.y) / this.dimWindow.y) * this.dim.y;
			var rightFuture = ( (area.getFutureRight()-this.posWindow.x) / this.dimWindow.x) * this.dim.x;
			var topFuture = ( (area.getFutureTop()-this.posWindow.y) / this.dimWindow.y) * this.dim.y;
			
			var leftBottom_ = {x:leftFuture+this.pos.x, y:bottomFuture+this.pos.y};
			if(leftBottom_.x < this.pos.x)
				leftBottom_.x = this.pos.x;
			if(leftBottom_.y < this.pos.y)
				leftBottom_.y = this.pos.y;
			var rightBottom_ = {x:rightFuture+this.pos.x, y:bottomFuture+this.pos.y};
			if(rightBottom_.x > (this.pos.x+this.dim.x) )
				rightBottom_.x = this.pos.x+this.dim.x;
			if(rightBottom_.y < this.pos.y)
				rightBottom_.y = this.pos.y;
			var rightTop_ = {x:rightFuture+this.pos.x, y:topFuture+this.pos.y};
			if(rightTop_.x > (this.pos.x+this.dim.x) )
				rightTop_.x = this.pos.x+this.dim.x;
			if(rightTop_.y > (this.pos.y+this.dim.y) )
				rightTop_.y = this.pos.y+this.dim.y;
			var leftTop_ = {x:leftFuture+this.pos.x, y:topFuture+this.pos.y};
			if(leftTop_.x < this.pos.x)
				leftTop_.x = this.pos.x;
			if(leftTop_.y > (this.pos.y+this.dim.y) )
				leftTop_.y = this.pos.y+this.dim.y;
			if(leftFuture >= 0 && leftFuture <= this.dim.x && bottomFuture < this.dim.y && topFuture > 0)
				Pantalla2D.drawLines(ctx2D, [leftBottom_, leftTop_], "#FF00FF");
			if(bottomFuture >= 0 && bottomFuture <= this.dim.y && leftFuture < this.dim.x && rightFuture > 0)
				Pantalla2D.drawLines(ctx2D, [leftBottom_, rightBottom_], "#FF00FF");
			if(rightFuture <= this.dim.x && bottomFuture < this.dim.y && topFuture > 0)
				Pantalla2D.drawLines(ctx2D, [rightBottom_, rightTop_], "#FF00FF");
			if(topFuture <= this.dim.y && rightFuture > 0 && leftFuture < this.dim.x)
				Pantalla2D.drawLines(ctx2D, [rightTop_, leftTop_], "#FF00FF");
		}
		
		// Dibujo cuadrado
		Pantalla2D.drawLines(ctx2D, [this.view1, this.view2, this.view3, this.view4, this.view1], "#00FF00");
		
		if(this.loading)
		{
			Pantalla2D.dimText(ctx2D, [Lang.loading+"..."], this.pos_);
			this.pos_.x = this.pos.x + this.dim.x/2 - this.pos_.x/2;
			this.pos_.y = this.pos.y + this.dim.y/2 - this.pos_.y/2;
			Pantalla2D.drawText(ctx2D,  [Lang.loading+"..."], this.pos_.x, this.pos_.y, color="#00cc00");
		}
		
		// Dibujo zoom actual.
		Pantalla2D.dimText(ctx2D, this.zoomText, this.posTextZoom);
		this.posTextZoom.x = this.pos.x + this.dim.x - this.posTextZoom.x*1.5;
		this.posTextZoom.y = this.pos.y + this.dim.y - this.posTextZoom.y;
		Pantalla2D.drawText(ctx2D, this.zoomText, this.posTextZoom.x, this.posTextZoom.y, color="#ffffff99", withDepth=true);
		
		// Draw buttons.
		if(this.fullscreen)
		{
			this.zoomIn.draw(ctx2D, true);
			this.zoomOut.draw(ctx2D, true);
			this.zoomIn.draw(ctx2D, false);
			this.zoomOut.draw(ctx2D, false);
		}
	}
	
	sendSettingNet()
	{
		this.loading = true;
		if(this.fullscreen)
			document.game.net.sendMiniMapSetting(Config.MINIMAP_RES_HIGH, this.zoom, this.posWindow);
		else
			document.game.net.sendMiniMapSetting(Config.MINIMAP_RES_LOW, this.zoom, this.posWindow);
	}
}

