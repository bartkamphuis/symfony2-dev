var test = (function () {
    function path(txt){
	return(ROOT_FOLDER+'/modules/menu/'+txt);
    }

/*
var createWindow=function(title,x,y,wid,hei){
	var win=new x_Window({
		title:title,
		size:{minWidth:300,minHeight:200},
		corners:{leftTop:4,rightTop:4,rightBottom:0,leftBottom:0},
		header:{
			height:25,
			titleAlign:'center',
			left:3,top:5,right:3,bottom:0},
		content:{left:2,top:1,right:2,bottom:2},
		font:{
			family:'perfect',
			size:10,
			color:'#757575'},
		images:{corners:ROOT_FOLDER+'/themes/'+THEME+'/window/corners.png',
				sides:ROOT_FOLDER+'/themes/'+THEME+'/window/sides.png',
				background:ROOT_FOLDER+'/themes/'+THEME+'/window/background.png'
			},
		resize:{size:5}
	});
	win.data.eventOnMinimize=function(){
		if (win.data.eventOnBlurTaskbar){
			win.data.eventOnBlurTaskbar(win);
		}
	}
	win.data.eventOnMaximize=function(){
		win.data.lastX=win.offsetLeft;
		win.data.lastY=win.offsetTop;
		win.data.lastWidth=win.offsetWidth;
		win.data.lastHeight=win.offsetHeight;
		win.style.left=(menu.getPageX()+3)+'px';
		win.style.top=(menu.getPageY()+3)+'px';
		win.style.width=(menu.getPageWidth()-6)+'px';
		//win.style.height=(win.parentNode.offsetHeight-6)+'px';
		win.style.height=(menu.getPageHeight()-6)+'px';
		winScroll.repaint();
	}
	win.data.eventOnMiddlelize=function(){
		win.style.left=win.data.lastX+'px';
		win.style.top=win.data.lastY+'px';
		win.style.width=win.data.lastWidth+'px';
		win.style.height=win.data.lastHeight+'px';
	}
	win.data.eventOnClose=function(){
		
	}
	win.data.eventOnFocus=function(){
		if (win.data.eventOnFocusTaskbar){
			win.data.eventOnFocusTaskbar(win);
		}
	}
	win.data.eventOnBlur=function(){
		if (win.data.eventOnBlurTaskbar){
			win.data.eventOnBlurTaskbar(win);
		}
	}

    win.style.position='absolute';
	win.style.left=x;
	win.style.top=y;
	win.style.width=wid;
	win.style.height=hei;
	return win;
}

	var win1=createWindow('Window 1','2000px','100px','500px','750px');
	menu.data.content.appendChild(win1);

	explorer1=new x_Explorer_Selectable({
	});
	explorer1.style.position='absolute';
	explorer1.style.left='0px';
	explorer1.style.top='0px';
	explorer1.style.width='100%';
	explorer1.style.height='100%';
	win1.data.content.appendChild(explorer1);
	explorer1.show();	

	winScroll=new x_Scrollbar({
		link:explorer1.content,
		type:'vertical',
		drag:{
			size:30,
			top:0,
			bottom:0
		}
	});
	winScroll.style.position='absolute';
	winScroll.style.right='7px';
	winScroll.style.top='0px';
    winScroll.style.width='6px';
	winScroll.style.top='20px';
	winScroll.style.bottom='20px';

	winScrol2=new x_Scrollbar({
		link:explorer1.content,
		type:'horizontal',
		drag:{
			size:30,
			top:0,
			bottom:0
		}
	});
	winScrol2.style.position='absolute';
	winScrol2.style.right='7px';
	winScrol2.style.bottom='7px';
    winScrol2.style.height='6px';
	winScrol2.style.left='7px';
	winScrol2.style.right='20px';

	win1.data.content.appendChild(winScroll);
	win1.data.content.appendChild(winScrol2);

	win1.data.eventOnResize=function(){
		winScroll.repaint();
		winScrol2.repaint();
	}

	win1.data.eventOnMouseover=function(){
		winScroll.repaint();
		winScrol2.repaint();
	}
	win1.data.eventOnMouseout=function(){
		winScroll.hide();
		winScrol2.hide();
	}
	
	//WIN2
	var win2=createWindow('Window 2','2550px','100px','500px','750px');
	menu.data.content.appendChild(win2);





























	//WIN 3
	var win3=createWindow('Window 3','3100px','100px','500px','750px');
	menu.data.content.appendChild(win3);


	var but1=new x_Button({
		width:70,
		height:30,
		text:'OK',
		font:{
			family:'perfect',
			size:14,
			color:'gray'},		
		content:{left:0,top:0,right:0,bottom:0},
		image:{width:30,height:30,src:ROOT_FOLDER+'/objects/taskbar/icon.png'}
	});
	but1.style.position='absolute';
	but1.style.left='10px';
	but1.style.top='100px';
	//but1.style.width='250px';
	//but1.style.height='35px';
	win3.data.content.appendChild(but1);
	but1.show();

	var progress=new x_Progress();
	progress.style.position='absolute';
	progress.style.width='200px';
	progress.style.left='10px';
	progress.style.top='10px';
	win3.data.content.appendChild(progress);
	progress.show();

	var up=new x_Uploader({id:'upload_id',text:'Upload',image:ROOT_FOLDER+'/objects/taskbar/icon.png'});
	up.show();
	up.style.position='absolute';
	up.style.width='100px';
	up.style.height='50px';
	up.style.left='390px';
	up.style.top='10px';
	win3.data.content.appendChild(up);

	up.data.eventOnSubmit=function(event){
		if (this.getFilesCount()>0){
			
			var statusCheck=function(data){
				if (data===false){
					progress.error();
				}else{
					var piece=data.split('-');
					if (piece[0]!=1){
						progress.setTotal(piece[1]);
						progress.update(piece[2]);
						return true;
					}else{
						progress.setTotal(piece[1]);
						progress.update(piece[2]);
						setTimeout(function(){
							progress.hide();
							var totalEntries=fileList.rows.length;
							for (var i=0;i<totalEntries;i++){
								fileList.rows[0].parentNode.removeChild(fileList.rows[0]);
							}
						},1000);
						return false;
					}
					
				}
			}
			progress.show();
			up.status(statusCheck);
		}else{
			
		}
	}

	var upSel1=up.newFileSelector({text:'Browse Files',image:ROOT_FOLDER+'/objects/taskbar/icon.png'});
	upSel1.style.position='absolute';
	upSel1.style.width='160px';
	upSel1.style.height='25px';
	upSel1.style.left='220px';
	upSel1.style.top='10px';
	upSel1.extensions={'':0,'jpg':1,'pdf':2,'mp3':3};	
	win3.data.content.appendChild(upSel1);
	
	upSel1.data.eventOnSelect=function(event){
		var orderNumber=up.addFile(upSel1);
	}



	var onoff=new x_Switch({
		width:70,
		height:30,
		sliderWidth:40,
		text:{
			on:'On',
			off:'Off'
		},
		font:{
			family:'perfect',
			size:14,
			color:'gray'}
	});
	onoff.style.position='absolute';
	onoff.style.left='90px';
	onoff.style.top='100px';
	//but1.style.width='250px';
	//but1.style.height='35px';
	win3.data.content.appendChild(onoff);
	onoff.show();
	











	
	taskbar.add('Window 1',ROOT_FOLDER+'/objects/taskbar/icon.png',win1);
	taskbar.add('Window 2',ROOT_FOLDER+'/objects/taskbar/icon.png',win2);
	taskbar.add('Window 3',ROOT_FOLDER+'/objects/taskbar/icon.png',win3);

	win1.show();
	win2.show();
	win3.show();

	//winScroll.show();
	//winScrol2.show();



	var explorer=new x_Explorer({images:ROOT_FOLDER+'/themes/icons.png',size:20,values:[1,2,3,4,5,6,7,8]});
	explorer.style.position='absolute';
	explorer.style.left='25px';
	explorer.style.top='25px';
	explorer.style.right='25px';
	explorer.style.bottom='25px';

	var rez=explorer.addItem(explorer,1,'First',1);
	explorer.addItem(explorer,2,'seccond',2);
	explorer.addItem(rez,3,'Third',3);

	explorer.show();
	win2.data.content.appendChild(explorer);


	progress.setTotal(100);
	progress.update(50);

*/






	system.loadComplete=true;
}());