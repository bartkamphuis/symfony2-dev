//This can be PHP file
var test = (function () {
    function path(txt){
		return(ROOT_FOLDER+'/modules/home/'+txt);
    }

	var settings=system.canvas({width:'125px',height:'125px',canvas:theme.canvas.loading1});
	settings.draw({color:theme.colors.note});
	settings.style.position='absolute';
	settings.style.left='300px';
	settings.style.top='270px';
	board.content.appendChild(settings);

	//system.loadComplete=true;

}());