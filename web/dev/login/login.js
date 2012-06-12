/*LOGIN
-------
Creates a div as big as the screen or as the system object for authentication
CONSTRUCTOR
	onSuccess	-	function called on login success
	onFail		-	function called on login fail
ATTRIBUTES
	PUBLIC
	data

	PRIVATE
	local

*/

function x_Login(param){
var local=new Object();
	local.showLastUser=null;

var object=document.createElement('div');
object.style.position='absolute';
object.style.left='0px';
object.style.top='0px';
object.style.width='100%';
object.style.height='100%';
object.style.backgroundColor=theme.colors.background;
object.innerHTML="<table style='width:100%;height:100%;border:1px solid #838383;'><tr><td align='center' style='vertical-align:middle;'>\
	<table cellspacing='0' cellpadding='0' border='0'>\
		<tr><td align='center' style='vertical-align:middle;padding-right:35px;'>\
		<tr><td align='center'>\
		<tr><td align='center' style='padding-left:8px;'>\
			<table cellspacing='0' cellpadding='0'>\
				<tr style='height:35px;'>\
					<td rowspan='2' style='width:37px;vertical-align:middle;'>\
					<td align='center' style='vertical-align:middle;padding-top:3px;font-family:"+theme.fonts.font1+";'>\
					<td rowspan='2' style='width:37px;vertical-align:middle;'>\
				<tr>\
					<td align='center' style='vertical-align:top;padding-left:15px;padding-right:15px;'>\
			</table>\
	</table>\
</table>";

var helper=system.getChildNode(object,'1:1:1:1:1:1');
var inside=system.getChildNode(helper,'1:1');
var inside1=system.getChildNode(helper,'2:1');
var changeUserArea=system.getChildNode(helper,'3:1:1:1:1:1');
var usernameArea=system.getChildNode(helper,'3:1:1:1:1:2');
var loginArea=system.getChildNode(helper,'3:1:1:1:1:3');
var passwordArea=system.getChildNode(helper,'3:1:1:1:2:1');

var logo=system.canvas({width:'400px',height:'400px',canvas:theme.canvas.logo});
logo.draw({color:'#000000',lines:theme.colors.area});
inside.appendChild(logo);

var entry=document.createElement('div');
entry.style.marginTop='-80px';
entry.innerHTML="<table border='0' style='width:100%;height:100%;'>\
<tr><td align='center' style='vertical-align:middle;'>\
<tr><td align='center' style='height:50%;vertical-align:top;padding-top:20px;background-color:"+theme.colors.background+";'>\
<div style='position:relative;width:120px;height:120px;overflow:hidden;padding:2px;border:1px solid "+theme.colors.border+";'>\
	<div style='width:100%;height:100%;overflow:hidden;'>\
		<canvas width='136px' height='136px' style='margin-left:-9px;margin-top:-9px;width:136px;height:136px;'></canvas>\
	</div>\
</div>\
</table>";

var inside_entry=system.getChildNode(entry,'1:1:2:1:1');
inside_entry.style.backgroundColor=theme.colors.area;
inside_entry.style.border='1px solid #838383';
system.setCornerRadius(inside_entry,100,100,100,100);

var inside_entry1=system.getChildNode(inside_entry,'1');
system.setCornerRadius(inside_entry1,100,100,100,100);
system.setBoxType(inside_entry1,'in');

inside1.appendChild(entry);

var avatar=system.getChildNode(inside_entry1,'1');

var last=system.getLocalData('users.lastUser');

var ctx=avatar.getContext("2d");
var imageObj = new Image();
	
var drawNewUser=function(){
	ctx.scale(1.1,1.1);
	ctx.translate(12,20);
	theme.canvas.avatar(ctx,{color:theme.colors.note});
	ctx.scale(0.35,0.35);
	ctx.translate(94,173);
	theme.canvas.questionMark(ctx,{color:theme.colors.area});
	loginuserName.style.display='none';
	loginuser.setValue('');
	loginuser.show();
	loginuser.focus();
}

var drawLastUser=function(){
	ctx.scale(1,1);
	ctx.translate(0,0);
    imageObj.src = last.avatar;
	imageObj.onload=function(){
		ctx.drawImage(imageObj, 9, 9);
	}
	loginuserName.style.display='';
	loginuser.hide();
}

var loginuser=new x_Textbox({hint:'Enter username',title:'Please enter your password.<br>If you don\'t remember your username please ask your teacher or send an e-mail to your administrator.',type:'text',width:'120px',maxLength:'50',image:{
	canvas:theme.canvas.games,
	normal:{color:theme.colors.border,lines:theme.colors.background},
	over:{color:theme.colors.note,gradient:true,lines:theme.colors.background},
	down:{color:theme.colors.note,lines:theme.colors.background}
	},
	style:{color:theme.colors.text,border:theme.colors.border,radius:theme.radius,background:theme.colors.area,font:theme.fonts.font1}
	});
	loginuser.focus();
	usernameArea.appendChild(loginuser);

var loginuserName=document.createElement('span');
	loginuserName.style.display='none';
	system.setInnerText(loginuserName,last.firstName+' '+last.lastName);
	usernameArea.appendChild(loginuserName);

if (last===false || last.id==''){
	lastUserExist=false;
	local.showLastUser=false;
	drawNewUser();
}else{
	lastUserExist=true;
	local.showLastUser=true;
	drawLastUser();
}

var switchLastNewUsers=function(){
	var chain1=function(){
		loginpass.setValue('');
		if (local.showLastUser){
			local.showLastUser=false;
			avatar.width=avatar.width;
			drawNewUser();
		}else{
			local.showLastUser=true;
			avatar.width=avatar.width;
			drawLastUser();
		}
		system.unlock(system,false,null);
	}
	system.lock(system,true,false,chain1);
}

var loginpass=new x_Textbox({hint:'Enter password',title:'Please enter your password.<br>If you don\'t remember your password please ask your teacher or send an e-mail to your administrator.',type:'password',width:'120px',image:{
				canvas:theme.canvas.games,
				normal:{color:theme.colors.border,lines:theme.colors.background},
				over:{color:theme.colors.note,gradient:true,lines:theme.colors.background},
				down:{color:theme.colors.note,lines:theme.colors.background}
				},
				style:{color:theme.colors.text,border:theme.colors.border,radius:theme.radius,background:theme.colors.area,font:theme.fonts.font1}
				});
loginpass.show();

if (lastUserExist){
var change=new x_Clickable({label:'',title:'Playing games',width:'37px',height:'37px',image:{
			canvas:theme.canvas.change,
			normal:{color:theme.colors.border,lines:theme.colors.background},
			over:{color:theme.colors.note,gradient:true,lines:theme.colors.background},
			down:{color:theme.colors.note,lines:theme.colors.background}
			},
			onClick:switchLastNewUsers
});
change.show();
changeUserArea.appendChild(change);
}

passwordArea.appendChild(loginpass);
//passwordArea.appendChild(geometry);

var enter=new x_Clickable({label:'',title:'Playing games',width:'45px',height:'45px',image:{
			canvas:theme.canvas.login,
			normal:{color:theme.colors.border,lines:theme.colors.background,inside:theme.colors.background},
			over:{color:theme.colors.note,gradient:true,lines:theme.colors.background,inside:theme.colors.background},
			down:{color:theme.colors.note,lines:theme.colors.background,inside:theme.colors.background}
			},
			onClick:function(){
				var onOk=function(){object.style.display='none';entry.style.display='none';}
				var onCancel=function(){}
				
				var msg='The password is not correct.<br>Please try again and check if the Caps Lock is not active.<br>Otherwise please contact the administrator.';
				system.message({type:'action',lock:true,content:msg,width:400,height:120,font:theme.fonts.font,
					image:{
						width:50,
						height:50,
						canvas:theme.canvas.warning,
						parameters:{color:theme.colors.alert,inside:theme.colors.border}
					},
					buttons:[{label:'Ok',callback:onOk},{label:'Cancel',callback:onCancel}]
				});
			}
});
enter.show();
loginArea.appendChild(enter);
loginpass.focus();

	return object;
}