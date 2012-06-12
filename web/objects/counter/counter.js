function x_Counter(param){

	if (!param.font){param.font={};}
	if (!param.font.color){param.font.color='red';}
	if (!param.borderColor){param.borderColor='gray';}
	
	if (!param.color){param.color=theme.colors.area;}
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

	var local=new Object();

	var newInnerHTML="\
		<table border='0' cellpadding='0' cellspacing='0' style='background-color:"+theme.colors.error+";'>\
			<tr>\
				<td align='center' style='vertical-align:middle;color:"+param.color+";font-size:10px;font-family:"+param.fontFamily+";padding-left:3px;padding-right:3px;padding-bottom:1px;'>\
					"+param.label+"\
		</table>";
    
	object.innerHTML=newInnerHTML;

	local.inside=system.getChildNode(object,'1');
	
	system.setCornerRadius(object,999,999,999,999);
	system.setCornerRadius(local.inside,999,999,999,999);
	system.setGradient(local.inside,colors.backColor,100,colors.baseColor,100);

	object.content=system.getChildNode(object,'1:1:1:1');

	object.setValue=function(val){
		this.content.innerHTML=val;
	}
	object.show=function(){ this.style.display='block';	}
	object.hide=function(){ this.style.display='none';	}

	return object;
}