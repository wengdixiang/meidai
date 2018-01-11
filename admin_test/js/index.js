// 给按钮加上颜色
function btn_color(content){  
    function get_color(){
        // var colorarr=["#282828","#525252","#BEBEBE","#E6E8EA","#FFFFFF","#623100","#760094","#690101","#D40000","#F099FF","#FED1F7","#FF6600","#FEFE41","#91FE56","#328D00",'#61D8FF',"#008FBE",'url(images/touming.png)'];
        // var colorarr=["#282828","#525252","#BEBEBE","#E6E8EA","#FFFFFF","#623100","#760094","#690101","#D40000","#F099FF","#FED1F7","#FF6600","#FEFE41","#91FE56","#328D00",'#61D8FF',"#008FBE",'#F2F1D7'];
        var colorarr=["#282828","#525252","#bebebe","#e6e8ea",'#f2f1d7',"#ffffff","#623100","#690101","#d40000","#760094","#f099ff","#fed1f7","#ff6600","#fefe41","#91fe56","#328d00",'#61d8ff',"#008fbe"];
        return colorarr;
    }
    // var btn=content;          
    var color_arr=get_color();
    for(i=0;i<content.length;i++){
        $(content[i]).css({"background":color_arr[i]});
    }
}

// 眼镜的颜色选取
function cut(button,content){
    // content.fadeOut(0);
    button.toggle(function(){
        content.fadeIn(500);
    },function(){
        content.fadeOut(500);
    })
}

// 输入色值按钮，按钮呈现不同的显色
function input_color(input,trigger){
    input.blur(function(){
        var btn_background = input.val();
        trigger.css('background',btn_background);     
    })
}

// 点击按钮出现不同的色值
function btn_cut(button,input,trigger){
    button.click(function(){
        var color = $(this)[0].style.backgroundColor;
        function zero_fill_hex(num, digits) {
          var s = num.toString(16);
          while (s.length < digits)
            s = "0" + s;
          return s;
        }
        function rgb2hex(rgb) {
          if (rgb.charAt(0) == '#')
            return rgb;             
          var ds = rgb.split(/\D+/);
          var decimal = Number(ds[1]) * 65536 + Number(ds[2]) * 256 + Number(ds[3]);
          // var shift_capital = zero_fill_hex(decimal, 6).toUpperCase();
          var shift_capital = zero_fill_hex(decimal, 6);
          return "#" + shift_capital;
        }
        input.val(rgb2hex(color));

        trigger.css('background',color);
    }) 
}


// 判断闰年
function isLeapYear(year) {
    var cond1 = year % 4 == 0;  //条件1：年份必须要能被4整除
    var cond2 = year % 100 != 0;  //条件2：年份不能是整百数
    var cond3 = year % 400 ==0;  //条件3：年份是400的倍数
    //当条件1和条件2同时成立时，就肯定是闰年，所以条件1和条件2之间为“与”的关系。
    //如果条件1和条件2不能同时成立，但如果条件3能成立，则仍然是闰年。所以条件3与前2项为“或”的关系。
    //所以得出判断闰年的表达式：
    var cond = cond1 && cond2 || cond3;
    if(cond) {
        return true;
    } else {
        return false;
    }
}


        