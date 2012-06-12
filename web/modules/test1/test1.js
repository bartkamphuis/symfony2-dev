var test = (function ($) {
    function path(txt){
	return(ROOT_FOLDER+'/modules/test/'+txt);
    }
	
	var uploader=new x_Uploader({id:'x_file_uploader',color:'#Ff0000'});
	uploader.style.position='absolute';
	uploader.style.left='319px';
	uploader.style.top='35px';
	uploader.style.width='160px';
	uploader.style.height='25px';
	uploader.content.innerHTML="<table cellspacing='0' cellpadding='5' style='background-color:lightgray;width:100%;height:100%;font-size:14px;color:#616161;position:absolute;left:0px;bottom:0px;line-height:18px;'><tr><td align='center'>UPLOAD</table>";
	frame.content[2].appendChild(uploader);
	uploader.show();


	uploader.data.eventOnSubmit=function(){
		alert('Files selected: '+this.getFilesCount());
		if (this.getFilesCount()>0){
			
			var statusCheck=function(data){
				if (data===false){
					alert('Error');
				}else{
					var piece=data.split('-');
					if (piece[0]!=1){
						track.write(piece[1]+'==='+piece[2]);
						return true;
					}else{
						track.write(piece[1]+'==='+piece[2]);
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
			uploader.status(statusCheck);
		}else{
			
		}
	}
 
	var fileList=new uploader.newFileSelector({width:321,height:358,color:'#Ff0000'});
	fileList.style.position='absolute';
	fileList.style.left='119px';
	fileList.style.top='35px';
	fileList.style.width='160px';
	fileList.style.height='25px';
	fileList.content.innerHTML="<table cellspacing='0' cellpadding='5' style='background-color:lightgray;width:100%;height:100%;font-size:14px;color:#616161;position:absolute;left:0px;bottom:0px;line-height:18px;'><tr><td align='center' style='white-space:nowrap;'>SELECT FILES</table>";
	frame.content[2].appendChild(fileList);
	
	fileList.data.eventOnSelect=function(){
		var orderNo=uploader.addFiles(fileList);
		var newRow=filesTable.insertRow(-1);
		var newCell=newRow.insertCell(-1);
		var newTab=document.createElement('table');
		newTab.setAttribute('cellpadding',5);
		newTab.setAttribute('cellspacing',0);
		newTab.style.width='100%';
		newCell.appendChild(newTab);

		var fls=uploader.getFiles(orderNo);
		for (var i=0;i<fls.length;i++){
			var newRow=newTab.insertRow(-1);			
			
			var fileName=fls[i].name;
			var brake=fileName.split('/');
			var fileName=brake[brake.length-1];
			
			var extension=fileName.split('.');
				extension=extension[extension.length-1];

			var newCell=newRow.insertCell(-1);
			newCell.setAttribute('align','left');
			newCell.style.verticalAlign='middle';
			newCell.innerHTML=fileName;
track.write(extension);
			if (extension=='txt'){
				var can=system.canvas({width:'40px',height:'40px',canvas:theme.canvas.mimeText});
				can.draw({});
			}else if((extension=='doc')||(extension=='docx')){
				var can=system.canvas({width:'40px',height:'40px',canvas:theme.canvas.mimeWord});
				can.draw({});
			}else if ((extension=='xls')||(extension=='xlsx')){
				var can=system.canvas({width:'40px',height:'40px',canvas:theme.canvas.mimeExcel});
				can.draw({});
			}else if (extension=='pdf'){
				var can=system.canvas({width:'40px',height:'40px',canvas:theme.canvas.mimePdf});
				can.draw({});
			}else if (extension=='avi'){
				var can=system.canvas({width:'40px',height:'40px',canvas:theme.canvas.video});
				can.draw({});
			}else if (extension=='mp3'){
				var can=system.canvas({width:'40px',height:'40px',canvas:theme.canvas.audio});
				can.draw({});
			}else{
				var can=system.canvas({width:'40px',height:'40px',canvas:theme.canvas.mimeFile});
				can.draw({});
			}
			
			var newCell=newRow.insertCell(-1);
			newCell.setAttribute('align','right');
			newCell.style.verticalAlign='middle';
			newCell.appendChild(can);
			
		}		
	}

/*	var fls=new x_Button({width:100,height:50,label:'Current files'});
	fls.style.position='absolute';
	fls.style.bottom='10px';
	fls.style.right='190px';
	fls.show();
	frame.content[2].appendChild(fls);
	
	fls.data.eventOnClick=function(e){
		track.write('FILE LIST');
		fls=fileList.getFiles();
		for (var j=0;j<fls.length;j++){
			track.write(fls[j].name);
		}
	}


	var grp=new x_Button({width:100,height:50,label:'Groups'});
	grp.style.position='absolute';
	grp.style.bottom='10px';
	grp.style.right='80px';
	grp.show();
	frame.content[2].appendChild(grp);
	
	grp.data.eventOnClick=function(e){
		track.write('GROUP LIST');
		var max=uploader.items.length;
		for (var i=0;i<max;i++){
			track.write('GROUP '+i);
			fls=uploader.getFiles(i);
			for (var j=0;j<fls.length;j++){
				track.write(fls[j].name);
			}
		}
	}
*/

	var filesTableWrapper=document.createElement('div');
	filesTableWrapper.style.height='500px';
	filesTableWrapper.style.position='absolute';
	filesTableWrapper.style.top='70px';
	filesTableWrapper.style.left='10px';
	filesTableWrapper.style.right='10px';
	filesTableWrapper.style.border='1px solid lightgray';
	filesTableWrapper.innerHTML="<table cellspacing='0' cellpadding='0' style='width:100%;'></table>";
	frame.content[2].appendChild(filesTableWrapper);
	var filesTable=system.getChildNode(filesTableWrapper,1);

}(window.$));