/*
PANEL
-------

CONSTRUCTOR
	corner
		width	-	the width of the corner image
		height	-	the height of the corner image
	content
		left -	content box distance in pixels from the left side of the panel
		top  -	content box distance in pixels from the top of the panel
		right-	content box distance in pixels from the right side of the panel
		bottom-	content box distance in pixels from the bottom of the panel
	images
		corners		-	image containing the 4 corners of the panel
		sides		-	image containing the left and right sides of the panel
		background	-	backgroundimage for the panel

METHODS
	show	-	displays the textbox
	hide	-	hides the textbox

	setTextMatch(reg,regFinal,onMatchError)
		reg	- regular expression applied on typeing
		regFinal - regular expression applied on onChange event or onblur event
		onMatchError - function to call on regular expression match error

	setTextLength(max)
		max	- the maximum length of the text

	setValue(val)
		val - value to set the textbox to

	getValue - gets the value of the textbox


CALLBACK FUNCTIONS
	eventOnchange
	eventOnBlur
	eventOnMatchError
*/
function x_Panel(param){
	var object=document.createElement('div');
        object.style.display='none';
		object.style.left=-10000;
        object.style.top=-10000;
	//object.style.width=width;
	//object.style.height=height;
	//object.style.border='1px solid black';
	object.style.overflow='hidden';
	
	var newInnerHTML="\
	    <div style='border:0 solid blue;width:100%;height:100%;overflow:hidden;position:relative;'>\
		<table cellpadding='0' cellspacing='0' style='position:absolute;width:100%;table-layout:fixed;height:100%;border:0px solid green;margin:0;'>\
			<tr height='"+param.corner.height+"px' width='100%'>\
				<td style='width:"+param.corner.width+"px;background:url("+param.images.corners+");background-repeat:no-repeat;'>\
				<td style='background:url("+param.images.corners+");background-repeat:repeat-x;background-position:0 -"+(1*param.corner.height)+";'>\
				<td style='width:"+param.corner.width+"px;background:url("+param.images.corners+");background-repeat:no-repeat;background-position:0 -"+(2*param.corner.height)+";'>\
			<tr height='100%'>\
				<td style='width:"+param.corner.width+";background:url("+param.images.sides+");background-repeat:repeat-y;background-position:0 0;'>\
				<td style='width:100%;height:100%;border:0px solid green;background:url("+param.images.background+");position:relative;'>";
				newInnerHTML+="<td style='width:"+param.corner.width+"px;background:url("+param.images.sides+");background-repeat:repeat-y;background-position:-"+(1*param.corner.width)+" 0;'>\
			<tr height='"+param.corner.height+"px' width='100%'>\
				<td style='width:"+param.corner.width+"px;background:url("+param.images.corners+");background-repeat:no-repeat;background-position:0 -"+(3*param.corner.height)+";'>\
				<td style='background:url("+param.images.corners+");background-repeat:repeat-x;background-position:0 -"+(4*param.corner.height)+";'>\
				<td style='width:"+param.corner.width+"px;background:url("+param.images.corners+");background-repeat:no-repeat;background-position:0 -"+(5*param.corner.height)+";'>\
		</table>\
		  \
		<table style='border:0px solid green;width:100%;height:100%;overflow:hidden;position:absolute;'>\
		    <tr>\
			<td align='center' style='vertical-align:middle;padding-left:"+param.content.left+"px; padding-right:"+param.content.right+"px; padding-top:"+param.content.top+"px; padding-bottom:"+param.content.bottom+"px;'>\
			    <div style='border:0px solid red;width:100%;height:100%;overflow:hidden;position:relative;'></div>\
		</table>\
   	    </div>";
    
	object.innerHTML=newInnerHTML;
	object.container=system.getChildNode(object,'1');
	object.content=system.getChildNode(object,'1:2:1:1:1:1');
	
	
   object.show=function(){
		this.style.display='block';
   }


	return object;
}