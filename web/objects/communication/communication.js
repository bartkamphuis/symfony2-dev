function x_Communication(){

	object=new Object();
	object.id='';
	object.selected=0;
	object.communicationActive=0;
	
	object.queue=Array();
	object.queueMax=0;
	object.ajax=0;
	object.count=0;
	var boss=object;
	
	object.processRequest=function(){

			var retry=0;
			if (boss.ajax.readyState==4){
				clearInterval(boss.queue[0].cancelID);
				if (boss.ajax.status==200){
					boss.queueMax=boss.queueMax-1;
					var currentQueue=boss.queue.shift();
					
					//calls the callBack and after that goes further with the queue
					if (currentQueue.syncron===true){
					    currentQueue.processFunction(boss.ajax.responseText);
					}else{
					    window.setTimeout(function(){currentQueue.processFunction(boss.ajax.responseText);},1);
					}
					
					//track.write('Communication '+boss.queue[0].order+' OK');
				}else{
					//track.write('Communication '+boss.queue[0].order+' ERROR');
					if (boss.queue[0].retry>0){
						retry=1;
						boss.queue[0].retry=boss.queue[0].retry-1;
						//track.write('Retrying communication '+boss.queue[0].order);
						boss.process();
					}else{
						errorMessage="";
						if (boss.queue[0].retry==-1){
							errorMessage='Could not load page. Please try again.';
						}else{
						
						switch (boss.ajax.status){
							case 400: errorMessage="Unknown request.";break;
							case 401: errorMessage="No authorization.";break;
							case 403: errorMessage="Request rejected by server.";break;
							case 404: errorMessage="No module to load.";break;
							case 405: errorMessage="Wrong method for requested resource.";break;
							case 406: errorMessage="Unacceptable request.";break;
							case 407: errorMessage="Proxy authentication required.";break;
							case 408: errorMessage="Timeout for request for server.";break;
							case 409: errorMessage="Resource conflict.";break;
							case 410: errorMessage="Unavailable resource and no forward address.";break;
							case 411: errorMessage="Server does not accept request without Content-length hader.";break;
							case 414: errorMessage="Server does not accept URI with this length.";break;
							case 500: errorMessage="Internal server error.";break;
							case 501: errorMessage="Server does not have the functionality to server the request.";break;
							case 503: errorMessage="Server stopped or overloaded.";break;
							case 505: errorMessage="Unacceptable HTTP version.";break;
							default:  errorMessage=boss.ajax.status;
						}
						}
						
						boss.queue[0].processFunction('0<'+errorMessage);
						boss.queueMax=boss.queueMax-1;
						boss.queue.shift();
					}
				}

				if (retry==0){
					if (boss.queueMax>0){
						//track.write('New connection: '+boss.queue[0].order);
						boss.process();
					}else{
						boss.communicationActive=0;
						//track.write('Comm over & out');
					}
				}
			}
	}

	object.process=function(){
		if (this.queueMax>0){
			this.ajax=new XMLHttpRequest();		
			
			//boss=this;
			this.ajax.onreadystatechange=this.processRequest;
	
		this.ajax.open('POST',this.queue[0].target,true);
		this.ajax.setRequestHeader('Content-type','application/x-www-form-urlencoded');
		this.ajax.setRequestHeader('Content-length',this.queue[0].parameters.length);
		//this.ajax.setRequestHeader('Connection','close');
		this.queue[0].countdown=Math.round(new Date().getTime()*0.001);
		
		//this.queue[0].cancelID=setTimeout(function(){boss.queue[0].retry=0;boss.ajax.abort();},1000);
		if (this.queue[0].timeLimit){
			this.queue[0].cancelID=setTimeout(this.resetConnection,this.queue[0].timeLimit*1000);
		}else{
			this.queue[0].cancelID=setTimeout(this.resetConnection,10000);
		}
		this.ajax.send('data='+JSON.stringify(this.queue[0].parameters));
		}
	}

	object.resetConnection=function(){
		boss.queue[0].retry-=1;
		boss.ajax.abort();
	}
	
	object.connection=function(parameters,target,caller,retrys,timeLimit,syncron){
		this.queueMax=this.queueMax+1;
		//track.write('Starting comm '+this.queueMax);
		var piece=new Object();
		piece.parameters=parameters;
		piece.target=target;
		piece.processFunction=caller;
		piece.cancelID=0;
		piece.retry=retrys-1;
		if (syncron===true){
		    piece.syncron=true;
		}
		if (timeLimit){
			piece.timeLimit=timeLimit;
		}
		
		this.count=this.count+1;
		piece.order=this.count;
	
		this.queue.push(piece);

		if (this.communicationActive==0){
			this.communicationActive=1;
			this.process();
		}
	}

	return object;
}