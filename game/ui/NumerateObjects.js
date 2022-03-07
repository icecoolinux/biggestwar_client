
class NumerateObjects
{
	constructor(gl, shaders, ctx2D, camera, control)
	{
		this.gl = gl;
		this.shaders = shaders;
		this.ctx2D = ctx2D;
		this.camera = camera;
		this.control = control;
		
		this.numberLastSelect = -1;
		this.tsLastSelect = 0;
		
		this.asignations = [];
		for(var i=0; i<10; i++)
			this.asignations.push(null);
		
		this.theresGoToSelectionUpdate = false;
		this.tsLastGoSelection = -1;
		this.posCameraOnGoSelection = {x:0,y:0};
		this.posCenterOnGoSelection = {x:0,y:0};
		this.selectionIdsOnGoSelection = [];
	}
	
	update(ms)
	{
		// I must to update the selection's position
		if(this.theresGoToSelectionUpdate)
		{
			// Changed the selection, cancel
			var selectionChanged = this.control.selection.length != this.selectionIdsOnGoSelection.length || this.selectionIdsOnGoSelection.length == 0;
			if(!selectionChanged)
			{
				for(var i=0; i<this.selectionIdsOnGoSelection.length; i++)
				{
					var itis = false;
					for(var j=0; j<this.control.selection.length; j++)
					{
						if(this.selectionIdsOnGoSelection[i] == this.control.selection[j].id)
						{
							itis = true;
							break;
						}
					}
					if(! itis)
					{
						selectionChanged = true;
						break;
					}
				}
			}
			if(selectionChanged)
				this.theresGoToSelectionUpdate = false;
			
			// The user moved the camera, cancel.
			else if(Geom.dist(this.posCameraOnGoSelection, this.camera) > 1.0)
				this.theresGoToSelectionUpdate = false;
			
			// It was time a long, cancel.
			else if( (Date.now() - this.tsLastGoSelection) > 1000)
				this.theresGoToSelectionUpdate = false;
			
			else
			{
				var updatedCenter = {x:0, y:0};
				this.getCenterOfSelection(this.control.selection, updatedCenter)
				
				// The selection's center moved
				if(Geom.dist(this.posCenterOnGoSelection, updatedCenter) > 1.0)
				{
					// Calculate the offset center by the bar.
					var offsetBar = this.getOffsetGoodCenter();

					this.camera.move(updatedCenter.x - this.camera.x, updatedCenter.y - this.camera.y -offsetBar, 0);
					this.theresGoToSelectionUpdate = false;
				}
			}
		}
	}
	
	
	// A number is pressed
	select(number)
	{
		if(this.asignations[number] != null)
		{
			this.control.selection = [].concat(this.asignations[number]);
			
			// Quick double selection go to middle selection
			if(this.numberLastSelect == number && ((Date.now()-this.tsLastSelect) < 800) )
			{
				// Set to update selection's position to later.
				this.theresGoToSelectionUpdate = true;
				this.tsLastGoSelection = Date.now();
				this.selectionIdsOnGoSelection = [];
				for(var i=0; i<this.control.selection.length; i++)
					this.selectionIdsOnGoSelection.push(this.control.selection[i].id);
				
				// Get center position
				this.getCenterOfSelection(this.control.selection, this.posCenterOnGoSelection)
				
				// Calculate the offset center by the bar.
				var offsetBar = this.getOffsetGoodCenter();

				this.camera.move(this.posCenterOnGoSelection.x - this.camera.x, this.posCenterOnGoSelection.y - this.camera.y -offsetBar, 0);
				
				// Set camera position here.
				this.posCameraOnGoSelection.x = this.camera.x;
				this.posCameraOnGoSelection.y = this.camera.y;
			}
			this.numberLastSelect = number;
			this.tsLastSelect = Date.now();
		}
	}
	
	// A number is pressed with Ctrl key
	setSelection(number)
	{
		this.asignations[number] = [].concat(this.control.selection);
		
		if(this.asignations[number].length == 0)
			this.asignations[number] = null;
	}
	
	// An object is destroyed
	destroyObject(id)
	{
		for(var i=0; i<this.asignations.length; i++)
		{
			if(this.asignations[i] != null)
			{
				for(var j=0; j<this.asignations[i].length; j++)
				{
					if(this.asignations[i][j].id == id)
					{
						this.asignations[i].splice(j, 1);
						
						if(this.asignations[i].length == 0)
							this.asignations[i] = null;
							
						return;
					}
				}
			}
		}
	}
	
	setVisibleObject(obj)
	{
		// Update object reference
		for(var i=0; i<this.asignations.length; i++)
		{
			if(this.asignations[i] != null)
			{
				for(var j=0; j<this.asignations[i].length; j++)
				{
					if(this.asignations[i][j].id == obj.id && this.asignations[i][j] != obj)
					{
						this.asignations[i][j] = obj;
						return;
					}
				}
			}
		}
	}
	
	draw()
	{
	}
	
	
	getCenterOfSelection(selection, center)
	{
		center.x = 0;
		center.y = 0;
		for(var i=0; i<selection.length; i++)
		{
			center.x += selection[i].pos.x;
			center.y += selection[i].pos.y;
		}
		center.x /= selection.length;
		center.y /= selection.length;
	}
	
	// Calculate the offset center by the bar.
	getOffsetGoodCenter()
	{
		var pos1Tmp = Colision.pantallaToTerrain(this.gl, this.shaders, 0, 0);
		var pos2Tmp = Colision.pantallaToTerrain(this.gl, this.shaders, 0, UI.DIM_INFO.y/2);
		return pos2Tmp.y - pos1Tmp.y;
	}
}
