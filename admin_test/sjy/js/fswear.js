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


//检测登录状态
function checklogin(check_success, check_fail) {
    var _data = {};
    var _user = getCookie("userName");
    var _uuid = getCookie("uuid");
    if(_uuid != "") {
        var fsw_obj = {
            action: "query",
            userData: _user,
            uuid: _uuid
        };
        _data = fsw_obj;
        $.ajax({
            url: "/user",
            type: 'POST',
            data: _data,
            success: function(re) {
                var re_parsed = JSON.parse(re);
                if(re_parsed.result == "true") {
                    check_success(re);
                    console.log(re)
                } else {
                    check_fail(re);
                }
            },
            error: function(re) {
                check_fail(re);
            }
        }); 
    }else check_fail();
};


/* config 的文本转换成JSON格式 */
function Config2Json(config)
{
    if (! (typeof config === "string")) {
        console.log("Config2Json needs input in string type.");
        return;
    }
    
    config = config.split(/\r?\n/);
    var key;
    var value;
    var config_json = {};
    for (var pair in config) {
        pair = config[pair].trim();
        if ("" == pair)
            continue;
        
        var pair_ = pair.split(" ");
        key = pair_[0].trim();
        if(pair_.length > 1)
            value = pair_[1].trim();
        else
            value = "";
        
        if ("" == key)
            continue;
        
        config_json[key] = value;
    }
    
    return config_json;
}


;(function($){
    $.fn.extend({
        "setword":function(options){
            
            var regex=/\W/;
            var _word=this.val();
            this.val(_word.replace(regex,""));
        },
//      "Verification":function(){
//          var regex=/[^A-Za-z0-9]{8,}/
//          var _data=this.val();
//          return this.val(_data.replace(regex,""));
//      },
        "inputpassword_err":function(options){
            var _true=options.errtrue;
            var _docoment1=options.docoment1;
            var _str=options.stl;
            this[_true?"addClass":"removeClass"]("fws_input_danger");
            _docoment1.html(_str);
        },
        "phonetest":function(){
            var regex=/^1[3|4|5|7|8][0-9]\d{8}$/;
            var _result=this.val();
            return regex.test(_result);
        },
        "inputphone_err":function(options){
            var _true=options.errtrue;
            var _docoment1=options.docoment1;
            var _str=options.stl;
            this[_true?"addClass":"removeClass"]("fws_input_danger");
            _docoment1.html(_str);
        }
        
    });
})(jQuery);