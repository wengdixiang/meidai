$(function(){

	/*
	* 当前密码
	**/
	$('#InputPassword1').blur(function(){
		this.placeholder="旧的登录密码"
		var _password=$(this).val();
		if(_password!=""){
			this.placeholder="";
		}
		if(this.placeholder=="" && _password.length<8 && _password !== '*'){

			$(this).inputpassword_err({
				"errtrue":true,
				"docoment1":$(".fsw_jubuerr #userTs1"),
				"stl":"当前密码最少要8位字符或数字"
			});
		}
	}).focus(function(){
		this.placeholder="";	
		$(this).inputpassword_err({
				"errtrue":false,
				"docoment1":$(".fsw_jubuerr #userTs1"),
				"stl":""
		});
	});

	/*
	* 新密码
	**/
	$('#InputPassword2').blur(function(){
	    var _newpassword = $('#InputPassword1').val();
		this.placeholder="新的登录密码"
		var _password=$(this).val();
		if(_password!=""){
			this.placeholder="";
		}
		if(this.placeholder==""&&_password.length<8){
			$(this).inputpassword_err({
				"errtrue":true,
				"docoment1":$(".fsw_jubuerr #userTs2"),
				"stl":"新的密码最少要8位字符或数字"
			});
		}else if(_newpassword!=""&&_password!=""&&_password==_newpassword){
	        $(this).inputpassword_err({
	            "errtrue":true,
	            "docoment1":$(".fsw_jubuerr #userTs2"),
	            "stl":"新的密码与旧密码一致"
	        });
	    }
	}).focus(function(){
		this.placeholder="";	
		$(this).inputpassword_err({
				"errtrue":false,
				"docoment1":$(".fsw_jubuerr #userTs2"),
				"stl":""
		});
	});

	/*
	* 确认密码
	**/
	$('#InputPassword3').blur(function(){
		this.placeholder="确认新的密码"
		var _newpassword=$("#InputPassword2").val();
		var _password=$(this).val();
		if(_password!=""){
			this.placeholder="";
		}
		if(this.placeholder==""&&_password.length<8){
			$(this).inputpassword_err({
				"errtrue":true,
				"docoment1":$(".fsw_jubuerr #userTs3"),
				"stl":"确认密码最少要8位字符或数字"
			});
		}
	  else if(_newpassword!=""&&this.placeholder==""&&_password!=_newpassword){
			$(this).inputpassword_err({
				"errtrue":true,
				"docoment1":$(".fsw_jubuerr #userTs3"),
				"stl":"两次新密码输入不一致"
			})
		}
	}).focus(function(){
		this.placeholder="";	
		$(this).inputpassword_err({
				"errtrue":false,
				"docoment1":$(".fsw_jubuerr #userTs3"),
				"stl":""
		});
	});

	/**
	 * 
	 * */
	/*
	* 确认提交
	**/
	$("#confirm").click(function() {
		var _data = {};
		var _iserro=$(".fsw_jubuerr").children();
		for(var _indexErr=0;_indexErr<_iserro.length;_indexErr++){
			 if(_iserro[_indexErr].innerText!=""){
			 	 return ;
			 }
		}
		if($("#InputPassword1").val() == "") {
			$("#InputPassword1").inputpassword_err({
				"errtrue": false,
				"docoment1": $(".fsw_jubuerr #userTs1"),
				"stl": "旧的密码不能为空"
			});
			return;
		};
		if($("#InputPassword2").val() == "") {
			$("#InputPassword2").inputpassword_err({
				"errtrue": false,
				"docoment1": $(".fsw_jubuerr #userTs2"),
				"stl": "新的密码不能为空"
			});
			return;
		};
	    if($("#InputPassword3").val() == "") {
	        $("#InputPassword3").inputpassword_err({
	            "errtrue": false,
	            "docoment1": $(".fsw_jubuerr #userTs3"),
	            "stl": "确认密码不能为空"
	        });
	        return;
	    };
	    if($("#InputPassword3").val() != $("#InputPassword2").val()) {
	        $("#InputPassword3").inputpassword_err({
	            "errtrue": false,
	            "docoment1": $(".fsw_jubuerr #userTs3"),
	            "stl": "两次新密码输入不一致"
	        });
	        return;
	    };
		var fsw_x = $("#userTs1").html() != "" || $("#userTs2").html() != "" || $("#userTs3").html() != "";
		if(fsw_x) {
			return;
		};


	    if(document.URL.lastIndexOf('uuid') != -1){
	        var tmp_uuid = document.URL.slice(document.URL.lastIndexOf('uuid')+5,document.URL.length);
	    }

	    if(getCookie("uuid") != '' || tmp_uuid != ''){

	        if (getCookie("uuid") != ''){
	            uuid = getCookie("uuid");
	        }else if(tmp_uuid != ''){
	            uuid = tmp_uuid;
	        }
			_data = {
				"action": "update",
	            // "uuid": getCookie("uuid"),
				"uuid": uuid,
				"oldpassword": $("#InputPassword1").val(),
				"password": $("#InputPassword2").val(),
			}
			$.ajax({
				type: "post",
				data: _data,
				dataType: "json",
				url: "/user",
				success: function(data) {
					if(data.result == 'true') {
						success_infro(true, "密码修改成功");
						setTimeout(function(){
							success_infro(false, "");
						},3000);
					}else if(data.errorno == 'E01150'){
						console.log(data)
						$("#InputPassword1").inputpassword_err({
							"errtrue": false,
							"docoment1": $(".fsw_jubuerr #userTs1"),
							"stl": "旧的密码错误"
						});
						error_infro(true, "旧的密码错误");
						setTimeout(function(){
								error_infro(false, "");
						},3000);
					}
				},
				error: function() {
					error_infro(true, " 当前网络错误请重新连接");
					setTimeout(function(){
							error_infro(false, "");
					},3000);
				}
			});
	    }
	});

	//成功信息框
	function success_infro(param1,param2){
		param1?$(".password .succeed").css({"display":"block"}):$(".password .succeed").css({"display":"none"});
		$(".password .succeed span").text(param2);
	}

	//错误信息框
	function error_infro(param1,param2){
		param1?$(".password .error").css({"display":"block"}):$(".password .error").css({"display":"none"});
		$(".password .error span").text(param2);
	}
})