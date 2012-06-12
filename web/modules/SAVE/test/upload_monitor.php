<?php
//apc.rfc1867_freq = 10k
 
	$upload = apc_fetch('upload_7');
	
	if ($upload){
		$ret="";
		/*foreach($upload as $key){
			$ret=$ret."-".$key;
		}*/
		echo("1:".$upload['done'].'-'.$upload['total'].'-'.$upload['current']);
		//echo("1:".$ret);
		
	}else{
		echo("0:Futai");
	}
?>
