function x_Frame(param){
	var object=document.createElement('div');
        object.style.display='block';
		object.style.width='100%';
		object.style.height='100%';
		object.style.overflow='hidden';
		object.style.minWidth='500px';
		object.style.minHeight='200px';
		object.style.border='0px solid red';
		system.setBoxType(object,'in');

		object.data=new Object();
		var boss=object;

		object.data.content=new Array();


		function isEmpty(map) { 
			for(var key in map) { 
				return false; 
			} 
			return true; 
		} 

		var tab=document.createElement('table');
		tab.border='0';
		tab.style.width='100%';
		tab.style.height='100%';
		tab.style.backgroundColor='white';
		tab.style.borderCollapse='collapse';
		tab.cellPadding='0';
		tab.cellSpacing='0';
		tab.style.tableLayout='fixed';
		
		var content=0;
		var maxRows=param.length;
		
		var order=0;
		
		for(var i=0;i<maxRows;i++){
			var newRow=tab.insertRow(-1);
			var maxCells=param[i].length;
			
			for(var j=0;j<maxCells;j++){
				content++;
				var item=param[i][j];
					
				if (item.xSpan){
					var newCell=newRow.insertCell(-1);
					newCell.colSpan=item.xSpan*2-1;
					newCell.rowSpan=item.ySpan*2-1;
					param[i][j].cell=newCell;
					
					if (param[i][j].width){newCell.style.width=param[i][j].width;}
					if (param[i][j].height){newCell.style.height=param[i][j].height;}
					
					newCell.innerHTML="<div style='width:100%;height:100%;overflow:hidden;position:relative;backgroundColor:green;'></div>";
					object.data.content[content]=system.getChildNode(newCell,1);
					
					order++;

					var t=0;
					while (t<param[i][j].xSpan){
						param[i][j+t].order=order;
						t++;
					}

					var t=0;
					while (t<param[i][j].ySpan){
						param[i+t][j].order=order;
						t++;
					}
				}
			}
			
			var newRow=tab.insertRow(-1);			
		}

		//ADD resize row
		
		for(var i=0;i<=maxRows-1;i++){
			var currentCell=null;
			for(j=0;j<maxCells;j++){
				
				if (param[i][j].cell){
					currentCell=param[i][j].cell;

					if (j==0){
						if (currentCell.parentNode.nextSibling){
							var resizeRow=currentCell.parentNode.nextSibling;
						}
					}
				}
				
				if ((i+1<maxRows)&&(param[i][j].order!=param[i+1][j].order)){
					newCell=resizeRow.insertCell(-1);
					newCell.active=1;
					newCell.style.borderTop='1px solid gray';
					newCell.style.borderBottom='1px solid gray';
					newCell.style.backgroundColor='#e6e6e6';
					newCell.style.height='5px';
					newCell.style.cursor='s-resize';
				}
				
				if (((j+1)<maxCells) && (param[i][j].order!=param[i][j+1].order)){
					var newCell=currentCell.parentNode.insertCell(currentCell.cellIndex+1);
					newCell.active=1;
					newCell.style.borderLeft='1px solid gray';
					newCell.style.borderRight='1px solid gray';
					newCell.style.backgroundColor='#e6e6e6';
					newCell.style.width='5px';
					newCell.style.cursor='w-resize';
					
					if (i+1<maxRows){
						newCell=resizeRow.insertCell(-1);
						newCell.active=1;
						newCell.style.backgroundColor='#e6e6e6';
						newCell.style.height='5px';
						newCell.style.cursor='move';
						
						if ((param[i][j+1])&&(param[i][j].order==param[i][j+1].order)){
							newCell.style.borderTop='1px solid gray';
						}
						if ((param[i][j+1])&&(param[i+1][j+1])&&(param[i][j+1].order==param[i+1][j+1].order)){
							newCell.style.borderRight='1px solid gray';
						}
						if ((param[i+1][j])&&(param[i+1][j+1])&&(param[i+1][j+1].order==param[i+1][j].order)){
							newCell.style.borderBottom='1px solid gray';
						}
						if ((param[i+1][j])&&(param[i][j].order==param[i+1][j].order)){
							newCell.style.borderLeft='1px solid gray';
						}
						
					}
				}
			}
		}
	
		object.appendChild(tab);

	return object;
}




