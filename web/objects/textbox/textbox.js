/*TEXTBOX
-------
Creates a small icon like button with 3 states
CONSTRUCTOR
	label	-	text to appear on the button
	title	-	the alt title of the button/what the button does
	width	-	the width of the image
	height	-	the height of the image
	maxLength  -	the maximum length of the textfield. Default: 25
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

function x_Textbox(param){
	
	var object=document.createElement('div');
        object.style.display='none';
		object.style.left=-10000;
        object.style.top=-10000;
		object.style.width=param.width;
		object.style.height='25px';
		object.style.border='0px solid black';
		object.style.overflow='hidden';
		
		object.data=new Object();
		
		var local=new Object();
		local.border='#000000';
		local.background='#FFFFFF';
		local.radius=0;
		local.font='Arial';
		
		local.color='#000000';
		local.pressed=0;
		local.type='text';
		local.maxLength=25;
		local.hint='';
		local.hintOn=true; //Shows if the content is empty or not. Used in order to display the hint
		
		local.onClick=function(){}
		local.onMouseDown=function(){}
		local.onMouseUp=function(){}

		if (param.onClick){ local.onClick=param.onClick;}
		if (param.onMouseDown){ local.onClick=param.onMouseDown;}
		if (param.onMouseUp){ local.onClick=param.onMouseUp;}
		if (param.type=='password'){ local.type='password';}
		if (param.maxLength){ local.maxLength=param.maxLength;}
		if (param.title){ object.data.title=param.title;}
		if (param.hint){ local.hint=param.hint;}
		
		if (param.style){
			if (param.style.color){ local.color=param.style.color;}
			if (param.style.border){ local.border=param.style.border;}
			if (param.style.background){ local.background=param.style.background;}
			if (param.style.radius){ local.radius=param.style.radius;}
			if (param.style.font){ local.font=param.style.font;}
		}
		
		var hintColor=system.setColorHSVA(local.color,0,0,0,0.5,'RGBA');

	var newInnerHTML="\
	    <div style='position:relative;cursor:pointer;border:0 solid blue;width:100%;height:100%;overflow:hidden;position:relative;background-color:"+local.background+";'>\
			<div style='position:absolute;left:0px;top:0px;width:100%;height:100%;padding-left:2px;padding-right:2px;'><input type='text' value='"+local.hint+"' maxlength='"+local.maxLength+"' style='border:none;color:"+hintColor+";font-family:"+local.font+";width:100%;height:100%;'></div>\
			<div style='display:none;position:absolute;left:0px;top:0px;width:10px;height:100%;overflow:hidden;'></div>\
			<div style='display:none;position:absolute;right:0px;top:0px;width:10px;height:100%;overflow:hidden;'></div>\
   	    </div>";
    
	object.innerHTML=newInnerHTML;

	var main=system.getChildNode(object,'1');
	main.style.border='1px solid '+local.border;
	system.setBoxType(main,'in');
	system.setCornerRadius(main,local.radius,local.radius,local.radius,local.radius);

	var text=system.getChildNode(object,'1:1:1');
	system.setBoxType(text,'in');
	system.setBoxType(text.parentNode,'in');

	var leftblur=system.getChildNode(object,'1:2');
	var rightblur=system.getChildNode(object,'1:3');
	system.setGradient(leftblur,'left','rgba(255,255,255,1)',0,'rgba(255,255,255,0)',0);
	system.setGradient(rightblur,'right','rgba(255,255,255,1)',0,'rgba(255,255,255,0)',0);

	main.onclick=function(){text.focus();}

	var showHint=function(){
		text.style.color=hintColor;
		text.setAttribute('type','text');
		text.value=local.hint;
	}
	var hideHint=function(){
		text.setAttribute('type',local.type);
		text.style.color=local.color;
		text.value='';
	}

	text.onfocus=function(){
		if (local.hintOn){
			hideHint();
			local.hintOn=false;
		}
	}
	text.onblur=function(){
		if (text.value==''){
			showHint();
			local.hintOn=true;			
		}
	}
	
	object.setValue=function(val){
		text.value=val;
		if (text.value!=''){
			hideHint();
			local.hintOn=false;
		}else{
			showHint();
			text.value=local.hint;
			local.hintOn=true;
		}
	}

	object.getValue=function(){
		if (local.isEmpty){
			return '';
		}else{
			return text.value;
		}
	}

	object.show=function(){
		this.style.display='block';
	}

	object.hide=function(){
		this.style.display='none';
	}

	return object;
}