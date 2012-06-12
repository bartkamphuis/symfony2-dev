/*
EXPLORER_SELECTABLE
------

CONSTRUCTOR
	border	-	color of the border when items not selected
	width	-	the width of the items. If not set the item takes the size of the content.
	height	-	the height of the items. If not set the item takes the size of the content.

ATTRIBUTES
	PUBLIC
		items	-	an array of all the items.

	PRIVATE

PUBLIC METHODS
	
EXAMPLE

*/
function x_Explorer_Selectable(param){
	var baseColor='#c8f2c8';
	var colors=new Object();
		colors.baseColor=baseColor;
		colors.backColor=system.setColorHSVA(baseColor,0,0,20,0,'HEX');
		colors.borderColor=system.setColorHSVA(baseColor,0,0,-50,0,'HEX');

	var object=document.createElement('div');
    object.style.display='none';
	object.style.left=-10000;
    object.style.top=-10000;
	//object.style.width='500px';
	//object.style.height='700px';
	//object.style.border='1px solid #333333';
	object.style.overflow='hidden';
	//object.style.backgroundColor='green';
	object.items=new Array();

	object.data=new Object();
	object.data.eventOnScroll=function(){}
	object.data.eventOnDragStart=function(){}
	object.data.eventOnDragStop=function(){}
	object.data.eventOnDragDrop=function(){}
	object.data.eventOnDragNoDrop=function(){}
	
	if (!param.hasOwnProperty('dragAnddropId')){param.dragAndDropId=null;}
	object.data.dragAndDropId=param.dragAndDropId;


	var local=new Object();
	local.action=null;
	local.lastX=null;
	local.lastY=null;
	local.startX=null;
	local.startY=null;
	local.startScrollX=null;
	local.startScrollY=null;
	local.scale=1;
	local.border=system.setColorRGBA(theme.colors.border,0,0,0,-0.8,'RGBA');
	//local.border='transparent';

	var boss=object;
	var selector=document.createElement('div');
	selector.style.display='none';
	selector.style.position='absolute';
	selector.style.overflow='hidden';
	selector.style.zIndex=10000;
	selector.style.border='1px solid '+theme.colors.border;
	selector.style.backgroundColor=system.setColorRGBA(theme.colors.note,0,0,0,-0.9,'RGBA');
	selector.style.backgroundColor=system.setColorHSVA(selector.style.backgroundColor,0,0,-30,0,'RGBA');
	
	object.selector=selector;
	
	var newInnerHTML="<div style='border:0px solid blue;width:100%;height:100%;overflow:hidden;position:relative;'>\
	</div>";
    
	object.innerHTML=newInnerHTML;
	object.content=system.getChildNode(object,1);
	system.setBoxType(object,'in');
	system.setBoxType(object.content,'in');

	object.content.active=1;

	object.content.appendChild(object.selector);
	var selectedLast=null;

	/*ADD ITEM*/
	object.addItem=function(position,cnt){
		/*If this is a div then in IE the display must be inline-block. If it's a table the display must be inline.*/
		var main=document.createElement('div');
		main.active='2';
		main.selected=0;
		main.selectedLast=null;
		main.style.width='50px';
		main.style.height='50px';
		main.style.overflow='hidden';
		if (system.browser=='MIE'){
			main.style.display='inline-block';
		}else{
			main.style.display='inline-block';
		}
		main.style.marginLeft='8px';
		main.style.marginTop='8px';
		main.style.padding='4px';
		main.style.border='1px solid '+local.border;
		main.style.backgroundColor=theme.colors.area;
		system.setCornerRadius(main,3,3,3,3);
		if (cnt){
			if (typeof cnt == 'object'){
				main.appendChild(cnt);
			}else{
				main.innerHTML=cnt;
			}
		}
		/*main.innerHTML="<div style='width:100%;height:100%;overflow:hidden;position:relative;'></div>";
		system.setBoxType(system.getChildNode(main,1),'in');
		system.getChildNode(main,1).active=3;*/
		this.content.appendChild(main);
		main.itemOrder=this.items.push(main);
	}
	/*================*/

	object.select=function(obj){
		obj.style.backgroundColor='#d7f0fd';
		obj.style.border='1px solid '+theme.colors.border;
		obj.selected=true;
	}

	object.deselect=function(obj){
		obj.style.backgroundImage='';
		obj.style.backgroundColor='';
		obj.style.border='1px solid '+local.border;
		obj.selected=false;
	}

	object.deselectAll=function(){
		for(var i in boss.items){
			boss.deselect(boss.items[i]);
		}
		selectedLast=null;
	}

	object.preserveSelection=function(){
		for(var i in boss.items){
			if (boss.items[i].selected){
				boss.items[i].selected=null;
			}
		}
		selectedLast=null;
	}

	object.restorePreservedSelection=function(){
		for(var i in boss.items){
			if (boss.items[i].selected==null){
				boss.items[i].selected=true;
			}
		}
		selectedLast=null;
	}

	var selectHandlerEnd=function(){
		for(var i in boss.items){
			if (boss.items[i].selected==null){
				boss.items[i].selected=true;
			}
		}
		boss.selector.style.width='1px';
		boss.selector.style.height='1px';
		boss.selector.style.display='none';
		local.action=null;
	}

		var selectWindow=function(x,y,event){
			local.lastX=x;
			local.lastY=y;
			if (x==0){x=1;}
			if (y==0){y=1;}

			x=x+(boss.content.scrollLeft-local.startScrollX);
			y=y+(boss.content.scrollTop-local.startScrollY);

			if (x<0){
				boss.selector.style.left=(local.startX+x)+'px';
				boss.selector.style.width=Math.abs(x)+'px';
			}else{
				boss.selector.style.left=local.startX+'px';
				boss.selector.style.width=(x)+'px';
			}
			if (y<0){
				boss.selector.style.top=(local.startY+y)+'px';
				boss.selector.style.height=Math.abs(y)+'px';
			}else{
				boss.selector.style.top=local.startY+'px';
				boss.selector.style.height=(y)+'px';
			}
			
			var item;
			var selectorLeft=parseInt(boss.selector.style.left);
			var selectorTop=parseInt(boss.selector.style.top);
			var selectorRight=selectorLeft+parseInt(boss.selector.style.width);
			var selectorBottom=selectorTop+parseInt(boss.selector.style.height);

			for(var i in boss.items){
				item=boss.items[i];
				
				//track.write(item.offsetLeft+' -- '+item.offsetTop+' -- '+(item.offsetLeft+item.offsetWidth)+' -- '+(item.offsetTop+item.offsetHeight));
				if(boss.items[i].selected!=null){
				if ( ((parseInt(item.offsetLeft)+parseInt(item.offsetWidth)>selectorLeft)&&(parseInt(item.offsetLeft)<selectorRight)) &&
					 ((parseInt(item.offsetTop)+parseInt(item.offsetHeight)>selectorTop)&&(parseInt(item.offsetTop)<selectorBottom))
					){
						boss.select(item);
					}else{
						boss.deselect(item);
					}
				}
		}
			
			return true;
		}

	var selectHandler=function(event,_this){
		var xy=system.getMouseXYRelativeTo(event,boss.content,true);
		local.startX=xy[0];
		local.startY=xy[1];
		local.startScrollX=boss.content.scrollLeft;
		local.startScrollY=boss.content.scrollTop;
		
		boss.selector.style.left=local.startX+'px';
		boss.selector.style.top=local.startY+'px';
		boss.selector.style.display='block';

		local.action='select';
		system.startMoveAction(event,_this,_this.parentNode,selectWindow,selectHandlerEnd,1);
		event.noAction=true;
	}


	system.addEvent(object,'mouseup',function(e){
			var event=e?e:window.event; 
			var target=event.target? event.target : event.srcElement;
			if (event.button==0){

				while ((target!==boss)&&(target.active!=2)){
					target=target.parentNode;
				}

				if ((target.active==2)&&(boss.markedDeselect===target)){
					boss.deselectAll();
					boss.select(target);
					selectedLast=target;
					boss.markedDeselect=null;
				}
			}
		}
	);


	system.addEvent(object,'mousedown',function(e){
			var event=e?e:window.event; 
			var target=event.target? event.target : event.srcElement;
			if (event.button==0){

			if (target.active=='1'){
				if (event.ctrlKey==false){
					boss.deselectAll();
				}else{
					boss.preserveSelection();
				}
					selectHandler(event,this);
					//system.cancelEvent(event);
			}else{
				var contactTarget=target;
				while ((target!==boss)&&(target.active!=2)){
					target=target.parentNode;
				}

				if (target.active==2){
				
					if ((event.shiftKey)&&(selectedLast!=null)){
						if (selectedLast.itemOrder<target.itemOrder){
							while ((selectedLast!==target)&&(selectedLast.nextSibling)){
								boss.select(selectedLast);
								selectedLast=selectedLast.nextSibling;
							}
						}else{
							while ((selectedLast!==target)&&(selectedLast.previousSibling)){
								boss.select(selectedLast);
								selectedLast=selectedLast.previousSibling;
							}
						}

							selectedLast=target;
							boss.select(selectedLast);
					}else if(event.ctrlKey){
						if (target.selected){
							//boss.markedDeselect=target;
							boss.deselect(target);
						}else{
							boss.select(target);
						}
						selectedLast=target;
					}else{
						if (target.selected){
							boss.markedDeselect=target;
						}else{
							boss.deselectAll();								
							boss.select(target);
							selectedLast=target;
						}
					}
					
					//DRAG and drop
					var dragStart=function(){
						if (true==true){
						boss.markedDeselect=null;
						var visual=document.createElement('div');
						var max=boss.items.length;
						var no=0;
						var firstFound=false;
						/*for (var i=0;i<max;i++){
							if (boss.items[i].selected){
								var clon=boss.items[i].cloneNode(true);
								boss.deselect(clon);
								clon.style.position='absolute';
								//clon.style.left=(no*(100-(no*5)))+'px';
								clon.style.left=(no*90)+'px';
								clon.style.top='0px';
								clon.style.zIndex=10000-no;
								system.setAlpha(clon,(100-(no*10)));
								drag.appendChild(clon);
								if (no>10){break;}
								no++;
							}
						}*/
						
						/*seccond method===*/
						for (var i=0;i<max;i++){
							if (boss.items[i].selected){
								no++;
								if (!firstFound){
									var drag=boss.items[i].cloneNode(true);
									var oldCanvas = system.getChildNode(boss.items[i],'1:1:1:1:1');
									var newCanvas = system.getChildNode(drag,'1:1:1:1:1');
									var newCanvasCtx = newCanvas.getContext('2d');
									newCanvasCtx.drawImage(oldCanvas, 0, 0);
									firstFound=true;
								}
							}
						}
						drag.style.position='static';
						visual.appendChild(drag);
						if (no>1){
							var count=new x_Counter({});
							count.style.position='absolute';
							count.style.right='-6px';
							count.style.top='0px';
							count.setValue(no);
							system.setCornerRadius(count,999,999,999,999);
							count.show();
							visual.appendChild(count);
						}
						/*===*/
						system.setAlpha(visual,70);
						return visual;
						}
					}
					var dragStop=function(){
						local.action=null;
						boss.data.eventOnDragStop();
					}
					
					var dragDrop=function(visual){
						visual.parentNode.removeChild(visual);						
						return(boss.data.eventOnDragStop(visual));

						/*var items=Array();
						var i=0;
						while (boss.items[i]){
							if (boss.items[i].selected){
								items.push(i);
							}
							i++;
						}
						
						local.action=null;
						return items;*/
					}					
					var noDragDrop=function(visual,x,y){
						visual.parentNode.removeChild(visual);
						boss.data.eventOnDragStop(visual);
						local.action=null;						
						/*var _this=this;
						var destroy=function(){
							_this.action.draggedObject.parentNode.removeChild(_this.action.draggedObject);
							_this.action.type=null;
							_this.action.object=null;
						}
						this.action.type='dragEnd';
						this.action.draggedObject.animate='move';
						this.animate(this.action.draggedObject,'move',1,destroy,15,this.action.startX-this.action.draggedObjectLeft,15,this.action.startY-this.action.draggedObjectTop);*/
					}
					
					local.action='dragdrop';
					system.startDragAction(event,dragStart,dragStop,dragDrop,noDragDrop);		
					
				}
			}	
			}
		}
	);

	/*system.addEvent(object,'click',function(e){
			var event=e?e:window.event; 
			var target=event.target? event.target : event.srcElement;
			if (target.active==1){
				selectHandler(event,this);
			}
		}
	);*/

	object.selectItem=function(item){
		item.style.border='1px solid #333333';
		item.style.backgroundImage='url('+ROOT_FOLDER+'/themes/'+THEME+'/panel/background.png)';
	}

	object.deSelectItem=function(item){
		item.style.border='0px solid #333333';
		item.style.backgroundImage='';
	}

    object.show=function(){
        this.style.display='block';
    }

object.content.onscroll=function(e){
	if (local.action=='select'){
		var event=e?e:window.event; 	
		selectWindow(local.lastX,local.lastY,event);
		this.data.eventOnScroll();
	}
}

object.deleteItem=function(no){
	boss.items[no].parentNode.removeChild(boss.items[i]);
	boss.items.splice(no,1);
	var max=boss.items.length;
	for (var i=0;i<max;i++){
		boss.items[i].itemOrder=i;
	}
}

object.scale=function(scl){
	//local.scale=scl;
	if (boss.items.length>0){
		var buc=Math.round((boss.items[0].offsetWidth-(boss.items[0].offsetWidth*local.scale))/2);
		mar=8-buc-((1-local.scale)*10);
		marTop=8-buc-((1-local.scale)*20);
		marBot=8-buc-((1-local.scale)*30);
	}
	
	for(var i in boss.items){
		item=boss.items[i];
		system.setScale(item,local.scale);
		//item.style.margin=mar+'px';
		//item.style.marginTop=marTop+'px';
		//item.style.marginBottom=marBot+'px';
		track.write(item.offsetLeft);
	}
}

for (i=0;i<555;i++){
	var rand=Math.floor(Math.random()*4+1);
	if (rand==1){var can=system.canvas({width:'40px',height:'40px',canvas:theme.canvas.audio});}
	if (rand==2){var can=system.canvas({width:'30px',height:'30px',canvas:theme.canvas.photo});}
	if (rand==3){var can=system.canvas({width:'40px',height:'40px',canvas:theme.canvas.folder});}
	if (rand==4){var can=system.canvas({width:'40px',height:'40px',canvas:theme.canvas.movie});}
	
	can.draw({color:theme.colors.note});
	var wrapp=document.createElement('table');
	wrapp.style.width='100%';
	wrapp.style.height='100%';
	var newRow=wrapp.insertRow(-1);
	var newCell=newRow.insertCell(-1);
		newCell.style.verticalAlign='middle';
		newCell.setAttribute('align','center');
	newCell.appendChild(can);
	object.addItem(-1,wrapp);
}

	return object;
}