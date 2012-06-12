/*
An object can have:
data.onFocus()	-	method to be called on focus
data.onBlur		-	called on blur

data.focusable	-	if it is an focusable object must set to true

local.focusElement	-	the element which has the focus. Null otherwise.
local.resizeList	-	array of pointers to functions which resize other objects
local.tooltip
	  element		-	the element for which the tooltip should be displayed 
	  cancelId		-	the ID of the setTimeout of the tooltip function which shows the tooltip.
local.screenX		-	x position of the mouse on the screen
local.screenY		-	y position of the mouse on the screen

local.messageBoxes	-	an array of functions which are called when the user clicks somewhere. If a box of type click is on the screen and the user clicks then this functions are called.
SYSTEM SMALL OBJECTS
--------------------
The message box
	zIndex	-	10000, new message box will still have zIndex 10000 but it will cover the previous one

SYSTEM
-------

CONSTRUCTOR
	wallpaper	-	the main window's wallpaper

METHODS
	show	-	displays the system
	hide	-	hides the system
	setColorRGBA
		color		-	the color to edit
		r			-	the amount to change the red channel
		g			-	the amount to change the green channel
		b			-	the amount to change the blue channel
		a			-	the amount to change the alpha channel
		returnType	-	RGBA / HEX the type of color to return
	setColorHSVA
		color		-	the color to edit
		h			-	the amount to change the hue channel
		s			-	the amount to change the saturation channel
		v			-	the amount to change the value channel
		a			-	the amount to change the alpha channel
		returnType	-	RGBA / HEX the type of color to return
	startMoveAction(actionEvent,actionObject,actionParent,actionCallback,actionCallbackEnd,actionButton)
		actionEvent		-	the event object passed from the element which called the startMoveAction
		actionObject	-	the object on which the action is taking place
		actionDragObject-	the dragged object
		actionParent	-	the parent to which relatively the object is moved
		actionCallback	-	the function which is called on every mouse move
		actionCallbackEnd	-	the function called on action end
		actionButton		-	the button on which the action is performed
	startDragAction(actionEvent,dragStart,dragStop,dragDrop,noDragDrop)
		actionEvent		-	the event object passed from the element which called the startMoveAction
		dragStart		-	callback function called when draging starts and must return the object to drag
		dratStop		-	callback function called after the drag is over
		dragDrop		-	function called when the drop was succesful and must return an object which will be processed in the dropZone object
		noDragDrop		-	called when the drop was not succesfull
			NOTE:	when dragging the system looks for objects which have the attribute dropZone and it calls the dropOverHandler and dropOutHandler
					when the mouse goes over or out from the dropzone object and calls the dropHandler passing as parameter the return of the dragDrop function
					The dropHandler is the function which will process the object
	showTooltip(event,obj)
		event	-	the current event
		obj		-	the object to which the tooltip whould be showen
	animate(obj,type,speed,callBack,par1,par2,par3,par4)
		obj	-	the object to animate
		type	-	the type of animation (alpha)
		speed	-	the speed the animation will take place (milliseconds)
		callBack	-	function called after animation over
		par1/par2/par3/par4		-	
		par1/par2/par3/par4		-	
	loadModule(module,code,callBack)
		module	-	path to the javascript file which will be loaded and executed
		code	-	a code sent to the script which does the loading
		callBack	-	function called when the loading is done
	lock(obj,silent,smooth,callBack)
		obj	-	object to be locked
		silent	-	true/false	it shows or not the div which masks all the rest of the page content
		smooth	-	uses alpha to fade in / out when locking an object
		callBack	-	function called when locking is finished
	unlock(obj,smooth,callBack)
		obj	-	object to be unlocked
		smooth	-	uses alpha to fade in / out when locking an object
		callBack	-	function called when unlocking is finished
	setGradient(obj,type,colors...)
		obj	-	the object to apply the gradient
		type	-	left / top / right / bottom / left top / right top / left bottom / right bottom / left right :)
		colors	-	parameters for the colors.Come in pairs of color and percent.  Ex: setGradient(object,'top','rgba(50,40,30,1)',0, 'rgba(150,140,130,1)',50, 'rgba(250,240,230,1)',100,
	
GENERAL METHODS	
	getChildNode(node,number)	-	returns the node number "number" of the parent node "node"
	setStyle(node,styleString)	-	sets the style attribute of the node
	setAlpha(node,opacity)	-	sets the opacity of the node "node"
		aplha	-	can be from 0 to 100
	setInnerText(obj,text)	-	sets the innerText value of a node
	getEventWheelDelta(event)	-	returns the delta of the mouse wheel
	addEvent(obj,event,handler)
		obj		-	object to add event to
		event	-	event to add
		handler	-	function to handle the event
	getEventButton(event)	-	returns the mouse button number (1 - left click, 2 - right click, 3 - middle click)
	getMouseXYRelativeTo
		event	-
		obj		-	the object relative to which
		scroll	-	true if scroll diff is calculated
DEVELOPMENT
	keys(obj)	-	returns a list of all atributes of an object


DESCRIPTION
	The system object checks for elements which have the object.data.focusable set to true and then it checks if the object has an onFocus and onBlur
*/

