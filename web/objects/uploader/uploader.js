/*
UPLOADER
-------

CONSTRUCTOR
	id	- the id of the iframe
	
METHODS
	show	-	displays the textbox
	hide	-	hides the textbox
	newFileSelector(width,height,pic)	-	creates a new browse button to enable file selections
		!	multiple file selectors can be defined
	addFile(fileSelector) - add the selected file to the list of files which will be uploaded.
							RETURNS	a number which is the itemOrder in the list
		fileSelector - object returned by the newFileSelector method
	removeFile(itemOrder) - removes a file from the list of files which would be uploaded
		itemOrder - the order number of the file in the list
	getFilescount()	- returns the number of files ready to be uploaded

EVENTS
	eventOnSubmit	-	function called when the files are submitted. The function should return true if the status needs to be returned or false if the status of the upload is not needed anymore.
	eventOnSelect	-	function called when a file is selected

ATTRIBUTES


*/

function x_Uploader(param){
	if (!param.color){param.color='#FFFFFF';}
	if (!param.text){param.text='';}
	
	var baseColor='#c8f2c8';
	var colors=new Object();
		colors.baseColor=baseColor;
		colors.backColor=system.setColorHSVA(param.color,0,0,20,0,'RGBA');
		colors.borderColor=system.setColorHSVA(param.color,0,0,-50,0,'RGBA');

	var object=document.createElement('div');
    object.style.display='block';
	object.style.left=-10000;
    object.style.top=-10000;

	object.data=new Object();
	object.data.eventOnMouseDown=function(){}
	object.data.eventOnMouseUp=function(){}
	object.data.eventOnSubmit=function(){}
	
	object.style.overflow='hidden';
	object.items=new Array();
	object.x=250;
	object.y=250;
	object.fileId=param.id;
	object.reloadIframe='refresh';
	
	var boss=object;

	var local=new Object();
	local.pressed=0;
	local.returnedData=null;

	object.innerHTML="\
		<div style='width:100%;height:100%;overflow:hidden;position:relative;'>\
			<div style='width:100%;height:100%;overflow:hidden;position:absolute;left:0px;top:0px;z-index:2;'></div>\
			<div style='width:100%;height:100%;overflow:hidden;position:absolute;left:0px;top:0px;z-index:1;'></div>\
		</div>\
	";

	object.content=system.getChildNode(object,'1:1');

	system.getChildNode(object,'1').onmouseover=function(){
		//this.style.backgroundPosition='0 -'+y+'px';
	}
	system.getChildNode(object,'1').onmouseout=function(){
		//this.style.backgroundPosition='0 0';
	}

	var iframe=document.createElement('iframe');
	iframe.setAttribute('id',param.id);
	iframe.src='';
	iframe.style.width='100%';
	iframe.style.height='100%';
	iframe.style.position='absolute';
	iframe.style.left='0px';
	iframe.style.top='0px';
	iframe.style.zIndex=3;
	system.setAlpha(iframe,0);
	system.getChildNode(object,'1').appendChild(iframe);
	system.setBoxType(iframe,'in');

	iframe.onload=function(){
	if (boss.reloadIframe=='refresh'){
		while (boss.items.length>0){
			boss.items.pop();
		}

		boss.reloadIframe='waiting';
		var frame = document.getElementById(boss.fileId);
		var doc = frame.contentWindow.document;

		local.returnedData=doc.body.innerHTML;

		doc.open();
		doc.write("<form method='post' action='"+ROOT_FOLDER+"/modules/test1/upload.php' enctype='multipart/form-data'>\
				<input type='hidden' name='APC_UPLOAD_PROGRESS' value='7' />\
				<input type='submit' style='border:0px solid white;z-index:100;position:absolute;width:100%;height:100%;margin:0px;left:0px;top:0px;' value='Upload'/>\
			</form>");
		doc.close();

		doc.body.onmouseover=function(e){
			var event=e?e:window.event; 
			local.pressed=0;
		}

		doc.body.onmouseout=function(e){
			var event=e?e:window.event; 
			event.noAction=true;
			local.pressed=0;
			var target=event.target? event.target : event.srcElement;
		}
		
		doc.body.onmousedown=function(e){
			var event=e?e:window.event; 
			event.noAction=true;
			local.pressed=1;
			boss.data.eventOnMouseDown(event);
		}
		
		doc.body.onmouseup=function(e){
			var event=e?e:window.event; 
			if (local.pressed==1){
				local.pressed=2;
				boss.data.eventOnMouseUp(event);
			}else{
				local.pressed=0;
			}
		}

		boss.filesContent=doc.forms[0];
		boss.filesContent.onsubmit=function(e){
			track.write('Submit');
			var event=e?e:window.event; 
			if ((boss.reloadIframe=='waiting')&&(local.pressed==2)){
				boss.reloadIframe='refresh';
				return(boss.data.eventOnSubmit(event));
			}else{
				return false;
			}
		}
		
	}
	}

object.getLastReturnedData=function(){
	return local.returnedData;
}

object.status=function(callback){
	var ajax=new XMLHttpRequest();
	var retry=3;		
	
	var getStatus=function(){
		ajax.onreadystatechange=function(){
			if (ajax.readyState==4){
				if (ajax.status==200){
					if (ajax.responseText!=''){
						var data=ajax.responseText.split(':');
						
						if (data[0]==1){
							var ret=callback(data[1]);
							if (ret){
								retry=3;
								setTimeout(getStatus,1000);
							}
						}else{
							callback(false);
						}						
					}else{
						retry=retry--;
						if (retry>0){
							setTimeout(getStatus,1000);
						}else{
							callback(false);	
						}
					}
				}else{
					retry=retry--;
					if (retry>0){
						setTimeout(getStatus,1000);
					}else{
						callback(false);
					}
				}			
			}
		}

		ajax.open('POST','/kn/modules/test1/upload_monitor.php',true);
		ajax.send();
	}

	setTimeout(getStatus,1);
}

	/*FILE SELECTOR*/
	object.newFileSelector=function(param){
		var file=document.createElement('div');
		file.style.overflow='hidden';
		file.data=new Object();
			
		var local=new Object();
		local.pressed=0;
		
		file.data=new Object();
		file.data.eventOnMouseDown=function(){}
		file.data.eventOnMouseUp=function(){}
		file.data.eventOnSelect=function(){}	/*Is called when a file is selected.*/
		
		file.innerHTML="\
			<div style='width:100%;height:100%;overflow:hidden;position:relative;left:0px;top:0px;'>\
				<div style='width:100%;height:100%;overflow:hidden;position:absolute;left:0px;top:0px;z-index:1;'></div>\
				<input type='file' multiple='' name='"+boss.fileId+"' size='0' style='font-size:1000px;z-index:2;position:absolute;right:-10px;top:-10px;margin:0px;'/>\
			</div>";
		file.content=system.getChildNode(file,'1:1');
		file.data.selector=system.getChildNode(file,'1:2');
		file.data.content=system.getChildNode(file,'1:1');
		system.setAlpha(file.data.selector,0);

		file.onmouseover=function(){
			local.pressed=0;
		}
		file.onmousedown=function(e){
			var event=e?e:window.event; 
			event.noAction=true;
			local.pressed=1;
			this.data.eventOnMouseDown();
		}
		file.onmouseup=function(e){
			var event=e?e:window.event; 
			if (local.pressed==1){
				local.pressed=2;
				this.data.eventOnMouseUp();
			}else{
				local.pressed=0;
			}
		}
		file.onmouseout=function(e){
			var event=e?e:window.event; 
			event.noAction=true;
			if (local.pressed!=2){
				local.pressed=0;
			}
		
			var target=event.target? event.target : event.srcElement;
			var toTarget = event.relatedTarget || event.toElement;
			while (toTarget!==event.currentTarget && toTarget.tagName!='BODY'){
				toTarget=toTarget.parentNode;
			}
			if (toTarget!==event.currentTarget){
				//system.setGradient(local.skin,colors.backColor,100,colors.baseColor,100);
			}
		}
		file.onclick=function(){
			if (local.pressed!=2){
				return false;
			}
		}
		file.data.selector.onchange=function(e){
			var event=e?e:window.event; 
			if (local.pressed==2){
				this.parentNode.parentNode.data.eventOnSelect(event);
			}
		}

		file.getFiles=function(){
			if (system.browser=='MIE'){
				var ieSucks=new Array();
				ieSucks[0]={name:this.data.selector.value};
				return ieSucks;
			}else{
				return this.data.selector.files;	
			}
		}

		//boss.items.push(file);
		return file;
	}

	object.addFiles=function(obj){
		if (obj.data.selector.value!=''){
			var fileClone=obj.data.selector.cloneNode(true);
			fileClone.onchange=obj.data.selector.onchange;
			
			//obj.data.selector.style.fontSize='12px';
			//system.setAlpha(obj.data.selector,100);
			//obj.data.selector.style.position='relative';

			obj.data.selector.itemOrder=this.items.length;
			var itemOrder=obj.data.selector.itemOrder;
			obj.data.selector.name=obj.data.selector.name+'_'+obj.data.selector.itemOrder;
			this.items.push(obj.data.selector);
			obj.data.selector.parentNode.appendChild(fileClone);
			this.filesContent.appendChild(obj.data.selector.parentNode.removeChild(obj.data.selector));
			obj.data.selector=system.getChildNode(obj,'1:2');
			/*OPERA is not clearing the selected files.*/
			obj.data.selector.value='';
			return itemOrder;
		}else{
			return false;
		}
	}

	object.getFiles=function(group){
		if (!group){group=0;}
		if (this.items.length==0){return false;}
		if (system.browser=='MIE'){
			var ieSucks=new Array();
			ieSucks[0]={name:this.items[group].value};
			return ieSucks;
		}else{
			return this.items[group].files;
		}
	}


	object.removeFile=function(itemOrder){
		this.items[itemOrder].parentNode.removeChild(this.items[itemOrder]);
		this.items[itemOrder]=null;
	}
	
	object.show=function(){
		this.style.display='block';
	}
	object.hide=function(){
		this.style.display='none';
	}

	return object;
}