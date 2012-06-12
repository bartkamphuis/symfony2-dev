/*
PROGRESS
------

CONSTRUCTOR
	width -	the width of the progress bar
	height	-	the height of the progress bar

ATTRIBUTES
	PUBLIC

	PRIVATE

PUBLIC METHODS
	
EXAMPLE
		var progress=new x_Progress();
		progress.show();
		progress.setTotal(1458);
		progress.update(200);
*/
function x_Progress(){
	baseColor=theme.colors.note;
	var colors=new Object();
		colors.baseColor=baseColor;
		colors.backColor=system.setColorHSVA(baseColor,0,0,20,0,'HEX');

	if (!param.width){param.width='50px';}
	if (!param.height){param.height='22px';}

	var object=document.createElement('div');
    object.style.display='none';
	object.style.left=-10000;
    object.style.top=-10000;
	object.style.width=param.width;
	object.style.height=param.height;
	object.style.border='1px solid #979797';
	object.style.backgroundColor=theme.colors.area;
 	object.style.overflow='hidden';
	
	var local=new Object();
	local.total=null;
	local.progress=null;

	//var back=system.canvas({width:100,height:100,canvas:theme.canvas.background});
	//back.draw({color:'red'});
	//background:url("+back.toDataURL('image/png')+");
	
	var newInnerHTML="<div style='border:0 solid blue;width:100%;height:100%;overflow:hidden;position:relative;left:0px;top:0px;'>\
		<div style='width:100%;height:100%;overflow:hidden;'></div>\
		<div style='left:10px;right:10px;bottom:10px;height:10px;overflow:hidden;position:absolute;background-color:#ffffff;border:1px solid "+theme.colors.border+";'>\
			<div style='position:relative;width:100%;height:100%;'>\
				<div style='width:102%;height:100%;overflow:hidden;position:absolute;left:-100%;top:0px;'></div>\
			</div>\
		</div>\
		<table style='width:100%;position:absolute;left:0px;top:0px;'><tr><td align='center' style='font-size:12px;font-family:"+theme.fonts.font1+";color:#616161;'>Uploading\
		</table>\
	</div>\
	";
    
	object.innerHTML=newInnerHTML;
	local.content=system.getChildNode(object,'1');
	local.background=system.getChildNode(object,'1:1');
	local.progress=system.getChildNode(object,'1:2');
	local.title=system.getChildNode(object,'1:3');
	local.slider=system.getChildNode(object,'1:2:1:1');
	
	system.setBoxType(local.slider,'in');
	system.setBoxType(local.slider.parentNode,'in');
	//local.progress.style.backgroundColor='#ffffff';
	system.setGradient(local.slider,'left',colors.baseColor,0,colors.baseColor,100);
	system.setCornerRadius(local.slider,theme.radius,theme.radius,theme.radius,theme.radius);
	system.setCornerRadius(local.progress,theme.radius,theme.radius,theme.radius,theme.radius);
	system.setCornerRadius(object,theme.radius,theme.radius,theme.radius,theme.radius);
	
	object.setTotal=function(total){
		local.total=total;
	}

	object.update=function(part){
		var progress=part*100/local.total;
		local.slider.style.left=(progress-101)+'%';
	}
	
    object.show=function(){
        this.style.display='block';
    }
    object.hide=function(){
        this.style.display='none';
    }
	
	return object;
}