function x_System(param){
	if (!param){var param=new Object();}
	var object=document.createElement('div');
	object.style.display='none';
	object.style.width='100%';
	object.style.height='100%';
	object.style.backgroundRepeat='no-repeat';
	//object.style.backgroundAttachment='fixed';
	object.style.backgroundPosition='center';
	if (param.wallpaper){
		object.style.backgroundImage='url('+param.wallpaper+')';
	}
	if (param.backgroundColor){
		object.style.backgroundColor='#'+param.backgroundColor;
	}
	
	object.style.overflow='hidden';

	object.innerHTML="<div style='width:100%;height:100%;position:relative;background-color:transparent;border:0px solid red;'></div>";
	object.content=object.firstChild;
	
	object.loadComplete=false;
	
	//OPERATION
	//---------
	//object for holding values related to operations like select, drag, move
	object.action=new Object();
	object.action.type=null;
	object.action.callback=null;
	object.action.element=null;
	object.action.object=null;
	object.action.draggedObject=null;
	object.action.parent=null;

	object.data=new Object();
	object.data.animation=new Object();
	object.data.animation.on=false;

	//LOCAL
	var local=new Object();
	local.focusElement=null;
	local.resizeList=new Array();	//an array of functions to be called on window resize.

	local.tooltip={};
	local.tooltip.element=null;
	local.tooltip.cancelId=null;
	local.tooltip.message=null;
	local.tooltip.box=null;

	local.screenX=0;
	local.screenY=0;

	if (navigator.appName=='Microsoft Internet Explorer'){object.browser='MIE';}
	if (navigator.appName=='Netscape'){object.browser='NET';}
	if (navigator.appName=='Opera'){object.browser='OPE';}
	if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1){object.browser='GOG'};

	//onKeyDown
	document.onkeydown=function(e){
		local.hideTooltip();
	}

	//onMouseMove
	//based on the type of operation set like 'move' or 'select' the onMouseMove event executes certain actions
	object.onmousemove=function(e){
		var event=e? e : window.event;
		
		local.screenX=event.clientX;
		local.screenY=event.clientY;
		
		if (this.action.type=='move'){
			if (!this.action.callback(parseInt(event.clientX)-this.action.startX,parseInt(event.clientY)-this.action.startY,event)){
				this.stopAction();			
			}
		}
		if (this.action.type=='dragStart'){
			if ((Math.abs(this.action.startX-event.clientX)>10)||(Math.abs(this.action.startY-event.clientY)>10)){
				var drag=this.action.dragStart();
				system.content.appendChild(drag);
				drag.style.position='absolute';
				drag.style.left=event.clientX;
				drag.style.top=event.clientY;
				this.action.draggedObject=drag;
				this.action.type='drag';
			}
		}
		if (this.action.type=='drag'){
			this.action.draggedObject.style.left=(parseInt(event.clientX)+5)+'px';
			this.action.draggedObject.style.top=(parseInt(event.clientY)+5)+'px';
		}
	}
	object.onmouseup=function(e){
		var event=e? e : window.event;
		var target=event.target? event.target : event.srcElement;
		var contactTarget=target;
		if (this.action.type=='drag'){
			while ((target.parentNode)&&(target.dropZone==null)){
				target=target.parentNode;
			}

			if ((target!=null)&&(target.dropZone!=null)){
				target.dropOutHandler();
				if (target.dropHandler){
					target.dropHandler(this.action.dragDrop(this.action.draggedObject),contactTarget);
				}
				this.action.type='dragEnd';
				this.stopAction();
			}else{
				this.stopAction();
				this.cancelEvent(e);
			}
		}else{
			this.stopAction();
			this.cancelEvent(e);
		}
	}
	object.onmouseover=function(e){
		var event=e? e : window.event;
		var target=event.target? event.target : event.srcElement;
		
		if (this.action.type=='drag'){
			while ((target!=null)&&(target.dropZone==null)){
				target=target.parentNode;
			}
			if ((target!=null)&&(target.dropZone!=null)){
				//track.write('Drop zone over');
				if (target.dropOverHandler){
					target.dropOverHandler();
				}
			}
		}else{
			this.showTooltip(event,target);
		}
	}
	object.onmouseout=function(e){
		var event=e? e : window.event;
		var target=event.target? event.target : event.srcElement;
		if (this.action.type=='drag'){
			while ((target!=null)&&(target.dropZone==null)){
				target=target.parentNode;
			}
			if ((target!=null)&&(target.dropZone!=null)){
				//track.write('Drop zone out');
				if (target.dropOutHandler){
					target.dropOutHandler();
				}
			}
		}
	}
	object.onmousedown=function(e){
		local.hideTooltip();
		var event=e? e : window.event;
		var target=event.target? event.target : event.srcElement;
		while ((target!==this)&&((!target.data)||(!target.data.focusable))){
			target=target.parentNode;
		}
		if (target.data.focusable){
			focusElement(target);
		}else{
			if (target===this){
				blurElement();
				//this.stopAction();
			}
		}
		
		/*if boxes are on screen then clear them*/
		if (local.messageBoxes.length>0){
			var max=local.messageBoxes.length;
			for (var i=0;i<max;i++){
				local.messageBoxes[0]();
				local.messageBoxes.shift();
			}
		}
	}	
	/*object.onmouseleave=function(e){
		var event=e? e : window.event;
		var target=event.target? event.target : event.srcElement;
		if (target===this){
			this.action.type=null;
			this.action.callback=null;
			this.action.element=null;
			this.action.object=null;
			this.action.parent=null;
		}
	}*/
	var focusElement=function(target){
		if (local.focusElement!==target){
			if ((local.focusElement!=null)&&(local.focusElement!==target)&&(local.focusElement.data.onBlur)){
				local.focusElement.data.onBlur();
			}
			local.focusElement=target;
			if (local.focusElement.data.onFocus){
				local.focusElement.data.onFocus();
			}
		}
	}
	var blurElement=function(target){
		if ((local.focusElement!=null)&&(local.focusElement.data.onBlur)){
				local.focusElement.data.onBlur();
		}
		local.focusElement=null;
	}
		
	//setFocus
	object.focusElement=function(obj){
		focusElement(obj);
	}
	//blurFocus
	object.blurElement=function(obj){
		blurElement(obj);
	}
	
	
		/*
		 Modifies the col color with the rr,gg,bb and aa values
		Ex: system.setColorRGBA('#aabbccaa',0,0,10,-10);
		*/
	   
		object.setColorRGBA=function(col,rr,gg,bb,aa,returnType){
			if (col.substr(0,1)=='#'){
				var r=parseInt(col.substr(1,2),16);
				var g=parseInt(col.substr(3,2),16);
				var b=parseInt(col.substr(5,2),16);
				var a=1;
			}
			if (col.substr(0,4)=='RGBA'){
				col=col.substr(5).split(',');
				var r=parseInt(col[0]);
				var g=parseInt(col[1]);
				var b=parseInt(col[2]);
				var a=parseInt(col[3]);
			}

			r+=rr;
			g+=gg;
			b+=bb;
			a+=aa;
			
			if (r<0){r=0;} if (r>255){r=255;} if (g<0){g=0;} if (g>255){g=255;}	if (b<0){b=0;} if (b>255){b=255;} if (a<0){a=0;} if (a>1){a=1;}
	
			if (returnType=='RGBA'){
				return('RGBA('+r+','+g+','+b+','+a+')');
			}else{
				var r=r.toString(16).toUpperCase();
				if (r.length==1){r='0'+''+r;}
				var g=g.toString(16).toUpperCase();
				if (g.length==1){g='0'+''+g;}
				var b=b.toString(16).toUpperCase();
				if (b.length==1){b='0'+''+b;}
				return '#'+r+g+b;
			}	
		}
	
		object.setColorHSVA=function(col,hh,ss,vv,aa,returnType){
			if (col.substr(0,1)=='#'){
				var r=parseInt(col.substr(1,2),16);
				var g=parseInt(col.substr(3,2),16);
				var b=parseInt(col.substr(5,2),16);
				var a=1;
			}
			if (col.substr(0,4)=='RGBA'){
				col=col.substr(5).split(',');
				var r=parseInt(col[0]);
				var g=parseInt(col[1]);
				var b=parseInt(col[2]);
				var a=parseInt(col[3]);
			}
				
			var rr=r/255;
			var gg=g/255;
			var bb=b/255;
			var max=Math.max(rr,gg,bb);
			var min = Math.min(rr,gg,bb);
			var h=max;
			var s=max;
			var v=max;
				
			var d=max-min;
			if (max==0){
				s=0;
			}else{
				s=d/max;
			}
			
			if(max==min){
				h=0; // achromatic
			}else{
				switch(max){
					case rr: h=(gg-bb)/d+(gg<bb?6:0); break;
					case gg: h=(bb-rr)/d+2; break;
					case bb: h=(rr-gg)/d+4; break;
				}
				h=h/6;
			}

			h+=hh/100;
			s+=ss/100;
			v+=vv/100;
			a+=aa;

			if (h<0){h=0;} if (h>100){h=100;} if (s<0){s=0;} if (s>100){s=100;} if (v<0){v=0;} if (v>100){v=100;} if (a<0){a=0;} if (a>1){a=1;}

				var i = Math.floor(h * 6);
				var f = h * 6 - i;
				var p = v * (1 - s);
				var q = v * (1 - f * s);
				var t = v * (1 - (1 - f) * s);

				switch(i % 6){
			        case 0: r = v, g = t, b = p; break;
			        case 1: r = q, g = v, b = p; break;
			        case 2: r = p, g = v, b = t; break;
			        case 3: r = p, g = q, b = v; break;
			        case 4: r = t, g = p, b = v; break;
			        case 5: r = v, g = p, b = q; break;
				}
				r=Math.round(r*255);
				g=Math.round(g*255);
				b=Math.round(b*255);

			if (returnType=='RGBA'){
				return('RGBA('+r+','+g+','+b+','+a+')');
			}else{
				var r=r.toString(16).toUpperCase();
				if (r.length==1){r='0'+''+r;}
				var g=g.toString(16).toUpperCase();
				if (g.length==1){g='0'+''+g;}
				var b=b.toString(16).toUpperCase();
				if (b.length==1){b='0'+''+b;}
				return '#'+r+g+b;
			}
		}
	
	//Canvas object
	object.canvas=function(param){
		var can=document.createElement('canvas');
		can.setAttribute('width', parseInt(param.width));
		can.setAttribute('height', parseInt(param.height));
		can.style.width=parseInt(param.width)+'px';
		can.style.height=parseInt(param.height)+'px';
		var ctx = can.getContext("2d");
		ctx.scale(parseInt(param.width)/100,parseInt(param.height)/100);
		ctx.translate(0,0);
		
		can.draw=function(par){
			ctx.clearRect(0,0,100,100);
			param.canvas(ctx,par);
		}
		return can;
	}
	
	
	//Local storage functions
	//Returns a value of a node or false if it does not find it or other error
	object.setLocalData=function(path,val){
		if (path.length==0){ return false; }
		path=path.split(".");
		var max=path.length;

		//localStorage.removeItem('map');return false;
		var database=JSON.parse(localStorage.getItem(path[0]));
		if (database==null){
			localStorage.setItem(path[0],{});
			database={};
		}
		if (typeof(database)!='object'){database={}}
		
		var node=database;
		var parentNode=node;
		
		for (i=1;i<max;i++){
			if (node[path[i]]){
				if ((typeof(node[path[i]])!='object')&&(i+1<max)){
					node[path[i]]={}
				}
			}else{
				node[path[i]]={}
			}
			
			parentNode=node;
			node=node[path[i]];
		}

		parentNode[path[i-1]]=val;
		localStorage.setItem(path[0],JSON.stringify(database));
		
		return true;
	}
	
	object.getLocalData=function(path){
		if (path.length==0){ return false; }
		path=path.split(".");
		var max=path.length;

		var database=JSON.parse(localStorage.getItem(path[0]));
		if (database==null){
			return false;
		}

		var node=database;
		var i=0;
		
		for (i=1;i<max;i++){
			if (node[path[i]]){
				node=node[path[i]];				
			}else{
				return false;
			}
		}

		return node;
	}
	
	//animate
	//animates an object, multiple animations can be set at once
	object.animate=function(actionObject,speed,step,animation,actionCallback,actionEndCallback,cleanUp){
		/*
		animation
			type	-	move
			startX
			startY
			stopX
			stopY
			stepX
			stepY
			progressX
			progressY
			callback
		
			type	-	alpha
			startAlpha
			stopAlpha
			stepAlpha
			progressAlpha
			callback
	
			type	-	scale
			startWidth
			startHeight
			stopWidth
			stopHeight
			stepWidth
			stepHeight
			callback
		
			type	-	rotate
			startAngle
			stopAngle
			direction
			step
			callback
		*/
	    var boss=this;
		var callId=null;
		var currentStep=0;
		
		var processStart=function(){
			var max=animation.length;
			for(var i=0;i<max;i++){
				
				if (animation[i].type=='move'){
					if (animation[i].startX==null){
						animation[i].startX=actionObject.offsetLeft;
					}else{
						if (animation[i].startX.toString().indexOf('%')>-1){
							animation[i].startX=parseFloat(animation[i].startX);
						}else{
							animation[i].startX=parseInt(animation[i].startX);
						}
					}
					if (animation[i].startY==null){
						animation[i].startY=actionObject.offsetTop;
					}else{
						if (animation[i].startY.toString().indexOf('%')>-1){
							animation[i].startY=parseFloat(animation[i].startY);
						}else{
							animation[i].startY=parseInt(animation[i].startY);
						}
					}
					
					if (animation[i].stopX!=null){
						if (animation[i].stopX.toString().indexOf('%')>-1){
							animation[i].stopX=parseFloat(animation[i].stopX);
							animation[i].unitX='%';
						}else{
							animation[i].stopX=parseInt(animation[i].stopX);
							animation[i].unitX='px';
						}
					}else{
						animation[i].stopX=animation[i].startX;
						animation[i].unitX='px';	
					}
					
					if (animation[i].stopY!=null){
						if ((animation[i].stopY.toString().indexOf('%'))>-1){
							animation[i].stopY=parseFloat(animation[i].stopY);
							animation[i].unitY='%';
						}else{
							animation[i].stopY=parseInt(animation[i].stopY);
							animation[i].unitY='px';
						}
					}else{
						animation[i].stopY=animation[i].startY;
						animation[i].unitY='px';	
					}

					animation[i].stepX=(animation[i].stopX-animation[i].startX)/step;
					animation[i].stepY=(animation[i].stopY-animation[i].startY)/step;
					animation[i].progressX=0;
					animation[i].progressY=0;
				}
				
				if (animation[i].type=='alpha'){
					if ((!animation[i].startAlpha)&&(animation[i].startAlpha!=0)){
						animation[i].startAlpha=100;
					}
					animation[i].stepAlpha=(animation[i].stopAlpha-animation[i].startAlpha)/step;
					animation[i].progressAlpha=animation[i].startAlpha;
				}
			}
		}

		var processEnd=function(){
			var max=animation.length;
			for(var i=0;i<max;i++){
				
				if (animation[i].type=='move'){
					actionObject.style.left=animation[i].stopX+animation[i].unitX;
					actionObject.style.top=animation[i].stopY+animation[i].unitY;
				}
				if (animation[i].type=='alpha'){
					system.setAlpha(actionObject,animation[i].stopAlpha);
				}
				
			}
			if (actionCallback!=null){
				actionCallback(currentStep);
			}
			if (actionEndCallback!==null){
				actionEndCallback();
			}
			boss.data.animation.on=false;
		}

		var cancelProcess=function(where){
			if (callId!==null){
				clearTimeout(callId);
				callId=null;
				if (cleanUp!==null){
					cleanUp();
				}
			}
		}

		var process=function(){
			var max=animation.length;
			for(var i=0;i<max;i++){
				
				if (animation[i].type=='move'){
					animation[i].progressX+=animation[i].stepX;
					animation[i].progressY+=animation[i].stepY;
					var newLeft=animation[i].startX+animation[i].progressX;
					if (animation[i].unitX!='%'){newLeft=Math.round(newLeft);}
					else{newLeft=newLeft.toFixed(2);}
					var newTop=Math.round(animation[i].startY+animation[i].progressY);
					if (animation[i].unitY!='%'){newTop=Math.round(newTop);}
					else{newTop=newTop.toFixed(2);}
					
					/*if ( ((animation[i].stepX<0)&&(newLeft<animation[i].stopX)) || ((animation[i].stepX>=0)&&(newLeft>animation[i].stopX)) ){
						newLeft=animation[i].stopX;
					}
					if ( ((animation[i].stepY<0)&&(newTop<animation[i].stopY)) || ((animation[i].stepY>=0)&&(newTop>animation[i].stopY)) ){
						newTop=animation[i].stopY;
					}*/
					actionObject.style.left=newLeft+animation[i].unitX;
					actionObject.style.top=newTop+animation[i].unitY;
					if (animation[i].callback){
						animation[i].callback([animation[i].progressX,animation[i].progressY]);
					}
				}

				if (animation[i].type=='alpha'){
					animation[i].progressAlpha+=animation[i].stepAlpha;
					system.setAlpha(actionObject,Math.round(animation[i].progressAlpha));
					if (animation[i].callback){
						animation[i].callback(animation[i].progressAlpha);
					}				
				}

			}
			if (actionCallback!==null){
				actionCallback(currentStep);
			}
			currentStep++;
			if (currentStep<step){
				callId=setTimeout(process,speed);
			}else{
				processEnd();
			}
		}
		
		processStart();
		callId=setTimeout(process,0);
		return cancelProcess;
	}
	
	//startMoveAction
	//starts a move operation calling a callback function on each mouseMove event
	object.startMoveAction=function(actionEvent,actionObject,actionParent,actionCallback,actionCallbackEnd,actionButton){
		if (actionEvent.noAction){

		}else{
			if (this.action.type==null){
				this.action.object=actionObject;
				this.action.parent=actionParent;
				this.action.callback=actionCallback;
				this.action.callbackEnd=actionCallbackEnd;
				this.action.button=actionButton;
				this.action.startX=parseInt(actionEvent.clientX);
				this.action.startY=parseInt(actionEvent.clientY);
				this.action.type='move';
			}
		}
	}	

	//stops the move operation
	object.stopAction=function(){
		if (this.action.type=='move'){
			if (this.action.callbackEnd){
				this.action.callbackEnd();
			}		
			this.action.type=null;
			this.action.callback=null;
			this.action.callbackEnd=null;
			this.action.element=null;
			this.action.object=null;
			this.action.parent=null;
		}
		
		if (this.action.type=='dragStart'){
			this.action.type=null;
		}else if (this.action.type=='drag'){
			this.action.noDragDrop(this.action.draggedObject,this.action.startX,this.action.startY);
			this.action.type=null;
			this.action.object=null;
		}else if (this.action.type=='dragEnd'){
			this.action.type=null;
			this.action.object=null;
		}
	}

	//startDragAction
	//starts a drag drop operation
	object.startDragAction=function(actionEvent,dragStart,dragStop,dragDrop,noDragDrop){
		if (this.action.type==null){
			if (dragStart){ system.action.dragStart=dragStart; }else{ system.action.dragStart=function(){};	}
			if (dragStop){ system.action.dragStop=dragStop; }else{ system.action.dragStop=function(){};	}
			if (dragDrop){ system.action.dragDrop=dragDrop; }else{ system.action.dragDrop=function(){};	}
			if (noDragDrop){ system.action.noDragDrop=noDragDrop; }else{ system.action.noDragDrop=function(){};	}
			system.action.startX=parseInt(actionEvent.clientX);
			system.action.startY=parseInt(actionEvent.clientY);
			system.action.type='dragStart';
		}
	}	

        //loadModule
        //loads a javascript code
	/*OLD CODE WHICH WORKS WITHOUT JSON OBJECTS
	 object.loadModule=function(module,code,callBack){
		var ajaxCallBack=function(data){
			if (data.charAt(0)=='1'){
				var data=data.substring(2);
				eval(data);
				if (callBack!==null){
				    checkComplete=function(){
					if (system.loadComplete==true){
					    callBack(true);
					}else{
					    setTimeout(checkComplete,100);
					}
				    }
				    setTimeout(checkComplete,100);
				    
				}
			}else{
				//system.showMessage(3,1,data.substring(2));
                                //track.write('Error: '+data.substring(2));
				alert(data.substring(2)+'\n Please try again.');
				if (callBack!==null){
				    callBack(false);
				}				
			}
		}

		if (typeof(window[code])==='undefined'){
			this.loadComplete=false;
    			var parameters='module='+module+'&code='+code;
			com.connection(parameters,ROOT_FOLDER+'/load_module.php',ajaxCallBack,3);
		}else{
			//system.activateWindow(window[code].taskbarOrder);
                        alert('Var name already exist.');
		}
	}      */  

	//On success it calls the callback with the TRUE parameter, otherwise with the FALSE parameter. ON false it also returns a MESSAGE parameter.
	object.loadModule=function(module,code,callBack){
		var This=this;
		var ajaxCallBack=function(data){

			//alert(data);
			var data=eval('data='+data);
			if (data.code==1){
				This.setLocalData('modules.'+module+'.script',data.data);
				eval(data.data);
				if (callBack!==null){
				    /*checkComplete=function(){
					if (system.loadComplete==true){
					    callBack(true);
					}else{
					    setTimeout(checkComplete,100);
					}
				    }
				    setTimeout(checkComplete,100);*/
				    callBack(true);
				}
			}else{
				//system.showMessage(3,1,data.substring(2));
                                //track.write('Error: '+data.substring(2));
				alert(data.message);
				if (callBack!==null){
				    callBack(false);
				}				
			}
		}

		if (typeof(window[code])==='undefined'){
			if ((1==2)&&(this.getLocalData('modules.'+module+'.script'))){
				var data=this.getLocalData('modules.'+module+'.script');
				eval(data);
				//alert('Script loaded from local storage :)');
				callBack(true);
			}else{
				//this.loadComplete=false;
				var sender={module:module,code:code};
				com.connection(sender,ROOT_FOLDER+'/load_module.php',ajaxCallBack,3);
			}
		}else{
            alert('Var name already exist.');
		}
	}        

	//BringToFront
	object.bringToFront=function(obj){
		var father=obj.parentNode;
		var lng=father.childNodes.length;
		if (obj.style.zIndex==''){
			obj.style.zIndex=1;
		}
		var max=obj.style.zIndex;			
		
		var min=1;
		var empty=0;
		
		for (var i=0;i<lng;i=i+1){
			//if ((father.childNodes(i).style.zIndex>obj.style.zIndex)&&(father.childNodes(i).objectType==obj.objectType)){
			if ((father.childNodes[i].style)&&(father.childNodes[i]!==obj)){
				if (father.childNodes[i].style.zIndex==''){
					empty++;
				}else{
					if (father.childNodes[i].style.zIndex>=max){
						max=father.childNodes[i].style.zIndex;
					}
					if (father.childNodes[i].style.zIndex>=obj.style.zIndex){
						father.childNodes[i].style.zIndex--;
					}
					if (father.childNodes[i].style.zIndex<min){
						min=father.childNodes[i].style.zIndex;
					}
				}
			}
		}
		obj.style.zIndex=max;
		var i=0;
		var j=0;

		while (j<empty){
			if (father.childNodes[i].style){
				if (father.childNodes[i].style.zIndex==''){
					father.childNodes[i].style.zIndex=min+j;
					j++;
				}else{
					father.childNodes[i].style.zIndex=parseInt(father.childNodes[i].style.zIndex)+empty;
				}
			}
			i++;
		}
	}

	//registerResize
	object.registerResize=function(callback){
		local.resizeList.push(callback);
	}

        //lock
        object.lock=function(obj,silent,smooth,callBack){
			if (!obj.data){obj.data=new Object();}

            if (obj.data.locker==null){
                var div=document.createElement('div');

                div.style.position='absolute';
                div.style.left=0;
                div.style.top=0;
                div.style.overflow='hidden';
                div.style.width='100%';
                div.style.height='100%';
                div.style.backgroundColor='black';
                object.setAlpha(div,0);
                obj.appendChild(div);
                obj.data.locker=div;

                if (silent===false){
                    if (smooth===true){
                        var step=0;
                        
                        var roll=function(){
                            if (step<5){
                                object.setAlpha(div,step);
                                step++;
                                setTimeout(roll,50);
                            }else{
                                if (callBack!==null){callBack();}
                            }
                        }
                        setTimeout(roll,200);
                    }else{
                        this.setAlpha(div,10);
                        if (callBack!==null){callBack();}
                    }
                }else{
                    if (callBack!==null){callBack();}
		}    
            }else{
		if (callBack!==null){callBack();}
	    }
        }

        //showLoading
        object.unlock=function(obj,smooth,callBack){
			if (!obj.data){obj.data=new Object();}
            if (obj.data.locker!==null){
                if (smooth===true){
                    var step=5;
                    var roll=function(){
                         if (step>0){
                            step--;                             
                            object.setAlpha(obj.data.locker,step);
                            setTimeout(roll,50);
                        }else{
                            obj.removeChild(obj.data.locker);
                            obj.removeAttribute('locker');
                            if (callBack!==null){callBack();}
                        }
                    }
                    setTimeout(roll,200);
                }else{
		    object.setAlpha(obj.data.locker,100);
		    obj.removeChild(obj.data.locker);
                    delete obj.data.locker;
                    if (callBack!==null){callBack();}
               }
            }
        }
		
		//Tooltip
		local.hideTooltip=function(){
			if (local.tooltip.cancelId!==null){
				clearTimeout(local.tooltip.cancelId);
				local.tooltip.cancelId=null;
			}
			if (local.tooltip.element!=null){
				local.tooltip.element=null;
				local.tooltip.box.parentNode.removeChild(local.tooltip.box);
			}
		}
		
		object.showTooltip=function(event,obj){
			var showTip=function(){
				var box=document.createElement('div');
				box.data=new Object();
				box.data.title='';
				box.style.border='1px solid '+theme.colors.border;
				var col=theme.colors.area;
				object.setColorRGBA(col,0,0,0,70);
				box.style.backgroundColor=col.getRGB();
				box.style.position='absolute';
				box.style.overflow='hidden';
				box.style.left=(local.screenX+10)+'px';
				box.style.top=local.screenY+'px';
				box.innerHTML="<table style='width:100%;height:100%;font-size:11px;color:black;'><tr><td style='padding:2px;'>"+local.tooltip.message+"</table>";
				object.setCornerRadius(box,theme.radius,theme.radius,theme.radius,theme.radius);
				box.style.visibility='hidden';
				object.content.appendChild(box);
				local.tooltip.box=box;
				var x=local.screenX+15;
				var y=local.screenY;
				var docWidth=window.innerWidth;
				var docHeight=window.innerHeight;
				if ((docWidth-local.screenX)<box.offsetWidth){
					x=x-box.offsetWidth-20;
				}
				if ((docHeight-local.screenY)<box.offsetHeight){
					y=y-box.offsetHeight;
				}
				box.style.left=x+'px';
				box.style.top=y+'px';
				box.style.visibility='visible';
			}
			while (obj.data==null){
				obj=obj.parentNode;
			}
			if ((obj.data)&&(obj.data.title)){
				if ((obj!==local.tooltip.element)&&(obj!==local.tooltip.box)){
					local.hideTooltip();

					local.tooltip.element=obj;
					local.tooltip.message=obj.data.title;
					local.tooltip.cancelId=setTimeout(showTip,1500);
				}
			}else{
				if (obj!==local.tooltip.box){
					local.hideTooltip();
				}
			}
		}

		/*Message
		Ex:	message({type:'disolve/click/action',
					lock:true/false,
					content:'You have done very good.',
					image:src, / image:{width:100,height:100,canvas:canvas_image,parameters:canvas_parameters},
					buttons:[{label:'Ok',width:'100px',callback:callbackFunction},{label:'Cancel'...}]});
		*/
		local.messageBoxes=new Array();
	   
		object.message=function(param){
			var box=document.createElement('div');
			box.data=new Object();
			box.style.border='1px solid '+theme.colors.border;
			box.style.backgroundColor=theme.colors.area;
			box.style.position='absolute';
			box.style.overflow='hidden';
			if (!param.width){param.width=400}
			if (!param.height){param.height=250}
			if (!param.font){param.font='Arial';}
			if (!param.type){param.type='action';}
			if (!param.lock){param.lock=false;}
			box.style.width=param.width+'px';
			box.style.height=param.height+'px';
			
			box.style.zIndex='10000';

			if (param.lock){object.lock(object,false,false,null);}

			box.innerHTML="<table border='0' cellspacing='0' cellpadding='0' style='width:100%;height:100%;font-family:"+param.font+";font-size:12px;color:black;'>\
				<tr><td style='vertical-align:top;padding:5px;'>\
					<td style='width:100%;height:100%;padding:10px;padding-left:0px;vertical-align:top;'>\
						<div style='position:relative;width:100%;height:100%;'>\
							<div style='position:absolute;width:100%;height:100%;overflow:hidden;word-wrap: break-word;'>\
								"+param.content+"\
							</div>\
						</div>\
					<td style='padding:5px;'>\
				<tr><td colspan='3' style='padding-left:10px;padding-right:10px;'><div style='width:100%;height:0px;overflow:hidden;border-top:1px solid "+theme.colors.border+"'></div>\
				<tr><td align='right' colspan='3' style='padding:5px;padding-right:5px;'><table cellpadding='2' cellspacing='0'><tr></table>\
			</table>";
			object.setCornerRadius(box,theme.radius,theme.radius,theme.radius,theme.radius);

			if (param.image){
				var tab=system.getChildNode(box,1);
				if (param.image.canvas){
					if (!param.image.width){param.image.width=100;}
					if (!param.image.height){ param.image.height=100;}
					var imag=system.canvas({width:param.image.width,height:param.image.height,canvas:param.image.canvas});
					tab.rows[0].cells[0].appendChild(imag);
					imag.draw(param.image.parameters);
				}
			}

			var scroll=new x_Scrollbar({
				link:system.getChildNode(tab.rows[0].cells[1],'1:1'),
				width:'8px',
				height:'100%',
				type:'vertical',
				color:theme.colors.border,
				backgroundColor:theme.colors.background,
				drag:{
					size:30,
					top:0,
					bottom:0
				}
			});
			scroll.style.visibility='hidden';
			tab.rows[0].cells[2].appendChild(scroll);
			scroll.show();

			box.onmouseover=function(){scroll.style.visibility='visible';}
			box.onmouseout=function(){scroll.style.visibility='hidden';}

			var destroyBox=function(){
				box.parentNode.removeChild(box);
				object.unlock(object,false,null);
			}

			if (param.buttons){
				var buttonTable=system.getChildNode(tab.rows[2].cells[0],'1:1:1');
				var max=param.buttons.length;
				for (var i=0;i<max;i++){
					if (!param.buttons[i].label){param.buttons[i].label='Ok';}
					var but=null;
					var doit=function(){
						var clbk=param.buttons[i].callback;
						but=new x_Button({label:param.buttons[i].label,callback:function(){destroyBox();clbk();},borderColor:theme.colors.border});				
					}
					doit();
					but.style.display='block';
					var newCell=buttonTable.insertCell(-1);
					newCell.appendChild(but);
					but.show();
				}
			}else{
				tab.rows[1].style.display='none';
			}
			
			var repositionBox=function(){
				box.style.left=document.body.scrollLeft+ ((document.body.clientWidth-param.width)/2) +'px';
				box.style.top=document.body.scrollTop+ ((document.body.clientHeight-param.height)/2) +'px';			
			}

			this.registerResize(repositionBox);
			repositionBox();

			if (param.type=='click'){
				local.messageBoxes.push(destroyBox);
			}

			if (param.type=='disolve'){
				var cancelAnimation=null;
				var cancelTimeout=null;
				tab.onmouseover=function(){
					if (typeof cancelAnimation=='function'){
						cancelAnimation();
						cancelAnimation=null;
						object.setAlpha(box,100);
						cancelTimeout=setTimeout(function(){cancelAnimation=object.animate(box,20,100,[{type:'alpha',startAlpha:100,stopAlpha:0,callback:null}],null,destroyBox,null);},1000);
					}
					if (cancelTimeout!=null){
						clearTimeout(cancelTimeout);
						cancelTimeout=setTimeout(function(){cancelAnimation=object.animate(box,20,100,[{type:'alpha',startAlpha:100,stopAlpha:0,callback:null}],null,destroyBox,null);},1000);
					}
				}
				cancelTimeout=setTimeout(function(){cancelAnimation=object.animate(box,20,100,[{type:'alpha',startAlpha:100,stopAlpha:0,callback:null}],null,destroyBox,null);},1000);
			}
			
			
			object.content.appendChild(box);
		
		}



