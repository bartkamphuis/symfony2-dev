/*
PANEL
-------

CONSTRUCTOR
	corners
		leftTop		-
		rightTop	-
		leftBottom	-
		rightBottom	- 
	header
		height	-	the height of the window's title bar
		image	-	the image on the left side of the title bar
	content
		left -	content box distance in pixels from the left side of the panel
		top  -	content box distance in pixels from the top of the panel
		right-	content box distance in pixels from the right side of the panel
		bottom-	content box distance in pixels from the bottom of the panel
	resizeSize	-	the size in pixels of the border which will allow resizing
	

ATTRIBUTES
	data
		container	-	the container which contains everything in the window
		content	-	the window content
		header	-	the window header where the image,title text and buttons are
		title	-	text in the tile bar
		minWidth	-	minimum width
		minHeight	-	minimum height
PUBLIC METHODS
	setTitle(txt)	-	sets the text in the title

*/

function x_Window(param){
	var object=document.createElement('div');
        object.style.display='none';
		object.style.left=-10000;
        object.style.top=-10000;
		object.style.width='700px';
		object.style.height='500px';
		object.style.overflow='hidden';
		//object.style.minWidth='500px';
		//object.style.minHeight='200px';

		object.data=new Object();
		object.data.eventOnFocus=function(){}
		object.data.eventOnBlur=function(){}
		object.data.eventOnMinimize=function(){}
		object.data.eventOnMaximize=function(){}
		object.data.eventOnMiddlelize=function(){}
		object.data.eventOnClose=function(){}
		object.data.eventOnMouseover=function(){}
		object.data.eventOnMouseout=function(){}
		object.data.eventOnResize=function(){}
		
		object.data.focusable=true;
		
		var local=new Object();
		local.show=false;
		local.draw=new Object();
		
		var boss=object;

		if ((param.size)&&(param.size.minWidth)){
			object.data.minWidth=param.size.minWidth;
		}else{
			object.data.minWidth=200;
		}
		if ((param.size)&&(param.size.minHeight)){
			object.data.minHeight=param.size.minHeight;
		}else{
			object.data.minHeight=0;
		}
	
		var newInnerHTML="<div style='border:0 solid blue;width:100%;height:100%;overflow:hidden;position:relative;'>\
		<div style='box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;width:100%;height:100%;position:absolute;cursor:default;border:1px solid #555555;color:"+param.font.color+";font-family:"+param.font.family+" important!;font-size:"+param.font.size+"px;'>\
			<div style='border-bottom:1px solid #555555;width:100%;height:"+param.header.height+"px;position:relative;'>\
				<div style='width:100%;height:100%;overflow:auto;position:absolute;text-align:center;padding-top:3px;'>\
					"+param.title+"\
				</div>\
				<div style='position:absolute;right:5px;top:5px;'>\
				</div>\
			</div>\
			<div style='border:0px solid blue;position:absolute;top:"+(param.header.height+1)+"px;bottom:0px;width:100%;overflow:hidden;'>\
					<div style='width:100%;height:100%;overflow:hidden;position:relative;background-color:white;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;'>\
					</div>\
			</div>\
		</div>";

		bgcol='transparent';
		newInnerHTML+="<div style='position:absolute;overflow:hidden;left:0px;top:0px;cursor:w-resize;width:"+param.resize.size+"px;height:100%;background-color:"+bgcol+";'></div>";
		newInnerHTML+="<div style='position:absolute;overflow:hidden;left:;right:0px;top:0px;cursor:w-resize;width:"+param.resize.size+"px;height:100%;background-color:"+bgcol+";'></div>";
		newInnerHTML+="<div style='position:absolute;overflow:hidden;left:0px;top:0px;cursor:n-resize;height:"+param.resize.size+"px;width:100%;background-color:"+bgcol+";'></div>";
		newInnerHTML+="<div style='position:absolute;overflow:hidden;left:0px;top:;bottom:0px;cursor:n-resize;height:"+param.resize.size+"px;width:100%;background-color:"+bgcol+";'></div>";
		
		newInnerHTML+="<div style='cursor:nw-resize;position:absolute;overflow:hidden;left:0px;top:0px;width:"+param.resize.size+"px;height:"+param.resize.size+"px;background-color:"+bgcol+";'></div>";
		newInnerHTML+="<div style='cursor:ne-resize;position:absolute;overflow:hidden;right:0px;top:0px;width:"+param.resize.size+"px;height:"+param.resize.size+"px;background-color:"+bgcol+";'></div>";
		newInnerHTML+="<div style='cursor:nw-resize;position:absolute;overflow:hidden;right:0px;bottom:0px;width:"+param.resize.size+"px;height:"+param.resize.size+"px;background-color:"+bgcol+";'></div>";
		newInnerHTML+="<div style='cursor:ne-resize;position:absolute;overflow:hidden;left:0px;bottom:0px;width:"+param.resize.size+"px;height:"+param.resize.size+"px;background-color:"+bgcol+";'></div>";

		newInnerHTML+="</div>";

		object.innerHTML=newInnerHTML;


		object.data.header=system.getChildNode(object,'1:1:1');
		object.data.title=system.getChildNode(object,'1:1:1:1');
		object.data.buttons=system.getChildNode(object,'1:1:1:2');
		object.data.content=system.getChildNode(object,'1:1:2:1');
		//object.data.container=system.getChildNode(object,'1:1:2');
		
		system.setBoxType(object.data.content,'in');

		local.draw.minimize=function(ctx,on){
			ctx.clearRect(0,0,12,12);
			ctx.save();
			ctx.beginPath();
			ctx.moveTo(1,9);
			ctx.lineTo(11,9);
			ctx.lineTo(11,11);
			ctx.lineTo(1,11);
			ctx.closePath();
			ctx.clip();
			ctx.translate(0,0);
			ctx.scale(1,1);
			//ctx.strokeStyle = 'rgba(0,0,0,0)';
			ctx.lineCap = 'butt';
			ctx.lineJoin = 'miter';
			ctx.miterLimit = 4;
			if (on){
				ctx.fillStyle='#555555';
			}else{
				ctx.fillStyle='#888888';
			}
			ctx.fill();
			//ctx.stroke();
			ctx.restore();
		}
		local.draw.maximize=function(ctx,on){
			ctx.clearRect(0,0,12,12);		
			ctx.save();
			ctx.beginPath();
			ctx.moveTo(1,1);
			ctx.lineTo(11,1);
			ctx.lineTo(11,11);
			ctx.lineTo(1,11);
			ctx.closePath();
			ctx.clip();
			ctx.translate(0,0);
			ctx.scale(1,1);
			//ctx.strokeStyle = 'rgba(0,0,0,0)';
			ctx.lineCap = 'butt';
			ctx.lineJoin = 'miter';
			ctx.miterLimit = 4;
			if (on){
				ctx.fillStyle='#555555';
			}else{
				ctx.fillStyle='#888888';
			}
			ctx.fill();
			//ctx.stroke();
			ctx.restore();
		}
		local.draw.middleize=function(ctx,on){
			ctx.clearRect(0,0,12,12);			
			ctx.save();
			ctx.beginPath();
			ctx.moveTo(4,1);
			ctx.lineTo(11,1);
			ctx.lineTo(11,8);
			ctx.lineTo(4,8);
			ctx.closePath();
			if (on){
				ctx.strokeStyle='#555555';
			}else{
				ctx.strokeStyle='#888888';
			}
			ctx.lineWidth=2;
			ctx.stroke();
			
			ctx.beginPath();
			ctx.moveTo(1,4);
			ctx.lineTo(8,4);
			ctx.lineTo(8,11);
			ctx.lineTo(1,11);
			ctx.closePath();
			//ctx.stroke();
			
			ctx.clip();
			ctx.translate(0,0);
			ctx.scale(1,1);
			//ctx.strokeStyle = 'rgba(0,0,0,0)';
			ctx.lineCap = 'butt';
			ctx.lineJoin = 'miter';
			ctx.miterLimit = 4;
			if (on){
				ctx.fillStyle='#555555';
			}else{
				ctx.fillStyle='#888888';
			}
			ctx.fill();
			ctx.restore();
		}
		local.draw.close=function(ctx,on){
			ctx.clearRect(0,0,12,12);
			ctx.save();
			ctx.beginPath();
			ctx.moveTo(9.34913,11.4005);
			ctx.lineTo(5.99528,8.04614);
			ctx.lineTo(2.64142,11.4005);
			ctx.lineTo(0.599528,9.35858);
			ctx.lineTo(3.95386,6.00472);
			ctx.lineTo(0.599528,2.65087);
			ctx.lineTo(2.64142,0.608976);
			ctx.lineTo(5.99528,3.96331);
			ctx.lineTo(9.34913,0.608976);
			ctx.lineTo(11.391,2.65087);
			ctx.lineTo(8.03669,6.00472);
			ctx.lineTo(11.391,9.35858);
			ctx.lineTo(9.34913,11.4005);
			ctx.closePath();
			if (on){
				ctx.fillStyle='#555555';
			}else{
				ctx.fillStyle='#888888';
			}
			ctx.fill();
			ctx.restore();
		}
		
		var min=document.createElement('canvas');
		min.style.cssFloat='left';
		min.style.position='relative';
		min.setAttribute('width', '12');
		min.setAttribute('height', '12');
		min.style.width='12px';
		min.style.height='12px';
		var contextMin = min.getContext("2d");
		local.draw.minimize(contextMin,false);
		
		min.active=1;
		//system.setBoxShadow(system.getChildNode(min,1),'inset',1,1,0,0,'faf9f9');
		min.onmouseover=function(){
			//system.setGradient(this,'ffffff',100,'e4e3e3',100);
		}
		min.onmouseout=function(e){
			var event=e?e:window.event; 
			local.draw.minimize(contextMin,false);
		}
		min.onmousedown=function(e){
			var event=e?e:window.event; 
			local.draw.minimize(contextMin,true);
			event.noAction=true;
		}
		min.onmouseup=function(e){
			var event=e?e:window.event; 
			local.draw.minimize(contextMin,false);
		}
		min.onclick=function(){
			local.show=false;
			boss.style.display='none';
			local.draw.minimize(contextMin,false);
			boss.data.eventOnMinimize();
		}

		var max=document.createElement('canvas');
		max.style.cssFloat='left';
		max.style.position='relative';
		max.setAttribute('width', '12');
		max.setAttribute('height', '12');
		max.style.width='12px';
		max.style.height='12px';
		var contextMax = max.getContext("2d");
		local.draw.maximize(contextMax,false);

		max.active=1;
		//system.setBoxShadow(system.getChildNode(max,1),'inset',1,1,0,0,'faf9f9');
		
		max.onmouseover=function(){
			//system.setGradient(this,'ffffff',100,'e4e3e3',100);
		}
		max.onmouseout=function(e){
			var event=e?e:window.event; 
			var target=event.target? event.target : event.srcElement;
			if (target===event.currentTarget){
				local.draw.maximize(contextMax,false);
			}
		}
		max.onmousedown=function(e){
			var event=e?e:window.event; 
			local.draw.maximize(contextMax,true);
			event.noAction=true;
		}
		max.onmouseup=function(e){
			//var event=e?e:window.event; 
			local.draw.maximize(contextMax,true);
		}
		max.onclick=function(e){
			//var event=e?e:window.event; 
			boss.data.eventOnMaximize();
			local.draw.maximize(contextMax,false);
			max.style.display='none';
			middle.style.display='block';
		}

		var middle=document.createElement('canvas');
		middle.style.cssFloat='left';
		middle.style.position='relative';
		middle.setAttribute('width', '12');
		middle.setAttribute('height', '12');
		middle.style.width='12px';
		middle.style.height='12px';
		var contextMiddle = middle.getContext("2d");
		local.draw.middleize(contextMiddle,false);
		
		middle.active=1;
		middle.style.display='none';
		//system.setBoxShadow(system.getChildNode(middle,1),'inset',1,1,0,0,'faf9f9');
		middle.onmouseover=function(){
			//system.setGradient(this,'ffffff',100,'e4e3e3',100);
		}
		middle.onmouseout=function(e){
			var event=e?e:window.event; 
			var target=event.target? event.target : event.srcElement;
			if (target===event.currentTarget){
				local.draw.middleize(contextMiddle,false);
			}
		}
		middle.onmousedown=function(e){
			var event=e?e:window.event; 
			local.draw.middleize(contextMiddle,true);			
			event.noAction=true;
		}
		middle.onmouseup=function(e){
			var event=e?e:window.event; 
			local.draw.middleize(contextMiddle,false);
		}		
		middle.onclick=function(e){
			var event=e?e:window.event; 
			boss.data.eventOnMiddlelize();
			local.draw.middleize(contextMiddle,false);
			middle.style.display='none';
			max.style.display='block';
		}

		var close=document.createElement('canvas');
		close.style.cssFloat='left';
		close.style.position='relative';
		close.setAttribute('width', '12');
		close.setAttribute('height', '12');
		close.style.width='12px';
		close.style.height='12px';
		var contextClose = close.getContext("2d");
		local.draw.close(contextClose,false);
		
		close.active=1;

		close.onmouseover=function(){
			//system.setGradient(this,'ffffff',100,'e4e3e3',100);
		}
		close.onmouseout=function(e){
			var event=e?e:window.event; 
			var target=event.target? event.target : event.srcElement;
			if (target===event.currentTarget){
				local.draw.close(contextClose,false);
			}
		}
		close.onmousedown=function(e){
			var event=e?e:window.event; 
			local.draw.close(contextClose,true);
			event.noAction=true;
		}
		close.onmouseup=function(e){
			var event=e?e:window.event; 
			//local.draw.close(contextClose,false);
		}


		object.data.header.ondblclick=function(){
			if (middle.style.display=='block'){
				boss.data.eventOnMiddlelize();
				middle.style.display='none';
				max.style.display='block';
			}else{
				boss.data.eventOnMaximize();
				middle.style.display='block';
				max.style.display='none';
			}
		}

		object.data.buttons.appendChild(min);
		object.data.buttons.appendChild(max);
		object.data.buttons.appendChild(middle);
		object.data.buttons.appendChild(close);		
		max.style.marginLeft='4px';
		middle.style.marginLeft='4px';
		close.style.marginLeft='4px';

		object.data.content.style.backgroundColor='white';

		system.setCornerRadius(system.getChildNode(object,'1:1'),param.corners.leftTop,param.corners.rightTop,param.corners.rightBottom,param.corners.leftBottom);
		system.setCornerRadius(object,param.corners.leftTop,param.corners.rightTop,param.corners.rightBottom,param.corners.leftBottom);
		system.setGradient(object.data.header,'#e7e7e7','100','#d3d3d3','100');
		system.setCornerRadius(object.data.header,param.corners.leftTop,param.corners.rightTop,0,0);
		system.setCornerRadius(object.data.content,0,0,param.corners.leftBottom,param.corners.rightBottom);
		system.setBoxShadow(object,'',0,0,3,0,'333');
		if (system.browser!='MIE'){
			system.setTextShadow(object.data.title,0,1,0,'#FFF');
		}
		
		object.onmousedown=function(e){
			var event=e?e:window.event;
			//e.noAction=true;
		}
		object.onmouseover=function(e){
			boss.data.eventOnMouseover();
		}
		object.onmouseout=function(e){
			var event=e?e:window.event;
			var target=event.target? event.target : event.srcElement;
			var toTarget = event.relatedTarget || event.toElement;
			while (toTarget!==event.currentTarget && toTarget.tagName!='BODY'){
				toTarget=toTarget.parentNode;
			}
			if (toTarget!==event.currentTarget){
				boss.data.eventOnMouseout();
			}			
		}
		object.data.onFocus=function(){
			local.show=true;
			boss.style.display='block';
			system.setGradient(boss.data.header,'#b2e4ff','100','#a6d4ed','100');
			system.bringToFront(boss);
			boss.data.eventOnFocus();
			system.focusElement(boss);
		}
		object.data.onBlur=function(){
			system.setGradient(boss.data.header,'#e7e7e7','100','#d3d3d3','100');		
			boss.data.eventOnBlur();
		}
		
//MOVE WINDOW
		var moveHandler=function(event,_this){
			system.bringToFront(boss);
			var startX=parseInt(boss.style.left);
			var startY=parseInt(boss.style.top);
			
			var moveWindow=function(x,y){
				boss.style.left=(startX+x)+'px';
				boss.style.top=(startY+y)+'px';
				return true;
			}
			
			system.startMoveAction(event,_this,_this.parentNode,moveWindow,null,1);
		}

		system.addEvent(object.data.header,'mousedown',function(e){var event=e?e:window.event; moveHandler(event,this);});

//RESIZE WINDOW
		var resizeHandler=function(event,_this,horizontal,vertical){
			system.bringToFront(boss);
			var startWidth=parseInt(boss.style.width);
			var startX=parseInt(boss.style.left);
			var newWidth=0;
			
			var startHeight=parseInt(boss.style.height);
			var startY=parseInt(boss.style.top);
			var newHeight=0;
			
			var resizeWindow=function(x,y){
				if (horizontal!=0){
					newWidth=startWidth-(x*horizontal);
					if (newWidth<boss.data.minWidth){
						x=x-(boss.data.minWidth-newWidth);
						newWidth=boss.data.minWidth;
					}
					boss.style.width=newWidth+'px';
					if (horizontal==1){
						boss.style.left=(startX+x)+'px';
					}
				}

				if (vertical!=0){
					newHeight=startHeight-(y*vertical);
					if (newHeight<boss.data.minHeight){
						y=y-(boss.data.minHeight-newHeight);
						newHeight=boss.data.minHeight;
					}
					boss.style.height=newHeight+'px';
					if (vertical==1){
						boss.style.top=(startY+y)+'px';
					}
				}
				
				boss.data.eventOnResize();
				
				return true;
			}
			
			system.startMoveAction(event,_this,_this.parentNode,resizeWindow,null,1);
		}
	
		system.addEvent(system.getChildNode(object,'1:2'),'mousedown',function(e){var _this=this; resizeHandler(e? e : window.event,_this,1,0);});
		system.addEvent(system.getChildNode(object,'1:3'),'mousedown',function(e){var _this=this; resizeHandler(e? e : window.event,_this,-1,0);});
		system.addEvent(system.getChildNode(object,'1:4'),'mousedown',function(e){var _this=this; resizeHandler(e? e : window.event,_this,0,1);});
		system.addEvent(system.getChildNode(object,'1:5'),'mousedown',function(e){var _this=this; resizeHandler(e? e : window.event,_this,0,-1);});
		system.addEvent(system.getChildNode(object,'1:6'),'mousedown',function(e){var _this=this; resizeHandler(e? e : window.event,_this,1,1);});
		system.addEvent(system.getChildNode(object,'1:7'),'mousedown',function(e){var _this=this; resizeHandler(e? e : window.event,_this,-1,1);});
		system.addEvent(system.getChildNode(object,'1:8'),'mousedown',function(e){var _this=this; resizeHandler(e? e : window.event,_this,-1,-1);});
		system.addEvent(system.getChildNode(object,'1:9'),'mousedown',function(e){var _this=this; resizeHandler(e? e : window.event,_this,1,-1);});
	
	
	object.setTitle=function(txt){
		this.title.innerHTML=txt;
	}

	object.show=function(){
		this.style.display='block';
		local.show=true;
	}

	return object;	
}