//SCROLLBARS
function x_Scrollbar(param){
	var baseColor='#94bed4';
	var colors=new Object();
	colors.baseColor='#555555';
	colors.backColor='transparent';
	colors.borderColor=system.setColorHSVA(baseColor,0,0,-50,0,'HEX');
	
	var object=document.createElement('div');
    object.style.display='block';
	object.style.overflow='hidden';
	system.setBoxType(object,'in');
	
	object.data=new Object();
	object.data.bindObject=param.link;
	
	var local=new Object();
	local.timerId=null;
	local.timerMaxTime=1500;
	local.animating=false;
	local.cancelAnimation=null;
	local.show=false;
	local.currentAlpha=50;
	
	var boss=object;

	if (param.type=='vertical'){
		object.innerHTML="<div style='width:100%;height:100%;position:relative;overflow:hidden;'>\
			<div style='position:absolute;width:100%;height:100%;background-color:"+colors.backColor+";'></div>\
			<div style='position:absolute;top:"+param.drag.top+";width:100%;height:0px;background-color:"+colors.baseColor+";'></div>\
		</div>";
		
		object.scrollTrack=system.getChildNode(object,'1:1');
		object.scrollButton=system.getChildNode(object,'1:2');
		object.scrollButton.startX=0;
		object.scrollButton.startY=0;

		system.setAlpha(object.scrollButton,50);
		system.setCornerRadius(object.scrollTrack,5,5,5,5);
		system.setCornerRadius(object.scrollButton,5,5,5,5);

		object.scrollButton.onmousedown=function(e){
			var event=e? e : window.event;
			boss.scrollButton.startX=parseInt(this.style.left);
			boss.scrollButton.startY=parseInt(this.style.top);
			//this.style.backgroundColor=colors.backColor;
			
			refreshPosition=function(x,y){
				if (local.timerID!=null){
					clearTimeout(local.timerId);
					local.timerId=null;
					
				}

				var newY=boss.scrollButton.startY+y;
				if (newY<0){ newY=0; }
				var track=parseInt(boss.offsetHeight)-parseInt(boss.scrollButton.offsetHeight);
				if (newY>track){
					newY=track;
				}
				boss.scrollButton.style.top=newY+'px';
				var bindObjectTotal=boss.data.bindObject.scrollHeight-boss.data.bindObject.offsetHeight;
				boss.data.bindObject.scrollTop=Math.ceil(newY*bindObjectTotal/track);
				return true;
			}
			
			system.startMoveAction(event,this,boss,refreshPosition,null,1);
		}

		object.scrollTrack.onmousedown=function(e){
			var event=e?e:window.event;
			var target=event.target? event.target : event.srcElement;
			if (target===event.currentTarget){
				var newY=system.getMouseXYRelativeTo(event,event.currentTarget)[1]-Math.round(parseInt(boss.scrollButton.offsetHeight)/2);
				if (newY<0){ newY=0; }
				var track=parseInt(boss.offsetHeight)-parseInt(boss.scrollButton.offsetHeight);
				if (newY>track){ newY=track; }

				boss.scrollButton.style.top=newY+'px';
				var bindObjectTotal=boss.data.bindObject.scrollHeight-boss.data.bindObject.offsetHeight;
				boss.data.bindObject.scrollTop=Math.ceil(newY*bindObjectTotal/track);
				boss.scrollButton.onmousedown(event);
			}
		}

		object.repaint=function(){
			this.data.bindObject.scrollHeight;
			this.data.bindObject.offsetHeight;
			if ((this.data.bindObject.scrollHeight)<=(this.data.bindObject.offsetHeight)){
				boss.hide(true);
			}else{
				boss.show(true);
				
				var newDragSize=parseInt(this.offsetHeight*this.offsetHeight/this.data.bindObject.scrollHeight);
				if (newDragSize<10){
					newDragSize=10;
				}
				this.scrollButton.style.height=newDragSize+'px';
					
				var bindObjectTotal=this.data.bindObject.scrollHeight-this.data.bindObject.offsetHeight;
				var track=parseInt(this.offsetHeight)-parseInt(this.scrollButton.offsetHeight);
				var newY=Math.ceil(this.data.bindObject.scrollTop*track/bindObjectTotal);
				if (newY>track){
					newY=track;
				}
				this.scrollButton.style.top=newY+'px';
			}
		}
		
		object.data.bindObject.bindObjectVertical=object;
	}else{
		object.innerHTML="<div style='width:100%;height:100%;position:relative;overflow:hidden;'>\
			<div style='position:absolute;width:100%;height:100%;background-color:#f2f2f2;'></div>\
			<div style='position:absolute;left:"+param.drag.top+";height:100%;width:0px;background-color:"+colors.baseColor+";'></div>\
		</div>";
		
		object.scrollTrack=system.getChildNode(object,'1:1');
		object.scrollButton=system.getChildNode(object,'1:2');
		object.scrollButton.startX=0;
		object.scrollButton.startY=0;

		system.setCornerRadius(object.scrollTrack,5,5,5,5);
		system.setCornerRadius(object.scrollButton,5,5,5,5);

		object.scrollButton.onmousedown=function(e){
			var event=e? e : window.event;
			boss.scrollButton.startX=parseInt(this.style.left);
			boss.scrollButton.startY=parseInt(this.style.top);
			//this.style.backgroundColor=colors.backColor;
			
			refreshPosition=function(x,y){
				var newX=boss.scrollButton.startX+x;
				if (newX<0){ newX=0; }
				var track=parseInt(boss.offsetWidth)-parseInt(boss.scrollButton.offsetWidth);
				if (newX>track){
					newX=track;
				}
				boss.scrollButton.style.left=newX+'px';
				var bindObjectTotal=boss.data.bindObject.scrollWidth-boss.data.bindObject.offsetWidth;
				boss.data.bindObject.scrollLeft=Math.ceil(newX*bindObjectTotal/track);
				return true;
			}
			
			system.startMoveAction(event,this,boss,refreshPosition,null,1);
		}

		object.scrollTrack.onmousedown=function(e){
			var event=e?e:window.event;
			var target=event.target? event.target : event.srcElement;
			if (target===event.currentTarget){
				var newX=system.getMouseXYRelativeTo(event,event.currentTarget)[0]-Math.round(parseInt(boss.scrollButton.offsetWidth)/2);
				if (newX<0){ newX=0; }
				var track=parseInt(boss.offsetWidth)-parseInt(boss.scrollButton.offsetWidth);
				if (newX>track){ newX=track; }

				boss.scrollButton.style.left=newX+'px';
				var bindObjectTotal=boss.data.bindObject.scrollHeight-boss.data.bindObject.offsetWidth;
				boss.data.bindObject.scrollLeft=Math.ceil(newX*bindObjectTotal/track);
				boss.scrollButton.onmousedown(event);
			}
		}

		object.repaint=function(){
			this.data.bindObject.scrollWidth;
			this.data.bindObject.offsetWidth;
			if ((this.data.bindObject.scrollWidth)<=(this.data.bindObject.offsetWidth)){
				boss.hide(true);
			}else{
				boss.show(true);
				
				var newDragSize=parseInt(this.offsetWidth*this.offsetWidth/this.data.bindObject.scrollWidth);
				if (newDragSize<10){
					newDragSize=10;
				}

				this.scrollButton.style.width=newDragSize+'px';
					
				var bindObjectTotal=this.data.bindObject.scrollWidth-this.data.bindObject.offsetWidth;
				var track=parseInt(this.offsetWidth)-parseInt(this.scrollButton.offsetWidth);
				var newX=Math.ceil(this.data.bindObject.scrollLeft*track/bindObjectTotal);
				if (newX>track){
					newX=track;
				}
				this.scrollButton.style.left=newX+'px';
			}
		}
		
		object.data.bindObject.bindObjectHorizontal=object;	
	}	

	var updateCurrentAlpha=function(alpha){
		local.currentAlpha=alpha;
	}

	object.show=function(insideCall){
		if (!local.show){
			local.show=true;
			if (!local.animating){
				local.cancelAnimation();
				if (local.timerID!=null){
					clearTimeout(local.timerId);
					local.timerId=null;
				}
			}
			boss.style.display='block';
			//if (!insideCall){ boss.repaint(); }
			local.animating=true;			
			var endShow=function(){
				local.animating=false;
				local.timerId=setTimeout(boss.hide,local.timerMaxTime);
			}
			local.cancelAnimation=system.animate(boss,1,20,[{type:'alpha',startAlpha:local.currentAlpha,stopAlpha:50,callback:updateCurrentAlpha}],null,endShow);
		}
    }
	
	object.hide=function(insideCall){
		if (local.show){
			local.show=false;
			if (local.animating){
				local.cancelAnimation();
			}
			//if (!insideCall){ boss.repaint(); }
			var endHide=function(){
				local.animating=false;
				boss.style.display='none';				
			}

			local.animating=true;
			local.cancelAnimation=system.animate(boss,1,20,[{type:'alpha',startAlpha:local.currentAlpha,stopAlpha:0,callback:updateCurrentAlpha}],null,endHide);
		}
    }
	
	var wheel_handler=function(e){
		var event=e? e : window.event;
		if (system.getEventWheelDelta(event)>0){
			if (event.ctrlKey){
				this.scrollLeft-=50;
			}else{
				this.scrollTop-=50;
			}
		}else{
			if (event.ctrlKey){
				this.scrollLeft+=50;
			}else{
				this.scrollTop+=50;		
			}
		}

		boss.repaint();
		/*if (this.data.bindObjectVertical){
			this.data.bindObjectVertical.repaint();
		}
		if (this.data.bindObjectHorizontal){
			this.data.bindObjectHorizontal.repaint();
		}*/
	}

	system.addEvent(object.data.bindObject,'mouseWheel',wheel_handler);
	system.setAlpha(object,0);
	
    return object;
}