//============
//CROS BROWSER
//============
	//getChildNode
	//gets the child node with index
	object.getChildNode=function(actionNode,no){
	    no=no.toString();
	    var start=no.indexOf(':');
	    if (start!=-1){
		var deep=no.substring(start+1);
		var no=no.substring(0,start);
	    }
		
	    var current=0;
	    var currentNode=0;
	    var count=actionNode.childNodes.length;
	    while (current<count){
	    	if (actionNode.childNodes[current].nodeType==1){
	    		currentNode++;
	    		if (currentNode==no){
			    if (start==-1){
	    			return(actionNode.childNodes[current]);
			    }else{
				return(this.getChildNode(actionNode.childNodes[current],deep));
			    }
	    		}
	    	}
	    	current++;
	    }
		return false;
	}


	//setStyle
	//sets the style for an element. Can take a string with styles and works cros browser.
	object.setStyle=function(element,styleString){
		element.setAttribute('style',styleString);
		element.style.cssText=styleString;
	}

	object.setAlpha=function(obj,opacity){
            obj.style.mozOpacity=opacity/100;
            obj.style.msFilter='alpha(opacity='+opacity+')';
            obj.style.filter='alpha(opacity='+opacity+')';
            obj.style.opacity=opacity/100;
        }
        
	object.setInnerText=function(obj,txt){
	    if ('innerText' in obj){
		obj.innerText=txt;
	    }else{
		obj.textContent=txt;
	    }
	}

	object.getEventWheelDelta=function(e){
		return(e.detail? e.detail*(-120) : e.wheelDelta); 
	}
	
	object.addEvent=function(obj,e,f){
		if (e=='mouseWheel'){
			if ((system.browser=='MIE')||(system.browser=='GOG')){
				obj.onmousewheel=f;
			}
			if ((system.browser=='NET')||(system.browser=='OPE')){
				obj.addEventListener('DOMMouseScroll',f,false);				
			}
		}else{
			//obj.addEventListener ? obj.addEventListener(e,f,false) : obj.attachEvent("on"+e,f);
			if (obj.addEventListener){
				obj.addEventListener(e,f,false);
			}else if(obj.attachEvent){
				obj.attachEvent("on"+e,f);
			}else{
				obj["on"+e]=f;
			}
		}
	}

