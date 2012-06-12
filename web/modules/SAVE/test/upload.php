<?php

    $upload = apc_fetch('upload_1234');
	
	if (extension_loaded('apc')==false){
		echo("0:APC extension not loaded");
	}
    if (function_exists('apc_fetch')==false){
		echo("0:apc_fetch does not exist");	
	}
    if ( (ini_get('apc.enabled')==false) || (ini_get('apc.rfc1867')==false) ){
		echo("0:apc not enabled or rfc1867 not enabledst");
	}

	echo('Files: '.count($_FILES));

	/*echo("<br>");
	echo('Done: '.$upload['done'].'<br>');
	echo('Total: '.$upload['total'].'<br>');
	echo('Current: '.$upload['current'].'<br>');
	
	$info=apc_cache_info();
	foreach ($info as $val){
		echo(var_dump($val).'<br>');
	}*/


?>
