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


    $('#username,#phone').blur(function(){
        if($(this).val() == ''){
            $(this).css('borderColor','#ff4f4f');
            $(this).next().css('display','block');
            $(this).next().text('不能为空');
        }
    })
    $('#username,#phone').focus(function(){
        // $(this).css('borderColor','#333');
        $(this).css('borderColor','#fff');
        $(this).next().css('display','none');
        $(this).next().text('');
    })  

    //点击提交按钮之后向后台发送数据
    $('#but_qrcode').click(function(){
        var tmp_username = $('#username').val();
        var tmp_phone= $('#phone').val();
        var tmp_disusername = $('#username').next().css('display');
        var tmp_disphone = $('#phone').next().css('display');
        
 
        if($('#phone').val() != '' && $('#username').val() != '' && tmp_disusername == 'none' && tmp_disphone == 'none'){
            // 检查用户名是否都为汉字
            var reg = /^[\u4e00-\u9fa5]*$/;
            if(reg.test(tmp_username) == true){
                // if($('.appellation select').val() != null){
                    // $('.appellation span').css('display','none');
                if($(".sex div span.active").length == 1){

                    $('.sex>span').css('display','none');
                    // 生成二维码
                    // var elText ='#' + $('#phone').val() + '#' +$('#username').val() + tmp_sex;

                    // qrcode.makeCode(elText);
                    // console.log(elText)

                    // var tmp_content = {
                    //     'username' : $('#username').val(),
                    //     'phone' : $('#phone').val(),
                    // };

                    var tmp_content ='#' + $('#phone').val() + '#' + $('#username').val()+ tmp_sex + '#city=长沙';
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
                            console.log(ev);
                            $('.data_error').css('display','block');
                                setTimeout(function(){
                                    $('.data_error').css('display','none');
                                },3000)
                            }
                    })
                }else{
                    $('.sex>span').css('display','block');
                }

            }else{
                $('#username').css('borderColor','#ff4f4f');
                $('#username').next().css('display','block');
                $('#username').next().text('输入的姓格式不对');
            }       
        }
    })   

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
            // $('#phone').css('borderColor','#333');
            $('#phone').css('borderColor','#fff');
            return true;
        }else{
            $('#phone').css('borderColor','#ff4f4f');
            $('#phone').next().text('输入的手机号格式有误');
            $('#phone').next().css('display','block');
        }
    })

})