/*	object.getEventButton=function(e){
		if ((system.browser=='MIE')||(system.browser=='GOG')||(system.browser=='NET')||(system.browser=='OPE')){
			return e.button;
		}
	}*/

object.getMouseXYRelativeTo=function(event,obj,scroll){
		var x = 0;
		var y = 0;
		var target=event.target? event.target : event.srcElement;

		var ret=new Array();

		while((target!=null)&&(target!==obj)) {
			if (parseInt(target.style.borderLeftWidth)){
				x=x+parseInt(target.style.borderLeftWidth);
			}
			if (parseInt(target.style.marginLeft)){
				x=x-parseInt(target.style.marginLeft);
			}
			if (parseInt(target.style.paddingLeft)){
				x=x-parseInt(target.style.paddingLeft);
			}
			
			if (parseInt(target.style.borderTopWidth)){
				y=y+parseInt(target.style.borderTopWidth);
			}
			if (parseInt(target.style.marginTop)){
				y=y-parseInt(target.style.marginTop);
			}
			if (parseInt(target.style.paddingTop)){
				y=y-parseInt(target.style.paddingTop);
			}

			x=x+target.offsetLeft;
			y=y+target.offsetTop;

			if (target!=null){
				x-=target.scrollLeft;
				y-=target.scrollTop;
			}
		
			target=target.parentNode;
		}
		ret[0]=x;
		ret[1]=y;
		while(target!=null) {
			if (parseInt(target.style.borderLeftWidth)){
				x=x+parseInt(target.style.borderLeftWidth);
			}
			if (parseInt(target.style.marginLeft)){
				x=x-parseInt(target.style.marginLeft);
			}
			if (parseInt(target.style.paddingLeft)){
				x=x-parseInt(target.style.paddingLeft);
			}
			
			if (parseInt(target.style.borderTopWidth)){
				y=y+parseInt(target.style.borderTopWidth);
			}
			if (parseInt(target.style.marginTop)){
				y=y-parseInt(target.style.marginTop);
			}
			if (parseInt(target.style.paddingTop)){
				y=y-parseInt(target.style.paddingTop);
			}

			x=x+target.offsetLeft;
			y=y+target.offsetTop;

			if (target!=null){
				x-=target.scrollLeft;
				y-=target.scrollTop;
			}
			
			target=target.offsetParent;			
		}

