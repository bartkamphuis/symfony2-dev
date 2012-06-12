function x_Track(){
	var object=document.createElement('div');
	object.style.width='300px';
	object.style.height='300px';
	object.style.position='absolute';
	object.style.left='';
	object.style.right='10px';
	object.style.top='10px';
	object.style.overflow='auto';
	object.style.backgroundColor='#cdcdcd';
	object.style.display='none';
	object.style.zIndex='99999';
	object.content=object;
	
	object.show=function(x,y){
		this.style.left=x;
		this.style.top=y;
		this.style.position='absolute';
		this.style.display='';
	}	

	object.write=function(text){
		this.show(1606,2);
		this.content.innerHTML=this.content.innerHTML+text+"<br>";
		this.scrollTop=100000;
	}	

	object.clear=function(){
		this.show(1606,2);
		this.content.innerHTML='';
	}	

	document.body.appendChild(object);
	return object;
}