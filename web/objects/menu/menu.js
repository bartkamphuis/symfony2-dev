/*
MENU
-------

CONSTRUCTOR
		
ATTRIBUTES
	PUBLIC
		content	-	an array of contents which point to each frame in the frameset content[1], content[2], content[3], content[4]
					content[1], content[2] ... content[n]
	PRIVATE

PUBLIC METHODS
	addPage();
	
EXAMPLE
	
*/
function x_Menu(param){
	var object=document.createElement('div');
    object.style.display='none';
	object.style.overflow='hidden';
	object.style.width='100%';
	object.style.height='100%';
	
	object.content=new Array();;
	/*Just so the numbering starts from 1*/
	object.content[0]=null;
	var boss=object;
	
	var local=new Object();
	local.direction=null;
	local.pages=null;
	
	var newInnerHTML="\
<div style='width:100%;height:100%;position:relative;overflow:hidden;'>\
		<div style='display:table;position:absolute;width:100%;height:100%;top:0px;left:0%;border:0px solid green;z-index:10;'>\
			<div style='display:table-row;height:100%;'>\
				<div style='display:table-cell;width:100%;height:100%;'>\
				</div>\
			</div>\
		</div>\
</div>";
	object.innerHTML=newInnerHTML;
	//system.setBoxType();

	var dragger=system.getChildNode(object,'1:1');
	var magnifier=system.getChildNode(object,'1');
	local.pages=system.getChildNode(object,'1:1:1');
	object.content[1]=system.getChildNode(local.pages,'1');
	//dragger.style.backgroundImage='url('+param.image+')';
	system.setBoxType(dragger,'in');

	var cancelAnimation=null;
	
	var dragHandler=function(event,_this){
		if (typeof cancelAnimation=='function'){cancelAnimation();}

		var lastX=0;
		var startX=parseFloat(dragger.offsetLeft);
		var startOffsetX=dragger.offsetLeft;
		
		var newX=0;
		var timer=0;
		var direction=0;
		
		var dragScreen=function(x,y){
			lastX=startX;
			newX=startX+x;
			if (lastX<newX){local.direction=1;}
			else{local.direction=-1;}
			
			if (newX>0){newX=0;}
			if (newX<-(dragger.offsetWidth-magnifier.offsetWidth)){newX=-(dragger.offsetWidth-magnifier.offsetWidth);}
			newX=newX*((object.content.length-1)*100)/dragger.offsetWidth;
			dragger.style.left=newX+'%';

			var date=new Date();
			timer=date.getTime()/1000;
			return true;
		}
			
		var dragEnd=function(){
			var modulo=parseFloat(dragger.style.left)%100;
			if (modulo!=0){
				var date=new Date();
				if ((date.getTime()/1000-timer)>0.1){
					if (Math.abs(modulo)<50){
						local.direction=1;
					}else{
						local.direction=-1;
					}
				}
				//if (modulo>=0){local.direction*=-1;}
				
				var draggerStart=parseFloat(dragger.style.left);
			
				var callbackBackground=function(){
				}
				var callbackEnd=function(){
					cancelAnimation=null;
				}

				if (local.direction==1){var stopX=parseFloat(dragger.style.left)+Math.abs(modulo);}
				if (local.direction==-1){var stopX=parseFloat(dragger.style.left)-(100-Math.abs(modulo));}
				
				cancelAnimation=system.animate(dragger,20,50,[{type:'move',startX:parseFloat(dragger.style.left)+'%',stopX:(stopX+'%')}],callbackBackground,callbackEnd,callbackEnd);
			}
		}

		system.startMoveAction(event,_this,_this.parentNode,dragScreen,dragEnd,1);
	}
	
	object.addPage=function(){
		var newPage=document.createElement('div');
		newPage.style.overflow='hidden';
		newPage.style.display='table-cell';
		//newPage.style.border='1px solid green';
		local.pages.appendChild(newPage);
		object.content.push(newPage);
		dragger.style.width=((object.content.length-1)*100)+'%';
		var max=object.content.length;
		var newWidth=(100/max)+'%';
		for (var i=1;i<max;i++){
			object.content[i].style.width=newWidth;
		}
	}

	object.show=function(){
		this.style.display='block';
	}
	
	system.addEvent(object,'mousedown',function(e){var _this=this; dragHandler(e? e : window.event,_this);});
	
	return object;
}