/*
FRAME
-------

CONSTRUCTOR
	direction	-	'horizontal'/'vertical'	-	defines the orientation of the cells
	padding		-	the padding around the cells
	border		-	border size for the cells
	resizer		-	the width of the drag bar for resizing.
	layout	-	an array of cells.Each cell can be defined by the properties:
		size	-	the size ofth3e cell in pixels or percent
		resize	-	true/false	- defines if the cell is resizable or not
		border	-	true/false	-	defines if the cell has border
	
		
ATTRIBUTES
	PUBLIC
		content	-	an array of contents which point to each frame in the frameset content[1], content[2], content[3], content[4]
					content[0], content[1] ... content[n]
	PRIVATE

PUBLIC METHODS
	
EXAMPLE
	var frame=new x_Frame({layout:[{size:250,resize:true,border:false},{resize:false,border:true},{resize:true,border:true},{resize:true,border:true}],direction:'horizontal',padding:5,resizer:5,border:1});	
*/
function x_Frame(param){
	var object=document.createElement('div');
        object.style.display='none';
		object.style.width='100%';
		object.style.height='100%';
		object.style.overflow='hidden';
		//object.style.minWidth='500px';
		//object.style.minHeight='200px';
		object.style.border='0px solid red';
		system.setBoxType(object,'in');
		object.style.background=theme.colors.background;

		if (!param.hasOwnProperty('layout')){ param.layout='resizable'; }
		if (!param.hasOwnProperty('border')){ param.border=0; }
		if (!param.hasOwnProperty('padding')){ param.padding=0; }
		if (!param.hasOwnProperty('direction')){ param.direction='horizontal'; }
		object.style.padding=param.padding+'px';

		var tab=document.createElement('table');
		tab.style.width='100%';
		tab.style.height='100%';
		tab.style.backgroundColor='green';
		tab.style.display='table';
		system.setBoxType(tab,'in');
		tab.style.overflow='hidden';
		tab.setAttribute('cellpadding',0);
		tab.setAttribute('cellspacing',0);
		//tab.setAttribute('border',1);
		system.setBoxType(tab,'in');

		object.content=new Array();
		/*Just so the numbering starts from 1*/
		object.content[0]=null;

		var local=new Object();
		local.freeCell=0;
		
var max=param.layout.length;

if (param.direction=='horizontal'){
	var newRow=tab.insertRow(-1);
	for (var i=0;i<max;i++){	
		//CELL
		var newCell=newRow.insertCell(-1);
		newCell.style.backgroundColor=theme.colors.area;
		
		if (param.layout[i].border){
			newCell.style.border=param.border+'px solid '+theme.colors.border;
		}else{
			newCell.style.border='0px solid '+theme.colors.border;
		}

		if (param.layout[i].hasOwnProperty('size')){
			if (!isNaN(param.layout[i].size)){param.layout[i].size=param.layout[i].size+'px';}
			newCell.style.width=param.layout[i].size;
		}
		newCell.style.height='100%';

		if (!param.layout[i].hasOwnProperty('resize')){
			newCell.resize=true;
		}else{
			newCell.resize=param.layout[i].resize;
		}
		
		system.setBoxType(newCell,'in');
		
		newCell.innerHTML="<div style='width:100%;height:100%;overflow:hidden;position:relative;'></div>";
		system.setBoxType(system.getChildNode(newCell,1),'in');
		object.content.push(system.getChildNode(newCell,1));
		
		var resizer=newCell.resize;
		
		//RESIZE CELL
		if (i+1<max){
			var newCell=newRow.insertCell(-1);
			newCell.style.width=param.resizer+'px';
			newCell.style.backgroundColor=theme.colors.background;
			if (resizer==true){
				newCell.style.cursor='e-resize';
				newCell.active=1;
			}else{
				newCell.style.cursor='default';
				newCell.active=0;
			}
			system.setBoxType(newCell,'in');
		}
	}
}

if (param.direction=='vertical'){
	for (var i=0;i<max;i++){	
		var newRow=tab.insertRow(-1);		
		//CELL
		var newCell=newRow.insertCell(-1);
		newCell.style.backgroundColor=theme.colors.area;
		if (param.layout[i].border){
			newCell.style.border=param.border+'px solid '+theme.colors.border;
		}else{
			newCell.style.border='0px solid '+theme.colors.border;
		}

		if (param.layout[i].hasOwnProperty('size')){
			if (!isNaN(param.layout[i].size)){param.layout[i].size=param.layout[i].size+'px';}
			newCell.style.height=param.layout[i].size;
		}
		newCell.style.width='100%';

		if (!param.layout[i].hasOwnProperty('resize')){
			newCell.resize=true;
		}else{
			newCell.resize=param.layout[i].resize;
		}
		
		system.setBoxType(newCell,'in');
		
		newCell.innerHTML="<div style='width:100%;height:100%;overflow:hidden;position:relative;'></div>";
		system.setBoxType(system.getChildNode(newCell,1),'in');
		object.content.push(system.getChildNode(newCell,1));
		
		var resizer=newCell.resize;

		//RESIZE CELL
		if (i+1<max){
			var newRow=tab.insertRow(-1);					
			var newCell=newRow.insertCell(-1);
			newCell.style.height=param.resizer+'px';
			newCell.style.backgroundColor=theme.colors.background;
			if (resizer==true){
				newCell.style.cursor='n-resize';
				newCell.active=2;
			}else{
				newCell.style.cursor='default';
				newCell.active=0;
			}			
			system.setBoxType(newCell,'in');
		}
	}
}

	
	
	

//RESIZE
//if (param.layout=='resizable'){
	if (param.direction=='horizontal'){
		var setPixelToPercent=function(resizer){
			var max=tab.rows[0].cells.length;
			for (var i=0;i<max;i=i+2){
				tab.rows[0].cells[i].style.width=(100*tab.rows[0].cells[i].offsetWidth/tab.offsetWidth)+'%';
			}
			tab.rows[0].cells[resizer].style.width='';
		}
	}else{
		var setPixelToPercent=function(resizer){
			var max=tab.rows.length;
			for (var i=0;i<max;i=i+2){
				tab.rows[i].cells[0].style.height=(100*tab.rows[i].cells[0].offsetHeight/tab.offsetHeight)+'%';
			}
			tab.rows[resizer].cells[0].style.height='';
		}
	}
		
		var resizeHandler=function(event,_this,target){
	
			var resizable=true;
			
			if (target.active==1){
				var resizer=tab.rows[0].cells[target.cellIndex-1];
				var j=target.cellIndex;
				var max=tab.rows[0].cells.length;
				while ((j<max)&&(tab.rows[0].cells[j+1].resize==false)){
					j=j+2;
				}
				if (j<max){
					//tab.rows[0].cells[j+1].style.width='';
					setPixelToPercent(j+1);
				}else{
					return false;
				}
				
				var startSize=parseInt(resizer.offsetWidth);
				var maxSize=startSize;
				if (j<max){
					maxSize=startSize+parseInt(tab.rows[0].cells[j+1].offsetWidth)-param.border*2;
				}
			}
			if (target.active==2){
				var resizer=tab.rows[target.parentNode.rowIndex-1].cells[0];				
				var j=target.parentNode.rowIndex;
				var max=tab.rows.length;
				while ((j<max)&&(tab.rows[j+1].cells[0].resize==false)){
					j=j+2;
				}
				if (j<max){
					//tab.rows[j+1].cells[0].style.height='';
					setPixelToPercent(j+1);
				}else{
					return false;
				}
				
				var startSize=parseInt(resizer.offsetHeight);
				var maxSize=startSize;
				if (j<max){
					maxSize=startSize+parseInt(tab.rows[j+1].cells[0].offsetHeight)-param.border*2;
				}				
			}

			if (target.active==1){
				object.style.cursor='e-resize';
			}
			if (target.active==2){
				object.style.backgroundColor='red';
				object.style.cursor='n-resize';
			}

			var newSize=0;
			
			var resizeWindow=function(x,y){
				if (target.active==1){
					newSize=startSize+x;
					if (newSize<1){newSize=1;}
					if (newSize>maxSize){newSize=maxSize;}
					//resizer.style.width=newSize+'px';
					newSize=newSize*100/tab.offsetWidth;
					resizer.style.width=newSize+'%';
				}
				if (target.active==2){
					newSize=startSize+y;
					if (newSize<1){newSize=1;}
					if (newSize>maxSize){newSize=maxSize;}
					//resizer.style.height=newSize+'px';
					newSize=newSize*100/tab.offsetHeight;
					if (newSize<0.5){newSize=0.5;}
					resizer.style.height=newSize+'%';
				}
				return true;
			}
			
			var endResizeWindow=function(){
				object.style.cursor='default';
			}
			
			system.startMoveAction(event,_this,_this.parentNode,resizeWindow,endResizeWindow,1);
		}

		system.addEvent(object,'mousedown',function(e){
			var event=e?e:window.event; 
			var target=event.target? event.target : event.srcElement;	
			if ((target.active==1)||(target.active==2)){
				resizeHandler(event,this,target);
			}
		});
//}



	object.appendChild(tab);

	object.show=function(){
		this.style.visibility='hidden';
		this.style.display='';
		setPixelToPercent(0);
		this.style.visibility='visible';
	}

	return object;
}