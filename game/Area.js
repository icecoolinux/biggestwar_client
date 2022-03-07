
class Area
{
	constructor()
	{
		this.startToClose = false;
		this.closing = false;
		this.tsToClose = -1;
		this.futureCenter = {x:Config.METROS_LADO_MAPA/2, y:Config.METROS_LADO_MAPA/2};
		this.currentBottom = 0;
		this.currentTop = Config.METROS_LADO_MAPA;
		this.currentLeft = 0;
		this.currentRight = Config.METROS_LADO_MAPA;
		this.futureBottom = 0;
		this.futureTop = Config.METROS_LADO_MAPA;
		this.futureLeft = 0;
		this.futureRight = Config.METROS_LADO_MAPA;
		this.speedBottom = 0;
		this.speedTop = Config.METROS_LADO_MAPA;
		this.speedLeft = 0;
		this.speedRight = Config.METROS_LADO_MAPA;
		
		this.continueBottom = this.currentBottom;
		this.continueTop = this.currentTop;
		this.continueRight = this.currentRight;
		this.continueLeft = this.currentLeft;
	}
	
	set(closing_, msToClose_, futureCenterX_, futureCenterY_,
		currentBottom_, currentTop_, currentLeft_, currentRight_, 
		futureBottom_, futureTop_, futureLeft_, futureRight_,
		speedBottom_, speedTop_, speedLeft_, speedRight_)
	{
		if(closing_)
			this.startToClose = true;
		this.closing = closing_;
		this.tsToClose = Date.now() + msToClose_;
		this.futureCenter.x = futureCenterX_;
		this.futureCenter.y = futureCenterY_;
		this.currentBottom = currentBottom_;
		this.currentTop = currentTop_;
		this.currentLeft = currentLeft_;
		this.currentRight = currentRight_;
		this.futureBottom = futureBottom_;
		this.futureTop = futureTop_;
		this.futureLeft = futureLeft_;
		this.futureRight = futureRight_;
		this.speedBottom = speedBottom_;
		this.speedTop = speedTop_;
		this.speedLeft = speedLeft_;
		this.speedRight = speedRight_;
		
		this.continueBottom = this.currentBottom;
		this.continueTop = this.currentTop;
		this.continueRight = this.currentRight;
		this.continueLeft = this.currentLeft;
	}
	
	isStartToClose()
	{
		return this.startToClose;
	}
	isClosing()
	{
		return this.closing;
	}
	getTsToClose()
	{
		return this.tsToClose;
	}
	getFutureCenter()
	{
		return this.futureCenter;
	}
	getCurrentBottom()
	{
		return this.continueBottom;
		//return this.currentBottom;
	}
	getCurrentTop()
	{
		return this.continueTop;
		//return this.currentTop;
	}
	getCurrentLeft()
	{
		return this.continueLeft;
		//return this.currentLeft;
	}
	getCurrentRight()
	{
		return this.continueRight;
		//return this.currentRight;
	}
	getFutureBottom()
	{
		return this.futureBottom;
	}
	getFutureTop()
	{
		return this.futureTop;
	}
	getFutureLeft()
	{
		return this.futureLeft;
	}
	getFutureRight()
	{
		return this.futureRight;
	}
	getSpeedBottom()
	{
		return this.speedBottom;
	}
	getSpeedTop()
	{
		return this.speedTop;
	}
	getSpeedLeft()
	{
		return this.speedLeft;
	}
	getSpeedRight()
	{
		return this.speedRight;
	}
	
	update(ms)
	{
		if(this.closing)
		{
			this.continueBottom += this.speedBottom * (ms/1000.0);
			this.continueTop += this.speedTop * (ms/1000.0);
			this.continueRight += this.speedRight * (ms/1000.0);
			this.continueLeft += this.speedLeft * (ms/1000.0);
		}

	}
}
