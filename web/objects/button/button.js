/*
BUTTON
------

CONSTRUCTOR
	width	-	the width of the button
	height	-	the height of the button
ATTRIBUTES
	PUBLIC

	PRIVATE

PUBLIC METHODS
	
EXAMPLE

*/
function x_Button(param){

	if (!param.width){param.width='50';}
	if (!param.height){param.height='22';}
	if (!param.image){param.image={};}
	if (!param.image.width){param.image.width='25px';}
	if (!param.image.src){param.image.src='#';}
	if (!param.font){param.font={};}
	if (!param.font.color){param.font.color='red';}
	if (!param.borderColor){param.borderColor='gray';}
	
	if (!param.color){param.color=theme.colors.note;}
	if (!param.normalColor){param.normalColor=theme.colors.area;}
	if (!param.backgroundColor){param.backgroundColor=theme.colors.background;}
	if (!param.label){param.label='';}
	if (!param.fontFamily){param.fontFamily='Helvetica';}
	
	var baseColor=param.color;

	var colors=new Object();
		colors.baseColor=baseColor;
		colors.backColor=system.setColorHSVA(baseColor,0,0,20,0,'HEX');
		colors.borderColor=system.setColorHSVA(baseColor,0,0,-50,0,'HEX');

	var object=document.createElement('div');
        object.style.display='none';
		if (param.width){
			object.style.width=param.width+'px';
		}
		object.style.height=param.height+'px';
		object.style.border='1px solid '+param.borderColor;
		object.style.overflow='hidden';
		
		object.data=new Object();
		
		var local=new Object();
		local.pressed=0;
		local.radius=theme.radius;
		
		
		object.data.eventOnClick=function(){}
		object.data.eventOnMouseDown=function(){}
		object.data.eventOnMouseUp=function(){}

		if (param.callback){object.data.eventOnClick=param.callback;}
		
	var newInnerHTML="\
	    <div style='width:100%;height:100%;border:0 solid blue;position:relative;'>\
		<table border='0' cellpadding='0' cellspacing='0' style='position:absolute;left:0px;op:0px;width:100%;table-layout:fixed;overflow:hidden;height:100%;border:0px solid green;margin:0;'>\
			<tr>\
				<td align='center' style='vertical-align:middle;color:"+param.color+";'>\
					<span style='font-size:12px;font-family:"+param.fontFamily+";'>"+param.label+"</span>\
		</table>\
   	    </div>";
    
	object.innerHTML=newInnerHTML;

	local.inside=system.getChildNode(object,1);
	
	system.setCornerRadius(object,theme.radius,theme.radius,theme.radius,theme.radius);
	system.setCornerRadius(local.inside,theme.radius,theme.radius,theme.radius,theme.radius);
	system.setGradient(local.inside,colors.backColor,100,colors.baseColor,100);

	object.content=system.getChildNode(object,'1:1:1:1:1');

	object.onmouseover=function(e){
		var event=e?e:window.event; 
		local.pressed=0;
		system.setGradient(local.inside,'bottom',param.backgroundColor,0,param.normalColor,100);
	}

	object.onmouseout=function(e){
		var event=e?e:window.event; 
		event.noAction=true;
		local.pressed=0;
		
		var target=event.target? event.target : event.srcElement;
		var toTarget = event.relatedTarget || event.toElement;
		while (toTarget!==event.currentTarget && toTarget.tagName!='BODY'){
			toTarget=toTarget.parentNode;
		}
		if (toTarget!==event.currentTarget){
			system.setGradient(local.inside,'bottom',param.normalColor,0,param.normalColor,100);
			//system.setBoxShadow(object,'',0,0,1,0,'333');
		}
	}

	object.onmousedown=function(e){
		var event=e?e:window.event; 
		event.noAction=true;
		local.pressed=1;
		system.setGradient(local.inside,'bottom',param.backgroundColor,0,param.backgroundColor,100);
		//system.setBoxShadow(object,'',0,0,0,0,'333');
		this.data.eventOnMouseDown();
	}

	object.onmouseup=function(e){
		var event=e?e:window.event; 
		if (local.pressed==1){
			local.pressed=2;
			system.setGradient(local.inside,'bottom',param.backgroundColor,0,param.normalColor,100);
			//system.setBoxShadow(object,'',0,0,1,0,'333');
			this.data.eventOnMouseUp();
		}else{
			local.pressed=0;
		}
	}

	object.onclick=function(){
		if (local.pressed==2){
			this.data.eventOnClick();
		}
	}

	object.show=function(){
		this.style.display='block';
	}

	return object;
}