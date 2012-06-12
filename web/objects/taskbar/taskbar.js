/*
TASKBAR
-------
Wehn an item is pressed in the taskbar the object which is linked ot it is checked if it has the
clicked_object.data.eventOnFocus method and the item which had the focus is checked for the clicked_object.data.eventOnBlur method.
The methods clicked_object.data.eventOnMinimize, clicked_object.data.eventOnMaximize and clicked_object.data.eventOnclose are called on the respective events.
When an object is added in the list an callTaskbar method is added in thta object like: added_object.data.callTaskbar which should be called from the object whenever is needed.

CONSTRUCTOR

ATTRIBUTES
	PUBLIC
	data

	PRIVATE
	local
		tasks	-	the array of all items
		selected-	pointer to the selected item
		itemPressed-pointer to the item on which the mouse was pressed down (mouse up,down,over and out)

PUBLIC METHODS
	setTitle(txt)	-	sets the text in the title

*/

function x_Taskbar(param){
	//INITIALIZATE
	var baseColor='#94bed4';
	var colors=new Object();
	colors.baseColor=baseColor;
	colors.backColor=system.setColorHSVA(baseColor,0,0,10,0,'HEX');
	colors.borderColor=system.setColorHSVA(baseColor,0,0,-50,0,'HEX');

	//START
	var object=document.createElement('div');
    object.style.display='none';
	//object.style.overflow='visible';
	//object.style.width='100%';
	//object.style.height='100%';
	object.style.border='1px solid #555555';
	
	object.data=new Object();
	
	var local=new Object();
	local.tasks=Array();
	local.selected=null;
	local.itemPressed=null;
		
	var content=null;
	var boss=object;
	
	var newInnerHTML="\
		<div style='width:100%;height:100%;position:relative;overflow:hidden;border:0px solid white;padding:2px;padding-bottom:0px;'>\
			<div style='display:inline-block;margin:2px;width:26px;height:26px;overflow:hidden;border:0px solid red;background-image:url("+ROOT_FOLDER+'/themes'+THEME+'/taskbar.png'+");background-position:center center;background-repeat:no-repeat;'></div>\
		</div>";
	object.innerHTML=newInnerHTML;

	content=system.getChildNode(object,1);
	
	infoBar=system.getChildNode(object,1);
	
	system.setGradient(infoBar,'#e7e7e7','100','#d3d3d3','100');
	//system.setCornerRadius(object,0,0,5,5);
	//system.setCornerRadius(infoBar,0,0,5,5);
	system.setBoxShadow(object,'',0,0,3,0,'333');
	system.setBoxType(object,'in');
	system.setBoxType(infoBar,'in');

	//object.addEventListener("resize",xxx,false);
	//object.attachEvent("onresize",xxx);
	//object.onresize=xxx;

	object.data.focusItem=function(obj){
		if ((local.selected==null)||(local.selected.data.pointer!==obj)){
			var found=null;
			var max=local.tasks.length;
			for (var i=0;i<max;i++){
				if (local.tasks[i].pointer===obj){
					found=local.tasks[i];
					break;
				}
			}
			if (found!=null){
				if (local.selected!=null){
					if ((local.selected.data.pointer.data)&&(local.selected.data.pointer.data.onBlur)){
						local.selected.data.pointer.data.onBlur();
					}
					local.selected.style.backgroundColor=colors.baseColor;
				}
			
				local.selected=found.item;
				local.selected.style.backgroundColor=colors.backColor;
				if ((local.selected.data.pointer.data)&&(local.selected.data.pointer.data.onFocus)){
					local.selected.data.pointer.data.onFocus();
				}		
			}
		}
	}
	object.data.blurItem=function(obj){
		var found=null;
		var max=local.tasks.length;
		var nextFocus=null;
		for (var i=0;i<max;i++){
			if (local.tasks[i].pointer===obj){
				found=local.tasks[i];
			}else{
				if ((nextFocus==null)&&(local.tasks[i].pointer.style.display!='none')){
					nextFocus=local.tasks[i];
				}else{
					if ((local.tasks[i].pointer.style.zIndex>nextFocus.pointer.style.zIndex)&&(local.tasks[i].pointer.style.display!='none')){
						nextFocus=local.tasks[i];
					}
				}
			}
		}
		
		if (found!=null){
			found.item.style.backgroundColor=colors.baseColor;
			local.selected=null;
		}
		/*if (nextFocus!=null){
			nextFocus.item.style.backgroundColor=colors.backColor;
			local.selected=nextFocus.item;
			if ((local.selected.data.pointer.data)&&(local.selected.data.pointer.data.onFocus)){
				local.selected.data.pointer.data.onFocus();
			}		
		}*/
	}

	object.remove=function(obj){
		var found=null;
		var max=local.tasks.length;
		for (var i=0;i<max;i++){
			if (local.tasks[i].pointer===obj){
				found=local.tasks[i];
				break;
			}
		}
		if (found!=null){
			found.item.parentNode.removeChild(found.item);
			local.tasks.splice(i,1);
		}
	}

	object.add=function(label,image,obj){
		var newItem=document.createElement('div');
			newItem.style.width='120px';
			newItem.style.height='26px';
			newItem.style.overflow='hidden';
			newItem.style.display='inline-block';
			newItem.innerHTML=label;
			newItem.style.border='1px solid '+colors.borderColor;
			newItem.style.backgroundColor='white';
			newItem.style.margin='2px';
			//newItem.style.padding='2px';
			newItem.active=1;
			newItem.data=new Object();
			
			var newItemHTML="\
				<table cellpadding='0' cellspacing='0' style='width:100%;height:100%;font-family:Verdana;font-size:12px;table-layout:fixed;'>\
					<tr>\
						<td style='width:20px;padding:2px;vertical-align:middle;background-image:url("+image+");background-position:center center;background-repeat:no-repeat;'>\
						<td style='width:100%;height:100%;vertical-align:middle;padding:2px;border:0px solid red;white-space:nowrap;'>\
							<div style='width:100%;overflow:hidden;white-space:nowrap;color:white;font-family:"+system.data.style.fonts.font1+";font-weight:normal;'>"+label+"</div>\
				</table>\
			";
			newItem.innerHTML=newItemHTML;
			system.setCornerRadius(newItem,2,2,2,2);
			//system.setBoxShadow(newItem,'',0,0,1,0,'b48047');
			//system.setGradient(newItem,system.data.style.colors.color3,'100',system.data.style.colors.color3,'50',system.data.style.colors.color3,'100');
			newItem.style.backgroundColor=colors.baseColor;
			if (system.browser!='MIE'){
				system.setTextShadow(system.getChildNode(newItem,'1:1:1:2:1'),0,1,0,'#b48047');
			}

			var newTask=new Object();
			newTask.pointer=obj;
			newTask.item=newItem;
			local.tasks.push(newTask);
			
			newItem.data.pointer=obj;

			if (!obj.data){
				obj.data=new Object();
			}
			obj.data.eventOnFocusTaskbar=boss.data.focusItem;
			obj.data.eventOnBlurTaskbar=boss.data.blurItem;
			
			content.appendChild(newItem);	
	}

	object.onmousedown=function(e){
		var event=e?e:window.event; 
		var target=event.target? event.target : event.srcElement;
		while ((target!==this)&&(target.active!=1)){
			target=target.parentNode;
		}
		if (target.active==1){
			local.itemPressed=target;
			target.style.backgroundColor=colors.backColor;
			//this.style.borderStyle='inset';
		}
	}
	object.onmouseup=function(e){
		var event=e?e:window.event; 
		var target=event.target? event.target : event.srcElement;
		while ((target!==this)&&(target.active!=1)){
			target=target.parentNode;
		}
		if ((target.active==1)&&(local.itemPressed==target)){
			local.itemPressed=null;
			target.style.backgroundColor=colors.baseColor;
			//this.style.borderStyle='outset';
		}
	}
	object.onmouseover=function(e){
		var event=e?e:window.event; 
		var target=event.target? event.target : event.srcElement;
		while ((target!==this)&&(target.active!=1)){
			target=target.parentNode;
		}
		if ((target.active==1)&&(local.itemPressed==target)){
			target.style.backgroundColor=colors.backColor;
			//this.style.borderStyle='outset';
		}
	}
	object.onmouseout=function(e){
		var event=e?e:window.event; 
		var target=event.target? event.target : event.srcElement;
		while ((target!==this)&&(target.active!=1)){
			target=target.parentNode;
		}
		if ((target.active==1)&&(local.itemPressed==target)){
			target.style.backgroundColor=colors.baseColor;
			//this.style.borderStyle='outset';
		}
	}
	object.onclick=function(e){
		var event=e?e:window.event; 
		var target=event.target? event.target : event.srcElement;
		while ((target!==this)&&(target.active!=1)){
			target=target.parentNode;
		}
		if (target.active==1){
			if (local.selected!=null){
				if ((local.selected.data.pointer.data)&&(local.selected.data.pointer.data.onBlur)){
					local.selected.data.pointer.data.onBlur();
				}
				local.selected.style.backgroundColor=colors.baseColor;
			}
			local.selected=target;
			local.selected.style.backgroundColor=colors.backColor;
			if ((local.selected.data.pointer.data)&&(local.selected.data.pointer.data.onFocus)){
				local.selected.data.pointer.data.onFocus();
			}
		}
	}

	var dragHandler=function(event,_this){
		system.bringToFront(boss);
	}
	system.addEvent(object,'mousedown',function(e){var _this=this; dragHandler(e? e : window.event,_this);});




	return object;
}