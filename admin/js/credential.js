
$(function () {

  // 引入顶部
  $('.top').nav();
  $('.nav-left').left();

  // 给当前的导航加上颜色   
  $('#credential a').addClass('active');
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


  //查询全部证书
  //获得全部证书uuid
  //
  var cert_list = [];
  var all_order_data;
  $.ajax({
    type: "post",
    dataType: "json",
    url: "/cert",
    data: { "action": "list" },
    success: function (data) {
      console.log(data)

      if (data.result == "true") {
        $("#apply_cert").show();
        $("#table_id_example").show();

        for (var i = 0; i < data.list.length; i++) {
          cert_list.push(data.list[i])
        }
        //console.log(cert_list);
        queryCert()
      } else if (data.reasons == "Page out of range.") {
        $("#apply_cert").show();
        $("#table_id_example").show();

      } else {
        console.log(data.result)
        $("#apply_cert").hide();
        $("#table_id_example").hide();

      }

    },
    error: function () {
      $("#apply_cert").hide();
      $("#credential_all").hide();
      $("#credential_list").hide();
      console.log("false");

    }
  });
  //查询全部商家证书显示
  function queryCert() {
    var tmp_list = {
      "action": "query",
      "uuid": JSON.stringify(cert_list),
      // "email": "",
      "phone": "",
      "qq": "",
      "fullname": "",
      "shortname": "",
      "address": "",
      "zipcode": "",
      "certsubject": "",
      "validdate": "",
      "signdate": "",
      "officehour": "",
      "contactname": "",
      "status": "",
      "notifieremail":""
    }
    $.ajax({
      type: "post",
      url: "/cert",
      dataType: "json",
      data: tmp_list,
      success: function (data) {
        console.log(data);
        all_order_data = data;
        var j = 0;
        var html = "";
        // table.clear()
        //     .draw();
        for (var i in data) {
          // console.log(data[i].stats)
          if (data[i].status != "disabled") {

            table.row.add([
              j = j + 1,
              data[i].fullname,
              format_time(data[i].validdate),
              data[i].phone,
              data[i].notifieremail,
              "<button class='btn-sm del btn_info' data=" + i + ">吊销证书</button>",
              "<button class='btn-sm update btn_info' data=" + i + ">修改资料</button>"

            ]);
            table.draw(false);
            // html+=  "<li>"
            // +"<p>"+data[i].fullname+"</P>"
            // +"<p>"+format_time(data[i].validdate)+"</P>"
            // +"<p><button class='btn btn_info' data="+i+">吊销证书</button></p>"
            // +"</li>"
          }

          // console.log(data[i])
        }



      },
      error: function () {
        console.log("false")
      }
    })
  };
  //吊销证书
  $("#table_id_example").on("click", "button.del", function () {
    if (window.confirm("确定要吊销该商家的证书吗？")) {
      console.log($(this).attr("data"));
      var tmp_uuid = $(this).attr("data");
      var tmp_data = {
        "action": "update",
        "uuid": tmp_uuid,
        "status": "disabled",
      }
      $.ajax({
        type: "post",
        url: '/cert',
        data: tmp_data,
        success: function (data) {
          console.log(data);
          if (JSON.parse(data).result == "true") {
            queryCert();
          } else {
            alert("操作失败:")
          }
        },
        error: function () {
          console.log("flase")
          alert("操作失败:");
        }
      });
    };

  });

  //修改资料
  var certUuid = "";
  $("#table_id_example").on("click", "button.update", function () {
    console.log($(this).attr("data"));
    $("#update_user").fadeIn();
    // let tmp_uuid = $(this).attr("data")
    certUuid = $(this).attr("data")
    let tmp_list = {
      "action": "query",
      "uuid": certUuid,
      // "email": "",
      "phone": "",
      "qq": "",
      "fullname": "",
      "shortname": "",
      "address": "",
      "zipcode": "",
      "certsubject": "",
      "validdate": "",
      "signdate": "",
      "officehour": "",
      "contactname": "",
      "notifieremail":"",
      // "status": "",
    }
    $.ajax({
      type: "post",
      url: "/cert",
      dataType: "json",
      data: tmp_list,
      success: function (data) {
        console.log(data)
        if (data.result == 'true') {
          $("#update_name").val(data.contactname),
            $("#update_phone").val(data.phone),
            $("#update_email").val(data.notifieremail),
            $("#update_qq").val(data.qq),
            $("#update_fullname").val(data.fullname),
            $("#update_shortname").val(data.shortname),
            // $("#update_province").val(data.certsubject.ST),
            // $("#update_city").val(data.certsubject.L),
            $("#update_address").val(data.address),
            $("#update_zipcode").val(data.zipcode),
            $("#update_open").val(data.officehour);
        }
      },
      error: function () { }
    })
  })
  // 点击修改
  $("#update_submint").click(function () {
    var update_name = $("#update_name").val(),
      update_phone = $("#update_phone").val(),
      update_email = $("#update_email").val(),
      update_qq = $("#update_qq").val(),
      update_fullname = $("#update_fullname").val(),
      update_shortname = $("#update_shortname").val(),
      update_address = $("#update_address").val(),
      update_zipcode = $("#update_zipcode").val(),
      update_open = $("#update_open").val();
    let tmp_data = {
      "action": "update",
      "uuid": certUuid,
      "phone": update_phone,
      "qq": update_qq,
      "notifieremail":update_email,
      "fullname": update_fullname,
      "shortname": update_shortname,
      "address": update_address,
      "zipcode": update_zipcode,
      "officehour": update_open,
      "contactname": update_name
    };
    console.log(tmp_data)
    $.ajax({
      type: "post",
      url: "/cert",
      data: tmp_data,
      success: function (data) {
        if (JSON.parse(data).result == "true") {
          alert("修改成功")
        } else {
          alert("修改失败")
        }
      },
      error: function () { }
    })
  })
  $("#update_close").click(function () {
    $("#update_user").fadeOut();
  })
  //申请证书
  ////点击申请按钮显示申请表单
  $("#apply_cert").click(function () {
    $("#apply_box").fadeIn();
  });
  $("#apply_close").click(function () {
    $("#apply_box").fadeOut();
  })
  //点击提交申请
  $("#cert_submint").click(function () {

    var cert_name = $("#cert_name").val(),
      cert_phone = $("#cert_phone").val(),
      cert_email = $("#cert_email").val(),
      cert_qq = $("#cert_qq").val(),
      cert_fullname = $("#cert_fullname").val(),
      cert_shortname = $("#cert_shortname").val(),
      cert_country = $("#cert_country").val(),
      cert_province = $("#cert_province").val(),
      cert_city = $("#cert_city").val(),
      cert_address = $("#cert_address").val(),
      cert_zipcode = $("#cert_zipcode").val(),
      cert_open = $("#cert_open").val();
    console.log(cert_name, cert_phone, cert_email, cert_qq, cert_fullname, cert_shortname, cert_country, cert_province, cert_city, cert_address, cert_zipcode, cert_open);
    var dataUint8 = [],
      cert_uuid = "";
    var cert_url = "/cert?action=create&email=" + cert_email + "&country=" + cert_country + "&province=" + cert_province + "&city=" + cert_city
    //console.log(cert_url);
    _downloadTarFile(cert_url)
    function _downloadTarFile(url) {
      //somehow 'arraybuffer' does not work in IE
      var xhr = new XMLHttpRequest();
      xhr.open("post", url, true);
      xhr.responseType = "arraybuffer";
      xhr.onload = function () {
        if (xhr.status === 200) {
          var downloadFile = function (mobileCode) {

            var file = new File([mobileCode], "cert.tar.gz", { type: "application/octet-binary" });
            saveAs(file);
            // console.log(file)
          }
          var arraybuffer = xhr.response,
            bytes = new Uint8Array(arraybuffer);
          dataUint8 = pako.inflate(bytes);
          console.log(arraybuffer)
          console.log(bytes)
          downloadFile(bytes)
          for (var offset = 0, len = dataUint8.length; offset < len; offset += 512) {
            var tempfilename = "";
            for (var i = 0; i < 31; ++i) {
              var j = i + offset,
                tempchar = String.fromCharCode(dataUint8[j]);
              tempfilename = tempfilename + tempchar;
            }
            if (tempfilename.indexOf("com.meidai") != -1) {
              console.log(tempfilename);
              cert_uuid = tempfilename
            }

          }
          //获得uuid更新证书信息
          var tmp_data = {
            "action": "update",
            "uuid": cert_uuid,
            "phone": cert_phone,
            "qq": cert_qq,
            "fullname": cert_fullname,
            "shortname": cert_shortname,
            "address": cert_address,
            "zipcode": cert_zipcode,
            "officehour": cert_open,
            "contactname": cert_name
          };
          console.log(tmp_data)
          $.ajax({
            type: "post",
            url: "/cert",
            data: tmp_data,
            success: function (data) {
              if (JSON.parse(data).result == "true") {
                cert_list.push(cert_uuid);
                alert("证书申请成功！");
                queryCert();

              } else {
                alert("证书申请失败");
              }
              $(".form-control").val("");
              $("#cert_country").val("");
              $("#cert_province").val("");
              $("#cert_city").val("")
            },
            error: function () {
              console.log("false");
              alert("证书申请失败")
            }
          });

        }
      };
      xhr.send(null);
      //console.log(fileURL+": downloading");
    };


  });

  $("#uploadify_close").click(function () {
    $("#uploadify_box").css("display", "none")
  })
  //续期上传旧证书
  $("#renewal").click(function () {
    $("#uploadify_box").css("display", "block")
    $("#uploadify_button").unbind('click').click(function () {

      var password = $("#credential_password").val();
      console.log(password);
      if (password != "") {
        var formdata = new FormData();
        formdata.append('file', $("input#uploadify")[0].files[0]);
        formdata.append('certtype', "p12");
        formdata.append('passphrase', password);
        let url = "/cert?action=renew",
        xhr = new XMLHttpRequest();
        xhr.addEventListener("load", uploadComplete, false);
        xhr.addEventListener("error", uploadFailed, false);
        xhr.open("POST", url);
        xhr.responseType = "arraybuffer";
        xhr.send(formdata);
        function uploadComplete(evt) {
          console.log(xhr.response)
          var downloadFile = function (mobileCode) {
            var file = new File([mobileCode], "cert.tar.gz", { type: "application/octet-binary" });
            saveAs(file);
          }
          let bytes = new Uint8Array(xhr.response);
          downloadFile(bytes)
        }
        function uploadFailed(evt) {
          alert("上传失败");
        }
      } else {
        alert("密码不能为空");
      }

    })

  });
  //选择城市
  var province = {
    "BeiJing": "北京市", "ShangHai": "上海市", "ZheJiang": "浙江省", "FuJian": "福建省", "HuNan": "湖南省", "GuangDong": "广东省",
    "JiangSu": "江苏省", "HeNan": "河南省", "HeBei": "河北省", "ShanXi": "陕西省", "ChongQing": "重庆市", "TianJin": "天津市",
    "YunNan": "云南省", "SiChuan": "四川省", "AnHui": "安徽省", "HaiNan": "海南省", "JiangXi": "江西省", "HuBei": "湖北省", "ShangXi": "山西省",
    "LiaoNing": "辽宁省", "TaiWan": "台湾省", "HeiLongJiang": "黑龙江", "NeiMengGu": "内蒙古", "GuiZhou": "贵州省", "GanSu": "甘肃省",
    "QingHai": "青海省", "XiZang": "西藏区", "JiLin": "吉林省", "NingXia": "宁夏区", "ShanDong": "山东省"
  };
  var ZheJiang = {
    "HangZhou": "杭州市", "WenZhou": "温州市", "NingBo": "宁波市", "TaiZhou": "台州市", "JiaXing": "嘉兴市", "JinHua": "金华市", "HuZhou": "湖州市",
    "ShaoXin": "绍兴市", "ZhouShan": "舟山市", "LiShui": "丽水市", "QuZhou": "衢州市"
  };
  var BeiJing = {
    "ChaoYang": "朝阳区", "HaiDing": "海定区", "TongZhou": "通州区", "FengTai": "丰台区", "ChangPing": "昌平区", "DaXing": "大兴区", "ShunYi": "顺义区", "XiCheng": "西城区", "YanQing": "延庆县", "ShiJingShan": "石景山", "XuanWu": "宣武区", "HuaiRou": "怀柔区", "ChongWen": "崇文区", "MiYun": "密云区", "DongCheng": "东城区", "NeiMengGuTouGou": "门头沟", "PingGu": "平谷区"
  };
  var ChongQing = {
    "JiangBei": "江北区", "YuBei": "渝北区", "ShaPingBa": "沙坪坝区", "JiuLongPo": "九龙坡区", "WanZhou": "万州区", "YongZhou": "永州市", "NanAn": "南岸区", "YouYang": "酉阳县", "BeiBei": "北碚区", "FuLing": "涪陵区", "XiuShan": "秀山县", "BaNan": "巴南区", "YuZhong": "渝中区", "ShiZhu": "石柱县", "ZhongXian": "忠县", "HeChuan": "合川市", "DaDuKou": "大渡口区", "KaiXian": "开县", "ChangShou": "长寿区", "RongChang": "荣昌县", "YunYang": "云阳县", "LiangPing": "梁平县", "TongNan": "潼南县", "JiangJin": "江津市", "PengShui": "彭水县", "BiShan": "璧山县", "QiJiang": "綦江县", "DaZu": "大足县", "QianJiang": "黔江区", "WuXi": "巫溪县", "WuShan": "巫山县", "DianJiang": "垫江县", "FengDu": "丰都县", "WuLong": "武隆县", "WanSheng": "万盛区", "TongLiang": "铜梁县", "NanChuan": "南川市", "FengJie": "奉节县", "ShuangQiao": "双桥区", "ChengKou": "城口县"
  };
  var GuangDong = {
    "DongGuan": "东莞市", "GuangZhou": "广州市", "ZhongShan": "中山市", "ShenZhen": "深圳市", "HuiZhou": "惠州市",
    "JiangMen": "江门市", "ZhuHai": "珠海市", "ShanTou": "汕头市", "FoShan": "佛山市", "ZhanJiang": "湛江市", "HeYuan": "河源市", "ZhaoQing": "肇庆市", "ChaoZhou": "潮州市", "QingYuan": "清远市", "ShaoGuan": "韶关市", "JieYang": "揭阳市", "YangJiang": "阳江市", "YunFu": "云浮市", "MaoMing": "茂名市", "MeiZhou": "梅州市", "ShanWei": "汕尾市"
  };
  var ShanDong = {
    "JiNan": "济南市", "QingDao": "青岛市", "LinYi": "临沂市", "ZiBo": "淄博市", "ZaoZhuang": "枣庄市", "DongYing": "东营市", "YanTai": "烟台市", "HuaiFang": "潍坊市", "JiNing": "济宁市", "TaiAn": "泰安市", "WeiHai": "威海市", "RiZhao": "日照市", "LaiWu": "莱芜市", "DeZhou": "德州市", "LiaoCheng": "聊城市", "HeZe": "菏泽市", "BinZhou": "滨州市"
  };
  var JiangSu = {
    "SuZhou": "苏州市", "XuZhou": "徐州市", "YanCheng": "盐城市", "WuXi": "无锡市", "NanJing": "南京市", "NanTong": "南通市", "LianYunGang": "连云港", "ChangZhou": "常州市", "YangZhou": "扬州市", "ZhenJiang": "镇江市", "HuaiAn": "淮安市", "TaiZhou": "泰州市", "Suqian": "宿迁市"
  };
  var HeNan = {
    "ZhengZHou": "郑州市", "NanYang": "南阳市", "XinXiang": "新乡市", "AnYang": "安阳市", "LuoYang": "洛阳市", "PingDingShan": "平顶山", "ZhouKou": "周口市", "ShangQiu": "商丘市", "KaiFeng": "开封市", "JiaoZuo": "焦作市", "ZhuMaDian": "驻马店", "PuYang": "濮阳市", "SanMenXia": "三门峡", "LuoHe": "漯河市", "XuChang": "许昌市", "HeBi": "鹤壁市", "JiYuan": "济源市"
  };
  var ShangHai = {
    "SongJiang": "松江区", "BaoShan": "宝山区", "JinShan": "金山区", "JiaDing": "嘉定区", "NanHui": "南汇区", "QingPu": "青浦区 ", "PuDong": "浦东区", "FengXian": "奉贤区", "MinXin": "闵行区", "XuHui": "徐汇区", "JingAn": "静安区", "HuangPu": "黄浦区", "PuTuo": "普陀区", "YangPu": "杨浦区", "HongKou": "虹口区", "ZhaBei": "闸北区", "ChangNing": "长宁区", "ChongMing": "崇明县", "LuWan": "卢湾区"
  };
  var HeBei = {
    "ShiJiaZhuang": "石家庄", "TangShan": "唐山市", "BaoDing": "保定市", "HanDan": "邯郸市", "XingTai": "邢台市", "HeBei": "河北区", "CangZhou": "沧州市", "QinHuangDao": "秦皇岛", "ZhangJiaKou": "张家口", "HengShui": "衡水市", "LangFang": "廊坊市", "ChengDe": "承德市"
  };
  var ShanXi = {
    "XiAn": "西安市", "XianYang": "咸阳市", "BaoJi": "宝鸡市", "HanZhong": "汉中市", "WeiNan": "渭南市", "AnKang": "安康市", "Yulin": "榆林市", "ShangLuo": "商洛市", "YanAn": "延安市", "TongChuan": "铜川市"
  };
  var HuNan = {
    "ChangSha": "长沙市", "ShaoYang": "邵阳市", "Changde": "常德市", "HengYang": "衡阳市", "ZhuZhou": "株洲市", "XiangTan": "湘潭市", "YongZhou": "永州市", "YueYang": "岳阳市", "HuaiHua": "怀化市", "ChenZhou": "郴州市", "LouDi": "娄底市", "YiYang": "益阳市", "ZhangJiaJie": "张家界", "XiangXi": "湘西州"
  };
  var FuJian = {
    "ZhangZhou": "漳州市", "QuanZhou": "泉州市", "XiaMen": "厦门市", "FuZhou": "福州市", "PuTian": "莆田市", "NingDe": "宁德市", "SanMing": "三明市", "NanPing": "南平市", "LongYan": "龙岩市"
  };
  var TianJin = {
    "HePing": "和平区", "BeiChen": "北辰区", "HeBei": "河北区", "HeXi": "河西区", "XiQing": "西青区", "JinNan": "津南区", "DongLi": "东丽区", "WuQing": "武清区", "BaoDi": "宝坻区", "HongQiao": "红桥区", "DaGang": "大港区", "HanGu": "汉沽区", "JingHai": "静海区", "NingHeXian": "宁河县", "TangGu": "塘沽区", "JiXian": "蓟县", "NanKai": "南开区", "HeDong": "河东区"
  };
  var YunNan = {
    "KunMing": "昆明市", "HongHe": "红河州", "DaLi": "大理州", "WenShan": "文山州", "DeHong": "德宏州", "QuJing": "曲靖市", "ZhaoTong": "昭通市", "ChuXiong": "楚雄州", "BaoShan": "保山市", "YuXi": "玉溪市", "LiJiang": "丽江", "Lingcang": "临沧", "SiMao": "思茅", "XIShuangBanNa": "西双版纳", "NuJiang": "怒江州", "DiQing": "迪庆州"
  };
  var SiChuan = {
    "Chengdu": "成都市", "MinYang": "绵阳市", "GuangYuan": "广元市", "DaZhou": "达州市", "NanChong": "南充市", "DeYang": "德阳市", "GuangAn": "广安市", "ABa": "阿坝州", "BaZhong": "巴中市", "SuiNing": "遂宁市", "NeiJiang": "内江市", "PanZhiHua": "攀枝花", "LeShan": "乐山市", "ZiGong": "自贡市", "LuZhou": "泸州市", "YaAn": "雅安市", "YiBin": "宜宾市", "ZiYang": "资阳市", "MeiShan": "眉山市", "GanZi": "甘孜州"
  };
  var AnHui = {
    "WuHu": "芜湖市", "HeFei": "合肥市", "LiuAn": "六安市", "SuZhou": "宿州市", "FuYang": "阜阳市", "AnQing": "安庆市", "MaAnShan": "马鞍山", "BengBu": "蚌埠市", "HuaiBei": "淮北市", "HuaiNan": "淮南市", "XuanCheng": "宣城市", "HuangShan": "黄山市", "TongLing": "铜陵市", "boZhou": "亳州市", "ChiZhou": "池州市", "ChaoHu": "巢湖市", "ChuZhou": "滁州市"
  };
  var HaiNan = {
    "SanYa": "三亚市", "HaiKou": "海口市", "QiongHai": "琼海市", "WenChang": "文昌市", "DongFang": "东方市", "ChangJiang": "昌江县", "LingShui": "陵水县", "LeDong": "乐东县", "WuZhiShan": "五指山", "BaoTing": "保亭县", "ChengMai": "澄迈县", "WanNing": "万宁市", "DanZhou": "儋州市", "LinGao": "临高县", "BaiSha": "白沙县", "DingAn": "定安县", "QiongZhong": "琼中县", "TunChang": "屯昌县"
  };
  var HuBei = {
    "Wuhan": "武汉市", "YiChang": "宜昌市", "Xiangfan": "襄樊市", "JingZhou": "荆州市", "EnShi": "恩施州", "XiaoGan": "孝感市", "HuangGang": "黄冈市", "ShiYan": "十堰市", "XianNing": "咸宁市", "HuangShi": "黄石市", "XianTao": "仙桃市", "SuiZhou": "随州市", "TianMen": "天门市", "JingMen": "荆门市", "QianJiang": "潜江市", "EZhou": "鄂州市", "ShenNongJia": "神农架"
  };
  var ShangXi = {
    "TaiYuan": "太原市", "DaTong": "大同市", "YunCheng": "运城市", "ChangZhi": "长治市", "JinCheng": "晋城市", "XinZhou": "忻州市", "LinFen": "临汾市", "LvLiang": "吕梁市", "JinZhong": "晋中市", "YangQuan": "阳泉市", "ShuoZhou": "朔州市"
  };
  var LiaoNing = {
    "DaLian": "大连市", "ShenYang": "沈阳市", "DanDong": "丹东市", "LiaoYang": "辽阳市", "HuLuDao": "葫芦岛", "JinZhou": "锦州市", "ChaoYang": "朝阳市", "YingKou": "营口市", "AnShan": "鞍山市", "FuShun": "抚顺市", "FuXin": "阜新市", "BenXi": "本溪市", "PanJin": "盘锦市", "TieLing": "铁岭市"
  };
  var TaiWan = { "TaiBei": "台北市", "GaoXiong": "高雄市", "TaiZhong": "台中市", "XinZhu": "新竹市", "JiLong": "基隆市", "TaiNan": "台南市", "JiaYi": "嘉义市" };
  var HeiLongJiang = {
    "QiQiHaEr": "齐齐哈尔", "HaErBin": "哈尔滨", "DaQing": "大庆市", "JiaMuSi": "佳木斯", "ShuangYaShan": "双鸭山", "MuDanJiang": "牡丹江", "JiXi": "鸡西市", "HeiHe": "黑河市", "SuiHua": "绥化市", "HeGang": "鹤岗市", "YiChun": "伊春市", "DaXingAnLing": "大兴安岭", "QiTaiHe": "七台河"
  };
  var NeiMengGu = {
    "ChiFeng": "赤峰市", "BaoTou": "包头市", "TongLiao": "通辽市", "HuHeHaoTe": "呼和浩特", "WuHai": "乌海市", "EErDuoSi": "鄂尔多斯", "HuLunBeiEr": "呼伦贝尔", "XingAn": "兴安盟", "BaYanNaoEr": "巴彦淖尔", "WuLanChsBu": "乌兰察布", "XiLinGuoLe": "锡林郭勒", "ALaShan": "阿拉善"
  };
  var GuiZhou = {
    "GuiYang": "贵阳市", "QianDongNan": "黔东南州", "QianNan": "黔南州", "ZunYi": "遵义市", "QianXiNan": "黔西南州", "BiJie": "毕节地区", "TongRen": "铜仁地区", "AnShun": "安顺市", "LiuPanShui": "六盘水"
  };
  var GanSu = {
    "LanZhou": "兰州市", "TianShui": "天水市", "QingYang": "庆阳市", "WuWei": "武威市", "JiuQuan": "酒泉市", "ZhangYe": "张掖市", "LongNan": "陇南地区", "BaiYin": "白银市", "DingXi": "定西地区", "PingLiang": "平凉市", "JiaLingGuan": "嘉陵关", "LinXia": "临夏区", "JinChang": "金昌市", "GanNan": "甘南州"
  };
  var QingHai = { "XiNing": "西宁市", "HaiXi": "海西州", "HaiDong": "海东地区", "HaiBei": "海北州", "GuoLuo": "果洛州", "YuShu": "玉树州", "HuangNan": "黄南地区" };
  var XiZang = { "LaSa": "拉萨市", "ShanNan": "山南地区", "LinZhi": "林芝地区", "RiKeZe": "日客则", "ALi": "阿里地区", "ChangDu": "昌都地区", "NaQu": "那曲地区" };
  var JiLin = {
    "Jilin": "吉林市", "ChangChun": "长春市", "BaiShan": "白山市", "BaiCheng": "白城市", "YanBian": "延边州", "SongYuan": "松原市", "LiaoYuan": "辽源市", "TongHua": "通化市", "SiPing": "四平市"
  };
  var NingXia = { "YinChuan": "银川市", "WuZhong": "吴忠市", "ZhongWei": "中卫市", "ShiZuiShan": "石嘴山市", "GuYuan": "固原市" };
  var JiangXi = {
    "NanChang": "南昌市", "GanZhou": "赣州市", "ShangRao": "上饶市", "JiAn": "吉安市", "JiuJiang": "九江市", "XinYu": "新余市", "FuZHou": "抚州市", "YiChun": "宜春市", "JingDeZhen": "景德镇", "PingXiang": "萍乡市", "YingTan": "鹰潭市"
  };
  // $("#cert_country").change(function(){
  //      if($(this).val()=="CN"){
  //          var html="<option value=''>选择省份</option>";
  //          for(var i in province ){
  //              html+="<option value="+i+">"+province[i]+"</option>"
  //          }
  //          $("#cert_province").html(html)
  //      }else{
  //           $("#cert_province").html("<option>选择省份</option>")
  //      }
  //      //$("#cert_province")
  // })
  (function () {
    var html = "<option value=''>选择省份</option>";
    for (var i in province) {
      html += "<option value=" + i + ">" + province[i] + "</option>"
    }
    $("#cert_province").html(html);
  })();
  (function () {
    var html = "<option value=''>选择省份</option>";
    for (var i in province) {
      html += "<option value=" + i + ">" + province[i] + "</option>"
    }
    $("#update_province").html(html);
  })();
  $("#cert_province").change(function () {
    var that = $(this).val();
    var city = "";
    switch (that) {
      case "ZheJiang":
        city = ZheJiang;
        break;
      case "HuNan":
        city = HuNan;
        break;
      case "FuJian":
        city = FuJian;
        break;
      case "BeiJing":
        city = BeiJing;
        break;
      case "ShangHai":
        city = ShangHai;
        break;
      case "GuangDong":
        city = GuangDong;
        break;
      case "JiangSu":
        city = JiangSu;
        break;
      case "HeNan":
        city = HeNan;
        break;
      case "HeBei":
        city = HeBei;
        break;
      case "ShanXi":
        city = ShanXi;
        break;
      case "ChongQing":
        city = ChongQing;
        break;
      case "TianJin":
        city = TianJin;
        break;
      case "YunNan":
        city = YunNan;
        break;
      case "SiChuan":
        city = SiChuan;
        break;
      case "AnHui":
        city = AnHui;
        break;
      case "HaiNan":
        city = HaiNan;
        break;
      case "JiangXi":
        city = JiangXi;
        break;
      case "HuBei":
        city = HuBei;
        break;
      case "ShangXi":
        city = ShangXi;
        break;
      case "LiaoNing":
        city = LiaoNing;
        break;
      case "TaiWan":
        city = TaiWan;
        break;
      case "HeiLongJiang":
        city = HeiLongJiang;
        break;
      case "NeiMengGu":
        city = NeiMengGu;
        break;
      case "GuiZhou":
        city = GuiZhou;
        break;
      case "GanSu":
        city = GanSu;
        break;
      case "QingHai":
        city = QingHai;
        break;
      case "XiZang":
        city = XiZang;
        break;
      case "JiLin":
        city = JiLin;
        break;
      case "NingXia":
        city = NingXia;
        break;
      case "ShanDong":
        city = ShanDong;
        break;
      default:
    }

    //$("#cert_province")
    var html = "<option value=''>选择城市</option>";
    for (var i in city) {
      html += "<option value=" + i + ">" + city[i] + "</option>"
    }
    $("#cert_city").html(html)
  })
  //  更新
  $("#update_province").change(function () {
    var that = $(this).val();
    var city = "";
    switch (that) {
      case "ZheJiang":
        city = ZheJiang;
        break;
      case "HuNan":
        city = HuNan;
        break;
      case "FuJian":
        city = FuJian;
        break;
      case "BeiJing":
        city = BeiJing;
        break;
      case "ShangHai":
        city = ShangHai;
        break;
      case "GuangDong":
        city = GuangDong;
        break;
      case "JiangSu":
        city = JiangSu;
        break;
      case "HeNan":
        city = HeNan;
        break;
      case "HeBei":
        city = HeBei;
        break;
      case "ShanXi":
        city = ShanXi;
        break;
      case "ChongQing":
        city = ChongQing;
        break;
      case "TianJin":
        city = TianJin;
        break;
      case "YunNan":
        city = YunNan;
        break;
      case "SiChuan":
        city = SiChuan;
        break;
      case "AnHui":
        city = AnHui;
        break;
      case "HaiNan":
        city = HaiNan;
        break;
      case "JiangXi":
        city = JiangXi;
        break;
      case "HuBei":
        city = HuBei;
        break;
      case "ShangXi":
        city = ShangXi;
        break;
      case "LiaoNing":
        city = LiaoNing;
        break;
      case "TaiWan":
        city = TaiWan;
        break;
      case "HeiLongJiang":
        city = HeiLongJiang;
        break;
      case "NeiMengGu":
        city = NeiMengGu;
        break;
      case "GuiZhou":
        city = GuiZhou;
        break;
      case "GanSu":
        city = GanSu;
        break;
      case "QingHai":
        city = QingHai;
        break;
      case "XiZang":
        city = XiZang;
        break;
      case "JiLin":
        city = JiLin;
        break;
      case "NingXia":
        city = NingXia;
        break;
      case "ShanDong":
        city = ShanDong;
        break;
      default:
    }
    var html = "<option value=''>选择城市</option>";
    for (var i in city) {
      html += "<option value=" + i + ">" + city[i] + "</option>"
    }
    $("#update_city").html(html)
  })

})

