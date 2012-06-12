function x_Me(param){
	var object=document.createElement('div');
    object.style.display='none';
	object.style.overflow='hidden';
	object.style.width='180px';
	object.style.height='66px';
	
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
	newHtml+="<table cellpadding='0' cellspacing='0' style='width:100%;height:100%;'>\
				<tr>\
					<td rowspan='2' style='width:60px;padding:3px;'>\
						<div style='width:60px;height:60px;position:relative;overflow:hidden;padding-top:3px;background-color:"+local.background+";border:1px solid "+local.border+";'>\
						<div style='width:100%;height:100%;overflow:hidden;'>\
						</div>\
						</div>\
					<td colspan='2' align='center' style='vertical-align:top;padding:3px;'>\
						<span style='font-size:13px;color:#34423f;'>Daniel Toma<br></span><span style='color:"+local.note+";'>Administrator</span>\
				<tr>\
					<td align='right' style='padding-bottom:3px;padding-right:5px;'>\
					<td align='left' style='padding-bottom:3px;padding-left:5px;'>\
				</table>";
	object.innerHTML=newHtml;		

	object.style.backgroundColor=local.area;
	object.style.border='1px solid '+local.border;

	local.image=system.getChildNode(object,'1:1:1:1:1:1');

	system.setCornerRadius(object,local.radius,local.radius,local.radius,local.radius);
	system.setCornerRadius(local.image,local.radius,local.radius,local.radius,local.radius);
	system.setCornerRadius(local.image.parentNode,local.radius,local.radius,local.radius,local.radius);
	system.setBoxType(local.image,'in');
	system.setBoxType(local.image.parentNode,'in');

	var avatar=system.canvas({width:57,height:57,canvas:theme.canvas.avatar});
	avatar.draw({color:theme.colors.note});
	local.image.appendChild(avatar);
	
	var buttons=system.getChildNode(object,'1:1:2:1');
	var settings=new x_Clickable({label:'',title:'Settings',width:'24px',height:'24px',image:{
				canvas:theme.canvas.settings,
				normal:{color:theme.colors.border},
				over:{color:theme.colors.note,gradient:true},
				down:{color:theme.colors.note}
				},
				onClick:function(){alert('Profile settings');}
	});
	buttons.appendChild(settings);
	settings.show();
	
	var buttons=system.getChildNode(object,'1:1:2:2');
	var logoff=new x_Clickable({label:'',title:'Log Out',width:'24px',height:'24px',image:{
				canvas:theme.canvas.logout,
				normal:{color:theme.colors.border},
				over:{color:theme.colors.note,gradient:true},
				down:{color:theme.colors.note}
				},
				onClick:function(){alert('Logging out');}
	});
	buttons.appendChild(logoff);
	logoff.show();


	object.show=function(){
		this.style.display='';
	}

	return object;
}