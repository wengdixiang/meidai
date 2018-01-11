$(document).ready(function(){
    // 图片懒加载
    $(".img_lazyload").lazyload({
        effect: "fadeIn",
        effectspeed : 0.5,
        threshold : 200,
    });

    
    /****** 生成二维码 ******/
    // var qrcode = new QRCode(document.getElementById("qrcode"), {
 //        // render : "canvas", 
 //        // text: 'your content',
 //        // text : "<span style='font-family: Consolas, 'Courier New', Courier, mono, serif; line-height: 18px;'>http://www.baidu.com</span>",
 //        width : 200,
 //        height : 200,
 //        colorDark : "#000000",
 //        colorLight : "#ffffff",
 //        correctLevel : QRCode.CorrectLevel.H
 //    });
    // 选择性别
    $(".sex div input").click(function() {
        $(this).siblings("div").children("span").addClass("active");
        $(this).parents("div").siblings("div").find("span").removeClass("active");
        tmp_sex = $(this).val();
        $('.sex>span').css('display','none');
    });


    $('#username,#phone,#teacher_license').blur(function(){
        if($(this).val() == ''){
            $(this).css('borderColor','#ff4f4f');
            $(this).next().css('display','block');
            $(this).next().text('不能为空');
        }
    })
    $('#username,#phone,#teacher_license').focus(function(){
        $(this).css('borderColor','#fff');
        $(this).next().css('display','none');
        $(this).next().text('');
    })  

    /* 获取common数据 */   
    var all_common_data = {};
    var common_list = [];

    /* 设置读取服务器的数据的分页 */
    var current_page = 0;
    var PAGE_SIZE = 20;

    load_common_list();  

    function load_common_list() {
        var init_data = {
            "action" : "list",
            "page" : '*#'+current_page,
            'type': 'PotentialUsers',
        };
        $.ajax({
            type: "post",
            data: init_data,
            dataType: "json",
            url: "/common",
            // async: false,
            success: function(data) {
                if(data.result == 'true'){
                    deal_totalpage = parseInt(data.totalpage);
                    common_list = common_list.concat(data.list);
                    if(parseInt(data.page.split('#')[2]) < parseInt(data.totalpage)-1 ){
                        current_page = current_page+1;      
                        load_common_list();

                    }else{
                        load_common_data();
                    } 
                }else{
                  
                }
                
            },
            error: function(er) {
                console.log('common list');
                console.log(er);
                $('.dataTables_empty').text('没有网络');
            }
        });        
    }


    var current_page_list =  0;                     
    /* 获取common的list查找common的数据 */
    function load_common_data(){
        var tmp_common_list = common_list.slice(current_page_list*PAGE_SIZE,Math.min((current_page_list+1)*PAGE_SIZE,common_list.length));
        /*查询common*/
        var post_data = {
            "action": "query",
            'type' : 'PotentialUsers',
            "uuid": JSON.stringify(tmp_common_list),
            "createdate": "",
            'content' : '',
        };

        $.ajax({
            type: "post",
            data: post_data,
            dataType: "json",
            url: "/common",
            success: function(dt) {
                if( dt.result != 'false'){
                    for(var i in dt){
                        all_common_data[i] = dt[i]; 
                    }
                    if(current_page_list < current_page){
                        current_page_list = current_page_list+1;
                        load_common_data();
                    }else{
                        query_content_data();
                    }
                }                  
            },
            error: function(er) {
                console.log('query common data');
                console.log(er)
                $('.dataTables_empty').text('没有网络');
            }
        });
    }
    /* 获取common的list查找common的数据 END*/

    function query_content_data(){
        var phone = [];
        var username = [];
        var teacher = [];
        for(var j= 0;j<common_list.length; j++){
            var tmp_content = all_common_data[common_list[j]].content;
            var tmp_phone_length = tmp_content.indexOf('#');
            var tmp_phone_data = tmp_content.slice(tmp_phone_length+1,tmp_phone_length+12); 
            phone = phone.concat(tmp_phone_data);

            var tmp_username_length = tmp_content.indexOf('#',tmp_phone_length+13);
            var tmp_username_data = tmp_content.slice(tmp_phone_length+13,tmp_username_length);
            username = username.concat(tmp_username_data); 

            var tmp_profession_length = tmp_content.indexOf('profession');
            var tmp_profession_last_length = tmp_content.indexOf('#',tmp_profession_length);
            var  tmp_profession_data = tmp_content.slice(tmp_profession_length+11,tmp_profession_last_length); 
            console.log(tmp_profession_data)
            if(tmp_profession_data === '教师' ){
                var tmp_teacher_length = tmp_content.indexOf('#',tmp_username_length+1);
                var  tmp_teacher_data = tmp_content.slice(tmp_username_length+1,tmp_teacher_length);
                teacher = teacher.concat(tmp_teacher_data); 
            }
        }
        // for(var j= 0;j<common_list.length; j++){
        //     var tmp_content = all_common_data[common_list[j]].content;
        //     var tmp_phone_length = tmp_content.indexOf('#');
        //     var tmp_phone_data = tmp_content.slice(tmp_phone_length+1,tmp_phone_length+12); 
        //     phone = phone.concat(tmp_phone_data);

        //     var tmp_username_length = tmp_content.lastIndexOf('#');
        //     if(tmp_username_length !== 12){
        //         var tmp_username_data = tmp_content.slice(tmp_phone_length+13,tmp_username_length);
        //         username = username.concat(tmp_username_data); 

        //         var  tmp_teacher_data = tmp_content.slice(tmp_username_length+1,tmp_content.length);
        //         teacher = teacher.concat(tmp_teacher_data); 
        //     }else{
        //         var tmp_username_data = tmp_content.slice(tmp_phone_length+13,tmp_content.length);
        //         username = username.concat(tmp_username_data); 
        //     }
            
        // }

        //点击提交按钮之后向后台发送数据
        $('#but_qrcode').click(function(){
            $('.teacher_error').hide();
            
            var tmp_username = $('#username').val();
            var tmp_phone= $('#phone').val();
            var tmp_disusername = $('#username').next().css('display');
            var tmp_disphone = $('#phone').next().css('display');
            
            var tmp_teacher = $('#teacher_license').val(); 
            var tmp_disteacher = $('#teacher_license').next().css('display'); 
            // if($('#phone').val() != '' && $('#username').val() != '' && tmp_disusername == 'none' && tmp_disphone == 'none' && tmp_disteacher == 'none' && phone.indexOf(tmp_phone) == '-1' ){
            if($('#phone').val() != '' && $('#username').val() != '' && tmp_disusername == 'none' && tmp_disphone == 'none' && tmp_disteacher == 'none'){
                // 检查用户名是否都为汉字
                var reg = /^[\u4e00-\u9fa5]*$/;
                if(reg.test(tmp_username) == true){
                    // if($('.appellation select').val() != null){
                        // $('.appellation span').css('display','none');
                    if($(".sex div span.active").length == 1){
                        $('.sex>span').css('display','none');
                        if(tmp_teacher != '' && teacher.indexOf(tmp_teacher) == '-1'){
                            var tmp_content ='#' + $('#phone').val() + '#' + $('#username').val()+tmp_sex + '#' + tmp_teacher + '#profession=教师' + '#city=长沙';
                            var message_obj = new Object(); 
                            message_obj.type = "PotentialUsers"; 
                            message_obj.action = "create"; 
                            message_obj.dataform = "text"; 
                            message_obj.description = "{}"; 
                            message_obj.count = "1"; 
                            // message_obj.content = JSON.stringify(tmp_content); 
                            message_obj.content = tmp_content; 
                            console.log(message_obj)
                            $.ajax({
                                type: "POST",
                                url: "/common",
                                data: message_obj,
                                success: function(re){
                                    // console.log(re) 
                                    // if(re.result = true){
                                    //  window.location.reload(); 
                                    // }  
                                    $('.data_success').css('display','block');                            
                                },
                                error:function(ev){
                                    console.log('create common');
                                    console.log(ev);
                                    $('.data_error').css('display','block');
                                        setTimeout(function(){
                                            $('.data_error').css('display','none');
                                        },3000)
                                    }
                            })
                        }else{
                            $('.teacher_error').show();
                        }

                    }else{
                        $('.sex>span').css('display','block');
                    }

                }else{
                    $('#username').css('borderColor','#ff4f4f');
                    $('#username').next().css('display','block');
                    $('#username').next().text('输入的姓格式不对');
                }       
            }else{
                $('.teacher_error').show();
            }
        })   
    }

    /****** 通过点击按钮返回顶部的功能 ******/
    return_top($("#back_to_top"));

    function return_top(event){    
        $(window).scroll(function(){  
            if($(window).scrollTop()>100){  
                event.fadeIn(1000);  
            }else{  
                event.fadeOut(1000);  
            }  
        });  

        event.click(function(){  
            $('body,html').animate({scrollTop:0},500);  
            return false;  
        }); 
    } 


    $('#coupon').click(function(){  
        $('body,html').animate({scrollTop:4500},500);  
        return false;  
    }); 

    //对电话号码进行验证
    $('#phone').blur(function(){
        var phone = $('#phone').val()
        if( phone && /^1[3578]\d{9}$/.test(phone)){
            $('#phone').css('borderColor','#fff');
            return true;
        }else{
            $('#phone').css('borderColor','#ff4f4f');
            $('#phone').next().text('输入的手机号格式有误');
            $('#phone').next().css('display','block');
        }
    })

})