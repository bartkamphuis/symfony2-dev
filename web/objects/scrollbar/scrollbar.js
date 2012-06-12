/*SCROLLBAR
-------
Creates a scrollbar
CONSTRUCTOR



ATTRIBUTES
	PUBLIC
	data

	PRIVATE
	local

PUBLIC METHODS

EXAMPLE:
	var scroll=new x_Scrollbar({
		link:system.getChildNode(tab.rows[0].cells[1],'1:1'),
		width:'10px',
		height:'90%',
		type:'vertical',
		color:theme.colors.border,
		backgroundColor:theme.colors.background,
		drag:{
			size:30,
			top:0,
			bottom:0
		}
	});
*/
function x_Scrollbar(param){
	if (!param.color){param.color='gray';}
	if (!param.backgroundColor){param.backgroundColor='transparent';}
	if (!param.type){param.type='vertical';}
	if (!param.width){
		if (param.type=='horizontal'){
			param.width='10px';
		}else{
			param.width='';
		}
	}
	if (!param.height){
		if (param.type=='vertical'){
			param.height='';
		}else{
			param.height='10px';
		}
	}
	
	var baseColor=param.color;
	param.borderColor=system.setColorHSVA(baseColor,0,0,-50,0,'HEX');
	
	var object=document.createElement('div');
    object.style.display='block';
	object.style.overflow='hidden';
	object.style.width=param.width;
	object.style.height=param.height;
	system.setBoxType(object,'in');
	
	var local=new Object();
	local.animating=false;
	local.cancelAnimation=null;
	local.show=false;
	local.currentAlpha=0;
	local.maxAlpha=80;
	local.bindObject=param.link;

	if (param.type=='vertical'){
		object.innerHTML="<div style='width:100%;height:100%;position:relative;overflow:hidden;'>\
			<div style='position:absolute;width:100%;height:100%;background-color:"+param.backgroundColor+";'></div>\
			<div style='position:absolute;top:"+param.drag.top+";width:100%;height:0px;background-color:"+param.color+";'></div>\
		</div>";
		
		object.scrollTrack=system.getChildNode(object,'1:1');
		object.scrollButton=system.getChildNode(object,'1:2');
		object.scrollButton.startX=0;
		object.scrollButton.startY=0;

		system.setAlpha(object.scrollButton,100);
		system.setCornerRadius(object.scrollTrack,5,5,5,5);
		system.setCornerRadius(object.scrollButton,5,5,5,5);

		object.scrollButton.onmousedown=function(e){
			var event=e? e : window.event;
			object.scrollButton.startX=parseInt(this.style.left);
			object.scrollButton.startY=parseInt(this.style.top);
			//this.style.backgroundColor=param.backgroundColor;
			
			refreshPosition=function(x,y){
				var newY=object.scrollButton.startY+y;
				if (newY<0){ newY=0; }
				var track=parseInt(object.offsetHeight)-parseInt(object.scrollButton.offsetHeight);
				if (newY>track){
					newY=track;
				}
				object.scrollButton.style.top=newY+'px';
				var bindObjectTotal=local.bindObject.scrollHeight-local.bindObject.offsetHeight;
				local.bindObject.scrollTop=Math.ceil(newY*bindObjectTotal/track);
				return true;
			}
			
			system.startMoveAction(event,this,object,refreshPosition,null,1);
		}

		object.scrollTrack.onmousedown=function(e){
			var event=e?e:window.event;
			var target=event.target? event.target : event.srcElement;
			if (target===event.currentTarget){
				var newY=system.getMouseXYRelativeTo(event,event.currentTarget)[1]-Math.round(parseInt(object.scrollButton.offsetHeight)/2);
				if (newY<0){ newY=0; }
				var track=parseInt(object.offsetHeight)-parseInt(object.scrollButton.offsetHeight);
				if (newY>track){ newY=track; }

				object.scrollButton.style.top=newY+'px';
				var bindObjectTotal=local.bindObject.scrollHeight-local.bindObject.offsetHeight;
				local.bindObject.scrollTop=Math.ceil(newY*bindObjectTotal/track);
				object.scrollButton.onmousedown(event);
			}
		}

		object.repaint=function(){
			local.bindObject.scrollHeight;
			local.bindObject.offsetHeight;
			if ((local.bindObject.scrollHeight)<=(local.bindObject.offsetHeight)){
				object.hide();
			}else{
				object.show();
				
				var newDragSize=parseInt(object.offsetHeight*object.offsetHeight/local.bindObject.scrollHeight);
				if (newDragSize<param.drag.size){
					newDragSize=param.drag.size;
				}
				object.scrollButton.style.height=newDragSize+'px';
				var bindObjectTotal=local.bindObject.scrollHeight-local.bindObject.offsetHeight;
				var track=parseInt(object.offsetHeight)-parseInt(object.scrollButton.offsetHeight);
				var newY=Math.ceil(local.bindObject.scrollTop*track/bindObjectTotal);
				if (newY>track){
					newY=track;
				}
				object.scrollButton.style.top=newY+'px';
			}
		}
		
		local.bindObject.bindObjectVertical=object;
	}else{
		object.innerHTML="<div style='width:100%;height:100%;position:relative;overflow:hidden;'>\
			<div style='position:absolute;width:100%;height:100%;background-color:"+param.backgroundColor+";'></div>\
			<div style='position:absolute;left:"+param.drag.top+";height:100%;width:0px;background-color:"+param.color+";'></div>\
		</div>";
		
		object.scrollTrack=system.getChildNode(object,'1:1');
		object.scrollButton=system.getChildNode(object,'1:2');
		object.scrollButton.startX=0;
		object.scrollButton.startY=0;

		system.setAlpha(object.scrollButton,100);
		system.setCornerRadius(object.scrollTrack,5,5,5,5);
		system.setCornerRadius(object.scrollButton,5,5,5,5);

		object.scrollButton.onmousedown=function(e){
			var event=e? e : window.event;
			object.scrollButton.startX=parseInt(this.style.left);
			object.scrollButton.startY=parseInt(this.style.top);
			//this.style.backgroundColor=param.backgroundColor;
			
			refreshPosition=function(x,y){
				var newX=object.scrollButton.startX+x;
				if (newX<0){ newX=0; }
				var track=parseInt(object.offsetWidth)-parseInt(object.scrollButton.offsetWidth);
				if (newX>track){
					newX=track;
				}
				object.scrollButton.style.left=newX+'px';
				var bindObjectTotal=local.bindObject.scrollWidth-local.bindObject.offsetWidth;
				local.bindObject.scrollLeft=Math.ceil(newX*bindObjectTotal/track);
				return true;
			}
			
			system.startMoveAction(event,this,object,refreshPosition,null,1);
		}

		object.scrollTrack.onmousedown=function(e){
			var event=e?e:window.event;
			var target=event.target? event.target : event.srcElement;
			if (target===event.currentTarget){
				var newX=system.getMouseXYRelativeTo(event,event.currentTarget)[0]-Math.round(parseInt(object.scrollButton.offsetWidth)/2);
				if (newX<0){ newX=0; }
				var track=parseInt(object.offsetWidth)-parseInt(object.scrollButton.offsetWidth);
				if (newX>track){ newX=track; }

				object.scrollButton.style.left=newX+'px';
				var bindObjectTotal=local.bindObject.scrollHeight-local.bindObject.offsetWidth;
				local.bindObject.scrollLeft=Math.ceil(newX*bindObjectTotal/track);
				object.scrollButton.onmousedown(event);
			}
		}

		object.repaint=function(){
			local.bindObject.scrollWidth;
			local.bindObject.offsetWidth;
			if ((local.bindObject.scrollWidth)<=(local.bindObject.offsetWidth)){
				object.hide();
			}else{
				object.show();
				
				var newDragSize=parseInt(object.offsetWidth*object.offsetWidth/local.bindObject.scrollWidth);
				if (newDragSize<param.drag.size){
					newDragSize=param.drag.size;
				}

				object.scrollButton.style.width=newDragSize+'px';
					
				var bindObjectTotal=local.bindObject.scrollWidth-local.bindObject.offsetWidth;
				var track=parseInt(object.offsetWidth)-parseInt(object.scrollButton.offsetWidth);
				var newX=Math.ceil(local.bindObject.scrollLeft*track/bindObjectTotal);
				if (newX>track){
					newX=track;
				}
				object.scrollButton.style.left=newX+'px';
			}
		}
		
		object.data.bindObject.bindObjectHorizontal=object;	
	}	

	var updateCurrentAlpha=function(alpha){
		local.currentAlpha=alpha;
	}

	object.show=function(){
		if (!local.show){
			local.show=true;
			if (local.animating){
				local.cancelAnimation();
			}
			object.style.display='block';
			local.animating=true;
			var endShow=function(){
				local.animating=false;
				object.repaint();
			}
			local.cancelAnimation=system.animate(object,1,20,[{type:'alpha',startAlpha:local.currentAlpha,stopAlpha:local.maxAlpha,callback:updateCurrentAlpha}],null,endShow);
		}
    }
	
	object.hide=function(){
		if (local.show){
			local.show=false;
			if (local.animating){
				local.cancelAnimation();
			}
			local.animating=true;
			var endHide=function(){
				local.animating=false;
				object.style.display='none';
			}
			local.cancelAnimation=system.animate(object,1,20,[{type:'alpha',startAlpha:local.currentAlpha,stopAlpha:0,callback:updateCurrentAlpha}],null,endHide);
		}
    }
	
	var wheel_handler=function(e){
		var event=e? e : window.event;
		if (system.getEventWheelDelta(event)>0){
			if (event.ctrlKey){
				this.scrollLeft-=25;
			}else{
				this.scrollTop-=25;
			}
		}else{
			if (event.ctrlKey){
				this.scrollLeft+=25;
			}else{
				this.scrollTop+=25;
			}
		}

		object.repaint();
		/*if (this.data.bindObjectVertical){
			this.data.bindObjectVertical.repaint();
		}
		if (this.data.bindObjectHorizontal){
			this.data.bindObjectHorizontal.repaint();
		}*/
	}

	system.addEvent(local.bindObject,'mouseWheel',wheel_handler);
	system.setAlpha(object,0);

	system.registerResize(object.repaint);

    return object;
}