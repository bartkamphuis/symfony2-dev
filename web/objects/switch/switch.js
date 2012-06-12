function x_Switch(param){
	var colors=new Object();	
	var baseColor='#c8f2c8';
		var rgbOn=baseColor.getRGB();	
		colors.sliderOnBaseColor=baseColor;
		colors.sliderOnBackColor=system.setColorHSVA(baseColor,0,0,20,0,'HEX');
		colors.sliderOnBorderColor=system.setColorHSVA(baseColor,0,0,-50,0,'HEX');
	
		var baseColor='#e5c3c3';
		var rgbOff=baseColor.getRGB();
		colors.sliderOffBaseColor=baseColor;
		colors.sliderOffBackColor='#'+baseColor.getHEX(baseColor.changeHSV('','',0.2));
		colors.sliderOffBorderColor='#'+baseColor.getHEX(baseColor.changeHSV('','',-0.5));

		baseColor.setHEX('d3d3d3');
		colors.sliderBaseColor='#'+baseColor.getHEX();
		colors.sliderBackColor='#'+baseColor.getHEX(baseColor.changeHSV('','',0.2));
		colors.sliderBorderColor='#'+baseColor.getHEX(baseColor.changeHSV('','',-0.5));

		var difR=rgbOff[0]-rgbOn[0];
		var difG=rgbOff[1]-rgbOn[1];
		var difB=rgbOff[2]-rgbOn[2];

	var object=document.createElement('div');
        object.style.display='none';
		object.style.left=-10000;
        object.style.top=-10000;
		object.style.width=param.width+'px';
		object.style.height=param.height+'px';
		object.style.border='0px solid black';
		object.style.overflow='hidden';

		var boss=object;
		
		object.data=new Object();
		
		var local=new Object();
		local.pressed=0;
		local.slided=0;
		local.startX=null;
		local.startTime=null;
		local.cancelAnimation=function(){};
		local.automaticSlide=false;

		object.eventOnclick=function(){}

		object.data.eventOnClick=function(){}
		object.data.eventOnMouseDown=function(){}
		object.data.eventOnMouseUp=function(){}

	var newInnerHTML="\
	    <div style='border:0 solid blue;width:100%;height:100%;overflow:hidden;position:relative;'>\
		<div style='width:100%;height:100%;overflow:hidden;position:relative;'>\
		<div style='width:"+param.sliderWidth+"px;position:absolute;left:1px;top:1px;bottom:1px;margin:0px;vertical-align:middle;text-align:center;color:"+param.font.color+";font-size:12px;font-family:perfect;padding-top:2px;'>\
					"+param.text.on+"\
		</div>\
		</div>\
   	    </div>";
    
	object.innerHTML=newInnerHTML;
	
	local.content=system.getChildNode(object,1);
	local.track=system.getChildNode(object,'1:1');
	local.slider=system.getChildNode(object,'1:1:1');
	local.title=system.getChildNode(object,'1:1:1');
	system.setBoxType(local.content,'in');
	system.setBoxType(local.track,'in');
	system.setBoxType(local.slider,'in');

	local.content.style.border='1px solid '+colors.sliderOnBorderColor;
	system.setCornerRadius(object,15,15,15,15);
	system.setCornerRadius(local.content,15,15,15,15);
	system.setCornerRadius(local.slider,15,15,15,15);
	local.slider.style.border='1px solid '+colors.sliderOnBorderColor;
	system.setGradient(local.content,colors.sliderOnBackColor,100,colors.sliderOnBaseColor,100);
	system.setGradient(local.slider,colors.sliderBackColor,100,colors.sliderBaseColor,100);
	if (system.browser!='MIE'){
		system.setTextShadow(local.slider,0,1,0,'#FFF');
	}		

	local.slider.onclick=function(e){
		/*if (local.pressed==2){
			var event=e?e:window.event; 
			if (local.slided==0){
				local.slider.style.left='';
				local.slider.style.right='0px';
				local.slided=1;
				system.setGradient(local.content,colors.sliderOffBackColor,100,colors.sliderOffBaseColor,100);
				local.title.innerHTML='Off';
			}else{
				local.slider.style.left='0px';
				local.slider.style.right='';
				local.slided=0;
				system.setGradient(local.content,colors.sliderOnBackColor,100,colors.sliderOnBaseColor,100);			
				local.title.innerHTML='On';
			}
		}else{
			return false;
		}*/
	}


	local.slider.onmouseover=function(){
		local.pressed=0;
		system.setGradient(local.slider,colors.sliderBackColor,100,colors.sliderBaseColor,100);
	}
	
	local.slider.onmousedown=function(e){
		var event=e?e:window.event; 
		local.pressed=1;
		//system.setGradient(local.slider,colors.sliderBaseColor,100,colors.sliderBaseColor,100);
		boss.data.eventOnMouseDown();
	  if (!local.automaticSlide){
		var startX=parseInt(local.slider.offsetLeft);
		local.startX=startX;
		var date=new Date();
		local.startTime=date.getTime();
		var startColor=system.color();

		var slideSlider=function(x,y){
			var newX=startX+x;
			var max=local.track.offsetWidth-local.slider.offsetWidth-1;
			if (newX<1){
				newX=1;
			}
			if (newX>max){
				newX=max;
			}
			
			startColor.setRGB(Math.round(rgbOn[0]+difR*newX/max),Math.round(rgbOn[1]+difG*newX/max),Math.round(rgbOn[2]+difB*newX/max));
			var col1='#'+startColor.getHEX();
			var col2='#'+startColor.getHEX(startColor.changeHSV('','',0.2));
			
			system.setGradient(local.track,col2,100,col1,100);
			
			local.slider.style.left=newX+'px';
			return true;
		}
		
		var slideEnd=function(){
			if (!local.automaticSlide){
			if (local.slider.offsetLeft+(local.slider.offsetWidth/2)<(local.track.offsetWidth/2-1)){
				var stopX=1;
				var stopSlided=0;
				var stopTitle=param.text.on;
			}else{
				var stopX=local.track.offsetWidth-local.slider.offsetWidth-1;
				var stopSlided=1;
				var stopTitle=param.text.off;
			}
				
			var callbackAnimation=function(){
				var newX=local.slider.offsetLeft;
				var max=local.track.offsetWidth-local.slider.offsetWidth-1;
				startColor.setRGB(Math.round(rgbOn[0]+difR*newX/max),Math.round(rgbOn[1]+difG*newX/max),Math.round(rgbOn[2]+difB*newX/max));
				var col1='#'+startColor.getHEX();
				var col2='#'+startColor.getHEX(startColor.changeHSV('','',0.2));
				system.setGradient(local.track,col2,100,col1,100);
			}
				
			var finish=function(){
				local.slided=stopSlided;
				local.title.innerHTML=stopTitle;
			}
			local.cancelAnimation=system.animate(local.slider,1,20,[{type:'move',startX:local.slider.offsetLeft,stopX:stopX}],callbackAnimation,finish);
			}
		}
		local.cancelAnimation();
		system.startMoveAction(event,this,this.parentNode,slideSlider,slideEnd,1);
		event.noAction=true;
	  }
	}
	
	local.slider.onmouseup=function(e){
		var event=e?e:window.event;
		if (local.pressed==1){
			local.pressed=2;
			system.setGradient(local.slider,colors.sliderBackColor,100,colors.sliderBaseColor,100);
			boss.data.eventOnMouseUp();
			var date=new Date();
			if ((local.slider.offsetLeft==local.startX)&&(date.getTime()-local.startTime<500)){
				local.cancelAnimation();
				var startColor=system.color();
				if (local.slider.offsetLeft+(local.slider.offsetWidth/2)<(local.track.offsetWidth/2-1)){
					var stopX=local.track.offsetWidth-local.slider.offsetWidth-1;
					var stopSlided=1;
					var stopTitle=param.text.off;
				}else{
					var stopX=1;
					var stopSlided=0;
					var stopTitle=param.text.on;
				}
				var callbackAnimation=function(){
					var newX=local.slider.offsetLeft;
					var max=local.track.offsetWidth-local.slider.offsetWidth-1;

					startColor.setRGB(Math.round(rgbOn[0]+difR*newX/max),Math.round(rgbOn[1]+difG*newX/max),Math.round(rgbOn[2]+difB*newX/max));
					var col1='#'+startColor.getHEX();
					var col2='#'+startColor.getHEX(startColor.changeHSV('','',0.2));
					system.setGradient(local.track,col2,100,col1,100);
				}
				var finish=function(){
					local.slided=stopSlided;
					local.title.innerHTML=stopTitle;
					local.automaticSlide=false;
				}

				local.automaticSlide=true;
				local.cancelAnimation=system.animate(local.slider,1,5,[{type:'move',startX:local.slider.offsetLeft,stopX:stopX}],callbackAnimation,finish);
			}
		}else{
			local.pressed=0;
		}
	}
	
	local.slider.onmouseout=function(e){
		var event=e?e:window.event; 
		event.noAction=true;
		local.pressed=0;
	
		var target=event.target? event.target : event.srcElement;
		var toTarget = event.relatedTarget || event.toElement;
		while (toTarget!==event.currentTarget && toTarget.tagName!='BODY'){
			toTarget=toTarget.parentNode;
		}
		if (toTarget!==event.currentTarget){
			system.setGradient(local.slider,colors.sliderBackColor,100,colors.sliderBaseColor,100);
		}
	}


	local.content.onmousedown=function(e){
		var event=e?e:window.event; 
		event.noAction=true;
	}

	object.show=function(){
		this.style.display='block';
	}


	return object;
}