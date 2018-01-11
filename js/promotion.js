$(document).ready(function(){
	// // 图片懒加载
 //    $(".img_lazyload").lazyload({
	//     effect: "fadeIn",
	//     effectspeed : 0.5,
	//     threshold : 200,
	// });

	
	// /****** 生成二维码 ******/
	// // var qrcode = new QRCode(document.getElementById("qrcode"), {
 // //        // render : "canvas", 
 // //        // text: 'your content',
 // //        // text : "<span style='font-family: Consolas, 'Courier New', Courier, mono, serif; line-height: 18px;'>http://www.baidu.com</span>",
 // //        width : 200,
 // //        height : 200,
 // //        colorDark : "#000000",
 // //        colorLight : "#ffffff",
 // //        correctLevel : QRCode.CorrectLevel.H
 // //    });
 //    // 选择性别
 //    $(".sex div input").click(function() {
 //        $(this).siblings("div").children("span").addClass("active");
 //        $(this).parents("div").siblings("div").find("span").removeClass("active");
 //        tmp_sex = $(this).val();
 //        $('.sex>span').css('display','none');
 //    });


 //    $('#username,#phone').blur(function(){
 //        if($(this).val() == ''){
 //            $(this).css('borderColor','#ff4f4f');
 //            $(this).next().css('display','block');
 //            $(this).next().text('不能为空');
 //        }
 //    })
 //    $('#username,#phone').focus(function(){
 //        $(this).css('borderColor','#333');
 //        $(this).next().css('display','none');
 //        $(this).next().text('');
 //    })  

 // 	//点击提交按钮之后向后台发送数据
 //    $('#but_qrcode').click(function(){
 //        var tmp_username = $('#username').val();
 //        var tmp_phone= $('#phone').val();
 //        var tmp_disusername = $('#username').next().css('display');
 //        var tmp_disphone = $('#phone').next().css('display');
        
 
 //        if($('#phone').val() != '' && $('#username').val() != '' && tmp_disusername == 'none' && tmp_disphone == 'none'){
 //        	// 检查用户名是否都为汉字
 //            var reg = /^[\u4e00-\u9fa5]*$/;
 //            if(reg.test(tmp_username) == true){
 //                // if($('.appellation select').val() != null){
 //                    // $('.appellation span').css('display','none');
 //                if($(".sex div span.active").length == 1){

 //                    $('.sex>span').css('display','none');
 //                	// 生成二维码
 //                	// var elText ='#' + $('#phone').val() + '#' +$('#username').val() + tmp_sex;

 //                	// qrcode.makeCode(elText);
 //                    // console.log(elText)

 //                	// var tmp_content = {
 //    	            //     'username' : $('#username').val(),
 //    	            //     'phone' : $('#phone').val(),
 //    	            // };

 //    	            var tmp_content ='#' + $('#phone').val() + '#' + $('#username').val()+tmp_sex;
 //    	            var message_obj = new Object(); 
 //    	            message_obj.type = "PotentialUsers"; 
 //    	            message_obj.action = "create"; 
 //    	            message_obj.dataform = "text"; 
 //    	            message_obj.description = "{}"; 
 //    	            message_obj.count = "1"; 
 //    	            // message_obj.content = JSON.stringify(tmp_content); 
 //    	            message_obj.content = tmp_content; 
 //    	            // console.log(message_obj)
 //    	            $.ajax({
 //    	                type: "POST",
 //    	                url: "/common",
 //    	                data: message_obj,
 //    	                success: function(re){
 //    	                    // console.log(re) 
 //    	                    // if(re.result = true){
 //    	                    // 	window.location.reload(); 
 //    	                    // }  
 //                            $('.data_success').css('display','block');                            
 //    	                },
 //    	                error:function(ev){
 //    	                    console.log(ev.result);
 //                            $('.data_error').css('display','block');
 //                                setTimeout(function(){
 //                                    $('.data_error').css('display','none');
 //                                },3000)
 //            	            }
 //    	            })
 //                }else{
 //                    $('.sex>span').css('display','block');
 //                }

 //            }else{
 //            	$('#username').css('borderColor','#ff4f4f');
	//             $('#username').next().css('display','block');
	//             $('#username').next().text('输入的姓格式不对');
 //            }       
 //        }
 //    })   

	// /****** 通过点击按钮返回顶部的功能 ******/
 //    return_top($("#back_to_top"));

 //    function return_top(event){    
 //        $(window).scroll(function(){  
 //            if($(window).scrollTop()>100){  
 //                event.fadeIn(1000);  
 //            }else{  
 //                event.fadeOut(1000);  
 //            }  
 //        });  

 //        event.click(function(){  
 //            $('body,html').animate({scrollTop:0},500);  
 //            return false;  
 //        }); 
 //    } 


 //    $('#coupon').click(function(){  
 //        $('body,html').animate({scrollTop:4500},500);  
 //        return false;  
 //    }); 




 //    //对电话号码进行验证
 //    $('#phone').blur(function(){
 //        var phone = $('#phone').val()
 //        if( phone && /^1[3578]\d{9}$/.test(phone)){
 //            $('#phone').css('borderColor','#333');
 //            return true;
 //        }else{
 //            $('#phone').css('borderColor','#ff4f4f');
 //            $('#phone').next().text('输入的手机号格式有误');
 //            $('#phone').next().css('display','block');
 //        }
 //    })


    /****** 地图 ******/
    var map = new BMap.Map("map"); // 创建地图实例
    var point = new BMap.Point(120.133646, 30.288737); // 创建点坐标
    map.centerAndZoom(point, 15); // 初始化地图，设置中心点坐标和地图级别

    /* window.setTimeout(function(){
    map.panTo(new BMap.Point(120.19, 30.27));
    }, 2000);
    */         
    

    var content = '<div style="margin:0;line-height:20px;padding:2px;">' +
                    '<img src="images/promotion/hengliwen.jpg" alt="" style="float:right;zoom:1;overflow:hidden;width:130px;height:100px;margin-left:3px;"/>' +
                    '地址：杭州市西湖区文二路323号枫华府第楼下花园西村车站旁<br/>电话：18969014358' +
                  '</div>';

    //创建检索信息窗口对象
    var searchInfoWindow = null;
    searchInfoWindow = new BMapLib.SearchInfoWindow(map, content, {
            title  : "亨利眼镜文二路店",      //标题
            width  : 290,             //宽度
            height : 105,              //高度
            panel  : "panel",         //检索结果面板
            enableAutoPan : true,     //自动平移
            searchTypes   :[
                BMAPLIB_TAB_SEARCH,   //周边检索
                BMAPLIB_TAB_TO_HERE,  //到这里去
                BMAPLIB_TAB_FROM_HERE //从这里出发
            ]
        });
    var marker = new BMap.Marker(point); //创建marker对象
    marker.enableDragging(); //marker可拖拽
    marker.addEventListener("mouseover", function(e){
        searchInfoWindow.open(marker);
    })
    marker.addEventListener("click", function(e){
        searchInfoWindow.open(marker);
    })
    map.addOverlay(marker); //在地图中添加marker

 
    // var mkrTool = new BMapLib.MarkerTool(map, {followText: "添加一个点"});
    // var marker = new BMap.Marker(point);        // 创建标注    
    // map.addOverlay(marker);                     // 将标注添加到地图中

    map.addControl(new BMap.NavigationControl());
    map.addControl(new BMap.ScaleControl());
    map.addControl(new BMap.OverviewMapControl());
    map.addControl(new BMap.MapTypeControl());
    map.setCurrentCity("杭州"); // 仅当设置城市信息时，MapTypeControl 的切换功能才能可用
    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放

})