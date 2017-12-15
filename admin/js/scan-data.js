$(function(){

    // 引入顶部
    $('.top').nav();
    $('.nav-left').left();

    // 给当前的导航加上颜色   
    $('#scan a').addClass('active');     

    // 分页插件
    var table = $('#table_id_example').DataTable({
        "columnDefs": [ 
            {
                "targets": [7],
                "visible": false,
                "searchable": true,
            },
        ],
        "bPaginate": true,  // 允许表格分页
        'bLengthChange' : false,  //允许改变每页显示的数据条数
        "bScrollCollapse" : true, //是否开启DataTables的高度自适应，当数据条数不够分页数据条数的时候，插件高度是否随数据条数而改变  
        "bAutoWidth": true,//关闭后，表格将不会自动计算表格大小，在浏览器大化小化的时候会挤在一坨
        "pagingType": "full_numbers", //分页样式
        "iDisplayLength" : 12, //默认显示的记录数  
        "bInfo" : false, //是否显示页脚信息，DataTables插件左下角显示记录数 
        "bProcessing": true, //开启读取服务器数据时显示正在加载中 
        "bSort": false, //开启排序功能，每一列都有排序功能，如果关闭了，排序功能将失效，
        // "bStateSave" : true, //是否打开客户端状态记录功能,此功能在ajax刷新纪录的时候不会将个性化设定回复为初始化状态
        "scrollX": true, 
        "oLanguage": {//国际语言转化
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
            null,
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
        setTimeout( top_input_settime,300)
                  
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
                 console.log(JSON.parse(data));
                var data=JSON.parse(data);
                    data=data.left;
               var date_days=data.substring(0, data.indexOf('days'));
               console.log(date_days)
                if(date_days<=14){
                    $("#remind").css("display","block");
                }else{
                    $("#remind").css("display","none");
                }
              
                   data=data.replace("days","天");
                   data=data.substring(0, data.indexOf('.')+1);
                   data=data.replace(",","");
                   data=data.replace(":","小时");
                   data=data.replace(":","分");
                   data=data.replace(".","秒");
               $(".credential_date").html(data);
            }else{
                certificate_none();
            }
        },error: function() {
            certificate_none();
        }

    })      
    /* 当没有证书情况 END*/
    $('#recently_one_day').click(function(){
        table.clear()
            .draw();
        var recently_one_day = '[[['+'"createdate"'+',">=","'+(new Date(Date.parse(new Date().toDateString())).toUTCString().replace(/GMT/,'-0000'))+'"]]]';
        data_load(recently_one_day);
    })
    $('#recently_hebdomad').click(function(){
        table.clear()
            .draw();
        var recently_hebdomad = '[[['+'"createdate"'+',">=","'+(new Date(Date.parse(new Date().toDateString())-86400000*6).toUTCString().replace(/GMT/,'-0000'))+'"]]]';
        data_load(recently_hebdomad);
    })

    $('#recently_month').click(function(){
        table.clear()
            .draw();
        var recently_month = '[[['+'"createdate"'+',">=","'+(new Date(Date.parse(new Date().toDateString())-86400000*30).toUTCString().replace(/GMT/,'-0000'))+'"]]]';
        data_load(recently_month);
    })
    $('#recently_one_year').click(function(){
        table.clear()
            .draw();
        var recently_one_year = '[[['+'"createdate"'+',">=","'+(new Date(Date.parse(new Date().toDateString())-86400000*300).toUTCString().replace(/GMT/,'-0000'))+'"]]]';
        data_load(recently_one_year);
    })
    $('#all_data').click(function(){
        table.clear()
            .draw();
        data_load();
    })


    /* 根据月份来选择数据 */
    $('#determine_the_time').click(function(){
        if($('#dropdown_list_year').val() != '' || $('#dropdown_list_month').val() != ''){
            /* 清楚上面时间段按钮的样式 */
            $('.order_data button').attr('index','');
            $('.order_data button').css('backgroundColor','#1f87d9');
            
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
            // console.log(recently_time)
            data_load(recently_time);
        }
    })
    /* 获取order的list */
    function data_load(condition_){

        var order_list = [];
        var data_totalpage;
        var all_order_data = {};
        // var all_order_data = {};
        /* 设置读取服务器的数据的分页 */
        var current_page = 0;

        var PAGE_SIZE = 20;
   

        // load_order_list();
        load_order_list(condition_);
       

        function load_order_list(_condition_) {
            var init_data = {
                "action": "list",
                "page":'*#'+current_page,
                'condition':_condition_
            };
            $.ajax({                
                type: "post",
                data: init_data,
                dataType: "json",
                url: "/order",
                // async: false,
                success: function(data) {
                    if( data.result == 'true'){
                        data_totalpage = data.totalpage;
                        order_list = order_list.concat(data.list);
                        if(parseInt(data.page.split('#')[2]) < parseInt(data.totalpage)-1 ){
                            current_page = current_page+1;
                            load_order_list(condition_);
                            console.log(data)
                        }else{
                            load_order_data();
                             console.log(data)

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
                error: function() {

                }
            });        
        }

        var  current_page_list = 0; 
        /* 获取order的list查找order的订单 */
        function load_order_data(){
            var tmp_order_list = order_list.slice(current_page_list*PAGE_SIZE,Math.min((current_page_list+1)*PAGE_SIZE,order_list.length));
            /*查询订单*/
            var post_data = {
                "action": "query",
                "uuid": JSON.stringify(tmp_order_list),
                'pinfo':'',
                'scandate':'',
                'collecteddata':'',
                'createdate':'', 
                'scanphoto': '',

            };
            //console.log(tmp_order_list)
            $.ajax({
                type: "post",
                data: post_data,
                dataType: "json",
                // async: false,
                url: "/order",
                success: function(dt) { 
                    if( dt.result != 'false'){
                        for(var i in dt){
                            all_order_data[i] = dt[i] 
                        }
                        if( current_page_list < current_page){
                            current_page_list = current_page_list+1;
                            load_order_data();
                        }else{

                           structure_data(); 
                        }
                    }                    	
                },
                error: function() {
                }
            });
        }

        // var order_list;
        // var all_order_data;

        // var time_createdate = []
       //console.log(all_order_data[order_list])
        function structure_data(){
            table.clear()
                .draw();
            var j = 0;
            order_list.reverse();
            for(var i in order_list){
                if(!all_order_data[order_list[i]]){
                }else{
                    all_order_data[order_list[i]] ? all_order_data[order_list[i]].pinfo : '';
            		if(all_order_data[order_list[i]].pinfo != null){
                        if(all_order_data[order_list[i]].collecteddata != ''){
                            table.row.add( [
                                j=j+1,
                                all_order_data[order_list[i]].pinfo ? all_order_data[order_list[i]].pinfo.username : "",
                                all_order_data[order_list[i]].pinfo ? all_order_data[order_list[i]].pinfo.phone : "",
                                all_order_data[order_list[i]].pinfo ? all_order_data[order_list[i]].pinfo.email : "",
                                format_time(all_order_data[order_list[i]].scandate),
                                // "<a href = 'fswear://"+jQuery.parseJSON(all_order_data[order_list[i]].collecteddata).user_path +"'><button id='alter_news' class='btn_info btn-sm'>启动试戴</button></a>",
                                "<a target='_blank' href = 'http://127.0.0.1:9100/tryon/"+all_order_data[order_list[i]].collecteddata.user_path +"'><button id='alter_news' class='btn_info btn-sm'>启动试戴</button></a>",
                                 "<a href='../sjy/glassadjust.html' class='btn_info' id='adjust' data="+order_list[i]+">调整下单</a>",
                                order_list[i],
                            ]);    
                            table.draw(false); 
                        }else{
                            table.row.add( [
                                j=j+1,
                                all_order_data[order_list[i]].pinfo ? all_order_data[order_list[i]].pinfo.username : "",
                                all_order_data[order_list[i]].pinfo ? all_order_data[order_list[i]].pinfo.phone : "",
                                all_order_data[order_list[i]].pinfo ? all_order_data[order_list[i]].pinfo.email : "",
                                format_time(all_order_data[order_list[i]].scandate),
                                '',
                                order_list[i],
                            ]);    
                            table.draw(false);
                        }                                                                                                	
            		} 
                }                              
            }
            all_order_data = {};               
        } 
    }
    $("tbody").on("click","#adjust",function(){
        var order_uuid=$(this).attr("data");
         document.cookie = "UserUUID="+order_uuid+";path=/";  

    })
})

