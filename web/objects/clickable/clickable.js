/*CLICKABL
-------
Creates a small icon like button with 3 states
CONSTRUCTOR
	label	-	text to appear on the button
	title	-	the alt title of the button/what the button does
	width	-	the width of the image
	height	-	the height of the image
	image	-	the image that appears on the button
		canvas	-	the canvas which will be drawen
		normal	-	parameters sent to the canvas when on normal state
		over	-	parameters sent to the canvas when on over state
		down	-	parameters sent to the canvas when on down state
ATTRIBUTES
	PUBLIC
	data

	PRIVATE
	local

PUBLIC METHODS
	setTitle(txt)	-	sets the text in the title

*/

function x_Clickable(param){
	
	var object=document.createElement('div');
        object.style.display='none';
		object.style.left=-10000;
        object.style.top=-10000;
		object.style.width=param.width;
		object.style.height=param.height;
		object.style.border='0px solid black';
		object.style.overflow='hidden';
		
		object.data=new Object();
		
		var local=new Object();
		local.background=theme.colors.background;
		local.border=theme.colors.border;
		local.area=theme.colors.area;
		local.info=theme.colors.confirm;
		local.alert=theme.colors.alert;
		local.note=theme.colors.note;
		local.radius=theme.radius;
		local.font=theme.fonts.font1;
		local.pressed=0;
		
		local.onClick=function(){}
		local.onMouseDown=function(){}
		local.onMouseUp=function(){}

		if (param.onClick){ local.onClick=param.onClick;}
		if (param.onMouseDown){ local.onClick=param.onMouseDown;}
		if (param.onMouseUp){ local.onClick=param.onMouseUp;}

	var newInnerHTML="\
	    <div style='cursor:pointer;border:0 solid blue;width:100%;height:100%;overflow:hidden;position:relative;'>\
			<div style='position:absolute;left:0px;top:0px;width:100%;height:100%;overflow:hidden;'></div>\
			<div style='position:absolute;font-size:12px;font-family:"+local.font+";'>"+param.label+"</div>\
   	    </div>";
    
	object.innerHTML=newInnerHTML;
	
	object.limit=system.getChildNode(object,1);
	object.limit.data={title:param.title};
	system.setCornerRadius(object,local.radius,local.radius,local.radius,local.radius);

	var can=system.canvas({width:parseInt(param.width),height:parseInt(param.height),canvas:param.image.canvas});
	can.draw(param.image.normal);
	can.style.position='absolute';
	can.style.left='0px';
	can.style.top='0px';
	system.getChildNode(object,'1:1').appendChild(can);
	//system.setGradient(local.inside,colors.backColor,100,colors.baseColor,100);
	if (system.browser!='MIE'){
		system.setTextShadow(system.getChildNode(object,'1:1'),0,1,0,'#FFF');
	}		
	object.content=system.getChildNode(object,'1:1');
	
	object.limit.onmouseover=function(e){
		var event=e?e:window.event; 
		local.pressed=0;
		can.draw(param.image.over);
	}

	object.limit.onmouseout=function(e){
		var event=e?e:window.event; 
		event.noAction=true;
		local.pressed=0;
		
		var target=event.target? event.target : event.srcElement;
		var toTarget = event.relatedTarget || event.toElement;
		while (toTarget!==event.currentTarget && toTarget.tagName!='BODY'){
			toTarget=toTarget.parentNode;
		}
		if (toTarget!==event.currentTarget){
			can.draw(param.image.normal);
		}
	}

	object.limit.onmousedown=function(e){
		var event=e?e:window.event; 
		event.noAction=true;
		local.pressed=1;
		can.draw(param.image.down);
		local.onMouseDown();
	}

	object.limit.onmouseup=function(e){
		var event=e?e:window.event; 
		if (local.pressed==1){
			local.pressed=2;
			can.draw(param.image.over);
			local.onMouseUp();
		}else{
			local.pressed=0;
		}
	}

	object.limit.onclick=function(){
		if (local.pressed==2){
			local.onClick();
		}
	}

	object.show=function(){
		this.style.display='block';
	}


	return object;
}