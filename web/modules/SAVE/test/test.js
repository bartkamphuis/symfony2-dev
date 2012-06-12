var test = (function () {
    function path(txt){
	return(ROOT_FOLDER+'/modules/test/'+txt);
    }

	var explorer=new x_Explorer();
	explorer.style.position='absolute';
	/*explorer.style.left='0px';
	explorer.style.top='0px';
	explorer.style.right='0px';
	explorer.style.bottom='0px';*/
	explorer.style.width='100%';
	explorer.style.height='50%';
	//frame.data.content[1].appendChild(explorer);
	//win1.data.content.appendChild(explorer);
	explorer.setItemTypes('1,2,3');

	var rez=explorer.addItem(explorer,1,'First',1);
	explorer.addItem(rez,2,'Seccond',1);
	explorer.addItem(rez,2,'Third',1);
	rez=explorer.addItem(rez,2,'Fourth',1);
	explorer.addItem(rez,3,'Fifth',1);
	explorer.style.display='block';
	
//DROP ZONE
/*	var drop=document.createElement('div');
	drop.style.position='absolute';
	drop.style.left='0px';
	drop.style.top='0px';
	drop.style.right='0px';
	drop.style.bottom='0px';
	drop.style.width='100%';
	drop.style.height='100%';
	if (system.browser=='MIE'){
		drop.style.display='inline';
	}else{
		drop.style.display='inline-block';
	}
	//drop.style.borderTop='1px solid #333333';
	frame.content[3].appendChild(drop);
	
	drop.dropZone=true;
	drop.dropOverHandler=function(){
		this.style.backgroundImage='url('+ROOT_FOLDER+'/themes/'+THEME+'/explorer/selector.png)';
	}
	drop.dropOutHandler=function(){
		this.style.backgroundImage='';
	}
	drop.dropHandler=function(obj,target){
		//target - the element on which the miuse was clicked
		for (var i=0;i<obj.length;i++){
			this.appendChild(obj[i].parentNode.removeChild(obj[i]));
		}
	}
*/

	explorer1=new x_Explorer_Selectable({
		corner:{width:3,height:3},
		content:{left:2,top:2,right:2,bottom:2},
		images:{corners:ROOT_FOLDER+'/themes/'+THEME+'/panel/corners.png',
				sides:ROOT_FOLDER+'/themes/'+THEME+'/panel/sides.png',
				background:ROOT_FOLDER+'/themes/'+THEME+'/panel/background.png'
		}
	});
	explorer1.style.position='absolute';
	explorer1.style.left='0px';
	explorer1.style.top='0px';
	explorer1.style.width='100%';
	explorer1.style.height='100%';
	//explorer1.style.border='1px solid red';
	win.data.content.appendChild(explorer1);
	explorer1.show();
	

);

	win.style.display='block';
	//win1.style.display='block';
	system.loadComplete=true;

}());