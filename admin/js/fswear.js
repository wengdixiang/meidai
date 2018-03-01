/* 当没有证书情况 */
function certificate_none() {
    $('#prompt_messagea').css('display', 'block');
    $('.data-table').css('display', 'none');
    $('.cancel-table').css('display', 'none');
    $('.versions').css('display', 'none');
    $('.order_data').css('display', 'none');
    $('.timezone').css('display', 'none');
    $('#credential_info').css('display', 'none');
    $('#credential_all').css('display', 'none');
    $('#credential_list').css('display', 'none');
    // $('#new_contacts').css('display', 'none');

}

/* config 的文本转换成JSON格式 */
function Config2Json(config) {
    if (!(typeof config === "string")) {
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
        if (pair_.length > 1)
            value = pair_[1].trim();
        else
            value = "";

        if ("" == key)
            continue;

        config_json[key] = value;
    }

    return config_json;
}

/*将格式MFC2822时间转化时间格式*/
function format_time(ordertime) {
    if (ordertime != '') {
        var date = new Date(ordertime);
        year = date.getFullYear();
        month = estimate_time(date.getMonth() + 1);
        day = estimate_time(date.getDate());
        minute = estimate_time(date.getMinutes());
        seconds = estimate_time(date.getSeconds());
        hour = estimate_time(date.getHours());
        var deal_date = year + "年" + month + "月" + day + "日" + hour + ":" + minute + ":" + seconds;
        return deal_date;
    } else {
        var deal_date = '';
        return deal_date;
    }

}
function estimate_time(data_time) {
    if (data_time <= 9) {
        data_time = '0' + data_time;
    }
    return data_time;
}
/*获取服务器端的时间*/
function getServerDate() {
    return new Date($.ajax({ async: false }).getResponseHeader("Date"));
}

/**
* 检测对象的key是否存在
**/
function inspect_data(obj, key) {
    var tmp_key = obj.hasOwnProperty(key) ? obj[key] : '';
    return tmp_key;
}


//设置Cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires; +"; path=/";
};
//获得Cookie
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}


// 删除Cookie
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}


//检测登录状态
function checklogin(check_success, check_fail) {
    var _data = {};
    var _user = getCookie("userName");
    var _uuid = getCookie("uuid");
    if (_uuid != "") {
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
            success: function (re) {
                var re_parsed = JSON.parse(re);
                if (re_parsed.result == "true") {
                    check_success(re);
                    console.log(re)
                } else {
                    check_fail(re);
                }
            },
            error: function (re) {
                check_fail(re);
            }
        });
    } else check_fail();
};
// (function(){
//      var data = {'action':'check'}
//     $.ajax({
//         type: "post",
//         data: data,
//         url: "/cert",
//         // async: false,
//         success: function(data) {
//             if(JSON.parse(data) && JSON.parse(data).result == 'true'){
//                console.log(JSON.parse(data));
//                 var data=JSON.parse(data);
//                     data=data.left;
//                var date=data.substring(0, data.indexOf('days'));
//                console.log(date)
//                 if(date<=14){
//                     $("#remind").css("display","block");
//                 }else{
//                     $("#remind").css("display","block");
//                 }

//                    data=data.replace("days","天");
//                    data=data.substring(0, data.indexOf('.')+1);
//                    console.log(data);
//                    data=data.replace(",","");
//                    data=data.replace(":","小时");
//                    data=data.replace(":","分");
//                    data=data.replace(".","秒");
//                var html=data
//                $(".credential_date").html(html)
//             }else{
//                 certificate_none();
//             }
//         },error: function() {
//             certificate_none();
//         }

//     })      

// })()

; (function ($) {
    $.fn.extend({
        "setword": function (options) {

            var regex = /\W/;
            var _word = this.val();
            this.val(_word.replace(regex, ""));
        },
        //      "Verification":function(){
        //          var regex=/[^A-Za-z0-9]{8,}/
        //          var _data=this.val();
        //          return this.val(_data.replace(regex,""));
        //      },
        "inputpassword_err": function (options) {
            var _true = options.errtrue;
            var _docoment1 = options.docoment1;
            var _str = options.stl;
            this[_true ? "addClass" : "removeClass"]("fws_input_danger");
            _docoment1.html(_str);
        },
        "phonetest": function () {
            var regex = /^1[3|4|5|7|8][0-9]\d{8}$/;
            var _result = this.val();
            return regex.test(_result);
        },
        "inputphone_err": function (options) {
            var _true = options.errtrue;
            var _docoment1 = options.docoment1;
            var _str = options.stl;
            this[_true ? "addClass" : "removeClass"]("fws_input_danger");
            _docoment1.html(_str);
        }

    });
})(jQuery);
