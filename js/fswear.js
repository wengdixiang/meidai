$(document).ready(function(){

    // 引入顶部导航
    $('.nav_content').load("navbar.html .navbar", function(){
        // 引入底部导航  
        $('.footer_content').load("navbar.html .footer",function(){
            // 底部导航动画
            $('.footer-bottom-div h4').toggle(function(){
                $(this).next().show(500);
                $(this).siblings('span').eq(0).fadeOut(500);
                $(this).siblings('span').eq(1).fadeIn(500);
            },function(){
                $(this).next().hide(500);
                $(this).siblings('span').eq(0).fadeIn(500);
                $(this).siblings('span').eq(1).fadeOut(500);
            })

            /****** 微信 ******/
            $('.footer_right .wechat').click(function(){
                $('.wechat_dialog').show();
            })

            $('.wechat_dialog').click(function(event){
                $('.wechat_dialog').hide();
                event.stopPropagation();
            })
            if(getCookie('activityurl') != ''){
                var tmp_activityurl = getCookie('activityurl');
                $('.activity a').eq(0).attr('href',tmp_activityurl);  
                $('.activity a').eq(1).attr('href',tmp_activityurl);  
            }

            // $('.wechat,.wechat-dialog').mouseout(function(){
            //     $('.wechat-dialog').hide();
            // })
            // console.log($('.dialog').not('#asad'))
            // $('.dialog').not('#asad').click(function(event){
            //     $('.dialog').hide();
            //     // return false
            //     event.stopPropagation();
            // })


            /****** 微博  ******/
            $('#app-store img').click(function(){
                $('#app_dialog').show();
            })

            $('#app_dialog').click(function(event){
                $('#app_dialog').hide();
                // return false
                event.stopPropagation();
            })
        })
    })  
})


// 通过外边框来控制图片的大小可以跟着浏览器窗口变化而变化
function set_banner_resizer(rim, img, ratio){

    function adjust_banner() {
        var viewport_height = rim.width()*ratio;
        rim.height (viewport_height);
        var img_height = img.height();
        // console.log(rim.height (viewport_height))
        var offset = rim.offset().top - (img_height-viewport_height)/2;
        img.offset({top: offset});
    }

    adjust_banner();   
    $(window).resize(adjust_banner);
}

// 通过点击按钮返回顶部的功能
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


//设置Cookie
function setCookie(cname,cvalue,exdays)
    {
    var d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
    };
//获得Cookie
function getCookie(cname){
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) 
      {
      var c = ca[i].trim();
      if (c.indexOf(name)==0) return c.substring(name.length,c.length);
    }
    return "";      
}


// 删除Cookie
function delCookie(name){
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null)
    document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}