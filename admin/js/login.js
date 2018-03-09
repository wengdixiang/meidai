$(document).ready(function(){ "use strict" 
	if(getCookie("isgoto")=="true"){
		checklogin(function(re) {
			var re_parsed = JSON.parse(re);
			if(re_parsed.result == "true") {
				window.location.href = "personaldata.html";
			}
		},
		function(){}
		);
	}


	$('.login_form_userName').hide();
	if(document.URL.lastIndexOf('?') != -1){
        var phone_uuid = document.URL.slice(document.URL.lastIndexOf('?')+1,document.URL.lastIndexOf('?')+12);
        if(phone_uuid.length == 11){
        	$('.email_or_phone').val(phone_uuid);
        }
  
        var name_uuid = document.URL.slice(document.URL.lastIndexOf('?')+12,document.URL.length);
        $('.login_form_userName').show();
        $('.login_form_userName input').val(name_uuid)
    }


var $selector=$("#selector");
var $li=$("li",$selector);
var $move=$("#move");
var $index=0; //多用户登陆页面索引
var $_page=0;//多用户登陆页面页
var $registration_index=0;//多用户注册页面索引
var $registration_page=0;//多用户注册页面页
var $form=$("form");
var $content=$("#content");
var $panduan=$(".panduan",$content);
var $loginForm=$("#login_form");
var $emailPhone=$(".email_or_phone",$loginForm);//登录页面邮箱电话
var $loginPassword=$(".login_password");
var $emailPhoneValue="";
var $loginPasswordVal="";
var $loginUserName="";
var $loginUserName1="";

var $email_or_phone_error=$(".email_or_phone_error",$loginForm);
var $registrationForm=$("#registration_form");
var $emailByphone=$(".email_by_phone",$registrationForm);
var $registration_error=$(".registration_error",$registrationForm);

var $registrationFormPassword=$(".password",$registrationForm);
// $flexBox=$(".flex-box");
// $comRegistration=$("#com_registration");  //继续注册按钮

var $userLogin=$("#user_login");
var $loginBox=$(".login_box");
var $loginBoxDiv=$("div",$loginBox);
var $user_registration=$("#user_registration");
var $userName="";
var $user=$(".user");
var $username=$(".select_userName",$user);
$li.each(function(){
    $(this).on('click',function(){

	    $li.each(function(){
	        $(this).removeClass("select_active");
	    });
	    $panduan.each(function(){
	        $(this).val($emailPhoneValue);
	    })
	      $form.each(function(){
	        $(this).removeClass('active_selected');
	    })
	    $index=$(this).index();
	    $(this).addClass("select_active");
	    $form.eq($index).addClass('active_selected');
    })
  })
//登录页面邮箱电话输入框
$emailPhone.on("blur",function(){
  	login_input_email_or_phone_infor(false,"");
  	login_fsw_success_infor(false,"");
  	$(this)[0].placeholder="手机／邮箱";
    $emailPhoneValue=$(this).val();
    if($(this).val()!==""&&/.+@.+\.[a-zA-Z]{2,4}$/.test($(this).val()) ){
    	//邮箱号码正确
    }else{
      	// if($(this).val()!==""&&/1[358]\d{9}$/.test($(this).val())){
      	if($(this).val()!==""&&/1[34578]\d{9}$/.test($(this).val())){
      	
      	//电话号码
      	}else{
			if($(this).val()!==""){
					$(this)[0].placeholder="";	
			}
			if($(this)[0].placeholder==""){
	       	 login_input_email_or_phone_infor(true,"输入的格式不正确");
		    }
      	}
    }
}).on("focus",function(){
    $(this)[0].placeholder="";
	login_fsw_querr_infor(false,"");
   	login_input_email_or_phone_infor(false,"");
   	login_fsw_success_infor(false,"");
   	
});
//登录页面密码输入框
$("#login_form .login_password").on("blur",function(){
	login_input_password_infor(false,"");
	$(this)[0].placeholder="请输入密码";
	if($(this).val()!==""){
	 	this.placeholder="";
	}
	if(this.placeholder=="" && $(this).val().length<8 && $(this).val() !== '*'){
	 	login_input_password_infor(true,"输入密码必须大于等于8位字符");
	}
}).on("focus",function(){
	$(this)[0].placeholder="";
	login_fsw_querr_infor(false,"")
	login_input_password_infor(false,"");
	login_fsw_success_infor(false,"");
});
//多用户登录页面用户输入框
$("#login_form .login_form_userName input[type='text']").on("blur",function(){
 	login_form_userName_error_infor(false,"");
 	$(this)[0].placeholder="请输入用户名";
}).on("focus",function(){
	$(this)[0].placeholder="";
	login_fsw_querr_infor(false,"")
	login_form_userName_error_infor(false,"");
	login_fsw_success_infor(false,"");
});
//注册页面邮箱输入框
$emailByphone.on("blur",function(){
  	registration_input_email_or_phone_infor(false,"");
  	$(this)[0].placeholder="手机/邮箱";
    $emailPhoneValue=$(this).val();
    if($(this).val()!==""&&/.+@.+\.[a-zA-Z]{2,4}$/.test($(this).val()) ){
    }else{
      	// if($(this).val()!==""&&/1[358]\d{9}$/.test($(this).val())){
      	if($(this).val()!==""&&/1[34578]\d{9}$/.test($(this).val())){
      	}else{
			if($(this).val()!==""){
				$(this)[0].placeholder="";
			}
			if($(this)[0].placeholder==""){
          		registration_input_email_or_phone_infor(true,"不正确的哦")
			}
      	}
    }
}).on("focus",function(){
	registration_fsw_success_infor(false,"");
	registration_fsw_querr_infor(false,"");
  	registration_input_email_or_phone_infor(false,"");
    $(this)[0].placeholder="";
   
})
//注册页面密码框
	$("#registration_form .registration_password").on("blur",function(){
	 		 $(this)[0].placeholder="请输入密码";
	 		 registration_input_password_infor(false,"");
	 		  if($(this).val()!==""){
	 		 	this.placeholder="";
	 		 }
	 		 if(this.placeholder==""&&$(this).val().length<8){
	 		 	registration_input_password_infor(true,"输入密码必须大于等于8位字符");
	 		 }
    }).on("focus",function(){
		  registration_fsw_success_infor(false,"");
	      registration_fsw_querr_infor(false,"");
	      registration_input_password_infor(false,"");
	      $(this)[0].placeholder="";
	 	});


// 注册页面确认密码输入框
$("#registration_form .registration_confirm_password").on("blur",function(){
	$(this)[0].placeholder="请确认密码";
	registration_input_password_infor(false,"");
	if($(this).val()!==""){
	 	this.placeholder="";
	}
	if(this.placeholder==""&&$(this).val() !== $("#registration_form .registration_password").val()){
	 	registration_input_password_infor(true,"两次密码输入不一致");
	}
}).on("focus",function(){
	registration_fsw_success_infor(false,"");
    registration_fsw_querr_infor(false,"");
    registration_input_password_infor(false,"");
    $(this)[0].placeholder="";
});



//提交注册
  $registrationForm.on("submit",function(event){
  		registration_fsw_success_infor(false,"");
      registration_fsw_querr_infor(false,"");
      event.preventDefault();
      var data={};
	  $emailByphoneValue=$emailByphone.val();
	  console.log($emailByphone.val())
      $registrationFormPasswordValue=$($registrationFormPassword[0]).val();
      $confirm_registrationFormPasswordValue=$($registrationFormPassword[1]).val();
      var _registrationUserNameValue=$("#registration_form .input_username .registration_input_username").val();
      if($emailByphoneValue==""){
      	registration_input_email_or_phone_infor(true,"用户名不能为空");
      }else if($registrationFormPasswordValue==""){
      	 registration_input_password_infor(true,"密码不能为空");
      }else if($confirm_registrationFormPasswordValue == ''){
      	registration_input_confirm_password_infor(true,"两次密码输入不一致")
      }else{
				var fsw_obj={
      			action:"create",
      			username:_registrationUserNameValue,
      			// userData:$emailByphoneValue,
      			password:$registrationFormPasswordValue
     			};
     			
     			if($emailByphoneValue.indexOf('@') == '-1'){
					fsw_obj['phone'] = $emailByphoneValue;
				}else{
					fsw_obj['email'] = $emailByphoneValue;
				}
				// data=get_input_data(fsw_obj);
				data=fsw_obj;
				var _iserro=$(".fsw_juerr").children();
				for(var _indexErr=0;_indexErr<_iserro.length;_indexErr++){
					if(_iserro[_indexErr].innerText!=""){
					 	return ;
					}
				}
        		// console.log("data:",data);
		        $.ajax({
		          url: "/user",
		          type: 'POST',
		          data: data,
		          success: function(re){
		            // console.log("data="+data);
		            var re = JSON.parse(re);
		            // console.log(re);
		            if(re.result=="true"){
		            	registration_fsw_success_infor(true,"注册成功");
		          	  	setTimeout(function(){
		          		  registration_fsw_success_infor(false,"");
		          	  	},4000);
		              // window.setTimeout("window.location='login.html'",30000);
		              return;
		            }else{
		            	if(re.errorno=="E01021"){
		            		 $("#fsw_bj").css("display",'block');
		                 $user_registration.css('display','block');
		                 create_registration_jiemian(re.reasons);
		            		}
		              else{
		              		createUser(re.errorno);
		              }
		            }
		
		          },
		          error: function() {
		            console.log("Registration：error");
		            console.log("data="+data);
		            registration_fsw_querr_infor(true,"当前网络错误，请重新连接");
		          }
		        });
      		}
  	});
//登陆界面

	// $(document).keydown(function(event){
	// 	if(event.keyCode == 13){
	// 		$("#login_form .login_password").blur();
	// 		login_submit();
	// 	}
	// }); 

	// $loginForm.on("submit",function(){
 //    	login_submit();
 // 	});

	$loginForm.on("submit",function(event){
 	// function login_submit(){
 		event.preventDefault();
	    var _data={};
	    var _cookiedata=[];
	    login_form_userName_error_infor(false,"");
	    login_fsw_querr_infor(false,"");
	    login_fsw_success_infor(false,"");
	    var $emailPhoneVal=$emailPhone.val();
	    var $loginPasswordVal=$loginPassword.val();
	    var $loginUserName=$("#login_form .login_form_userName input[type='text']").val();
		//$registrationFormPasswordValue=$registrationFormPassword.val();
	    if($emailPhoneVal==""){
	      	login_input_email_or_phone_infor(true,"用户名不能为空");
	    }else if($loginPasswordVal==""){
	      	login_input_password_infor(true,"密码不能为空");
	    }else{
	      	var fsw_obj={
	      			action:"login",
	      			userData:$emailPhoneVal,
	      			password:$loginPasswordVal
	      		};
	      	if(!$("#login_form .login_form_userName input[type='text']").is(":hidden")){
	      		if($loginUserName != ""){
	      			fsw_obj.username = $loginUserName;
	      		}
	      	}
		  	var _iserro=$(".fsw_juerr").children();
				for(var _indexErr=0;_indexErr<_iserro.length;_indexErr++){
					if(_iserro[_indexErr].innerText!=""){
					 	return ;
					}
				}
			_data=get_input_data(fsw_obj);
	        $.ajax({
	          	url: "/user",
	          	type: 'POST',
	          	data: _data,
	          	success: function(re){
	            	var re = JSON.parse(re);
	            	// console.log("re",re);
		            if(re.result=="true"){
		            //单个用户
		            	setCookie("UserUUID",re.uuid,0);
		              	login_fsw_success_infor(true,"登录成功");
		             	_cookiedata[0]= $emailPhoneVal;
			            _cookiedata[1]=re.uuid;
			            if($("#login_form .remember input[type='checkbox']")[0].checked){
			            	setCookie("isgoto",true,7);	
			            	// setCookie("uuid",_cookiedata[1],7);
			            	setCookie("UserUUID",_cookiedata[1],0.21);
			            }else{
			            	setCookie("isgoto",false,7);
			            	setCookie("UserUUID",_cookiedata[1],1);
		            	}
		            	goTohtml();
	            	}			
		        	else{
	            		if(re.errorno=="E01071"){
	            			// console.log(re);
	            			$("#fsw_bj").css("display",'block');
	            			$("#user_login").css("display",'block');
		          			create_login_jiemian(re.reasons);
	            		}
	            		else authenticateUser(re.errorno);
		        	}
	          	},
	          	error: function(re) {
	            	console.log("Registration：error");
			        console.log("data="+this.data);
			        login_fsw_querr_infor(true,"当前网络错误请重新连接")
	          	}
	        });
      	}
 	// }
 	})
//点击注册页面
$user_registration.on('click',function(event){
  	registration_init();
		$(this).css({"display":"none"});
		$("#fsw_bj").css("display",'none');
		$("#user_registration .fsw_registration_box1").empty();
})
//点击登录界面
$userLogin.on("click",function(event){
			login_init();
			$("#fsw_bj").css("display",'none');
      $(this).css("display",'none');
      $("#user_login .fsw_box1").empty();
})
//勾选多选框
$("#login_form .remember input[type='checkbox']").click(function(){
		if(this.checked){
			setCookie("checkbox","true",7);
		}
		else{
			setCookie("checkbox","false",0);
			setCookie("userName","",0);
		  setCookie("UserUUID","",0);
		}
})

//修改密码
if(document.URL.lastIndexOf('uuid') != -1){
	$("#login_form .remember span").eq(1).text('修改密码');
    var password_uuid = document.URL.slice(document.URL.lastIndexOf('uuid'),document.URL.length);
	$("#login_form .remember span").eq(1).click(function(){
		window.location.href = 'https://' + document.domain + '/password.html?' + password_uuid;
	})
}

//--------------------
//登陆页面与注册页面切换
//--------------------
  //登录页面切换到注册页面
  $("#login").click(function(){
  		login_fsw_querr_infor(false,"");
  		registration_fsw_querr_infor(false,"");
  		registration_fsw_success_infor(false,"");
  		login_fsw_success_infor(false,"");
	  	$("#registration_form .registration_input_username").val("");
	  	// $("#registration_form .input_username").css({"display":"none"});
	  	$("#registration_form .registration_input_username").css({"display":"blck"});
	  	$("#registration_form .registration_password").val("");
	  	$emailPhone.trigger("blur");	
	  	$("#login_form .login_password").trigger("blur");
	  	$move.animate({
	  		left:"0px",
	  	},300);
  })
  //注册页面切换到登录
  $("#registration").click(function(){
  		login_fsw_querr_infor(false,"");
  		login_form_userName_error_infor(false,"");
  		registration_fsw_querr_infor(false,"");
  		registration_fsw_success_infor(false,"");
  		login_fsw_success_infor(false,"");
	  	$("#login_form .login_password").val("");
	  	$("#login_form .login_form_userName").css({"display":"none"})
      $("#login_form .login_form_userName input[type='text']").val("");
	  	$emailByphone.trigger("blur");
	  	$("#registration_form .registration_password").trigger("blur");
	  	$move.animate({
	  		left:"135px",
	  	},300);
  })
//------------------------
//登陆页面
//------------------------
	var _userlistpPage=0;
	var _login_index=0;
	//登录界面初始化
	function login_init(){
			$("#user_login .login_userlist .fsw_box1").find(".login_userlist_info").eq(0).show()
		.siblings().hide();
		 _login_index=0;
	}
	//向左滑动
	$("#user_login .user_qiehua").find(".user_qiehua-left").click(function(event){
		 _login_index= _login_index<=0?$_page-1: _login_index-1;
		$("#user_login .login_userlist .fsw_box1").find(".login_userlist_info").eq( _login_index).show()
		.siblings().hide();
		event.stopPropagation();
	});
	//向右滑动
	$("#user_login .user_qiehua").find(".user_qiehua_right").click(function(event){
			 _login_index= _login_index>=$_page-1?0: _login_index+1;
		$("#user_login .login_userlist .fsw_box1").find(".login_userlist_info").eq( _login_index).show()
		.siblings().hide();
		event.stopPropagation();
	})

	// 多用户时，检查密码操作
	$("#user_login .login_box1 .login_userlist").delegate(".login_danuser_info_img","click",function(){
		var $emailPhoneVal=$emailPhone.val();
      	var $loginPasswordVal=$loginPassword.val();
      	var _data={};
      	var _cookiedata=[];
        $loginUserName1=$(this).siblings(".login_danuser_info_name").text();
        // console.log($loginUserName1)
        
        var fsw_obj={
      		action:"login",
      		username:$loginUserName1,
      		userData:$emailPhoneVal,
      		password:$loginPasswordVal
      	};
      	// console.log(fsw_obj)
		_data=get_input_data(fsw_obj);

        login_init();
		$("#fsw_bj").css("display",'none');
     	$userLogin.css("display",'none');
      	$("#user_login .fsw_box1").empty();
        $.ajax({
          	url: "/user",
          	type: 'POST',
         	data: _data,
          	success: function(re){
            	var re = JSON.parse(re);
            	if(re.result=="true"){
            		// setCookie("uuid",re.uuid,1); //0.21
            		setCookie("UserUUID",re.uuid,0.21); 

            		login_fsw_success_infor(true,"登录成功");
            		goTohtml();
	            	if($("#login_form .remember input[type='checkbox']")[0].checked){
		            	_cookiedata[0]= $emailPhoneVal;
		            	_cookiedata[1]=re.uuid;
		            	setCookie("userName",_cookiedata[0],7);
		            	setCookie("UserUUID",_cookiedata[1],7);
		           	}
					//window.setTimeout("window.location.href='https://www.baidu.com/'",3000);
            	}else{
         			if(re.errorno=="E01070"){
         				login_input_email_or_phone_infor(true,"用户不存在");
             		}else if(re.errorno=="E01080"){
             			login_input_password_infor(true,"密码不正确");
      					$("#login_form .login_form_userName").css({"display":"block"})
      					$("#login_form .login_form_userName input[type='text']").val($loginUserName1);
      					$("#login_form .login_password").val('');
              		}
            	}
          	},
          	error: function(re) {
            	console.log("Registration：error");
		        console.log("data="+this.data);
		        login_fsw_querr_infor(false,"当前网络错误，请重新连接");
          	}
        });
 });
//------------------------
//注册页面
//------------------------
	//注册页面初始化
	function  registration_init(){
		$("#user_registration .registration_userlist .fsw_registration_box1").find(".registration_userlist_info").eq(0).show()
		.siblings().hide();
		$registration_index=0;
	}
	//向左滑动
	$("#user_registration .registration_qiehua").find(".registration_qiehua-left").click(function(event){
		$registration_index= $registration_index<=0?$registration_page-1: $registration_index-1;
		$("#user_registration .registration_userlist .fsw_registration_box1").find(".registration_userlist_info").eq($registration_index).show()
		.siblings().hide();
		event.stopPropagation();
	});
	//向右滑动
		$("#user_registration .registration_qiehua").find(".registration_qiehua_right").click(function(event){
		 $registration_index= $registration_index>=$registration_page-1?0: $registration_index+1;
		$("#user_registration .registration_userlist .fsw_registration_box1").find(".registration_userlist_info").eq($registration_index).show()
		.siblings().hide();
		event.stopPropagation();
	});
	//点击注册
	$("#user_registration  .registration_btn").click(function(event){
		$("#user_registration").css({"display":"none"});
		$("#registration_form .input_username").css({"display":"block"})
		$("#fsw_bj").css("display",'none');
		$("#user_registration .fsw_registration_box1").empty();
		event.stopPropagation();
	});
//------------------------
//获得用户名
//------------------------
	function getuserName(parm1){
		var result={};
		var  re=/\[[\s\w]+\]/g;
		result=parm1.match(re);
		for (var i=0; i<result.length; i++) {
			result[i] = result[i].replace(/[\[\]]/g,"").trim();
		}
		return result;
	}
//---------------------
//创建多用户登陆界面
//---------------------
	//创建用户列表
	function create_user_list($docment){
		$docment.append('<div class="login_userlist_info"></div>');
	}
	//创建单个用户
	function create_danuser_list($docment,parm1){
		$docment.append('<div class="login_danuser_td">'
							+'<div class="login_danuser_info">'
							+'<div class="login_danuser_info_img">'
							+'<img src="images/6.jpg" />'
							+'</div>'
							+'<div class="login_danuser_info_name">'
							+'<p>'+parm1+'</p>'
							+'</div>'
							+'</div>'
							+'</div>')
	};
	//创建登陆界面
	function create_login_jiemian(parm1){
		var x=getuserName(parm1);
		var danqian_page=0;
		var last_list=false;
		if(x.length%3==0){
			  $_page=x.length/3;
		}
		else{
			  $_page=Math.floor(x.length/3)+1;
		}
		for(var i=0;i<$_page;i++){
			create_user_list($("#user_login .fsw_box1"));
			var $doc=$("#user_login .fsw_box1").find(".login_userlist_info");
			if(x.length%3==0){
				for(var j=0;j<3;j++){
					create_danuser_list($doc.eq(i),x[j+i*3]);
				}
			}
			else{
				if($_page>1){
					 		if(danqian_page<$_page-1){
						 		danqian_page=danqian_page+1;
								for(var n=0;n<3;n++){
									create_danuser_list($doc.eq(i),x[n+(danqian_page-1)*3]);
								}	
							}
					 		else{
					 			for(var p=0;p<x.length%3;p++){
										create_danuser_list($doc.eq($_page-1),x[p+($_page-1)*3]);
								}
					 		}
				}
				else{
					for(var p=0;p<x.length%3;p++){
							create_danuser_list($doc.eq(i),x[p]);
					}
				}
			}
		}
		login_init();
	};
//---------------------
//创建多个用户注册列表
//---------------------
	//创建用户注册列表
	function create_registrationuser_list($docment){
		$docment.append('<div class="registration_userlist_info"></div>');
	}
	//创建注册页面单个用户
	function create_registrationdanuser_list($docment,parm1){

		$docment.append('<div class="registration_danuser_td">'
							+'<div class="registration_danuser_info">'
							+'<div class="registration_danuser_info_img">'
							+'<img src="img/6.jpg" />'
							+'</div>'
							+'<div class="registration_danuser_info_name">'
							+'<p>'+parm1+'</p>'
							+'</div>'
							+'</div>'
							+'</div>');
	};
	//创建注册界面
	function create_registration_jiemian(parm1){
		var x=getuserName(parm1);
		var danqian_page=0;
		var last_list=false;
		if(x.length%3==0){
			  $registration_page=x.length/3;
		}
		else{
			  $registration_page=Math.floor(x.length/3)+1;
		}
		for(var i=0;i<$registration_page;i++){
			create_registrationuser_list($("#user_registration .fsw_registration_box1"));
			var $doc=$("#user_registration .fsw_registration_box1").find(".registration_userlist_info");
			if(x.length%3==0){
				for(var j=0;j<3;j++){
					create_registrationdanuser_list($doc.eq(i),x[j+i*3]);
				}
			}
			else{
				if($registration_page>1){
					 		if(danqian_page<$registration_page-1){
						 		danqian_page=danqian_page+1;
								for(var n=0;n<3;n++){
									create_registrationdanuser_list($doc.eq(i),x[n+(danqian_page-1)*3]);
								}	
							}
					 		else{
					 			for(var p=0;p<x.length%3;p++){
										create_registrationdanuser_list($doc.eq($registration_page-1),x[p+($registration_page-1)*3]);
								}
					 		}
				}
				else{
					for(var p=0;p<x.length%3;p++){
							create_registrationdanuser_list($doc.eq(i),x[p]);
					}
				}
			}
		}
		registration_init();
	};
//-----------------------------
//登录界面电话/邮箱输入报错信息
//-----------------------------
function get_input_data(obj){
	 var patt = /@/;
	 var fsw_data={};
	 		fsw_data.action=obj.action;
	 		fsw_data.username=obj.username;
	 		fsw_data.uuid=obj.uuid;
			if(patt.test(obj.userData)){
			  fsw_data.email=obj.userData;
			}else{
			  fsw_data.phone=obj.userData;
			}
			if(obj.password){
			  fsw_data.password=obj.password;
			}
			return fsw_data;
}
//-----------------------------
//登录界面电话/邮箱输入报错信息
//-----------------------------
function login_input_email_or_phone_infor(parma1,parma2){
	var _fswx=$("#login_form .email_or_phone");
	var _fswy=	$("#login_form .fsw_juerr .email_or_phone_error");
	_fswx[parma1?"addClass":"removeClass"]("fws_input_danger");
	_fswy.html(parma2);
}
//-----------------------------
//登录界面密码输入报错信息
//-----------------------------
function login_input_password_infor(parma1,parma2){
	var _fswx=$("#login_form .login_password");
	var _fswy=$("#login_form .fsw_juerr .login_password_error");
	_fswx[parma1?"addClass":"removeClass"]("fws_input_danger");
 	_fswy.html(parma2);
}
//-----------------------------
//多用户登录界面用户名输入报错信息
//-----------------------------
function login_form_userName_error_infor(parma1,parma2){
	var _fswx=$("#login_form .login_form_userName input[type='text']");
	var _fswy=$("#login_form .fsw_juerr .login_form_userName_error");
	_fswx[parma1?"addClass":"removeClass"]("fws_input_danger");
 	_fswy.html(parma2);
}
//-----------------------------
// 多用户界面登录成功信息框
//-----------------------------
function login_fsw_success_infor(parma1,parma2){
	var _fswx=$("#login_form .login_success");
	var _fswy=$("#login_form .login_success .login_success_infor");
	parma1?_fswx.css({"display":"block"}):_fswx.css({"display":"none"});
	_fswy.text(parma2);
}
//-----------------------------
//注册界面电话/邮箱输入报错信息
//-----------------------------
function registration_input_email_or_phone_infor(parma1,parma2){
	$emailByphone[parma1?"addClass":"removeClass"]("fws_input_danger");
  $registration_error.html(parma2);
}

//-----------------------------
//注册界面密码输入报错信息
//-----------------------------
function registration_input_password_infor(parma1,parma2){
	var _fswx=$("#registration_form .registration_password");
	var _fswy=$("#registration_form .fsw_juerr .registration_password_error");
	_fswx[parma1?"addClass":"removeClass"]("fws_input_danger");
  _fswy.html(parma2);
}
//-----------------------------
//注册界面验证密码输入报错信息
//-----------------------------
function registration_input_confirm_password_infor(parma1,parma2){
	var _fswx=$("#registration_form .registration_confirm_password");
	var _fswy=$("#registration_form .fsw_juerr .registration_password_error");
	_fswx[parma1?"addClass":"removeClass"]("fws_input_danger");
  _fswy.html(parma2);
}
//-----------------------------
// 登录界面全局报错信息框
//-----------------------------
function login_fsw_querr_infor(parma1,parma2){
	var _fswx=$("#login_form .fsw_querr");
	var _fswy=$("#login_form .fsw_querr .fsw_querr_infor");
	parma1?_fswx.css({"display":"block"}):_fswx.css({"display":"none"});
	_fswy.text(parma2);
}
//-----------------------------
// 注册界面全局报错信息框
//-----------------------------
function registration_fsw_querr_infor(parma1,parma2){
	var _fswx=$(" #registration_form .fsw_querr");
	var _fswy=$("#registration_form .fsw_querr .fsw_querr_infor");
	parma1?_fswx.css({"display":"block"}):_fswx.css({"display":"none"});
	_fswy.text(parma2);
}
//-----------------------------
// 注册界面全局成功信息框
//-----------------------------
function registration_fsw_success_infor(parma1,parma2){
	var _fswx=$("#registration_form .registration_success");
	var _fswy=$("#registration_form .registration_success .registration_success_infor");
	parma1?_fswx.css({"display":"block"}):_fswx.css({"display":"none"});
	_fswy.text(parma2);
}
//-----------------------------
// 创建用户报错信息
//-----------------------------
function createUser(parma1){
	var _fswx=false;
	var _fswy="";
	switch(parma1){
		case "E01000": _fswx=true;_fswy="至少有一个参数丢失";break;
		case "E01010": _fswx=true;_fswy="电话号码格式错误";break;
		case "E01020": _fswx=true;_fswy="电话号码存在";break;
		case "E01030": _fswx=true;_fswy="邮件格式错误";break;
		case "E01040": _fswx=true;_fswy="电子邮件存在";break;
	}
	registration_input_email_or_phone_infor(_fswx,_fswy);
}
//-----------------------------
// 用户认证报错信息
//-----------------------------
function authenticateUser(parma1){
	var _fswx=false;
	var _fswy="";
	var err=0;
	switch(parma1){
		case "E01000": _fswx=true;_fswy="至少有一个参数丢失";break;
		case "E01070":err=1; _fswx=true;_fswy="手机或邮箱没有找到";break;
		case "E01072":err=2; _fswx=true;_fswy="用户名没有找到";break;
		case "E01080":err=3; _fswx=true;_fswy="密码错误";break;
	}
	switch(err){
		case 1:login_input_email_or_phone_infor(_fswx,_fswy);break;
		case 2:login_form_userName_error_infor(_fswx,_fswy);break;
		case 3:login_input_password_infor(_fswx,_fswy);break;
	};
}
//-----------------------------
//页面跳转
//-----------------------------
function goTohtml(){
	window.location.href='personaldata.html';
}
//-----------------------------
//Cookie
//-----------------------------
})
