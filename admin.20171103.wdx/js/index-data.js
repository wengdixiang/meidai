$(function(){
    // 引入顶部
    $('.top').nav();
    $('.nav-left').left();

    // 给当前的导航加上颜色   
    $('#order_form a').addClass('active')


    $('#recently_hebdomad').addClass('bgColor1FB3F0')
                        .attr('index','active');
    // $('.order_data button').click(function(){
    //     $(this).css("background","#1FB3F0").siblings().css("background","");
    //     table.clear()
    //         .draw();
    //     setTimeout(data_load(),1000);
    // })

    // 分页插件
    var table = $('#table_id_example').DataTable({
    	"columnDefs": [ 
    		{
                "targets": [8],
                "visible": false,
                "searchable": true,
        	},                           
        ],

        //是否开启DataTables的高度自适应，当数据条数不够分页数据条数的时候，插件高度是否随数据条数而改变  
        "bScrollCollapse" : true, 

        //分页样式
        "pagingType": "full_numbers", 

        //默认显示的记录数 
        "iDisplayLength" : 12,  

        //是否显示页脚信息，DataTables插件左下角显示记录数
        "bInfo" : false,  

        //开启读取服务器数据时显示正在加载中 
        "bProcessing": true, 

        //开启排序功能，每一列都有排序功能，如果关闭了，排序功能将失效，
        "bSort": false, 

        //是否打开客户端状态记录功能,此功能在ajax刷新纪录的时候不会将个性化设定回复为初始化状态
        "bStateSave" : true, 

        //状态保存的有效期
        "stateDuration": 60 * 60 * 24,  

        //设置水平滚动
        "scrollX": true,  

        //国际语言转化
        "oLanguage": {

            //多语言配置文件，可将oLanguage的设置放在一个txt文件中，例：Javascript/datatable/dtCH.txt
            "oPaginate": {
               "sFirst": "首页",
               // "sPrevious": " <img src='images/fenye1.png'> ",
               "sPrevious": "上一页",
               "sNext": " 下一页 ",
               "sLast": " 尾页 "
            },
            "sEmptyTable": "载入中...",
        }, 
        "dom": '<t<p>r>',
        "columns": [
    		null,
    		// null,
    		{"defaultContent": ""},
    		{"defaultContent": ""},
    		{"defaultContent": ""},
    		{"defaultContent": ""},
    		{"defaultContent": ""},	           	            					  						  						     					  			            	
    		{"defaultContent": ""},
            {"defaultContent": ""},
    		{"defaultContent": ""},
		]


    });	

    //自定义搜索
    $('#top_input').on('keyup', function () {
    	function top_input_settime(){
    		var tsval = $("#top_input").val()
        	table.search(tsval, false, false).draw();
    	}       		
    	setTimeout(	top_input_settime,300)
                  
    });

    /* 当没有证书情况 */
    var data = {'action':'check'}
    $.ajax({
        type: "post",
        data: data,
        url: "/cert",
        // async: false,
        success: function(data) {
            if(JSON.parse(data) && JSON.parse(data).result == 'true'){
                var tmp_condition_ = '[[['+'"createdate"'+',">=","'+(new Date(Date.parse(new Date().toDateString())-86400000*6).toUTCString().replace(/GMT/,'-0000'))+'"]]]';
                data_load(tmp_condition_);
                // data_load();  
            }else{
                certificate_none();
            }
        },error: function(er) {
            console.log('check cert');
            console.log(er);
            certificate_none();
        }

    })       
    /* 当没有证书情况 END*/

    /* 根据时间段选取数据 */
    $('#recently_one_day').click(function(){
        $('#dropdown_list_year,#dropdown_list_month').val('');
        table.clear()
            .draw();
        var recently_one_day = '[[['+'"createdate"'+',">=","'+(new Date(Date.parse(new Date().toDateString())).toUTCString().replace(/GMT/,'-0000'))+'"]]]';
        data_load(recently_one_day);
    })
    $('#recently_hebdomad').click(function(){
        $('#dropdown_list_year,#dropdown_list_month').val('');
        table.clear()
            .draw();
        var recently_hebdomad = '[[['+'"createdate"'+',">=","'+(new Date(Date.parse(new Date().toDateString())-86400000*6).toUTCString().replace(/GMT/,'-0000'))+'"]]]';
        data_load(recently_hebdomad);
    })

    $('#recently_month').click(function(){
        $('#dropdown_list_year,#dropdown_list_month').val('');
        table.clear()
            .draw();
        var recently_month = '[[['+'"createdate"'+',">=","'+(new Date(Date.parse(new Date().toDateString())-86400000*30).toUTCString().replace(/GMT/,'-0000'))+'"]]]';
        data_load(recently_month);
    })
    $('#recently_one_year').click(function(){
        $('#dropdown_list_year,#dropdown_list_month').val('');
        table.clear()
            .draw();
        var recently_one_year = '[[['+'"createdate"'+',">=","'+(new Date(Date.parse(new Date().toDateString())-86400000*300).toUTCString().replace(/GMT/,'-0000'))+'"]]]';
        data_load(recently_one_year);
    })
    $('#all_data').click(function(){
        $('#dropdown_list_year,#dropdown_list_month').val('');
        table.clear()
            .draw();
        data_load();
    })

    /* 根据月份来选择数据 */
    $('#determine_the_time').click(function(){
        if($('#dropdown_list_year').val() != '' || $('#dropdown_list_month').val() != ''){
            /* 清楚上面时间段按钮的样式 */
            $('.order_data button').attr('index','');
            $('.order_data button').removeClass("bgColor1FB3F0");
            // $('.order_data button').css('backgroundColor','#1f87d9');
            
             var date_time = new Date();
                date_time.setFullYear(new Date().getFullYear());
                date_time.setMonth(0);
                date_time.setDate(1);
                date_time.setHours(0);
                date_time.setMinutes(0);
                date_time.setSeconds(0);
                date_time.setMilliseconds(0);

            if($('#dropdown_list_year').val() != '' && $('#dropdown_list_month').val() == ''){
                var year =date_time.setFullYear($('#dropdown_list_year').val());
                var year_ = date_time.setFullYear(parseInt($('#dropdown_list_year').val())+1);
                var recently_time = '[['+'["createdate"'+',">=","'+(new Date(year).toUTCString().replace(/GMT/,'-0000'))+'"]'+',["createdate"'+',"<=","'+(new Date(year_).toUTCString().replace(/GMT/,'-0000'))+'"]'+']]';
            }else if($('#dropdown_list_year').val() == '' && $('#dropdown_list_month').val() != ''){
                if($('#dropdown_list_month').val() == '12'){
                    var month_ = date_time.setFullYear(parseInt(new Date().getFullYear())+1);
                }else{
                    var month_ =  date_time.setMonth($('#dropdown_list_month').val());
                }

                date_time.setFullYear(new Date().getFullYear());
                var month =  date_time.setMonth(parseInt($('#dropdown_list_month').val())-1);
                var recently_time = '[['+'["createdate"'+',">=","'+(new Date(month).toUTCString().replace(/GMT/,'-0000'))+'"]'+',["createdate"'+',"<=","'+(new Date(month_).toUTCString().replace(/GMT/,'-0000'))+'"]'+']]';
            }else{
                date_time.setFullYear($('#dropdown_list_year').val());
                if($('#dropdown_list_month').val() == '12'){
                    var tmp_year_month_ = date_time.setFullYear(parseInt($('#dropdown_list_year').val())+1);
                }else{                     
                    var tmp_year_month_ = date_time.setMonth($('#dropdown_list_month').val());
                }
                    date_time.setFullYear($('#dropdown_list_year').val());
                var tmp_year_month = date_time.setMonth(parseInt($('#dropdown_list_month').val())-1);  
                var recently_time = '[['+'["createdate"'+',">=","'+(new Date(tmp_year_month).toUTCString().replace(/GMT/,'-0000'))+'"]'+',["createdate"'+',"<=","'+(new Date(tmp_year_month_).toUTCString().replace(/GMT/,'-0000'))+'"]'+']]'; 
            }

            table.clear()
                .draw();
            data_load(recently_time);
        }
    })



	/* 获取所有的数据 */
	function data_load(condition_){
		// var deal_list = [];
		// var all_deal_data = {};
		// var all_order_data = {};
        // tmp_deal_list_ = [];
        deal_list = [];
        all_deal_data = {};
        all_order_data = {};
        var deal_totalpage;
		/* 设置读取服务器的数据的分页 */
		var current_page = 0;
		var PAGE_SIZE = 20;

        load_deal_list(condition_);  

        function load_deal_list(_condition_) {
            var init_data = {
                "action" : "list",
                "page" : '*#'+current_page,
                'condition': _condition_,
            };
            $.ajax({
                type: "post",
                data: init_data,
                dataType: "json",
                url: "/deal",
                // async: false,
                success: function(data) {
                    if(data.result == 'true'){
                        deal_totalpage = parseInt(data.totalpage);
                        deal_list = deal_list.concat(data.list);
                        if(parseInt(data.page.split('#')[2]) < parseInt(data.totalpage)-1 ){
                            current_page = current_page+1;                     
                            load_deal_list(condition_);
                        }else{
                            load_deal_data();
                        } 
                    }else{
                        if($('#recently_one_day').attr('index') == 'active'){
                            $('.dataTables_empty').text('今天没有数据');
                        }else if($('#recently_hebdomad').attr('index') == 'active'){
                            $('.dataTables_empty').text('最近7天没有数据');
                        }else if($('#recently_month').attr('index') == 'active'){
                            $('.dataTables_empty').text('最近30天没有数据');
                        }else if($('#recently_one_year').attr('index') == 'active'){
                            $('.dataTables_empty').text('最近300天没有数据');
                        }else if($('#all_data').attr('index') == 'active'){
                            $('.dataTables_empty').text('没有数据');
                        }else if($('#dropdown_list_year').val() != '' && $('#dropdown_list_month').val() == ''){
                            $('.dataTables_empty').text($('#dropdown_list_year').val()+'年没有数据');
                        }else if($('#dropdown_list_year').val() == '' && $('#dropdown_list_month').val() != ''){
                            $('.dataTables_empty').text($('#dropdown_list_month').val()+'月没有数据');
                        }else{
                            $('.dataTables_empty').text($('#dropdown_list_year').val()+'年'+$('#dropdown_list_month').val()+'月'+'没有数据');
                        }
                    }
                	
                },
                error: function(er) {
                    console.log('deal list');
                    console.log(er);
                    $('.dataTables_empty').text('没有网络');
                }
            });        
        }


        var current_page_list =  0;                 	
        /* 获取deal的list查找deal的订单 */
        function load_deal_data(){
        	var tmp_deal_list = deal_list.slice(current_page_list*PAGE_SIZE,Math.min((current_page_list+1)*PAGE_SIZE,deal_list.length));
            /*查询订单*/
            var post_data = {
                "action": "query",
                "uuid": JSON.stringify(tmp_deal_list),
                "createdate": "",
                "price":"",
                "status":"",
                "owneruuid":"",
                "config_literal":"",
                "payment":"",
                "printdate":"",
                "manufactur": "",
                "delivery": "",
                "deliverydate": "",
                "acceptdate": "",
                'params':'',
                "config":"",
                'paymentstatus' :'',
                "discount" : '',
            };

            $.ajax({
                type: "post",
                data: post_data,
                dataType: "json",
                // async: false,
                url: "/deal",
                success: function(dt) {
                    if( dt.result != 'false'){
                        // console.log(dt)
                        for(var i in dt){
                            all_deal_data[i] = dt[i] 
                        }
                        if(current_page_list < current_page){
                            current_page_list = current_page_list+1;
                            load_deal_data();
                        }else{
                            load_order_data();
                        }
                    }else{
                       $('.dataTables_empty').text('没有数据'); 
                    }                	
                },
                error: function(er) {
                    console.log('deal query');
                    console.log(er)
                    $('.dataTables_empty').text('没有网络');
                }
            });
        }
        /* 获取deal的list查找deal的订单 END*/


        var current_page_owneruuid = 0;
        /* 获取listl的owneruuid查找order的数据 */
        function load_order_data(){
            /* 用owneruuid得到用户名邮箱和密码 */
            var tmp_deal_uuid = [];
            for (var i in all_deal_data) {
                tmp_deal_uuid.push(all_deal_data[i].owneruuid) 
            }

            var tmp_deal_owneruuid = tmp_deal_uuid.slice(current_page_owneruuid*PAGE_SIZE,Math.min((current_page_owneruuid+1)*PAGE_SIZE,tmp_deal_uuid.length));

            var post_data = {
                "action": "query",
                "uuid": JSON.stringify(tmp_deal_owneruuid),
                'scandate':'',
                'preconfig':'',
                'collecteddata':'',	              
        		"pinfo": "",
                'scanphoto'	: '', 
            };

            $.ajax({
                type: "post",
                data: post_data,
                dataType: "json",
                url: "/order",
                // async:false,
                success: function(dat) {
                    if( dat.result != 'false'){
                        for(var i in dat){
                            all_order_data[i] = dat[i]; 
                        }

                        if(current_page_owneruuid < current_page){
                            current_page_owneruuid = current_page_owneruuid+1;
                            load_deal_data()
                        }else{
                            struture_data(); 
                        }
                    }else{
                        console.log(dat.reasons)
                    }
                	
                },
                error: function(er) {
                    console.log('order query');
                    console.log(er)
                    $('.dataTables_empty').text('没有网络');
                }
            });
        }
        /* 获取listl的owneruuid查找order的数据 END*/

		// var deal_list;
		// var all_deal_data;
		// var all_order_data;
    }

	/* 插入数据 */
	// var time_createdate=[];
    function struture_data(){
        deal_list.reverse();
        struture_data_insertion(); 
    }
    function struture_data_insertion(){
        table.clear()
            .draw();
        var j = 0;
        for(var i in deal_list){
            if(!all_deal_data[deal_list[i]]){                        
            }else if(!all_deal_data[deal_list[i]].owneruuid){                       
            }else if(!all_order_data[all_deal_data[deal_list[i]].owneruuid]){                            
            }else{
                var order_status = all_deal_data[deal_list[i]].paymentstatus;
                var tmp_button = '' ;
                var tmp_btn_color;

                //购物小票
                var tmp_shopping_receipts;
                var tmp_shopping_class;

                switch(order_status)
                {
                case 'topay':
                  order_status = '待支付';
                  tmp_button = '提交订单';
                  tmp_btn_color = 'btn_danger';
                  tmp_shopping_receipts = '';
                  tmp_shopping_class = 'display_none';
                  break;
                case 'paid':
                  order_status = '已支付';
                  tmp_button = '查看详情';
                  tmp_btn_color = 'btn_info';
                  tmp_shopping_receipts = '打印小票';
                  tmp_shopping_class ='display_block';
                  break; 
                // default:
                //   order_status = '待支付';
                //   tmp_button = '提交订单';
                //   tmp_btn_color = 'btn_danger';
                }
                table.row.add([
                    j=j+1,
                    format_time(all_deal_data[deal_list[i]].createdate),                    
                    all_order_data[all_deal_data[deal_list[i]].owneruuid].pinfo ? all_order_data[all_deal_data[deal_list[i]].owneruuid].pinfo.username : "",
                    all_order_data[all_deal_data[deal_list[i]].owneruuid].pinfo ? all_order_data[all_deal_data[deal_list[i]].owneruuid].pinfo.phone : "",
                    all_order_data[all_deal_data[deal_list[i]].owneruuid].pinfo ? all_order_data[all_deal_data[deal_list[i]].owneruuid].pinfo.email : "",
                    // format_time(all_deal_data[deal_list[i]].printdate),
                    order_status,
                    // all_deal_data[deal_list[i]].status,   
                    "<button id='alter_news' class='"+tmp_btn_color+" btn-sm' alternews ='"+deal_list[i]+" ' >"+tmp_button+"</button>",                
                    "<button id='print_receipts' class='"+tmp_shopping_class+" btn-sm btn_info' alternews ='"+deal_list[i]+" ' >"+tmp_shopping_receipts+"</button>",                
                    // "<a href='shoppingreceipts.html'><button class='btn_info btn-sm "+tmp_shopping_class+"'>"+tmp_shopping_receipts+"</button></a>",                
                    deal_list[i],
                ]);
            }                                
        }
        table.draw(false);
    }
	/* 插入数据 END */

    var deal_uuid = '';
    var user_data;

    var order_username;

    var phone;
    var email;
    var username;


    var tmp_old_config_literal = {};
    /* 所有的眼镜的数据 */              
    // var glass_config_data = {};
    // var glass_collecteddata_data = {};
    // var glass_params_data = {};

	// 点击修改按钮，表格隐藏
    $('#table_id_example tbody').on('click','#alter_news',function(){

        // 返回商家系统按钮隐藏
        $('#return_index').hide();

        page_td = table.page();

        
        /* 顶部的时间段隐藏 */
        $('.order_data').css('display','none');
        $('.timezone').hide(0);
    	/* 让搜索框不能用 */
		$(".top-seek input").attr("disabled","false");
        $('.cancel-table').css('display','block');
        $('.data-table').css('display','none');   


        /* 点击颜色以外的区域，颜色隐藏 */
        $('.cancel-table').not('.frame_color_ul').click(function(event){
            $('.glass-frame-color>ul').hide(0);
            // return false
            // event.stopPropagation();
        })
        $('.frame-trigger').click(function(){
             $('.glass-frame-color>ul').show(0);
        })

        $('.cancel-table').not('.leg_color_ul').click(function(event){
            $('.glass-leg-color>ul').hide(0);
            // return false
            // event.stopPropagation();
        })

        $('.leg-trigger').click(function(){
             $('.glass-leg-color>ul').show(0);
        })
        
      	deal_uuid =($(this).attr("alternews")).slice(0,($(this).attr("alternews")).length-1);
      	/* 获取用户的个人信息 */
        

        for(var i in all_deal_data[deal_uuid].config_literal){
            tmp_old_config_literal[i] = all_deal_data[deal_uuid].config_literal[i]
        }



        if(all_deal_data[deal_uuid].paymentstatus == 'paid'){
            $('#submit_order,#submit_preserve').fadeOut(0);
        }else{
            $('#submit_order,#submit_preserve').fadeIn(0);
        }

        if(!all_deal_data[deal_uuid]){                
        }else if(!all_deal_data[deal_uuid].owneruuid){                    
        }else if(!all_order_data[all_deal_data[deal_uuid].owneruuid]){              
        }else if(!all_order_data[all_deal_data[deal_uuid].owneruuid].pinfo){        
        }else{
            phone = all_order_data[all_deal_data[deal_uuid].owneruuid].pinfo.phone;
            email = all_order_data[all_deal_data[deal_uuid].owneruuid].pinfo.email;
            username = all_order_data[all_deal_data[deal_uuid].owneruuid].pinfo.username;
        }

      	// $('#phone').val(phone);
      	// $('#email').val(email);
      	// $('#username').val(username);


      	/* 判断用户的登陆状态 */		         
  		var new_user_params = {
    		'action':'login',
    		'username': username,
            'password': '*',                        
    		// 'password': username,	            		
    	}
    	if(phone != ''){
    		new_user_params['phone'] = phone;
    	}else{
    		new_user_params['email'] = email;
        	}
	    $.ajax({
	        type: "POST",
	        url: "/user",
	        data: new_user_params,
	        success: function(data){
                if($.type(data) == 'string'){
                    user_data = JSON.parse(data)
                    if( user_data['result'] != "true"){
                        $('.username').append("<label id='username' type='text' name='username'></label>");
                        $('#username').text(username);
                        $('.phone').append("<label id='phone' type='text' name='phone'></label>");
                        $('#phone').text(phone);
                        $('.email').append("<label id='email' type='text' name='email'></label>");
                        $('#email').text(email);
                        $('#user_information_mod_hint').css('display','block');

                        // 中文名字
                        $('#user_realname').attr('readonly','readonly');
                        $('#user_realname').addClass('input_transparent');
                        personal_information();

                    }else{
                        $('.username').append('<input id="username" type="text" name="username">');
                        $('#username').val(username);
                        $('.phone').append('<input id="phone" type="text" name="phone">');
                        $('#phone').val(phone);
                        $('.email').append('<input id="email" type="text" name="email">');
                        $('#email').val(email);
                        $('#user_information_mod_hint').css('display','none');

                        // 中文名字
                        $('#user_realname').removeAttr('readonly');
                        $('#user_realname').removeClass('input_transparent');
                        load_username(user_data.uuid);
                        personal_information();
                        
                    }
                }
	        	
	        },
	        error:function(er){		
                console.log('login user *');
                console.log(er)		        	
	        }

	    })


        function load_username(tmpuuid){
            var user_params = {
                'action':'query',
                'uuid' : tmpuuid,
                'realname': '',                       
            }
            $.ajax({
                type: "POST",
                url: "/user",
                data: user_params,
                success: function(data){
                    if($.type(data) == 'string'){
                        user_data = JSON.parse(data)
                        if( user_data['result'] == "true"){   
                            $('#user_realname').val(user_data.realname);                         
                        }else{
                            $('#user_realname').val(''); 
                        }
                    }
                    
                },
                error:function(er){ 
                    console.log('query user');
                    console.log(er);                          
                }

            })
        }
	    /* 判断用户的登陆状态 END*/


        function personal_information(){

            /* 获取用户眼镜的眼镜的所有信息 */
            var config_uuid = all_deal_data[deal_uuid] ? all_deal_data[deal_uuid].config : "";  
            var params_uuid = all_deal_data[deal_uuid] ? all_deal_data[deal_uuid].params : ""; 

    		/* 所有的眼镜的数据 */				
            // var glass_config_data = {};
            // var glass_collecteddata_data = {};
    		// var glass_params_data = {};

            glass_collecteddata_data = {};
            glass_params_data = {};

            load_collecteddata_data();
            function load_collecteddata_data(){
                if(!all_deal_data[deal_uuid]){
                }else if(!all_deal_data[deal_uuid].owneruuid){
                }else if(!all_order_data[all_deal_data[deal_uuid].owneruuid]){        
                }else{
                    var tmp_collecteddata = all_order_data[all_deal_data[deal_uuid].owneruuid].collecteddata;
                    if( tmp_collecteddata != ''){
                        // tmp_collecteddata = JSON.parse(tmp_collecteddata)
                        tmp_collecteddata = tmp_collecteddata;
                        for(var i in tmp_collecteddata){
                            glass_collecteddata_data[i] = tmp_collecteddata[i];
                        }
                    } 
                    load_preconfig_data();

                }

            }
            glass_config_data = {};
            if(!glass_config_data.PupilDistance){
            }else{
                glass_config_data.PupilDistance = glass_collecteddata_data.pupil_dist;
            }
         
    		function load_preconfig_data(){
                if(!all_deal_data[deal_uuid]){
                }else if(!all_deal_data[deal_uuid].owneruuid){
                }else if(!all_order_data[all_deal_data[deal_uuid].owneruuid]){        
                }else{
                    var tmp_preconfig = all_order_data[all_deal_data[deal_uuid].owneruuid].preconfig;
                    if( tmp_preconfig != ''){
                        // tmp_preconfig = JSON.parse(tmp_preconfig);
                        tmp_preconfig = tmp_preconfig;
                        for( var i in tmp_preconfig){
                            glass_config_data[i] = tmp_preconfig[i];
                        }
                    }
                    load_oldConfig_data();
                }
    									
    		}

            function load_oldConfig_data(){
                var post_data = {
                    'action' : 'download',
                    'type' : 'config',
                };
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
                            load_config_data(); 
                        }
                        
                    },
                    error: function(er){
                        console.log('download config');
                        console.log(er)
                    }
                })              
            }

            function load_config_data(){
                if(!all_deal_data[deal_uuid].config_literal){
                }else{
                    tmp_config = all_deal_data[deal_uuid].config_literal;
                    for( var i in tmp_config){
                        glass_config_data[i] = tmp_config[i];
                    }
                    load_params_data();

                }
            }

            function load_params_data(){
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
            		// dataType: 'json',
            		url: "/data",
            		success:function(dte){
                        if(dte.indexOf("\"\"RightNosePadHeight") !== -1){
                            dte = dte.replace("\"\"RightNosePadHeight","\",\"RightNosePadHeight");
                        }

                        if(dte.indexOf("\"\"EPWidth") !== -1){
                            dte = dte.replace("\"\"EPWidth","\",\"EPWidth");
                        }
            			if (JSON.parse(dte) && JSON.parse(dte).result != 'false' && dte != '') {
            				var tmp_params = JSON.parse(dte);
    	        			for(var i in tmp_params){
    	        				glass_params_data[i] = tmp_params[i];
    	        			}

            			}
                        insert_data_to_page();  

            		},
            		error: function(er){
                        console.log('download params');
                        console.log(er);
            		}
            	})
            }
    	    /* 获取用户眼镜的眼镜的所有信息 END*/

            function insert_data_to_page(){
                // console.log(glass_config_data)
                // console.log(glass_collecteddata_data)
                // console.log(glass_params_data)
                     	
            	/* 刻字 */
                $('.frame_lettering input').val(inspect_data(glass_config_data,'SlotMessage'));
            	/* 刻字 END */

                /*镜框尺寸*/
                $('#frame_size input').eq(0).val(inspect_data(glass_params_data,'FrameWidth'));
                $('#frame_size input').eq(1).val(inspect_data(glass_params_data,'LeftLegTurnLength'));
                $('#frame_size input').eq(2).val(inspect_data(glass_params_data,'RightLegTurnLength'));
                /*镜框尺寸 END*/

            	/* 验光参数 */
                $('.left_parameter input').eq(0).val(inspect_data(glass_collecteddata_data,'left_degrees'));
                $('.left_parameter input').eq(1).val(inspect_data(glass_collecteddata_data,'left_cyl'));
                $('.left_parameter input').eq(2).val(inspect_data(glass_collecteddata_data,'left_axis'));
                $('.right_parameter input').eq(0).val(inspect_data(glass_collecteddata_data,'right_degrees'));
                $('.right_parameter input').eq(1).val(inspect_data(glass_collecteddata_data,'right_cyl'));
                $('.right_parameter input').eq(2).val(inspect_data(glass_collecteddata_data,'right_axis'));
                $('.glass_pupil_dist input').val(inspect_data(glass_config_data,'PupilDistance')); 
            		        	        		        	
                // $('.glass_pupil_dist input').val(glass_data.pupil_dist);    
       			   

       			/* 眼镜的颜色 */ 
                if(!glass_config_data.FrameColor){
                    $('.glass-frame-color input').val('#282828');
                    $('button.frame-trigger').css('background','#282828');
                }else{
                    var tmp_material_color = glass_color(glass_config_data.FrameColor);
                    if(tmp_material_color == ''){
                        $('.glass-frame-color input').val('');
                        $('button.frame-trigger').css('background','');
                    }else{
                        $('.glass-frame-color input').val(rgb16han('#' + tmp_material_color));
                        $('button.frame-trigger').css('background','#'+tmp_material_color);
                    } 
                }

                if(!glass_config_data.LegColor)	{
                    $('.glass-leg-color input').val('#282828');
                    $('button.leg-trigger').css('background','#282828');
                }else{
                    var tmp_leg_color = glass_color(glass_config_data.LegColor);
                    if(tmp_leg_color == ''){
                        $('.glass-leg-color input').val('');
                        $('button.leg-trigger').css('background','');
                    }else{
                        $('.glass-leg-color input').val(rgb16han('#' + tmp_leg_color));
                        $('button.leg-trigger').css('background','#'+tmp_leg_color);
                    }
                }
       			      	
       			/* 眼镜的颜色 END */ 	
    									   		
       			/* 镜框的参数 */
                $('.picture_param label').eq(0).text(inspect_data(glass_config_data,'WidthScale')); 
                // $('.picture_param label').eq(1).text(inspect_data(glass_config_data,'HeightScale'));
                $('.picture_param label').eq(1).text(inspect_data(glass_config_data,'BridgeSpanRatio'));
       			
       			/* 镜框的参数 END*/

       			/* 眼镜的框镜型 */
                // if(!glass_config_data.LensProfileFile){                    
                // }else{
                //     var tmp_lensprofilefile = glass_config_data.LensProfileFile.slice(15,-8);
                //     if(tmp_lensprofilefile == 'rectangle-s'){
                //         tmp_lensprofilefile = 'MFA717';
                //     }
                //     if(tmp_lensprofilefile == 'ellipse'){
                //         tmp_lensprofilefile = 'MFA101';
                //     }
                //     if(tmp_lensprofilefile == 'catseye'){
                //         tmp_lensprofilefile = 'MFA555';
                //     }
                //     if(tmp_lensprofilefile == 'circle'){
                //         tmp_lensprofilefile = 'MFA000';
                //     }
                //     // console.log(jQuery.type(glass_data.LensProfileFile))
                //     // console.log(glass_data.LensProfileFile.slice(15,-8))
                //     $('.glass-frame span').text(tmp_lensprofilefile)
                //     $('.glass-frame img').attr('src','images/information/kuang/'+tmp_lensprofilefile+'.png')
                // }

                if(!glass_config_data.LensProfileFile){
                    
                }else{
                    var tmp_lensprofilefile = glass_config_data.LensProfileFile.slice(15,-8);
                    if(tmp_lensprofilefile == 'rectangle-s'){
                        tmp_lensprofilefile = 'MFA717';
                    }
                    if(tmp_lensprofilefile == 'ellipse'){
                        tmp_lensprofilefile = 'MFA101';
                    }
                    if(tmp_lensprofilefile == 'catseye'){
                        tmp_lensprofilefile = 'MFA555';
                    }
                    if(tmp_lensprofilefile == 'circle'){
                        tmp_lensprofilefile = 'MFA000';
                    }
                    // console.log(jQuery.type(glass_data.LensProfileFile))
                    // console.log(glass_data.LensProfileFile.slice(15,-8))
                    $('.glass-frame span').text(tmp_lensprofilefile);
                    if(tmp_lensprofilefile.slice(0,2) === 'KM'){
                        $('.glass-frame>div').removeClass('glass_div');
                        $('.glass-frame>div').append('<img src="images/information/kuang/' +tmp_lensprofilefile+ '.png">')
                        $('.glass-frame img').css('width','192px');
                        $('.glass-frame img').css({'width':'192px','float':'right'});
                    }else if(tmp_lensprofilefile.length === 3){
                        $('.glass-frame>div').html('');
                        $('.glass-frame>div').addClass('glass_div');
                        $('.glass-frame>div').append('<img src="images/information/frame18-2.png">');

                        var margin_top;
                        var margin_left;

                        switch(tmp_lensprofilefile)
                        {
                        case 'fkx':
                          margin_top = '0px';
                          margin_left = '2px';
                          break;
                        case 'fks':
                          margin_top = '0px';
                          margin_left = '-130px';
                          break; 
                        case 'fkm':
                          margin_top = '0px';
                          margin_left = '-264px';
                          break;
                        case 'fkl':
                          margin_top = '-75px';
                          margin_left = '3px';
                          break;
                        case 'fkh':
                          margin_top = '-75px';
                          margin_left = '-130px';
                          break;
                        case 'yxm':
                          margin_top = '-75px';
                          margin_left = '-264px';
                          break;
                        case 'fxs':
                          margin_top = '-155px';
                          margin_left = '2px';
                          break; 
                        case 'fxm':
                          margin_top = '-155px';
                          margin_left = '-130px';
                          break;
                        case 'fxl':
                          margin_top = '-155px';
                          margin_left = '-264px';
                          break;
                        case 'myx':
                          margin_top = '-230px';
                          margin_left = '2px';
                          break;
                        case 'mys':
                          margin_top = '-230px';
                          margin_left = '-130px';
                          break;
                        case 'mym':
                          margin_top = '-230px';
                          margin_left = '-264px';
                          break;
                        case 'myl':
                          margin_top = '-305px';
                          margin_left = '2px';
                          break;
                        case 'myh':
                          margin_top = '-305px';
                          margin_left = '-130px';
                          break;
                        case 'tys':
                          margin_top = '-305px';
                          margin_left = '-264px';
                          break;
                        case 'tym':
                          margin_top = '-382px';
                          margin_left = '2px';
                          break;
                        case 'tyl':
                          margin_top = '-382px';
                          margin_left = '-130px';
                          break;
                        case 'tyh':
                          margin_top = '-382px';
                          margin_left = '-264px';
                          break;
                        case 'tmm':
                          margin_top = '-460px';
                          margin_left = '2px';
                          break;
                        case 'tml':
                          margin_top = '-460px';
                          margin_left = '-130px';
                          break;
                        // default:
                        
                        }

                        $('.glass-frame img').css({'margin-top':margin_top,'margin-left':margin_left});


                    }else{
                        $('.glass-frame>div').html('');
                        $('.glass-frame>div').addClass('glass_div');
                        $('.glass-frame>div').append('<img src="images/information/frame18-1.png">');

                        var margin_top;
                        var margin_left;

                        switch(tmp_lensprofilefile)
                        {
                        case 'kk7507':
                          margin_top = '-34px';
                          margin_left = '2px';
                          break;
                        case 'ba75':
                          margin_top = '-34px';
                          margin_left = '-130px';
                          break; 
                        case 'tj2001':
                          margin_top = '-34px';
                          margin_left = '-264px';
                          break;
                        case 'by82':
                          margin_top = '-166px';
                          margin_left = '3px';
                          break;
                        case 'mt7875':
                          margin_top = '-166px';
                          margin_left = '-130px';
                          break;
                        case 'dm20':
                          margin_top = '-166px';
                          margin_left = '-264px';
                          break;
                        case 'sm18':
                          margin_top = '-298px';
                          margin_left = '2px';
                          break; 
                        case 'if20':
                          margin_top = '-298px';
                          margin_left = '-130px';
                          break;
                        case 'tg5500':
                          margin_top = '-298px';
                          margin_left = '-264px';
                          break;
                        case 'bl7507':
                          margin_top = '-431px';
                          margin_left = '2px';
                          break;
                        case 'dp4500':
                          margin_top = '-431px';
                          margin_left = '-130px';
                          break;
                        case 'pe6075':
                          margin_top = '-431px';
                          margin_left = '-264px';
                          break;
                        case 'ps4500':
                          margin_top = '-558px';
                          margin_left = '2px';
                          break;
                        case 'im9509':
                          margin_top = '-558px';
                          margin_left = '-130px';
                          break;
                        case 'lo8011':
                          margin_top = '-558px';
                          margin_left = '-264px';
                          break;
                        case 's419':
                          margin_top = '-690px';
                          margin_left = '2px';
                          break;
                        // default:
                        
                        }

                        $('.glass-frame img').css({'margin-top':margin_top,'margin-left':margin_left});
                    }
                                        
                }
                /* 眼镜的框镜型 END */

                /* 眼镜的腿镜型 */
                if(!glass_config_data.LegProfile){
                    $('.glass-leg span').text('c3');
                    $('.glass-leg img').attr('src','images/information/tui/c3.png');
                }else{
                    $('.glass-leg span').text(glass_config_data.LegProfile);
                    $('.glass-leg img').attr('src','images/information/tui/'+glass_config_data.LegProfile+'.png');
                }
                /* 眼镜的腿镜型 END */
       			
        	}	


            // 价格
            var tmp_price = all_deal_data[deal_uuid] ? all_deal_data[deal_uuid].price : " ";
            var tmp_discount = all_deal_data[deal_uuid] ? all_deal_data[deal_uuid].discount : " ";
            $('#glass_price').val(tmp_price)
            $('#glass_discount').val(tmp_discount)


           

            /* 照片 */
            if(!all_deal_data[deal_uuid]){
            }else if(!all_deal_data[deal_uuid].owneruuid){
            }else if(!all_order_data[all_deal_data[deal_uuid].owneruuid]){
            }else{               
                var scanphoto_uuid = all_order_data[all_deal_data[deal_uuid].owneruuid].scanphoto;      
                if(scanphoto_uuid != ''){        
                    $('.user_photo>img').attr('src','/data?action=download&type=scanphoto&uuid='+scanphoto_uuid)
                    $('.user_photo>img').css({'top':'-20px','left':'-140px'});
                }else{
                    $('.user_photo>img').attr('src','images/touxiang.png');
                }
            }
            /* 照片 END */







        	// var deal_list;
    		// var all_deal_data;
    		// var all_order_data;

    	    /* 信息修改提交 */
            $('#username,#phone,#email').focus(function(){
                // $(this).css('color','#000');
                $(this).removeClass('color888')
                    .addClass('color000');
                // $(this).next().text('');
                $(this).parents('span').next().text('');
                // $('.username_error,.phone_error,.email_error').text('');
            })
            $('#username').blur(function(){
                if(!username){
                }else if($('#username').val() == ''){
                    $('.username_error').text('用户名不能为空');
                    $('#username').val(username);
                    $('#username').removeClass('color000')
                        .addClass('color888');
                }
            })
            $('#phone').blur(function(){
                if(!phone){
                }else if($('#phone').val() == ''){
                    $('.phone_error').text('手机号不能为空');
                    $('#phone').val(phone);
                    $('#phone').removeClass('color000')
                        .addClass('color888');
                }
            })
            $('#email').blur(function(){
                if(!email){
                }else if($('#email').val() == ''){
                    $('.email_error').text('邮箱不能为空');
                    $('#email').val(email);
                    $('#email').removeClass('color000')
                        .addClass('color888');
                }
            })

            $('.frame_lettering input').focus(function(){
                $(this).next().text('');
            })

            $('.frame_lettering input').blur(function(){
                if($(this).val() == ''){
                    $(this).next().text('不能为空');
                    $(this).next().addClass('colorFC4E63');
                }else{
                    $(this).val($(this).val().toLocaleUpperCase());
                }
            })


            $('.leg_lettering input').blur(function(){
                if($('.leg_lettering input').eq(0).val() == '' && $('.leg_lettering input').eq(1).val() == '' && $('.leg_lettering input').eq(2).val() == '') {
                    $('.error_leg_lettering').addClass('colorFC4E63');
                    $('.error_leg_lettering').text('字符最少一个');
                }else{
                   $(this).val($(this).val().toLocaleUpperCase());
                }           
            })

            $('.leg_lettering input').focus(function(){
                $('.error_leg_lettering').text('');
            })



            $('.glass_pupil_dist input').focus(function(){
                $('.glass_pupil_dist label').text('');
            })

            $('.glass_pupil_dist input').blur(function(){
                if($(this).val() == ''){
                    $('.glass_pupil_dist label').text('瞳距不能为空');
                }
            })

            /* 中文姓名的判断 */
            // $('#user_realname').blur(function(){
            //     var patt1=/^[\u4E00-\u9FA5]+$/;
            //     if($(this).val() == ''){
            //         $('#user_realname_error').text('中文名字不能为空');
            //     }else if(!patt1.test($(this).val())){
            //         $('#user_realname_error').text('中文名字格式错误');
            //     }
            // })

            // $('#user_realname').focus(function(){
            //     $('#user_realname_error').text('');
            // })

        }
    });   
    		
	/* 信息修改提交 */
	$('#submit_preserve,#submit_order').click(function(){
        $('.font-p span').text('');
    	// $('#phone').val(all_order_data[all_deal_data[deal_uuid].owneruuid].pinfo.phone);
  		// $('#email').val(all_order_data[all_deal_data[deal_uuid].owneruuid].pinfo.email);
  		// $('#username').val(all_order_data[all_deal_data[deal_uuid].owneruuid].pinfo.username);
         

        /* 判断用户的登陆状态 */              
        var new_user_params = {
            'action':'login',
            'username': username,
            'password': '*',                        
            // 'password': username,                        
        }
        if(phone != ''){
            new_user_params['phone'] = phone;
        }else{
            new_user_params['email'] = email;
        }
        $.ajax({
            type: "POST",
            url: "/user",
            data: new_user_params,
            success: function(data){
                if($.type(data) == 'string'){
                    user_data = JSON.parse(data)
                    if( user_data['result'] == "true"){
                        
                        modify_username();
                    }
                }
                
            },
            error:function(er){     
                console.log('login user');
                console.log(er)                 
            }

        })

        function modify_username(){
            var old_username = username;
            var old_phone = phone;
            var old_email = email;
            if($('.username_error').text() === '' && $('.phone_error').text() === '' && $('.email_error').text() === ''){
                if( $('#username').val() != old_username || $('#phone').val() != old_phone ||
                    $('#email').val() != old_email || $('#user_realname').val() !== ''){
                    var new_username = {
                        'action' : 'update',
                        'uuid' : user_data.uuid,
                    }
                    
                    if($('#username').val() != ''){
                        new_username['username'] = $('#username').val();
                    }
                    if($('#phone').val() != ''){ 
                        new_username['phone'] = $('#phone').val();
                    }
                    if($('#email').val() != ''){
                        new_username['email'] = $('#email').val();
                    }
                    if($('#user_realname').val() != ''){
                        new_username['realname'] =  $('#user_realname').val();
                    }
                    $.ajax({
                        type: "POST",
                        url: "/user",
                        data: new_username,
                        success: function(e){
                            
                            if(JSON.parse(e).errorno == 'E01130'){
                                $('#email').addClass('borderColorFC4E63'); 
                                $('.email_error').text('邮箱的格式错误');
                                // $('#phone').css('borderColor','#ADADAD'); 
                                $('.phone_error,.username_error').text(''); 
                                $('body,html').animate({scrollTop:100},100); 
                            }else if(JSON.parse(e).errorno == 'E01120'){
                                // $('#phone').css('borderColor','#FC4E63'); 
                                $('.phone_error').text('手机号的格式错误'); 
                                // $('#email').css('borderColor','#ADADAD'); 
                                $('.email_error,.username_error').text('');
                                $('body,html').animate({scrollTop:100},100);  
                            }else{

                                if($('#username').val() != ''){
                                    all_order_data[all_deal_data[deal_uuid].owneruuid].pinfo.username = $('#username').val();
                                }
                                if($('#phone').val() != ''){
                                    all_order_data[all_deal_data[deal_uuid].owneruuid].pinfo.phone = $('#phone').val();
                                }
                                if($('#email').val() != ''){
                                    all_order_data[all_deal_data[deal_uuid].owneruuid].pinfo.email = $('#email').val();
                                }
                                table.clear()
                                    .draw();
                                struture_data_insertion();

                                $('.data_success').css('display','block');
                                $('.data_success p').text('修改成功'); 
                                // $('#phone,#email').css('borderColor','#ADADAD'); 
                                $('.phone_error,.email_error,.username_error').text('');
                                /* 取消保存成功之后的显示 */
                                setTimeout(function(){
                                    $('.data_success').css('display','none');
                                },3000)
                            }                       

                        },
                        error:function(er){ 
                            console.log('update user');
                            console.log(er);
                            $('.data_error').css('display','block');
                            setTimeout(function(){
                                $('.data_error').css('display','none');
                            },3000)                     
                        }
                    })
                }
            }
        }
		


        /* 镜框的参数 */
        // $('.picture_param input').eq(0).val(glass_config_data.WidthScale); 
        // $('.picture_param input').eq(1).val(glass_config_data.HeightScale);
        // $('.picture_param input').eq(2).val(glass_config_data.BridgeSpanRatio);
        /* 镜框的参数 END*/
        // var new_WidthScale = $('.picture_param input').eq(0).val();
        // var new_HeightScale = $('.picture_param input').eq(1).val();
        // var new_BridgeSpanRatio = $('.picture_param input').eq(2).val();
        // if(new_WidthScale != '' && new_HeightScale != '' && new_BridgeSpanRatio != ''){
        //    if(!glass_config_data.WidthScale != new_WidthScale || glass_config_data.HeightScale != 
        //              new_HeightScale || glass_config_data.BridgeSpanRatio != new_BridgeSpanRatio){
        //         all_deal_data[deal_uuid].config_literal.WidthScale = $('.picture_param input').eq(0).val();
        //         all_deal_data[deal_uuid].config_literal.HeightScale = $('.picture_param input').eq(1).val();
        //         all_deal_data[deal_uuid].config_literal.BridgeSpanRatio = $('.picture_param input').eq(2).val();
        //         alter_config(all_deal_data[deal_uuid].config_literal);
        //     } 
        // }else{
                // $('.font-p span').text('验光参数与镜框参数的所有数据不能为空');
        // }
                   

        /* 刻字 */
        // glass_data.SlotMessage[0]
        // glass_data.SlotMessage[2]
        // glass_data.LegMessage[0]
        // glass_data.LegMessage[1]
        // glass_data.LegMessage[2]                          
        // var new_LegMessage = $('.leg_lettering input').eq(0).val()+$('.leg_lettering input').eq(1).val()+$('.leg_lettering input').eq(2).val();
        // // console.log(glass_config_data.SlotMessage)
        // if(!glass_config_data.SlotMessage && !glass_config_data.LegMessage){
        // }else if($('.frame_lettering input').eq(0).val() !== '' && $('.frame_lettering input').eq(1).val() !== '' && $('.error_leg_lettering').text() === ''){

        //     var new_SlotMessage = $('.frame_lettering input').eq(0).val() + glass_config_data.SlotMessage[1] + 
        //                           $('.frame_lettering input').eq(1).val() + glass_config_data.SlotMessage[3];
        //     if(new_SlotMessage != glass_config_data.SlotMessage || new_LegMessage != glass_config_data.LegMessage){
        //         all_deal_data[deal_uuid].config_literal.SlotMessage = new_SlotMessage;
        //         all_deal_data[deal_uuid].config_literal.LegMessage = new_LegMessage;
        //     }
        // }

        if(!glass_config_data.SlotMessage){
        }else if($('.frame_lettering input').val() !== '' && $('.frame_lettering input').val() !== glass_config_data.SlotMessage){
            all_deal_data[deal_uuid].config_literal.SlotMessage = $('.frame_lettering input').val();
        }
        /* 瞳距的修改 */
        // $('.glass_pupil_dist input').val(glass_config_data.PupilDistance); 
        if(!glass_config_data.PupilDistance && $('.glass_pupil_dist input').val() != ''){
            all_deal_data[deal_uuid].config_literal.PupilDistance = $('.glass_pupil_dist input').val();
        }else if($('.glass_pupil_dist input').val() != glass_config_data.PupilDistance){
            all_deal_data[deal_uuid].config_literal.PupilDistance = $('.glass_pupil_dist input').val();
        }

        /* 眼镜的颜色 */     
        // var tmp_material_color = glass_color(glass_config_data.FrameColor)
        // var tmp_leg_color = glass_color(glass_config_data.LegColor)
            // console.log($('.glass-frame-color input').val());
            // console.log($('.glass-leg-color input').val());

            

        if($('.glass-frame-color input').val() != ''){
            var tmp_frame_color_ = $('.glass-frame-color input').val();
            var tmp_frame_color = detection_chinese(tmp_frame_color_)?rgbhan16(tmp_frame_color_):tmp_frame_color_;
            var tmp_frame_color_new = tmp_frame_color.slice(5,7) + tmp_frame_color.slice(3,5) + tmp_frame_color.slice(1,3);
            if(!glass_config_data.FrameColor){
                all_deal_data[deal_uuid].config_literal.FrameColor = '0xff' + tmp_frame_color_new;
            }else if(tmp_frame_color_new != glass_config_data.FrameColor){
                all_deal_data[deal_uuid].config_literal.FrameColor = '0xff' + tmp_frame_color_new;
            }
        }

        
        if($('.glass-leg-color input').val() != ''){
            var tmp_leg_color_ = $('.glass-leg-color input').val();
            var tmp_leg_color = detection_chinese(tmp_leg_color_)?rgbhan16(tmp_leg_color_):tmp_leg_color_;
            var tmp_leg_color_new = tmp_leg_color.slice(5,7) + tmp_leg_color.slice(3,5) + tmp_leg_color.slice(1,3);
            if(!glass_config_data.LegColor){
                all_deal_data[deal_uuid].config_literal.LegColor = '0xff' + tmp_leg_color_new;
            }else if(tmp_leg_color_new != glass_config_data.LegColor){
                all_deal_data[deal_uuid].config_literal.LegColor = '0xff' + tmp_leg_color_new;
                // alter_config(JSON.stringify(all_deal_data[deal_uuid].config_literal));
            }
        }   

        var tmp_new_price={};
        if($('#glass_price').val() != '' && $('#glass_price').val() != 0){
            if(all_deal_data[deal_uuid].price != $('#glass_price').val()){
                tmp_new_price['price'] = $('#glass_price').val();
                // tmp_new_price['price'] = '';
            }
        }

        if($('#glass_discount').val() != '' && $('#glass_discount').val() != 0){
            if(all_deal_data[deal_uuid].discount != $('#glass_discount').val()){
                tmp_new_price['discount'] = $('#glass_discount').val();
            }
        }

        if(Object.keys(tmp_new_price).length != 0){
            alter_config(tmp_new_price);
        }
        if(Object.keys(tmp_old_config_literal).length == Object.keys(all_deal_data[deal_uuid].config_literal).length){
            for(var i in tmp_old_config_literal){
                if(tmp_old_config_literal[i] != all_deal_data[deal_uuid].config_literal[i]){
                    // console.log(all_deal_data[deal_uuid].config_literal)
                    // alter_config(all_deal_data[deal_uuid].config_literal);
                    alter_config(JSON.stringify(all_deal_data[deal_uuid].config_literal));
                    break;
                }
            }
        }else{
            // console.log(all_deal_data[deal_uuid].config_literal)
            alter_config(JSON.stringify(all_deal_data[deal_uuid].config_literal)); 
            // alter_config(all_deal_data[deal_uuid].config_literal); 
        }


        
        function alter_config(config_literal_){             
            var new_deal_data = {
                'action' : 'update',
                'uuid' : deal_uuid,
            }
            if($.type(config_literal_)  === 'string'){
                new_deal_data['config_literal'] = config_literal_;
            }
            if(inspect_data(config_literal_,'price') !== ''){
                new_deal_data.price =config_literal_.price;
            }
            if(inspect_data(config_literal_,'discount') !== ''){
                new_deal_data.discount = config_literal_.discount;
            }

            $.ajax({
                type: "POST",
                url: "/deal",
                data: new_deal_data,
                success: function(e){
                    if(JSON.parse(e).result == 'true'  || e.result == 'true'){
                        all_deal_data[deal_uuid].discount = $('#glass_discount').val();
                        all_deal_data[deal_uuid].price = $('#glass_price').val()

                        // 保存成功之后执行
                        save_success();
                    }
                                         
                },
                error:function(){
                    $('.data_error').css('display','block');
                    setTimeout(function(){
                        $('.data_error').css('display','none');
                    },3000) 
                }
            })
        } 

        /* 验光参数的修改 */
        // var tmp_collecteddata_input = [];

        var new_collecteddata = {};
        new_collecteddata.left_axis = $('.left_parameter input').eq(2).val();
        new_collecteddata.left_cyl = $('.left_parameter input').eq(1).val();                    
        new_collecteddata.left_degrees = $('.left_parameter input').eq(0).val();
        new_collecteddata.right_degrees = $('.right_parameter input').eq(0).val();
        new_collecteddata.right_cyl = $('.right_parameter input').eq(1).val();
        new_collecteddata.right_axis = $('.right_parameter input').eq(2).val();
        // new_collecteddata.PupilDistance = $('.glass_pupil_dist input').val();
        if(!all_deal_data[deal_uuid]){
        }else if(!all_order_data[all_deal_data[deal_uuid].owneruuid]){
        }else if(!all_order_data[all_deal_data[deal_uuid].owneruuid].collecteddata){                    
        }else{
            // var old_collecteddata = jQuery.parseJSON(all_order_data[all_deal_data[deal_uuid].owneruuid].collecteddata);
            var old_collecteddata = all_order_data[all_deal_data[deal_uuid].owneruuid].collecteddata;
        }   

        if(jQuery.isEmptyObject(old_collecteddata)){
            for(var i in new_collecteddata){
                if(new_collecteddata[i] != ''){ 
                    alter_collecteddata();
                    break;
                }
            }               
        }else{
            for(var i in new_collecteddata){
                // tmp_collecteddata_input.push(new_collecteddata);
                if(new_collecteddata[i] != '' && new_collecteddata[i] != old_collecteddata[i]){
                    alter_collecteddata();
                    break;
                }
            }
        }

        function alter_collecteddata(){   
            var new_order_data = {
                'action' : 'update',
                'uuid' : all_deal_data[deal_uuid].owneruuid,
                'collecteddata':JSON.stringify(new_collecteddata),
            }
            $.ajax({
                type: "POST",
                url: "/order",
                data: new_order_data,
                success: function(e){
                    if(JSON.parse(e).result == 'true'){
                        // all_order_data[all_deal_data[deal_uuid].owneruuid].collecteddata = JSON.stringify(new_collecteddata);
                        all_order_data[all_deal_data[deal_uuid].owneruuid].collecteddata = new_collecteddata;  
                        // 保存成功执行
                        save_success();    
                    }                       
                },

                error:function(){
                    $('.data_error').css('display','block');
                    setTimeout(function(){
                        $('.data_error').css('display','none');
                    },3000) 
                }
            })
        }



        function save_success(){
            $('.data_success').css('display','block'); 
            $('.data_success p').text('修改成功'); 

            /* 取消保存成功之后的显示 */
            setTimeout(function(){
                $('.data_success').css('display','none');
            },3000)  
        }

    })


    /*提交订单*/
    $('#submit_order').click(function(){
        if (all_deal_data[deal_uuid].paymentstatus == 'topay' && $('.glass_pupil_dist input').val() != '') { 
            $('#payment').css('display','block');
            $('.masking').css({'display':'block'});
            // $('.masking').css({'backgroundColor':'rgba(0,0,0,0.8)','display':'block'});
            $('.masking').addClass('bgColorgba');
        }else{
            $('.glass_pupil_dist label').text('瞳距不能为空');
        }
           
    });


    $('#payment .confirm').click(function(){
        $('#payment').css('display','none');
        $('.masking').removeClass('bgColorgba');
        $('.masking').css({'display':'none'});
        var new_deal_data = {
            'action' : 'update',
            'uuid' : deal_uuid,
            'paymentstatus' : 'paid',
        }

        $.ajax({
            type: "POST",
            url: "/deal",
            data: new_deal_data,
            success: function(e){
                if(JSON.parse(e).result == 'true'){
                    all_deal_data[deal_uuid].paymentstatus = 'paid';
                    table.clear()
                        .draw();
                    struture_data_insertion(); 
                    $('.glass_pupil_dist label').text('');
                    $('#submit_order,#submit_preserve').fadeOut(0);     
                    $('.data_success').css('display','block');                       
                    $('.data_success p').text('订单提交成功'); 

                    /* 取消提交成功之后的显示 */
                    setTimeout(function(){
                        $('.data_success').css('display','none');
                    },3000)  
                }                                    
            },
            error:function(){
                $('.data_error').css('display','block');
                setTimeout(function(){
                    $('.data_error').css('display','none');
                },3000) 
            }
        })  
    })

    $('#payment .countermand').click(function(){
        $('#payment').css('display','none');
        $('.masking').css({'display':'none'});
        $('.masking').removeClass('bgColorgba');
    })

    /* 点击取消按钮的返回列表页 */
    $('#cancel,.cancel-table>span').click(function(){
        $(".top-seek input").removeAttr("disabled");
        $('.cancel-table').css('display','none');
        $('.message .data-table').css('display','block'); 
        // $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust().draw();
        $('.data_success').css('display','none'); 
        $('.data_error').css('display','none');

        $('#phone,#email,#username').removeClass('color888')
                .addClass('borderColorADADAD color000'); 
        $('.phone_error,.email_error,.username_error').text('');

        $('.user_photo>img').css({'top':'0','left':'0'});

        $('.order_data').css('display','block');
        $('.timezone').show(0);

        $('#dropdown_list_year,#dropdown_list_month').val('');
        $('.font-p span').text('');
        $('.glass_pupil_dist label').text('');

        $('.error_leg_lettering').text('');
        $('.frame_lettering input').next().text('');
        table.page(page_td).draw( false );

        // 用户名区域隐藏
        // $('#user_information').html('');
        $('.username,.phone,.email').html('');

        $('#user_realname_error').text('');
          
        // 返回商家系统按钮隐藏
        $('#return_index').hide();
    })
			
    /* 眼镜的颜色 */
    function glass_color(color){
        var tmp_material = '';
        if(color != undefined && color.slice(0,4) == "0xff"){
            tmp_material = color.slice(8,10) + color.slice(6,8) + color.slice(4,6);
        }else{
            tmp_material = '';
        }
        return tmp_material;
    }				
	/* 眼镜的颜色 END*/	                   


    $('.order_data button').click(function(){
        // $(this).css("background","#1FB3F0").siblings().css("background","");
        $(this).addClass("bgColor1FB3F0").siblings().removeClass("bgColor1FB3F0");
        $(this).attr('index','active').siblings().attr('index','');
    })
    

    /*
     * 打印小票
    */
    $('#table_id_example tbody').on('click','#print_receipts',function(){
        $('.top').hide();
        $('.content').hide();
        $('body').addClass('width215');
        $('.shopping_receipts').show();
        $('#return_index').show();


        /* 
         * 返回商家系统
         */
        $('#return_index').click(function(){
            $(this).hide();
            $('.top').show();
            $('.content').show();
            $('body').removeClass('width215');
            $('.shopping_receipts').hide();
            
        })

        // console.log(deal_list)
        // console.log(all_deal_data)
        // console.log(all_order_data)
        /*
         * 小票插入数据
         */
        var shopping_deal_uuid =($(this).attr("alternews")).slice(0,($(this).attr("alternews")).length-1);
        if(all_deal_data[shopping_deal_uuid].createdate != ''){

            var tmp_shopping_data = new Date(all_deal_data[shopping_deal_uuid].createdate);
            var tmp_shopping_year = tmp_shopping_data.getFullYear().toString();
            var tmp_shopping_month = estimate_time(tmp_shopping_data.getMonth()).toString();
            var tmp_shopping_date = estimate_time(tmp_shopping_data.getDate()).toString();
            var tmp_shopping_hours = estimate_time(tmp_shopping_data.getHours()).toString();
            var tmp_shopping_minutes = estimate_time(tmp_shopping_data.getMinutes());

            var tmp_encoding = tmp_shopping_year+tmp_shopping_month+tmp_shopping_date+
                           shopping_deal_uuid.slice(shopping_deal_uuid.length-6,shopping_deal_uuid.length);

            // 编号
            $('#encoding span').text(tmp_encoding.toUpperCase());

            // 日期
            $('#shopping_data span').text(tmp_shopping_year + tmp_shopping_month + tmp_shopping_date);

            // 时间
            $('#shopping_time span').text(tmp_shopping_hours +':' + tmp_shopping_minutes);

        }else{
            // 编号
            $('#encoding span').text('');

            // 日期
            $('#shopping_data span').text('');

            // 时间
            $('#shopping_time span').text('');
        }


        //姓名、联系方式
        if(!all_deal_data[shopping_deal_uuid]){                
        }else if(!all_deal_data[shopping_deal_uuid].owneruuid){                    
        }else if(!all_order_data[all_deal_data[shopping_deal_uuid].owneruuid]){              
        }else if(!all_order_data[all_deal_data[shopping_deal_uuid].owneruuid].pinfo){        
        }else{
            var shopping_phone = all_order_data[all_deal_data[shopping_deal_uuid].owneruuid].pinfo.phone;
            var shopping_email = all_order_data[all_deal_data[shopping_deal_uuid].owneruuid].pinfo.email;

            var tmp_shopping_phone = shopping_phone.slice(0,3) + "****" + shopping_phone.slice(7,11);
            $('#shopping_phone span').text(tmp_shopping_phone);

            var shopping_username = all_order_data[all_deal_data[shopping_deal_uuid].owneruuid].pinfo.username;
            var tmp_shopping_username = '';
            var patt2=/^[\u4E00-\u9FA5]+$/;
            if(!patt2.test(shopping_username)){
                tmp_shopping_username = shopping_username.slice(0,3) + "*****" + 
                                        shopping_username.slice(shopping_username.length-3,shopping_username.length);
            }else{
                tmp_shopping_username = shopping_username.substring(0,1) + '*';
            }
            
            $('#shopping_username span').text(tmp_shopping_username);
        }
  
        // 商品名称
        var shoppingconfig_uuid = all_deal_data[shopping_deal_uuid] ? all_deal_data[shopping_deal_uuid].config : "";
        load_shoppingconfig_data(); 
        function load_shoppingconfig_data(){
            var post_data = {
                'action' : 'download',
                'type' : 'config',
            };
            if(shoppingconfig_uuid != ''){
                post_data['uuid'] = shoppingconfig_uuid;
            }
            $.ajax({

                type: 'post',
                data: post_data,
                // dataType: 'text',
                url: "/data",
                success:function(dt){
                    if(dt.result != 'false' && dt != ''){
                        var config_in_json = Config2Json(dt);
                        /* 眼镜的框镜型 */
                        if(!config_in_json.LensProfileFile){
                            $('#commodity_name li').eq(2).text('');
                        }else{
                            var tmp_commodity_name = config_in_json.LensProfileFile.slice(15,-8);
                            if(tmp_commodity_name == 'rectangle-s'){
                                tmp_commodity_name = 'MFA717';
                            }
                            if(tmp_commodity_name == 'ellipse'){
                                tmp_commodity_name = 'MFA101';
                            }
                            if(tmp_commodity_name == 'catseye'){
                                tmp_commodity_name = 'MFA555';
                            }
                            if(tmp_commodity_name == 'circle'){
                                tmp_commodity_name = 'MFA000';
                            }

                            $('#commodity_name li').eq(2).text(tmp_commodity_name);
                        }
                    }              
                },
                error: function(){
                }
            })              
        }

        // 金额
        var tmp_commodity_price = all_deal_data[shopping_deal_uuid] ? all_deal_data[shopping_deal_uuid].price : "";
        $('#commodity_price li').eq(1).text('￥' + tmp_commodity_price);

        // 总折扣
        var tmp_shopping_discount = inspect_data(all_deal_data[shopping_deal_uuid],'discount');

        // 总金额     
        if (tmp_shopping_discount !== '' || tmp_shopping_discount != 0) {
            var tmp_shopping_amount = (tmp_commodity_price*tmp_shopping_discount).toFixed(2);
            $('#shopping_amount span').text('￥' + tmp_shopping_amount);
        }else{
            $('#shopping_amount span').text('￥' + tmp_commodity_price);
        }

        // 总折扣
        if($.type(tmp_shopping_discount) == 'number'){
            tmp_shopping_discount = tmp_shopping_discount.toString(10);
        }
        if(tmp_shopping_discount == '' || tmp_shopping_discount == '1' || tmp_shopping_discount == '0'){
            $('#shopping_discount span').text('0');
        }else{
            $('#shopping_discount span').text(tmp_shopping_discount.slice(2,tmp_shopping_discount.length)+' 折');
        }

        /* 判断用户的登陆状态 */              
        var user_params = {
            'action':'login',
            'username': shopping_username,
            'password': '*',                        
            // 'password': shopping_username,                        
        }
        if(shopping_phone != ''){
            user_params['phone'] = shopping_phone;
        }else{
            user_params['email'] = shopping_email;
        }

        $.ajax({
            type: "POST",
            url: "/user",
            data: user_params,
            success: function(data){
                if($.type(data) == 'string'){
                    var user_data = JSON.parse(data)
                    if( user_data['result'] != 'true'){
                        var tmp_phone = '';
                        if(shopping_phone != ''){
                            tmp_phone = shopping_phone;
                        }else{
                            tmp_phone = shopping_email;
                        }

                        var login_url =document.URL.slice(0,document.URL.lastIndexOf('/')) + "/login.html?" + tmp_phone + shopping_username;
                        console.log(login_url)
                        $('#qrcode').empty(); 
                        $('#qrcode').qrcode({
                            width: 180,
                            height:180,
                            text: login_url
                        });
                    }else{
                        setCookie("uuid",user_data.uuid,7);
                        var personaldata_url= document.URL.slice(0,document.URL.lastIndexOf('/')) + "/personaldata.html?uuid="+user_data.uuid;

                        //字符串压缩处理
                        // var binaryString = pako.deflate(JSON.stringify(personaldata_url), { to: 'string' });

                        $('#qrcode').empty();
                        $('#qrcode').qrcode({
                            width: 180,
                            height:180,
                            text: personaldata_url
                        });

                        load_username(user_data.uuid)
                    }
                }
                
            },
            error:function(){                           
            }

        })
        /* 判断用户的登陆状态 END*/
        

        function load_username(tmpuuid){
            var user_params = {
                'action':'query',
                'uuid' : tmpuuid,
                'realname': '',                       
            }
            $.ajax({
                type: "POST",
                url: "/user",
                data: user_params,
                success: function(data){
                    if($.type(data) == 'string'){
                        user_data = JSON.parse(data)
                        if( user_data['result'] == "true"){  
                            if(user_data.realname != ''){
                                var tmp_shopping_username = user_data.realname.substring(0,1) + '*';
                                $('#shopping_username span').text(tmp_shopping_username);     
                            }else{
                            }
                                                
                        }
                    }
                    
                },
                error:function(){                           
                }

            })
        }


        $(document).mousedown(function(e){
            if(3 == e.which){
                // 这是鼠标右键单击事件
                $('#return_index').hide();
          
            }else if(1 == e.which){

                // 这是鼠标左键单击事件
                $('#return_index').show();
       
            }
        })

        
    })
})

