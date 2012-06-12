function x_Explorer(param){
	//Example of parameters: {images:ROOT_FOLDER+'/themes/icons.png',size:20,values:[1,2,3,4,5,6,7,8]}
		
	var baseColor='#c8f2c8';
	//baseColor.changeHSV('',-0.4,0.4);
	var colors=new Object();
		colors.baseColor=baseColor;
		colors.backColor=system.setColorHSVA(baseColor,0,0,20,0,'HEX');
		colors.borderColor=system.setColorHSVA(baseColor,0,0,-50,0,'HEX');
		
	var object=document.createElement('div');
    //object.style.display='none';
	object.style.left=-10000;
    object.style.top=-10000;
	//object.style.width='500px';
	//object.style.height='700px';
	//object.style.border='1px solid black';
	object.style.overflow='hidden';
	//object.style.backgroundColor='green';
	
	object.data=new Object();
	var local=new Object();
	local.draw=new Object();
	local.images=param.images;
	local.size=param.size;
	local.values=param.values;
	
	var boss=object;

	var newInnerHTML="<div style='border:2px solid blue;width:100%;height:100%;overflow:hidden;position:relative;padding-left:1px;padding-right:1px;'>\
	</div>\
	";
    
	object.innerHTML=newInnerHTML;
	object.data.content=system.getChildNode(object,1);
	system.setBoxType(object,'in');
	system.setBoxType(object.data.content,'in');
	
	object.data.level=0;
	object.parent=null;
	object.children=new Array();
	
	local.draw.handler=function(ctx,on){
		ctx.clearRect(0,0,12,12);
		ctx.save();
		if (on){
			ctx.translate(12,0);
			ctx.rotate(90*Math.PI/180);
		}
		ctx.beginPath();
		ctx.moveTo(9.19606,6.10441);
		ctx.lineTo(6.09827,7.8926);
		ctx.lineTo(3.00094,9.68126);
		ctx.lineTo(3.00094,6.10441);
		ctx.lineTo(3.00094,2.52756);
		ctx.lineTo(6.09827,4.31622);
		ctx.lineTo(9.19606,6.10441);
		ctx.closePath();
		ctx.scale(1,1);
		ctx.lineCap = 'butt';
		ctx.lineJoin = 'miter';
		ctx.miterLimit = 4;
		ctx.fillStyle='#000000';
		ctx.fill();
		ctx.stroke();
		ctx.restore();	
	}
	
	object.addItem=function(parent,type,text,value){
		var item=document.createElement('div');
		item.data=new Object();
		item.data.level=parent.data.level+1;
		item.data.type=type;
		item.data.value=value;
		item.data.open=false;
		
		item.style.display='block';
		item.style.width='100%';
		item.style.marginTop='1px';

		item.innerHTML="\
			<table border='0' cellspacing='0' cellpadding='0' border='0' style='width:100%;height:"+local.size+"px;font-size:11px;font-family:"+system.data.style.fonts.font3+";color:black;'>\
				<tr>\
					<td style='width:"+(parent.data.level*local.size)+"px;'>\
					\
					<td align='center' style='width:"+local.size+"px;height:100%;vertical-align:middle;'>\
						<div style='position:relative;width:12px;height:12px;overflow:hidden;'>\
						</div>\
					\
					<td align='center' style='vertical-align:middle;width:"+local.size+"px;padding-top:0px;'>\
						<div style='width:100%;height:100%;overflow:hidden;background-image:url("+local.images+");background-repeat:no-repeat;background-position:0px 0px;'></div>\
					<td style='vertical-align:middle;padding-left:5px;'>"+text+"\
			</table>\
		";
		
		item.data.handle=system.getChildNode(item,'1:1:1:2:1');
		item.data.image=system.getChildNode(item,'1:1:1:2:1');
		item.data.text=system.getChildNode(item,'1:1:1:2');
		item.data.context=null;

		system.setGradient(item,colors.backColor,100,colors.baseColor,100);	
		system.setBoxType(item,'in');
		item.style.border='1px solid '+colors.borderColor;

		var handleImage=document.createElement('canvas');
		handleImage.setAttribute('width','12');
		handleImage.setAttribute('height','12');
		handleImage.style.width='12x';
		handleImage.style.height='12px';
		//handleImage.style.border='1px solid red';
		system.setBoxType(handleImage,'in');
		
		item.data.handle.appendChild(handleImage);
		boss.data.content.appendChild(item);

		item.data.context = handleImage.getContext("2d");
		local.draw.handler(item.data.context,false);
		system.setBoxType(item.data.handle,'in');
		
		item.onmouseover=function(){
			local.draw.handler(this.data.context,true);
		}
		
		return item;
	}

    object.show=function(){
        this.style.display='block';
    }

	
	return object;
}