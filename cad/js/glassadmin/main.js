(function () {
  'use strict';

  require.config({
    baseUrl: "./",
  })

  require(['js/glassadmin/headloader', 'js/glassadmin/glassloader', 'js/glassadmin/display', 'js/glassadmin/scrolleffect', 'js/glassadmin/cookie', 'js/glassadmin/framedesign', 'js/glassadmin/legdesign', 'js/glassadmin/color', 'js/glassadmin/fileurlgenerator', 'js/glassadmin/progress'], function (headloader, glassloader, display, scrolleffect, cookie, framedesign, legdesign, color, fileurlgenerator, progress) {
    // 教学参数


    // 教学参数结束
    var minInterfaceWidth = 433,
      headerHeight = 75,
      interfaceMarginR = 15,
      interfaceMarginB = 35,
      designPerHeight = 120,
      fdListHeight = Math.ceil(18 / 3) * designPerHeight,
      ldListHeight = Math.ceil(18 / 3) * designPerHeight,
      sliderListHeight = 270,
      headingHeight = 51,
      tabFixedHeight = 57,
      scrollHeight = 30,
      detaHeight = 16,
      idTimerColor = null,
      idTimerHead = null,
      idTimerGlass = null,
      headUrlInterval = 100,
      glassUrlInterval = 100,
      headDownloadInterval = 2000,
      glassDownloadInterval = 2000,
      setupDispInterval = 50,
      glass_params_data = {},
      PupilDistance = 0,
      frameDesignInfo = {
        commontype: "frame_profiles",
        classhead: "Fdesign"
      },
      legDesignInfo = {
        commontype: "leg_profiles",
        classhead: "Ldesign"
      },

      idTimerStartLogin = null,
      startLoginInterval = 100,

      headFileInfo = {
        fileurl: "",
        ursfilelist: ["marks.txt", "matrices.bin", "head.bin", "__metadata__"],
        ursbinfilelist: ["head.bin"],
        urstxtfilelist: ["marks.txt"]
      },
      glassFileInfo = {
        fileurl: "",
        ursfilelist: ["__metadata__", "axis.txt", "frame_dump.bin", "legs_dump_left.bin",
          "legs_dump_right.bin", "lens_dump_left.bin", "lens_dump_right.bin",
          "params.json", "spheres_dump.txt"],
        ursbinfilelist: ["frame_dump.bin", "legs_dump_left.bin", "legs_dump_right.bin",
          "lens_dump_left.bin", "lens_dump_right.bin"],
        urstxtfilelist: ["axis.txt"]
      },

      orderUuid = "",
      dealUuid = "",
      dealConfigUuid = "",
      dealCreateDate = "",
      userName = "",
      orderData,
      pInfo,
      defaultOrderUuid = "be3f2732e8f1068dcec2ae9c94ba90fd",
      scannerUrl = "./scanner.html",
      adminUrl = "../admin/",


      domConfigInfo = {
        PupilDistance: {
          domid: "#sliderbarParam0",
          defaultvalue: "62.5",
          dealvalue: "",
          type: "sliderbar"
        },
        EyeDistance: {
          domid: "#sliderbarParam1",
          defaultvalue: "12",
          dealvalue: "",
          type: "sliderbar"
        },
        WidthScale: {
          domid: "#sliderbarParam2",
          defaultvalue: "0.8",
          dealvalue: "",
          type: "sliderbar"
        },
        BridgeSpanRatio: {
          domid: "#sliderbarParam3",
          defaultvalue: "0.4",
          dealvalue: "",
          type: "sliderbar"
        },
        FrontRot: {
          domid: "#sliderbarParam4",
          defaultvalue: "-4",
          dealvalue: "",
          type: "sliderbar"
        },
        MarksOffsetX: {
          domid: "#sliderbarParam5",
          defaultvalue: "0",
          dealvalue: "",
          type: "sliderbar"
        },
        MarksOffsetY: {
          domid: "#sliderbarParam6",
          defaultvalue: "0",
          dealvalue: "",
          type: "sliderbar"
        },
        EarPointOffset: {
          domid: "#sliderbarParam7",
          defaultvalue: "0",
          dealvalue: "",
          type: "sliderbar"
        },
        EarPointOffsetY: {
          domid: "#sliderbarParam8",
          defaultvalue: "0",
          dealvalue: "",
          type: "sliderbar"
        },
        EarPointOffsetX0: {
          domid: "#sliderbarParam9",
          defaultvalue: "0",
          dealvalue: "",
          type: "sliderbar"
        },
        EarPointOffsetX1: {
          domid: "#sliderbarParam10",
          defaultvalue: "0",
          dealvalue: "",
          type: "sliderbar"
        },
        BevelAngle: {
          domid: "#sliderbarParam11",
          defaultvalue: "110",
          dealvalue: "",
          type: "sliderbar"
        },
        BevelWidth: {
          domid: "#sliderbarParam12",
          defaultvalue: "2",
          dealvalue: "",
          type: "sliderbar"
        },
        BevelDepth: {
          domid: "#sliderbarParam13",
          defaultvalue: "0.8",
          dealvalue: "",
          type: "sliderbar"
        },
        LensRotY: {
          domid: "#sliderbarParam14",
          defaultvalue: "-6.0",
          dealvalue: "",
          type: "sliderbar"
        },
        DownBridgeBendingFront: {
          domid: "#sliderbarParam15",
          defaultvalue: "0.0",
          dealvalue: "",
          type: "sliderbar"
        },
        // NosePadWidth:{
        //   domid: "#sliderbarParam16",
        //   defaultvalue: "8.0",
        //   dealvalue: "",
        //   type: "sliderbar"
        // },
        FrameThickness: {
          domid: "#sliderbarParam17",
          defaultvalue: "3.5",
          dealvalue: "",
          type: "sliderbar"
        },
        CarveBridge: {
          domid: "#selectParam0",
          defaultvalue: "true",
          dealvalue: "",
          type: "select"
        },
        BevelTri: {
          domid: "#selectParam1",
          defaultvalue: "true",
          dealvalue: "",
          type: "select"
        },
        GenerateNosePad: {
          domid: "#selectParam2",
          defaultvalue: "true",
          dealvalue: "",
          type: "select"
        },
        LensProfileIdentifier: {
          domid: "#textParam0",
          defaultvalue: "",
          dealvalue: "",
          type: "text"
        },
        FrameColor: {
          domid: "#textParam1",
          defaultvalue: "",
          dealvalue: "",
          type: "text"
        },
        LegProfile: {
          domid: "#textParam2",
          defaultvalue: "",
          dealvalue: "",
          type: "text"
        },
        LegColor: {
          domid: "#textParam3",
          defaultvalue: "",
          dealvalue: "",
          type: "text"
        },
        SlotMessage: {
          domid: "#textParam4",
          defaultvalue: "",
          dealvalue: "",
          type: "text"
        },
        LegMessage: {
          domid: "#textParam5",
          defaultvalue: "",
          dealvalue: "",
          type: "text"
        },
        BridgeMessage: {
          domid: "#textParam6",
          defaultvalue: "",
          dealvalue: "",
          type: "text"
        }
      },
      forceEarPointOverlap = true;
    console.log(domConfigInfo.BridgeMessage.domid)
    //initialization and main entrance
    $(document).ready(function () {
      //disable interface til glass setup done
      $('div.tab-content').css('pointerEvents', 'none');
      //initialize layout
      updateLayout();
      //start loadprogress effect
      progress.startLoad();
      //start login, then start download in startLogin()
      idTimerStartLogin = setInterval(queryStartLogin, startLoginInterval);
      //initialize Fcolor and Lcolor
      color.setupColor();
      //initialize Fdesign
      framedesign.setupDesign(frameDesignInfo);
      //initialize Ldesign
      legdesign.setupDesign(legDesignInfo);
      //initialize tooltip
      $('[data-toggle="tooltip"]').tooltip();
      //initialize sliderbar
      $('input.sliderbarParam').slider({
        formatter: function (value) {
          return 'Current value: ' + value;
        }
      });
      $('input.sliderbarParam').on('slide', function (slideEvt) {
        var id = slideEvt.target.id,
          index = id[id.length - 1],
          param = slideEvt.value;
        $('#' + id).val(param);
        var name = $('#' + id).attr("name");
        $('#sval' + name).html(param);

      });
      $('input.sliderbarParam').on('change', function (slideEvt) {
        var id = slideEvt.target.id,
          index = id[id.length - 1],
          param = slideEvt.value.newValue;
        $('#' + id).val(param);
        var name = $('#' + id).attr("name");
        $('#sval' + name).html(param);
      });
      //initialize resizing event
      $(window).resize(function () {
        updateLayout();
      });
      //toggle effect(we put it here because it is trivia but necessary)
      $('div.accordion-heading').click(function () {
        $('#toggled img.accordion-arrow').attr('src', 'images/glassclient/panel_arrow_hidden.png');
        $('#toggled').removeAttr('id');
        $(this).attr('id', 'toggled');
        $('#toggled img.accordion-arrow').attr('src', 'images/glassclient/panel_arrow_selected.png');
      });
      //pills-left effect(we put it here because it is trivia but necessary)
      $('ul.nav li').click(function () {
        $(this).siblings('.nav-selected').removeClass('nav-selected');
        $(this).addClass('nav-selected');
      });
    });

    function queryStartLogin() {
      console.log("queryStartLogin");
      if (color.queryIsSetup() && framedesign.queryIsSetup() && legdesign.queryIsSetup()) {
        clearInterval(idTimerStartLogin);
        idTimerStartLogin = null;
        startLogin();
      }
    };

    function startLogin() {
      console.log("startLogin()");

      var searchstring = location.search.slice(1),
        searchitems = searchstring.split("&"),
        i = 0,
        len = searchitems.length;
      for (; i < len; ++i) {
        var index = searchitems[i].indexOf("deal=");
        if (index >= 0) {
          dealUuid = searchitems[i].slice(index + 5);
          break;
        }
      }
      //dealUuid="c710a2319bef42b79f70c7ca343fda4a";
      //dealUuid=cookie.getCookie("deal");
      console.log("deal uuid: " + dealUuid);

      if (dealUuid !== '') {
        $.ajax({
          url: "/deal", type: 'POST',
          data: { "action": "query", "uuid": dealUuid, "createdate": "", "config": "", "genprint": "", "owneruuid": "", "config_literal": "", "CarveBridge": "" },
          success: function (data) {
            var dealdata = JSON.parse(data);
            if (dealdata.result === "true") {
              console.log("deal query result: true");
              console.log("deal data:");
              
              console.log(dealdata);
              orderUuid = dealdata.owneruuid;
              dealConfigUuid = dealdata.config;
              PupilDistance=dealdata.config_literal.PupilDistance;
              $('#user_PupilDistance').val(PupilDistance);
              var tempdate = new Date(dealdata.createdate);
              dealCreateDate = tempdate.toLocaleString();
              if (orderUuid.length === 0) {
                alert("订单无效，请重新从商家管理系统链接。。。");
                location.href = adminUrl;
              }
              else {
                console.log("orderuuid: " + orderUuid);
                // fileurlgenerator.load_params_data(orderUuid,14)
              }
              if (dealConfigUuid.length === 0) {
                alert("订单无效，请重新从商家管理系统链接。。。");
                location.href = adminUrl;
              } else {
                console.log("dealconfiguuid: " + dealConfigUuid);
              }
            }
            else {
              alert("订单数据错误：" + dealdata.reason);
              location.href = adminUrl;
            }

            $.ajax({
              url: "/data", type: 'POST',
              data: { "action": "download", "type": "config", "uuid": dealConfigUuid },
              success: function (data) {
                setupDefaultConfig(data, dealdata.config_literal);
                resetDefaultConfig();
                startDownload();
              },
              error: function (err) {
                alert("请求订单数据错误：" + err);
                location.href = adminUrl;
              }
            });

          },
          error: function (err) {
            alert("请求订单数据错误：" + err);
            location.href = adminUrl;
          }
        });
      }
      else {
        alert("没有订单，请重新从商家管理系统链接。。。");
        location.href = adminUrl;
      }
    };

    function startDownload() {
      var tempconfig = generateConfigText();
      fileurlgenerator.startGenerator(orderUuid, tempconfig);
      idTimerHead = setInterval(queryHeadUrl, headUrlInterval);
      idTimerGlass = setInterval(queryGlassUrl, glassUrlInterval);
    }

    function queryHeadUrl() {
      console.log("queryHeadUrl");
      var tempheadurl = fileurlgenerator.getHeadUrl();
      if (tempheadurl !== "") {
        pInfo = fileurlgenerator.getPInfo();
        userName = pInfo.username;
        $('#login').html('<div id="userName">用户昵称：' + userName + '</div><div id="createDate">下单时间：' + dealCreateDate + '</div>');
        clearInterval(idTimerHead);
        if (tempheadurl === undefined) {
          alert("lastorder订单数据无效，需重新扫描。。。");
          location.href = scannerUrl;
        }
        headFileInfo.fileurl = tempheadurl;
        headloader.downloadData(headFileInfo);
        idTimerHead = setInterval(queryHeadData, headDownloadInterval);
        console.log("queryHeadUrl done");
      }
    };

    function queryHeadData() {
      console.log("queryHeadData");
      if (headloader.queryResovedBinFiles().length > 0) {
        display.setupMarkPoints(headloader.queryResovedTxtFiles()[0], forceEarPointOverlap);
        display.setupHead(headloader.queryResovedBinFiles()[0]);
        clearInterval(idTimerHead);
        idTimerHead = setInterval(queryHeadSetup, setupDispInterval);
        console.log("queryHeadData done");
      }
    };

    function queryHeadSetup() {
      console.log("queryHeadSetup");
      if (display.queryIsHeadSetup()) {
        progress.completeLoad();
        headloader = null;
        clearInterval(idTimerHead);
        idTimerHead = null;
        console.log("queryHeadSetup done");
      }
    };

    function queryGlassUrl() {
      console.log("queryGlassUrl");
      var tempglassurl = fileurlgenerator.getGlassUrl();
      if (tempglassurl !== "") {
        clearInterval(idTimerGlass);
        glassFileInfo.fileurl = tempglassurl;
        glassloader.downloadData(glassFileInfo);
        idTimerGlass = setInterval(queryGlassData, glassDownloadInterval);
        console.log("queryGlassUrl done");
      }
    };

    function queryGlassData() {
      console.log("queryGlassData");
      if (glassloader.queryResovedBinFiles().length > 0 && display.queryIsHeadSetup()) {
        progress.completeUpdate();
        display.updateMarkPoints(glassloader.queryResovedTxtFiles()[0]);
        var framematerial = $("#" + frameDesignInfo.classhead + "-selected").parent().attr("material");
        var legmaterial = $("#" + legDesignInfo.classhead + "-selected").parent().attr("material");
        display.deleteGlass();
        display.setupGlass(glassloader.queryResovedBinFiles(), framematerial, legmaterial);
        clearInterval(idTimerGlass);
        idTimerGlass = setInterval(queryGlassSetup, setupDispInterval);
        console.log("queryGlassData done");
      }
    };

    function queryGlassSetup() {
      console.log("queryGlassSetup");
      if (display.queryIsGlassSetup()) {
        clearInterval(idTimerGlass);
        idTimerGlass = null;
        console.log("queryGlassSetup done");
        if (test == 1) {
          setup();
        }
        $('div.tab-content').css('pointerEvents', '');
        if (on_off == 1) {
          if (dealUuid == "5cae6d62e944c9bf576bb416ac04ab86") {
            $("title").html("模型调整教学")
            console.log(on_off)
            teaching()
            test = 1;
            on_off = 2;
          }

        }
      }
    };

    //glass data and display can update anytime
    function updateGlass() {
      progress.startUpdate();
      $('div.tab-content').css('pointerEvents', 'none');
      var tempconfig = generateConfigText();
      fileurlgenerator.glassUrlGenerator(tempconfig);
      idTimerGlass = setInterval(queryGlassUrl, glassUrlInterval);
      console.log("updating Glass");
    };

    //param change update
    $('#button-param-update').click(function () {
      console.log("Params update event");
      updateGlass();
     
    });

    $('#button-markp-disp').click(function () {
      display.markPEffectHide();
    });

    $('#button-marki-disp').click(function () {
      display.markIEffectHide();
    });

    $('#button-param-reset').click(function () {
      if (window.confirm('您确定要重置参数吗？')) {
        resetDefaultConfig();
      }
    });

    //deal refresh
    $('#button-deal-refresh').click(function () {
      console.log("deal refresh event");
      if (test == 1) {
        if (window.confirm('您确定要修改订单里的参数吗？')) {
          location.href = adminUrl;
        }

      } else {
        if (window.confirm('您确定要修改订单里的参数吗？')) {
          var literaltext = generateLiteralText();
          console.log("upload literal:");
          console.log(literaltext);
          $.ajax({
            url: "/deal",
            type: "POST",
            data: {
              action: "update",
              uuid: dealUuid,
              config_literal: literaltext,
            },
            cache: false,
            success: function (response) {

              var updateresult = JSON.parse(response);
              if (updateresult.result === "true") {
                var carve_switch = $("#selectParam0").val();

                var carve = $(domConfigInfo.BridgeMessage.domid).val();
                console.log(carve_switch)
                if (carve_switch == "false") {
                  carve = "";
                }
                var carve_data = { "carve": carve }
                var tmp_carve_data = {
                  "action": "update",
                  "uuid": dealUuid,
                  "scratch": JSON.stringify(carve_data)
                };

                console.log(tmp_carve_data);
                $.ajax({
                  url: "/deal",
                  type: "post",
                  data: tmp_carve_data,
                  success: function (data) {

                    var data = JSON.parse(data);
                    if (data.result === "true") {
                      if (carve_switch == "false") {
                        alert("刻字取消")
                      } else {
                        alert("刻字修改成功");
                      }

                      $.ajax({
                        url: "/deal",
                        type: "POST",
                        data: {
                          action: "refresh",
                          uuid: dealUuid
                        },
                        cache: false,
                        success: function (response) {

                          var refreshresult = JSON.parse(response);
                          if (refreshresult.result === "true") {
                            alert("提交模型刷新成功");
                            location.href = adminUrl;
                          } else {
                            alert("提交模型刷新失败: " + refreshresult.reason)
                          }

                        },
                        error: function (err) {
                          alert("请求提交模型刷新失败：" + err);
                        },
                      })

                    } else {
                      alert("刻字修改失败")
                    }
                  },
                  error: function () {
                    alert("提交修改订单失败: " + updateresult.reason)
                  }

                });

              } else {
                alert("提交修改订单失败: " + updateresult.reason)
              }
            },
            error: function (err) {
              alert("请求提交订单修改失败：" + err);
            },
          })
        }
      }


    });

    //deal(head data) download   
    $('#button-deal-download').click(function () {
      console.log("head download event");
      window.open(fileurlgenerator.getHeadUrl());
    });

    //camera perspective
    $('#camera-up-button').click(function () {
      display.perspectiveUp();
    });
    $('#camera-front-button').click(function () {
      display.perspectiveFront();
    });
    $('#camera-rear-button').click(function () {
      display.perspectiveRear();
    });
    $('#camera-left-button').click(function () {
      display.perspectiveLeft();
    });
    $('#camera-right-button').click(function () {
      display.perspectiveRight();
    });

    //head effect
    $('#head-hide-button').click(function () {
      if (display.headEffectHide()) {
        $(this).attr('src', 'images/glassclient/head_effect_hidden.png');
      }
      else {
        $(this).attr('src', 'images/glassclient/head_effect_hide.png');
      }
    });

    //resizing
    function updateLayout() {
      var windowwidth = window.innerWidth,
        interfacewidth = $('#accordionArea').innerWidth(),
        canvaswidth = Math.ceil(window.innerWidth - interfacewidth - interfaceMarginR),
        canvasheight = window.innerHeight - headerHeight,
        interfaceheight = canvasheight - interfaceMarginB,
        tempcontentheight = interfaceheight - 4 * headingHeight - tabFixedHeight,
        uppwidth = parseInt($('#updateprogress').css('width')),
        uppheight = parseInt($('#updateprogress').css('height')),
        ldpwidth = parseInt($('#loadprogress').css('width')),
        ldpheight = parseInt($('#loadprogress').css('height'));

      //update #interface width & height
      if (windowwidth < 1750) {
        $('#interface').css('width', minInterfaceWidth);
      }
      else {
        $('#interface').css('width', '');
      }
      $('#accordionArea').css('height', interfaceheight);

      //update #(F/L)design-list height
      if (tempcontentheight < fdListHeight + detaHeight) {
        tempcontentheight -= (scrollHeight) << 1;
        $('#Fdesign-list').css('height', tempcontentheight);
        $('#scroll-up-Fdesign').parent().css('display', 'block');
        $('#scroll-down-Fdesign').parent().css('display', 'block');
      }
      else {
        $('#Fdesign-list').css('height', fdListHeight);
        $('#scroll-up-Fdesign').parent().css('display', 'none');
        $('#scroll-down-Fdesign').parent().css('display', 'none');
      }
      if (tempcontentheight < ldListHeight + detaHeight) {
        tempcontentheight -= (scrollHeight) << 1;
        $('#Ldesign-list').css('height', tempcontentheight);
        $('#scroll-up-Ldesign').parent().css('display', 'block');
        $('#scroll-down-Ldesign').parent().css('display', 'block');
      }
      else {
        $('#Ldesign-list').css('height', ldListHeight);
        $('#scroll-up-Ldesign').parent().css('display', 'none');
        $('#scroll-down-Ldesign').parent().css('display', 'none');
      }

      //update #slider-list-Param display style
      if (tempcontentheight < sliderListHeight + detaHeight) {
        $('#canvasPreview').css('display', 'none');
      }
      else {
        $('#canvasPreview').css('display', 'block');
      }

      //update #updateprogress position
      $('#updateprogress').css({ 'left': ((canvaswidth - uppwidth) >> 1), 'top': ((canvasheight - uppheight) >> 1) });

      //update #loadprogress position
      $('#loadprogress').css({ 'left': ((canvaswidth - ldpwidth) >> 1), 'top': ((canvasheight - ldpheight) >> 1) });

      $('#canvasMark').attr({ 'width': canvaswidth, 'height': canvasheight });
      //update #display size
      if (display.queryIsHeadSetup()) {
        //update #canvasDisp size
        display.resizeCanvas(canvaswidth, canvasheight);
        //resizing in a sudden needs compensation
        var interfacewidthchanged = $('#accordionArea').innerWidth();
        if (interfacewidthchanged > interfacewidth + 1) {
          updateLayout();
          console.log("compensation");
        }
      }
      else {
        //update #canvasDisp size
        $('#canvasDisp').attr({ 'width': canvaswidth, 'height': canvasheight });
      }
    };

    function setupDefaultConfig(configdata, literaldata) {
      //update config data
      // console.log(configdata)
      var linelist = configdata.split("\n");
      for (var i = 0, len = linelist.length; i < len; ++i) {
        var lineinfo = linelist[i].split(" ");
        var configinfo = domConfigInfo[lineinfo[0]];
        if (configinfo !== undefined) {
          var tempvalue = lineinfo[1];
          var templength = tempvalue.length;
          if (templength > 2 && tempvalue[templength - 2] === "." && tempvalue[templength - 1] === "0") {
            tempvalue = tempvalue.substr(0, templength - 2);
          }
          configinfo.dealvalue = tempvalue;
          configinfo.defaultvalue = tempvalue;
        }
        //read forceEarPointOverlap for setupMarkPoints
        if (lineinfo[0] === "ForceEarPointOverlap") {
          console.log("ForceEarPointOverlap");
          console.log(lineinfo[1]);
          if (lineinfo[1] === "false") {
            forceEarPointOverlap = false;
          }
        }
      }
      //update literal data
      var tempobj,
        configinfo,
        tempvalue;
      for (tempobj in literaldata) {
        configinfo = domConfigInfo[tempobj];
        if (configinfo !== undefined) {
          var tempvalue = literaldata[tempobj];
          var templength = tempvalue.length;
          if (templength > 2 && tempvalue[templength - 2] === "." && tempvalue[templength - 1] === "0") {
            tempvalue = tempvalue.substr(0, templength - 2);
          }
          configinfo.dealvalue = tempvalue;
          configinfo.defaultvalue = tempvalue;
        }
      }

      setupFLDesignColor();
      console.log("setupDefaultConfig done");
    };

    function resetDefaultConfig() {
      var tempobj,
        configinfo,
        tempvalue;
      for (tempobj in domConfigInfo) {
        configinfo = domConfigInfo[tempobj];
        tempvalue = configinfo.defaultvalue;
        if (tempvalue !== undefined) {
          $(configinfo.domid).val(tempvalue);
          if (configinfo.type === "sliderbar") {
            $(configinfo.domid).slider('setValue', tempvalue);
            var name = tempobj;
            $('#sval' + name).html(tempvalue);
          }
        }
      }
      console.log("resetDefaultConfig done");
    };

    function generateConfigText() {
      var tempconfig = "",
        tempobj,
        configinfo,
        tempvalue;
      for (tempobj in domConfigInfo) {
        configinfo = domConfigInfo[tempobj];
        tempvalue = $(configinfo.domid).val();
        if (tempvalue !== undefined && tempvalue.length !== 0) {
          tempconfig += tempobj + " " + tempvalue + "\n";
        }
      }
      return tempconfig;
    };

    function generateLiteralText() {
      var literalconfig = {};
      var tempconfig = "",
        tempobj,
        configinfo,
        tempvalue;
      for (tempobj in domConfigInfo) {
        configinfo = domConfigInfo[tempobj];
        tempvalue = $(configinfo.domid).val();
        if (tempvalue !== undefined && tempvalue !== configinfo.dealvalue) {
          literalconfig[tempobj] = tempvalue;
        }
      }
      return JSON.stringify(literalconfig);
    };

    function setupFLDesignColor() {
      var framedesign = domConfigInfo["LensProfileIdentifier"].defaultvalue,
        framecolor = domConfigInfo["FrameColor"].defaultvalue,
        legdesign = domConfigInfo["LegProfile"].defaultvalue,
        legcolor = domConfigInfo["LegColor"].defaultvalue;
      //update frame and leg 
      var selectfdesign = $('a[data="' + framedesign + '"]');
      if (selectfdesign.children('img').attr('id') !== 'Fdesign-selected') {
        console.log("Frame Design Selection: " + $(selectfdesign).attr('data'));
        $('#Fdesign-selected').removeAttr('id');
        $(selectfdesign).children('img').attr('id', 'Fdesign-selected');
      }
      var selectfcolor = $('div[data="' + framecolor + '"]');
      if ($(selectfcolor).children('img').attr('id') !== 'Fcolor-selected') {
        $('#Fcolor-selected').removeAttr('id');
        $(selectfcolor).children('img').attr('id', 'Fcolor-selected');
        display.changeFrameColor($(selectfcolor).attr('data'));
      }
      var selectldesign = $('a[data="' + legdesign + '"]');
      if (selectldesign.children('img').attr('id') !== 'Ldesign-selected') {
        console.log("Leg Design Selection: " + $(selectldesign).attr('data'));
        $('#Ldesign-selected').removeAttr('id');
        $(selectldesign).children('img').attr('id', 'Ldesign-selected');
      }
      var selectlcolor = $('div[data="' + legcolor + '"]');
      if ($(selectlcolor).children('img').attr('id') !== 'Lcolor-selected') {
        $('#Lcolor-selected').removeAttr('id');
        $(selectlcolor).children('img').attr('id', 'Lcolor-selected');
        display.changeLegsColor($(selectlcolor).attr('data'));
      }
    };
    $("#button-obvious").click(function () {
      if ($(this).html() == "高亮显示") {
        console.log("highlight");
        $(this).html("取消高亮")
        display.changeFrameColor("0xffffffff");
      } else {
        var tmp_color = $("#textParam1").val();
        console.log(tmp_color);
        display.changeFrameColor(tmp_color);
        $(this).html("高亮显示")
      }

    });
    // 个人信息
  //  fileurlgenerator.load_params_data()
  })
  // 教学程序
  var on_off = 1, test;
  var step_one,
    step_two,
    step_three,
    step_four,
    step_five,
    explain_one,
    explain_two,
    explain_three,
    explain_four,
    explain_five,
    GenerateNosePad_val,
    CarveBridge_val,
    MarksOffsetX_val,
    MarksOffsetY_val,
    EarPointOffset_val,
    EarPointOffsetY_val,
    EarPointOffsetX0_val,
    EarPointOffsetX1_val;
  var hint = $("#hint");
  var hint_text = $("#hint-content");
  var explain_text = $("#explain");

  function teaching() {
    $("#box-hint").show();
    $("#box").show();
    $("#hint").show();
    let num = 1,
      uuid;
    $.ajax({
      url: "/common",
      type: 'POST',
      data: {
        "action": "list",
        "type": "text",
      },
      success: function (data) {
        var data = JSON.parse(data)
        uuid = data.list[0]
        console.log(uuid)
        $.ajax({
          url: "/common",
          type: "post",
          data: {
            "action": "query",
            "type": "text",
            "uuid": uuid,
            "content": ""
          },
          success: function (data) {
            var data = JSON.parse(data)
            if (data.result == "true") {
              let content = JSON.parse(data.content);
              console.log(content.step_one)
              step_one = content.step_one;
              step_two = content.step_two
              step_three = content.step_three
              step_four = content.step_four
              step_five = content.step_five
              explain_one = content.explain_one
              explain_two = content.explain_two
              explain_three = content.explain_three
              explain_four = content.explain_four
              explain_five = content.explain_five
              GenerateNosePad_val = content.GenerateNosePad_val
              CarveBridge_val = content.CarveBridge_val
              MarksOffsetX_val = content.MarksOffsetX_val
              MarksOffsetY_val = content.MarksOffsetY_val
              EarPointOffset_val = content.EarPointOffset_val
              EarPointOffsetY_val = content.EarPointOffsetY_val
              EarPointOffsetX0_val = content.EarPointOffsetX0_val
              EarPointOffsetX1_val = content.EarPointOffsetX1_val
            }

          },
          error: function () {
            alert("更新失败")
          }
        })
      },
      error: function () {
        alert("false")
      }
    })
    $("#camera-right-button").one("click", function () {

      $(this).removeClass("highlight");
      hint_text.html("点击这里能将头像模型向后转")
      hint.css({ top: "105px", left: "140px" });
      $("#camera-rear-button").addClass("highlight")
    })
    $("#camera-rear-button").one("click", function () {

      $(this).removeClass("highlight")
      hint_text.html("点击这里能将头像模型向左转")
      hint.css({ top: "145px", left: "85px" });
      $("#camera-left-button").addClass("highlight")
    })
    $("#camera-left-button").one("click", function () {

      $(this).removeClass("highlight")
      hint_text.html("点击这里能从上面看头像模型")
      hint.css({ top: "145px", left: "135px" });
      $("#camera-up-button").addClass("highlight")
    })
    $("#camera-up-button").one("click", function () {

      $(this).removeClass("highlight")
      hint_text.html("点击这里能将头像模型向转到前面")
      hint.css({ top: "185px", left: "135px" });
      $("#camera-front-button").addClass("highlight")
    })
    $("#camera-front-button").one("click", function () {

      $(this).removeClass("highlight")
      hint_text.html("点击这里能将头像隐藏只显示眼镜跟标记")
      hint.css({ top: "225px", left: "135px" });
      $("#head-hide-button").addClass("highlight")
    })
    $("#head-hide-button").on("click", function () {

      if (num == 1) {

        hint_text.html("再次点击能显示头像")
        num++;
      } else if (num == 2) {

        $(this).removeClass("highlight")
        hint.css({ display: "none" });
        $("#hint-right").css("display", "block")
        $("#box").css("width", "25.8%")
        $(".nav").addClass("highlight-right")
        $("#remind-sub").show();
        $("#box-hint").css({ left: "auto", right: "650px" });
        $("#box_explain").show();
        //  $("#param-list-gene").addClass("highlight-right");
        $("#button-param-update").addClass("highlight-right")
        $("#button-markp-disp").addClass("highlight-right")
        $("#button-marki-disp").addClass("highlight-right")
        $("#param-list-msge li:nth-child(1)").addClass("highlight-right")
        $("#param-list-msge li:nth-child(4)").addClass("highlight-right")
        $("#param-list-eye li:nth-child(1)").addClass("highlight-right")
        hint_text.html(step_one);
        explain_text.html(explain_one);
        num++;
      }

    })

    // right
    // $(".nav>li:nth-child(1)").click(function(){
    //   hint_text.html("这里能看到眼镜的外观颜色，是不能修改的")
    // })
    // $(".nav>li:nth-child(2)").click(function(){
    //   hint_text.html("这里能修改眼镜参数，改完可以点击刷新按钮查看模型变化，如果不满意可以再修改刷新或重置")
    // })
    // $(".nav>li:nth-child(3)").click(function(){
    //   hint_text.html("这里能修改校准参数，改完可以点击刷新按钮查看模型变化，如果不满意可以再修改刷新或重置")
    // })
    // $(".nav>li:nth-child(4)").click(function(){
    //   hint_text.html("这里能修改刻字参数，改完可以点击刷新按钮查看模型变化，如果看不清可以点击高亮显示查看刻字信息，如果不满意可以再修改刷新或重置")
    // })
    // $(".nav>li:nth-child(5)").click(function(){
    //   hint_text.html("这里能修改导角参数，改完可以点击刷新按钮查看模型变化，如果不满意可以再修改刷新或重置")
    // })
    $(".accordion-heading").click(function () {
      $("#hint-right").css("display", "block");
      $("#remind-sub").css({ top: "10px" })
      $("#remind-sub").html("修改完了点这里<img src='images/finger.png'>")
    })
    $("#panelDeal").click(function (e) {
      $("#hint-right").css("display", "none");
      $("#remind-sub").css({ top: "-40px" });
      $("#remind-sub").html("想继续修改点这里<img src='images/finger.png'>")
      hint_text.html("点击提交修改就能把数据提交，如果提交后还想修改，可以继续进入此页面修改提交")
    })
    $("#remind-sub").click(function (e) {
      window.event.cancelBubble = true;
    })

  }
  // 刷新按钮操作
  var num_button = 1;
  function setup() {
    let FrontRot = $("#sliderbarParam4").val(),
      MarksOffsetX = $("#sliderbarParam5").val(),
      MarksOffsetY = $("#sliderbarParam6").val(),
      EarPointOffset = $("#sliderbarParam7").val(),
      EarPointOffsetY = $("#sliderbarParam8").val(),
      EarPointOffsetX0 = $("#sliderbarParam9").val(),
      EarPointOffsetX1 = $("#sliderbarParam10").val(),
      GenerateNosePad = $("#selectParam2").val(),
      CarveBridge = $("#selectParam0").val();


    if (num_button == 1) {
      if (CarveBridge == GenerateNosePad_val) {
        if (GenerateNosePad == CarveBridge_val) {
          num_button = 2;
          alert("第一步完成");
          hint_text.html(step_two + "<u>（当前模型请调整到:" + MarksOffsetX_val + ")</u>")
          explain_text.html(explain_two);
          $("#param-list-msge li:nth-child(1)").removeClass("highlight-right")
          $("#param-list-msge li:nth-child(4)").removeClass("highlight-right")
          $("#param-list-eye li:nth-child(1)").removeClass("highlight-right")
          $("#param-list-cali li:nth-child(2)").addClass("highlight-right");
          $("#finger>li:nth-child(2)").css("visibility", "inherit")
          $("#finger>li:nth-child(1)").css("visibility", "hidden")
          $("#finger>li:nth-child(3)").css("visibility", "hidden")
        } else {
          alert("鼻托没有打开")
        }
      } else {
        alert("鼻中刻字没有打开")
      }
    } else if (num_button == 2) {
      if (MarksOffsetX == MarksOffsetX_val) {
        num_button = 3;
        alert("第二步完成");
        hint_text.html(step_three + "<u>（当前模型请调整到:" + MarksOffsetY_val + ")</u>")
        explain_text.html(explain_three);
        $("#param-list-cali li:nth-child(2)").removeClass("highlight-right");
        $("#param-list-cali li:nth-child(3)").addClass("highlight-right");
      } else {
        alert("距离没调准哦")
      }
    } else if (num_button == 3) {
      if (MarksOffsetY == MarksOffsetY_val) {
        num_button = 4;
        alert("第三步完成");
        hint_text.html(step_four + "<u>（当前模型请调整到:" + EarPointOffset_val + ")</u>")
        explain_text.html(explain_four);
        $("#param-list-cali li:nth-child(3)").removeClass("highlight-right");
        $("#param-list-cali li:nth-child(4)").addClass("highlight-right");
      } else {
        alert("没调准哦")
      }
    } else if (num_button == 4) {
      if (EarPointOffset == EarPointOffset_val) {
        num_button = 5;
        alert("第四步完成");
        hint_text.html(step_five + "<u>（当前模型请调整到:" + EarPointOffsetY_val + "," + EarPointOffsetX0_val + "," + EarPointOffsetX1_val + ")</u>");
        explain_text.html(explain_five);
        $("#param-list-cali li:nth-child(4)").removeClass("highlight-right");
        $("#param-list-cali li:nth-child(5)").addClass("highlight-right");
        $("#param-list-cali li:nth-child(6)").addClass("highlight-right");
        $("#param-list-cali li:nth-child(7)").addClass("highlight-right");
      } else {
        alert("没调准哦")
      }
    } else if (num_button == 5) {
      if (EarPointOffsetY == EarPointOffsetY_val) {
        if (EarPointOffsetX0 == EarPointOffsetX0_val) {
          if (EarPointOffsetX1 == EarPointOffsetX1_val) {
            alert("调整完成");
            $("#box").css("display", "none");
            hint_text.html("调整完了，可以去提交修改了，如果提交后还有不满意的地方可以再次进入页面调整提交")
            $("#box_explain").hide();
            $("#param-list-cali li:nth-child(5)").removeClass("highlight-right");
            $("#param-list-cali li:nth-child(6)").removeClass("highlight-right");
            $("#param-list-cali li:nth-child(7)").removeClass("highlight-right");
            $("#finger>li:nth-child(2)").css("visibility", "hidden")
          } else {
            alert("左耳上点左右位移:没调准")
          }
        } else {
          alert("右耳上点左右位移:没调准")
        }
      } else {
        alert("耳上点上下位移:没调准")
      }
    }
    console.log(FrontRot, MarksOffsetX, MarksOffsetY, EarPointOffset, EarPointOffsetY, EarPointOffsetX0, EarPointOffsetX1)
  }
}());

