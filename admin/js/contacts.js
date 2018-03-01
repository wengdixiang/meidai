
$(function () {

    // 引入顶部
    $('.top').nav();
    $('.nav-left').left();

    // 给当前的导航加上颜色   
    $('#contacts a').addClass('active');
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
    // 查询通知人、  
    var notifier_list = [];
    listNotifier();
    function listNotifier() {
        $.ajax({
            type: 'post',
            url: "/common",
            dataType: "json",
            data: { "action": "list", "type": "deal_paid_notify_email" },
            success: function (data) {
                console.log(data);
                if (data.result == "true") {
                    for (var i = 0; i < data.list.length; i++) {
                        notifier_list.push(data.list[i])
                    }
                    console.log(notifier_list);
                    queryNotifier()
                }
            },
            error: function () {
                alert("请检查网络")
            }
        })
    }

    // 查询
    function queryNotifier() {
        let tmp_notifier = {
            "action": "query",
            "uuid": JSON.stringify(notifier_list),
            "type": "deal_paid_notify_email",
            "description": "",
            "content": ""
        }
        $.ajax({
            type: 'post',
            url: '/common',
            dataType: 'json',
            data: tmp_notifier,
            success: function (data) {
                console.log(data)
                var id = 0;
                for (var i in data) {
                    table.row.add([
                        ++id,
                        data[i].description.name,
                        data[i].content,
                        "<button class='btn-sm update btn_info' data=" + i + ">修改联系人</button>",
                        "<button class='btn-sm del btn_info' data=" + i + ">删除联系人</button>"
                    ]);
                    table.draw(false);
                }
            },
            error: function () {
                alert("请检查网络")
            }
        })
    }
    // 更新通知人信息
    $("#table_id_example").on("click", "button.update", function () {
        let notifier_uuid = $(this).attr("data");
        console.log(notifier_uuid);
        let query_data = {
            "action": "query",
            "uuid": notifier_uuid,
            "type": "deal_paid_notify_email",
            "description": "",
            "content": ""
        };
        $.ajax({
            type: 'post',
            url: '/common',
            dataType: 'json',
            data: query_data,
            success: function (data) {
                console.log(data);
                $("#update_box").show();
                $("#update_email").val(data.content);
                $("#update_name").val(data.description.name);
            },
            error: function () {
                alert("请检查网络连接")
            }
        })
        $("button.update_btn").unbind("click").click(function () {
            let update_email = $("#update_email").val();
            let update_name = { "name": $("#update_name").val() };
            console.log(update_email, update_name, notifier_uuid);
            let update_tmp = {
                "action": "update",
                "uuid": notifier_uuid,
                "type": "deal_paid_notify_email",
                "description": JSON.stringify(update_name),
                "content": update_email
            };
            console.log(update_tmp)
            $.ajax({
                type: 'post',
                url: '/common',
                dataType: 'json',
                data: update_tmp,
                success: function (data) {
                    console.log(data)
                    if (data.result == 'true') {
                        alert("更新成功");
                        location.reload()
                    }
                },
                error: function () {
                    alert("请检查网络")
                }
            })
        })
    })
    // 删除通知人
    $("#table_id_example").on("click", "button.del", function () {
        if (window.confirm('您确定删除吗？')) {
            console.log("del")
            let notifier_uuid = $(this).attr("data");
            console.log(notifier_uuid);
            let del_data = {
                "action": "delete",
                "uuid": notifier_uuid,
                "type": "deal_paid_notify_email",
            }
            $.ajax({
                type: 'post',
                url: '/common',
                dataType: 'json',
                data: del_data,
                success: function (data) {
                    console.log(data);
                    if (data.result == "true") {
                        location.reload()
                    } else {
                        console.log("删除失败")
                    }

                },
                error: function () {
                    alert("请检查网络")
                }
            })
        }

    })
    // 添加通知人
    // $("button.add_btn").click(function(){
    //     let name=$("#new_name").val();
    //     let email=$("#new_email").val();
    //     console.log(name,email)
    // })
    //添加联系人
    $(".add_contacts").click(function () {
        $("#new_box").show();
    })
    $("#apply_close").click(function () {
        $("#new_box").hide();
    })
    $("#apply_close1").click(function () {
        $("#update_box").hide();
    })
    $(".add_btn").click(function () {
        var name = $("#new_name").val(),
            // phone = $("#new_phone").val();
            email = $("#new_email").val();
        var tmp_name = {
            "name": name
        }
        console.log("联系人：" + name + "邮箱：" + email);
        let tmp_data = {
            "action": "create",
            "type": "deal_paid_notify_email",
            "dataform": "text",
            "description": JSON.stringify(tmp_name),
            "count": "1",
            // "privilege":name,
            "content": email
        };
        console.log(tmp_data)
        $.ajax({
            type: "post",
            url: "/common",
            dataType: 'json',
            data: tmp_data,
            success: function (data) {
                console.log(data)
                if (data.result == 'true') {
                    alert("添加成功");
                    location.reload()
                }
                // if (data.result == 'true') {
                //     let update_tmp = {
                //         "action": "update",
                //         "uuid":data.uuid,
                //         "type": "deal_paid_notify_email",
                //         "privilege": name,
                //     };
                //     console.log(update_tmp)
                //     $.ajax({
                //         type: 'post',
                //         url: '/common',
                //         dataType: 'json',
                //         data: update_tmp,
                //         success:function(data){
                //             console.log(data)
                //             if (data.result == 'true'){
                //                 alert("添加成功");
                //                 reload();
                //             }
                //         },
                //         error:function(){
                //             alert("请检查网络")
                //         }
                //     })
                // }
            },
            error: function () {
                alert("请检查网络连接")
            }
        })
    })
})

