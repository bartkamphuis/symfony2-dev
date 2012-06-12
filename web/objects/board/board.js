function x_Board(param){
	var object=document.createElement('div');
    object.style.display='none';
	object.style.overflow='hidden';
	object.style.width='100%';
	object.style.height='100%';
	object.data=new Object();
		
	var local=new Object();
		local.background=theme.colors.background;
		local.border=theme.colors.border;
		local.area=theme.colors.area;
		local.info=theme.colors.confirm;
		local.alert=theme.colors.alert;
		local.note=theme.colors.note;
		local.radius=theme.radius;
	
	var newHtml='';
	newHtml+="<div style='position:relative;width:100%;height:100%;top:0px;left:0px;overflow:hidden; background-color:"+local.background+";'>\
		<div style='position:absolute;left:5px;top:70px;width:88px;bottom:25px;padding-top:18px;'>\
			<table cellpadding='0' cellspacing='10' style='width:100%;'>\
			</table>\
		</div>\
		<div style='position:absolute;left:100px;top:80px;right:25px;bottom:25px;min-width:100px;min-height:100px;overflow:hidden;'>\
			<div style='position:relative;width:100%;height:100%;overflow:hidden; background-color:"+local.area+";border:1px solid "+local.border+";'>\
				<div style='width:100%;height:100%;'>\
				</div>\
				<div style='position:absolute;width:100px;height:100%;left:-101px;top:0px; background-color:"+local.background+";border-right:1px solid "+local.border+";'>\
				</div>\
			</div>\
		</div>\
	</div>";
	object.innerHTML=newHtml;		

	object.style.borderTop='1px solid '+local.border;
	object.content=system.getChildNode(object,'1:2:1:1');

	local.menu=system.getChildNode(object,'1:1');
	local.submenu=system.getChildNode(object,'1:2:1:2');

	system.setBoxType(object.content.parentNode,'in');
	
	//system.setBoxShadow(local.submenu.parentNode,'inset',0,0,1,1,'888888');
	//system.setBoxShadow(local.submenu,'',0,0,1,1,'888888');
	
	system.setBoxType(object.content,'in');
	system.setCornerRadius(object.content.parentNode,local.radius,local.radius,local.radius,local.radius);

	object.addMenu=function(param){
		var bar=system.getChildNode(local.menu,1);
		var newRow=bar.insertRow(-1);
		var newCell=newRow.insertCell(-1);
			newCell.style.verticalAlign='middle';
			newCell.setAttribute('align','center');
			newCell.style.padding='10px';
			newCell.style.border='1px solid transparent';
			newCell.style.cursor='pointer';
			system.setCornerRadius(newCell,local.radius,local.radius,local.radius,local.radius);
		var item=document.createElement('div');
			item.style.overflow='hidden';
			item.style.width=param.image.width+'px';
			item.style.height=param.image.height+'px';
			
			newCell.appendChild(item);

		if (param.image){
			if (param.image.canvas){
				var can=system.canvas({width:parseInt(param.image.width),height:parseInt(param.image.height),canvas:param.image.canvas});
				can.draw(param.image.normal);
				item.appendChild(can);
				
			newCell.onmouseover=function(){
				//this.style.backgroundImage='url('+param.image.over+')';
				can.draw(param.image.over);
				this.style.border='1px solid '+local.border;
			}
			newCell.onmousedown=function(){
				can.draw(param.image.down);
				system.setBoxShadow(this,'inset',0,0,1,1,'ffffff');
				//this.style.backgroundImage='url('+param.image.down+')';
				//system.animate(local.submenu,1,100,[{type:'move',startX:-101,stopX:0}],null,null);
			}
			newCell.onmouseup=function(){
				can.draw(param.image.over);
				system.setBoxShadow(this,'inset',0,0,0,0,'ffffff');
				//this.style.backgroundImage='url('+param.image.over+')';
			}
			newCell.onmouseout=function(){
				can.draw(param.image.normal);
				this.style.border='1px solid transparent';
				system.setBoxShadow(this,'inset',0,0,0,0,'ffffff');
				//this.style.backgroundImage='url('+param.image.normal+')';
			}
			newCell.onclick=function(){param.onClick();}
			}
		}
	}
	
	object.show=function(){
		this.style.display='';
	}

	return object;
}