		ret[0]+=event.clientX-x;
		ret[1]+=event.clientY-y;

		return ret;
	}



	object.getElementXYPosition=function(obj){
		var x = 0;
		var y = 0;

		while(obj!=null) {
			if (parseInt(obj.style.borderLeftWidth)){
				x=x+parseInt(obj.style.borderLeftWidth);
			}
			if (parseInt(obj.style.borderTopWidth)){
				y=y+parseInt(obj.style.borderTopWidth);
			}
			x=x+obj.offsetLeft;
			y=y+obj.offsetTop;
			obj=obj.offsetParent;
		}
		var ret=new Array();
		ret[0]=x;
		ret[1]=y;
		return ret;
	}

	object.cancelEvent=function(e){
		try {
			if (e) {
	            e.returnValue = false;
	            e.cancelBubble = true;
	            if (e.stopPropagation) {
	                e.stopPropagation();
	            }
	            if (e.preventDefault) {
	                e.preventDefault();
	            }
	        }
			} catch (c) {alert(c); }
		return false;
	}		

	object.setCornerRadius=function(obj,lt,rt,lb,rb){
		obj.style.borderRadius=lt+'px '+rt+'px '+lb+'px '+rb+'px';
		obj.style.MozBorderRadius=lt+'px '+rt+'px '+lb+'px '+rb+'px';
		obj.style.WebkitBorderRadius=lt+'px '+rt+'px '+lb+'px '+rb+'px';
	}

	object.setGradient=function(obj,type){
		//
		//cols format - rgba(30,87,153,1) 0%,rgba(125,185,232,0) 100%
		if (object.browser=='MIE'){
			obj.style.backgroundColor=arguments[1];
		}
		cols=arguments[2]+' '+arguments[3]+'%';
		var max=arguments.length;
		for (var i=4;i<max;i=i+2){
			cols+=','+arguments[i]+' '+arguments[i+1]+'%';
		}
		obj.style.backgroundImage='-moz-linear-gradient('+type+','+cols+')';
		obj.style.backgroundImage='-webkit-linear-gradient('+type+','+cols+')';
		obj.style.backgroundImage='-o-linear-gradient('+type+','+cols+')';
		obj.style.backgroundImage='-ms-linear-gradient('+type+','+cols+')';
		obj.style.backgroundImage='linear-gradient('+type+','+cols+')';
	}	
	
	object.setBoxShadow=function(obj,type,hor,ver,blur,spread,color){
		obj.style.mozBoxShadow=type+' '+hor+'px '+ver+'px '+blur+'px '+spread+'px #'+color;
		obj.style.webkitBoxShadow=type+' '+hor+'px '+ver+'px '+blur+'px '+spread+'px #'+color;
		obj.style.boxShadow=type+' '+hor+'px '+ver+'px '+blur+'px '+spread+'px #'+color;
	}
	object.setTextShadow=function(obj,hor,ver,blur,color){
		obj.style.textShadow=hor+'px '+ver+'px '+blur+'px '+color;
		obj.style.filter='dropshadow(color='+color+', offx='+hor+', offy='+ver+')';
		obj.style.filter='progid:DXImageTransform.Microsoft.Shadow(color='+color+',direction=1,strength=1)'; 
	}
	object.setRotate=function(obj,deg){
		obj.style.MozTransform='rotate('+deg+'deg)';
		obj.style.webkitTransform='rotate('+deg+'deg)';
		obj.style.oTransform='rotate('+deg+'deg)';
		obj.style.msTransform='rotate('+deg+'deg)';
	}
	object.setScale=function(obj,scl){
		obj.style.MozTransform='scale('+scl+')';
		obj.style.webkitTransform='scale('+scl+')';
		obj.style.oTransform='scale('+scl+')';
		obj.style.msTransform='scale('+scl+')';
		obj.style.transform='scale('+scl+')';
	}
	object.setSkew=function(obj,deg){
		obj.style.MozTransform='skew('+deg+'deg)';
		obj.style.webkitTransform='skew('+deg+'deg)';
		obj.style.oTransform='skew('+deg+'deg)';
		obj.style.msTransform='skew('+deg+'deg)';
	}
	object.setBoxType=function(obj,type){
		if (type=='out'){type='content-box;';}
		else{type='border-box';}
		
		obj.style.boxSizing=type;
		obj.style.MozBoxSizing=type;
		obj.style.webkitBoxSizing=type;
	}
	object.setClipping=function(obj,type){
		//border / padding / content
		obj.style.MozBackgroundClip=type;
		obj.style.webkitBackgroundClip=type;
		obj.style.backgroundClip=type+'-box';
	}
	object.keys = function(obj,each){ 
	    var keys = ''; 
		var i=0;
	    for(var key in obj){ 
			i++;
		keys+=key+'\n'; 
		if (i==each){alert(keys);i=0;keys='';}
	    } 
	    return keys; 
	    } 

	object.setBoxType(object.content,'in');
	window.onresize=function(){
		var max=local.resizeList.length;
		for (var i=0;i<max;i++){
			if (typeof(local.resizeList[i])=='function'){
				local.resizeList[i]();
			}else{
				local.resizeList.splice(i,1);
				i--;
				max--;
			}
		}
	}
	
    return object;
}