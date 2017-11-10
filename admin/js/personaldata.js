$(document).ready(function(){
    if($(window).width() > 768){
        var tmp_height = $('.head_portrait').height();
        $('#userimg').height(tmp_height*1.03);
    }
    $(window).resize(function(){
        if($(window).width() < 768){
            var tmp_head_height = $('.head_portrait').height();
            var tmp_user_height = $('.user_glass').height();
            $('#userimg').height(tmp_head_height+tmp_user_height+100);
        }else{
            var tmp_height = $('.head_portrait').height();
            $('#userimg').height(tmp_height*1.03); 
        }
    });


    if(document.URL.lastIndexOf('=') != -1){
        var uuid = document.URL.slice(document.URL.lastIndexOf('=')+1,document.URL.length);
    }
   
    if(getCookie("uuid") != ''  || uuid != '' ){
        var tmp_uuid;
        if(getCookie("uuid") != ''){
            tmp_uuid = getCookie("uuid");
        } else if(uuid != '' ){
            tmp_uuid = uuid;
        }
        var all_user_data = {};
        var all_order_data = {};

        var fsw_obj = {
            'action': "query",
            // 'uuid': getCookie("uuid"),
            'uuid': tmp_uuid,
            'username':'',
            "orders": "",
            "phone" : '',
            "email" : '',
            "gender" : '',
            "birthday" : '',
            "address" :'',
            "preferredlang" :'',
            "lastorder" :'',
        };
        $.ajax({
            url: "/user",
            type: 'POST',
            dataType: "json", 
            data: fsw_obj,
            success: function(re) {
                if(re.result == 'true'){
                    for(var i in re){
                        all_user_data[i] = re[i];  
                    }
                    user_login();
                    query_scanphoto();
                }else if(re.result == 'false'){
                    $('#login_user').html('<a href="login.html">未登录</a>');
                }
            },
            error: function(er) {
                console.log('query user');
                console.log(er)
                $('#network_report_error').css("display","block");

            }
        }); 
        
        /* 判断用户的登陆状态 */              
        function user_login(){
            var tmp_username = all_user_data.username;
            var user_params = {
                'action':'login',
                'username': tmp_username,
                'password': '*',                        
                // 'password': tmp_username,                        
            }
            if(!all_user_data.email){       
            }else{
                user_params['email'] = all_user_data.email;
            }
            if(!all_user_data.phone){  
            }else{
                user_params['phone'] = all_user_data.phone;
            }

            $.ajax({
                type: "POST",
                url: "/user",
                data: user_params,
                success: function(data){
                    if($.type(data) == 'string'){
                        var user_data = JSON.parse(data)
                        if( user_data['result'] != 'true'){
                            $('.change_password').hide(); 
                        }else{
                            $('.change_password').show();
                            $('#login_password').click(function(){
                                var personaldata_url= document.URL.slice(0,document.URL.lastIndexOf('/')) +
                                                      "/password.html?uuid="+user_data.uuid;
                                location.href = personaldata_url;
                            })
                        }
                    }
                    
                },
                error:function(er){  
                    console.log('login user');
                    console.log(er)                         
                }

            })
        }    
        /* 判断用户的登陆状态 END*/

        function query_scanphoto() {
            var orderuuid = all_user_data.lastorder;
            // console.log(orderuuid)
            var order_data = {
                "action": "query",
                "uuid": orderuuid,
                "createdate" :'',
                "head" :'',
                "config" : '',
                "genobj" :'',
                "deals" :'',
                "stanion" :'',
                "appointmentdate" : '',
                "pinfo" :'',
                "status" : '',
                "preconfig" :'',
                "collecteddata" :'',
                "scanphoto" : '',
                "params" : '',
            };
            $.ajax({
                type: "post",
                data: order_data,
                dataType: "json",
                url: "/order",
                success: function(data) {
                    if(data.result == 'true'){
                        for(var i in data){
                            all_order_data[i] = data[i];
                        }
                        write_in_data();
                    }
                },
                error: function(er) {
                    console.log('query order');
                    console.log(er);
                    $('#network_report_error').css("display","block");

                }
            });
        }  


        function write_in_data(){
            // console.log(all_user_data) 
            // console.log(all_order_data) 
            var userName = all_user_data.username;

            /****** 获取用户头像 ******/    
            var scanphoto_uuid = all_order_data.scanphoto;      
            if(!scanphoto_uuid){        
                $('#login_user').html('<img src="images/touxiang.png"><span>'+userName+'</span><span id="delCookie">退出</span>')
            }else{
                $('#login_user').html('<img src="/data?action=download&type=scanphoto&uuid='+scanphoto_uuid+'"><span>'+userName+'</span><span id="delCookie">退出</span>')
            }
            /****** 获取用户头像END ******/

            /**
             * 关闭窗口
            * */
            $("#delCookie").click(function(){
                window.location.href="login.html";
                delCookie('uuid'); 
                setCookie("isgoto","false");
                setCookie("checkbox","false");
            });



            /****** 所有的眼镜的数据 ******/    
            glass_collecteddata_data = {};
            load_collecteddata_data();
            function load_collecteddata_data(){
                
                var tmp_collecteddata = all_order_data.collecteddata;
                if( tmp_collecteddata != ''){
                    tmp_collecteddata = tmp_collecteddata;
                    for(var i in tmp_collecteddata){
                        glass_collecteddata_data[i] = tmp_collecteddata[i];
                    }
                }                    

            }

            glass_config_data = {};

            load_preconfig_data();
            function load_preconfig_data(){
                
                var tmp_preconfig = all_order_data.preconfig;
                if( tmp_preconfig != ''){
                    // tmp_preconfig = JSON.parse(tmp_preconfig);
                    tmp_preconfig = tmp_preconfig;
                    for( var i in tmp_preconfig){
                        glass_config_data[i] = tmp_preconfig[i];
                    }
                }
                load_oldConfig_data()
                                        
            }

            function load_oldConfig_data(){
                var post_data = {
                    'action' : 'download',
                    'type' : 'config',
                };

                if(!all_order_data.config[0]){
                    var config_uuid = all_order_data.config;
                }else{
                    var config_uuid = all_order_data.config[0];
                }
                
                if(config_uuid != ''){
                    post_data['uuid'] = config_uuid;
                }
                $.ajax({

                    type: 'post',
                    data: post_data,
                    // dataType: 'text',
                    url: "/data",
                    success:function(dt){
                        if(dt.result != 'false' && dt != ''){
                            var config_in_json = Config2Json(dt);
                            for(var  i in config_in_json){
                                glass_config_data[i] = config_in_json[i];
                            }
                        }
                        
                    },
                    error: function(er){
                        console.log('download config');
                        console.log(er)
                    }
                })              
            }
            glass_params_data = {};
            load_params_data();
            function load_params_data(){
                if(all_order_data.params[0] !== undefined){
                    var params_uuid = all_order_data.params[0];  

                    var post_data = {
                        'action' : 'download',
                        'type' : 'params',
                    };
                    if(params_uuid != ''){
                        post_data['uuid'] = params_uuid;
                    }
                    $.ajax({

                        type: 'post',
                        data: post_data,
                        async: false,
                        dataType: 'json',
                        url: "/data",
                        success:function(dt){
                            if(dt.result != 'false' && dt != ''){
                                for(var  i in dt){
                                    glass_params_data[i] = dt[i];
                                }
                                disposal_data();
                            }
                            
                        },
                        error: function(er){
                            console.log('download params');
                            console.log(er);
                            $('#network_report_error').css("display","block");
                        }
                    })  
                }else{
                    disposal_data();
                }            
            }  

        }




        function disposal_data(){

            if(!glass_collecteddata_data.pupil_dist){
            }else{
                glass_config_data.PupilDistance = glass_collecteddata_data.pupil_dist;

            }

            /**
            * 检测对象的key是否存在
            **/
            function inspect_data(obj,key){
                var tmp_key = obj.hasOwnProperty(key)? obj[key] : '';
                return tmp_key;
            }
            // 脸部宽度 EPWidth
            $('#user_EPWidth').val(inspect_data(glass_params_data,"EPWidth"));
            // 脸部长度 FaceHeight
            $('#user_FaceHeight').val(inspect_data(glass_params_data,"FaceHeight"));
            // 鼻梁宽度 NoseWidth
            $('#user_NoseWidth').val(inspect_data(glass_params_data,"NoseWidth"));
            // 鼻梁高度 NoseHeight
            $('#user_NoseHeight').val(inspect_data(glass_params_data,"NoseHeight"));
            // 左侧脸宽 LeftFaceWidth
            $('#user_LeftFaceWidth').val(inspect_data(glass_params_data,"LeftFaceWidth"));
            // 右侧脸宽 RightFaceWidth
            $('#user_RightFaceWidth').val(inspect_data(glass_params_data,"RightFaceWidth"));
            // 左眼视力  left_degrees
            $('#user_left_degrees').val(inspect_data(glass_collecteddata_data,"left_degrees"));
            // 右眼视力 right_degrees
            $('#user_right_degrees').val(inspect_data(glass_collecteddata_data,"right_degrees"));
            // 左眼散光 left_cyl
            $('#user_left_cyl').val(inspect_data(glass_collecteddata_data,"left_cyl"));
            // 右眼散光 right_cyl
            $('#user_right_cyl').val(inspect_data(glass_collecteddata_data,"right_cyl"));


            // 左眼轴向 left_axis
            $('#user_left_axis').val(inspect_data(glass_collecteddata_data,"left_axis"));
            // 右眼轴向 right_axis
            $('#user_right_axis').val(inspect_data(glass_collecteddata_data,"right_axis"));
            
            // 瞳距 PupilDistance
            $('#user_PupilDistance').val(inspect_data(glass_config_data,"PupilDistance"));

            // left_axis
            
            // 镜框宽度 FrameWidth
            $('#user_FrameWidth').val(inspect_data(glass_params_data,"FrameWidth"));
            // 镜框高度 FrameHeight
            $('#user_FrameHeight').val(inspect_data(glass_params_data,"FrameHeight"));
            // 左鼻托高 LeftNosePadHeight
            $('#user_LeftNosePadHeight').val(inspect_data(glass_params_data,"LeftNosePadHeight"));
            // 右鼻托高 RightNosePadHeight
            $('#user_RightNosePadHeight').val(inspect_data(glass_params_data,"RightNosePadHeight"));
            // 左腿长度 LeftLegLength
            $('#user_LeftLegLength').val(inspect_data(glass_params_data,"LeftLegLength"));
            // 右腿长度 RightLegLength
            $('#user_RightLegLength').val(inspect_data(glass_params_data,"RightLegLength"));
            // 镜片宽度 LensWidth
            $('#user_LensWidth').val(inspect_data(glass_params_data,"LensWidth"));
            // 镜片高度 LensHeight
            $('#user_LensHeight').val(inspect_data(glass_params_data,"LensHeight"));
            // 中梁宽 BridgeWidth
            $('#user_BridgeWidth').val(inspect_data(glass_params_data,"BridgeWidth"));
        }

    }else{
        $('#login_user').html('<a href="login.html">未登录</a>');
    }  
})