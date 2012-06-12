/*LOADING
-------
Creates a small icon like button with 3 states
CONSTRUCTOR
	width	-	the width of the image
	height	-	the height of the image
	canvas	-	the canvas which will be drawen
ATTRIBUTES
	PUBLIC

	PRIVATE
	local

PUBLIC METHODS
	show()
	hide()

*/

function x_Loading(param){
	
	var object=document.createElement('div');
        object.style.display='none';
		object.style.overflow='hidden';
	
	var local=new Object();
		local.cancelId=null;
		local.show=false;
		local.locked=null;
			
	var newInnerHTML="\
	    <div style='border:1px solid "+theme.colors.border+";width:100%;height:100%;overflow:hidden;position:relative;'>\
			<table style='background-color:"+theme.colors.background+";'><tr>\
				<td style='padding-left:12px;padding-right:12px;'>\
					<div style='width:100%;height:100%;overflow:hidden;'></div>\
			<tr>\
				<td align='center' style='padding-bottom:10px;font-size:17px;font-family:"+theme.fonts.font1+";color:"+theme.colors.border+";font-weight:bold;'>\
					<span>Loading</span>\
			</table>\
		</div>";
    
	object.innerHTML=newInnerHTML;
	
	local.canvas=system.getChildNode(object,'1:1:1:1:1');
	system.setCornerRadius(system.getChildNode(object,1),theme.radius,theme.radius,theme.radius,theme.radius);
	system.setCornerRadius(system.getChildNode(object,'1:1'),theme.radius,theme.radius,theme.radius,theme.radius);
	system.setBoxType(system.getChildNode(object,1),'in');

	var can=system.canvas({width:parseInt(param.width),height:parseInt(param.height),canvas:param.image.canvas});
	param.image.parameters.angle=0;
	can.draw(param.image.parameters);
	local.canvas.appendChild(can);

	var ctx = can.getContext("2d");
	ctx.translate(0,0);

	var animateLoading=function(){
		param.image.parameters.angle+=1;
		if (param.image.parameters.angle>360){param.image.parameters.angle-=360;}
		can.draw(param.image.parameters);
		if (local.show==true){
			setTimeout(animateLoading,10);
		}
	}

	object.show=function(par){
		if (!par){par={};}
		if (par.lock){
			local.locked=true;
			system.lock(system,false,false,null);
		}else{
			local.locked=false;
		}
		local.show=true;
		this.style.display='block';
		setTimeout(animateLoading,1);
	}
	object.hide=function(){
		local.show=false;
		this.style.display='none';
		if (local.locked){
			system.unlock(system,false,false);
		}
	}

	return object;
}