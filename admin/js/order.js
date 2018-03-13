
$(function () {

    // 引入顶部
    $('.top').nav();
    $('.nav-left').left();

    // 给当前的导航加上颜色   
    $('#order-page a').addClass('active');
    //获取证书到期时间   

    var data = { 'action': 'check' };
    $.ajax({
        type: "post",
        data: data,
        url: "/cert",
        // async: false,
        success: function (data) {
            if (JSON.parse(data) && JSON.parse(data).result == 'true') {
                var data = JSON.parse(data);
                data = data.left;
                var date_days = data.substring(0, data.indexOf('days'));
                console.log(date_days)
                if (date_days <= 14) {
                    $("#remind").css("display", "block");
                } else {
                    $("#remind").css("display", "none");
                };
                data = data.replace("days", "天");
                data = data.substring(0, data.indexOf('.') + 1);
                data = data.replace(",", "");
                data = data.replace(":", "小时");
                data = data.replace(":", "分");
                data = data.replace(".", "秒");
                $(".credential_date").html(data);
            } else {
                certificate_none();
            }
        }, error: function () {
            certificate_none();
        }
    });
    var table = $('#table_id_example').DataTable({
        "columnDefs": [
            {
                // "targets": [7],
                // "visible": false,
                // "searchable": true,
            },
        ],
        "bPaginate": true,  // 允许表格分页
        'bLengthChange': false,  //允许改变每页显示的数据条数
        "bScrollCollapse": true, //是否开启DataTables的高度自适应，当数据条数不够分页数据条数的时候，插件高度是否随数据条数而改变  
        "bAutoWidth": true,//关闭后，表格将不会自动计算表格大小，在浏览器大化小化的时候会挤在一坨
        "pagingType": "full_numbers", //分页样式
        "iDisplayLength": 12, //默认显示的记录数  
        "bInfo": false, //是否显示页脚信息，DataTables插件左下角显示记录数 
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

        // "columns": [
        //     null,
        //     null,
        //     {"defaultContent": ""},
        //     {"defaultContent": ""},
        //     {"defaultContent": ""},
        //     {"defaultContent": ""},
        //     {"defaultContent": ""},
        // ]


    });


    $('#top_input').on('keyup', function () {

        function top_input_settime() {
            var tsval = $("#top_input").val()
            table.search(tsval, false, false).draw();
        }
        setTimeout(top_input_settime, 300)

    });

    //管理按钮
    $("#table_id_example tbody").on("click", '#operation', function () {
        if ($(this).css("height") != "22px") {
            $(this).css("height", "22px");
        } else {
            $(this).css("height", "88px");
            var now_state = $(this).attr("state");
            console.log(now_state)
            if (now_state == 1) {
                $(this).children().eq(1).children().prop("disabled", false).css({ "color": "#000" });
            } else {
                $(this).children().eq(1).children().prop("disabled", true).css({ "color": "#999" });
            }
            if (now_state == 2) {
                $(this).children().eq(2).children().prop("disabled", false).css({ "color": "#000" });
            } else {
                $(this).children().eq(2).children().prop("disabled", true).css({ "color": "#999" });
            }
        }
    })
    var notifier_list = [];
    listNotifier();
    function listNotifier() {
        var order_list = "";
        $.ajax({
            type: 'post',
            url: "/meet",
            dataType: "json",
            data: { "action": "list" },
            success: function (data) {
                console.log(data);
                if (data.result == 'true') {
                    order_list = data.data;
                    console.log(order_list)
                    var id = 0;
                    let state = "";
                    for (var i in order_list) {
                        if (order_list[i].status != "2" && order_list[i].status != "3") {
                            console.log(order_list[i])
                            switch (order_list[i].status) {
                                case "0":
                                    state = "开始预约"
                                    break;
                                case "1":
                                    state = "已经到店"
                                    break;
                            }
                            table.row.add([
                                ++id,
                                order_list[i].user,
                                order_list[i].phone,
                                order_list[i].meet_date,
                                order_list[i].update_date,
                                state,
                                "<button class='btn-sm affirm btn_info' data=" + order_list[i].user_id + ">确认预约时间</button>",
                                "<ul id='operation'state='1'>" +
                                "<li> <a class=operation_btn>管理操作</a> </li>" +
                                "<li><button id='start_production' class='btn_info arrive operation_btn a_block' state='1' alternews='" + order_list[i].user_id + "'>确认到店</button></li>" +
                                "<li><button id='start_production' class='btn_info complete  operation_btn a_block' state='2' alternews='" + order_list[i].user_id + "'>预约完成</button></li>" +
                                "<li><button id='start_production' class='btn_info cel  operation_btn a_block' state='0' alternews='" + order_list[i].user_id + "'>取消预约</button></li>" +
                                "</ul>",
                            ]);
                            table.draw(false);
                        }
                    }
                }
            },
            error: function () {
                alert("请检查网络")
            }
        })
    }

    // 查询

    // 商家修改时间
    $("#apply_close").click(function () {
        $("#submit_box").hide();
    })
    $("#table_id_example tbody").on("click", '.affirm', function () {
        $("#submit_box").show();
        let uuid = $(this).attr("data");
        $("#sub").unbind('click').click(function () {
            let year = $("#year").val() + "年";
            let month = $("#month").val() + "月";
            let day = $("#day").val() + "号";
            let hour = $("#hour").val() + "点";
            let minute = $("#minute").val() + "分";
            let date = "";
            if ($("#minute").val() != "") {
                date = year + month + day + hour + minute
            } else {
                date = year + month + day + hour
            }
            let tmp_data = {
                "action": "update",
                "user_id": uuid,
                "update_date": date
            }
            console.log(tmp_data)
            $.ajax({
                type: "post",
                url: "/meet",
                dataType: "json",
                data: tmp_data,
                success: function (data) {
                    console.log(data)
                    window.location.reload();
                },
                error: function () {
                    
                    console.log("false")
                }
            })
        })
    })
    //点击提交修改

    //确认到店
    $("#table_id_example tbody").on("click", '.arrive', function () {
        console.log("确认到店")
    })
    //预约完成
    $("#table_id_example tbody").on("click", '.complete', function () {
        console.log("预约完成")
    })
    $("#table_id_example tbody").on("click", '.cel', function () {
        console.log("取消预约")
    })
})

