(function(){'use strict';
  
  require.config({
    baseUrl: "./",
  })

  require(['js/glassclient/headloader','js/glassclient/glassloader','js/glassclient/display','js/glassclient/slidereffect','js/glassclient/scrolleffect','js/glassclient/cookie','js/glassclient/framedesign','js/glassclient/legdesign','js/glassclient/color','js/glassclient/fileurlgenerator','js/glassclient/progress'],function(headloader,glassloader,display,slidereffect,scrolleffect,cookie,framedesign,legdesign,color,fileurlgenerator,progress){
    
    var minInterfaceWidth=433,
        headerHeight=75,
        interfaceMarginR=15,
        interfaceMarginB=35,
        designPerHeight=120,
        fdListHeight=Math.ceil(18/3)*designPerHeight,
        ldListHeight=Math.ceil(18/3)*designPerHeight,
        sliderListHeight=270,
        headingHeight=51,
        tabFixedHeight=57,
        scrollHeight=30,
        detaHeight=16,
        
        idTimerHead=null,
        idTimerGlass=null,
        headUrlInterval=100,
        glassUrlInterval=100,
        headDownloadInterval=2000,
        glassDownloadInterval=2000,
        setupDispInterval=50,
        
        frameDesignInfo={
          commontype:"frame_profiles",
          classhead:"Fdesign"
        },
        legDesignInfo={
          commontype:"leg_profiles",
          classhead:"Ldesign"
        },
        idTimerFdesign=null,
        idTimerLdesign=null,
        setupFdesignInterval=1000,
        setupLdesignInterval=1000,
        
        idTimerColor=null,
        setupColorInterval=1000,
        
        idTimerStartLogin=null,
        startLoginInterval=100,
        
        idTimerCreateDeal=null,
        createDealInterval=200,
        
        headFileInfo={
          fileurl:"",
          ursfilelist:["marks.txt", "matrices.bin", "head.bin", "__metadata__"],
          ursbinfilelist:["head.bin"]
        },
        glassFileInfo={
          fileurl:"",
          ursfilelist:["__metadata__", "axis.txt", "frame_dump.bin", "legs_dump_left.bin",
                          "legs_dump_right.bin","lens_dump_left.bin", "lens_dump_right.bin",
                          "params.json", "spheres_dump.txt"],
          ursbinfilelist:["frame_dump.bin", "legs_dump_left.bin", "legs_dump_right.bin",
                              "lens_dump_left.bin", "lens_dump_right.bin"]
        },
        
        userUuid="",
        orderUuid="",
        userName="",
        orderData,
        defaultOrderUuid="be3f2732e8f1068dcec2ae9c94ba90fd",
        loginUrl="./login.html?returnUrl=glassclient.html",
        scannerUrl="./scanner.html",
        adminUrl="/admin/";
        
    //initialization and main entrance
    $(document).ready(function(){
      //disable interface til glass setup done
      $('div.tab-content').css('pointerEvents','none');
      //initialize layout
      updateLayout();
      //start loadprogress effect
      progress.startLoad();
      //start login, then start download in startLogin()
      idTimerStartLogin=setInterval(queryStartLogin,startLoginInterval);
      //initialize Fcolor and Lcolor
      color.setupColor();
      idTimerColor=setInterval(queryColorSetup,setupColorInterval);
      //initialize Fdesign
      framedesign.setupDesign(frameDesignInfo);
      idTimerFdesign=setInterval(queryFdesignSetup,setupFdesignInterval);
      //initialize Ldesign
      legdesign.setupDesign(legDesignInfo);
      idTimerLdesign=setInterval(queryLdesignSetup,setupLdesignInterval);
      //initialize tooltip
      $('[data-toggle="tooltip"]').tooltip();
      //initialize sliderbar
      slidereffect.initCanvasPreview();
      //initialize resizing event
      $(window).resize(function(){
        updateLayout();
      });
      //toggle effect(we put it here because it is trivia but necessary)
      $('div.accordion-heading').click(function(){
        $('#toggled img.accordion-arrow').attr('src','images/glassclient/panel_arrow_hidden.png');
        $('#toggled').removeAttr('id');
        $(this).attr('id','toggled');
        $('#toggled img.accordion-arrow').attr('src','images/glassclient/panel_arrow_selected.png');
      });
      //pills-left effect(we put it here because it is trivia but necessary)
      $('ul.nav li').click(function(){
        $(this).siblings('.nav-selected').removeClass('nav-selected');
        $(this).addClass('nav-selected');
      });
    });
    
    function queryStartLogin(){
      console.log("queryStartLogin");
      if(color.queryIsSetup()&&framedesign.queryIsSetup()&&legdesign.queryIsSetup()){
        clearInterval(idTimerStartLogin);
        idTimerStartLogin=null;
        startLogin();
      }
    };
    
    function startLogin(){
      console.log("startLogin()");
      userUuid=cookie.getCookie("uuid");
      console.log("user uuid: "+userUuid);
      if(userUuid !== ''){
        $.ajax({
          url: "/user", type: 'POST',
          data: {'action': "query", 'uuid': userUuid, 'username': '', 'lastorder': '', 'gender': '', 'orders': ''},
          success: function(data) {
            var userdata=JSON.parse(data);
            if(userdata.result==="true"){
              console.log("user query result: true");
              console.log("user data:");
              console.log(userdata);
              orderUuid=userdata.lastorder;
              userName=userdata.username;
              if(userdata.gender==="male"){
                $('#canvasPreview').css('backgroundImage','url(../images/glassclient/face_male.png)');
              }
              if(orderUuid.length===0){
                alert("没有生成有效订单，请重新扫描。。。");
                location.href=scannerUrl;
              }
              else{
                console.log("orderuuid: "+orderUuid);
              }
              $('#login').html('<a href="./personal.html">'+userName+'</a><a href="##" id="delCookie">退出</a>');
                $('#delCookie').click(function(){
                  cookie.delCookie('uuid');
                  location.href=loginUrl;
              })
            }
            else{
              alert("用户数据错误："+userdata.reason);
              location.href=loginUrl;
            }
            //start head data request
            startDownload();
          },
          error: function(err) {
            alert("请求用户数据错误："+err);
            location.href=loginUrl;
          }
        }); 
      }
      else{
        alert("请先登陆。。。");
        location.href=loginUrl;
      }
    };
    
    function startDownload(){
      fileurlgenerator.startGenerator(orderUuid);
      idTimerHead=setInterval(queryHeadUrl,headUrlInterval);
      idTimerGlass=setInterval(queryGlassUrl,glassUrlInterval);
    }
    
    function queryHeadUrl(){
      console.log("queryHeadUrl");
      var tempheadurl=fileurlgenerator.getHeadUrl();
      if(tempheadurl!==""){
        clearInterval(idTimerHead);
        if(tempheadurl===undefined){
          alert("lastorder订单数据无效，需重新扫描。。。");
          location.href=scannerUrl;
        }
        headFileInfo.fileurl=tempheadurl;
        headloader.downloadData(headFileInfo);
        idTimerHead=setInterval(queryHeadData,headDownloadInterval);
        console.log("queryHeadUrl done");
      }
    };
    
    function queryHeadData(){
      console.log("queryHeadData");
      if(headloader.queryResovedBinFiles().length>0){
        display.setupHead(headloader.queryResovedBinFiles()[0]);
        clearInterval(idTimerHead);
        idTimerHead=setInterval(queryHeadSetup,setupDispInterval);
        console.log("queryHeadData done");
      }
    };
    
    function queryHeadSetup(){
      console.log("queryHeadSetup");
      if(display.queryIsHeadSetup()){
        progress.completeLoad();
        headloader=null;
        clearInterval(idTimerHead);
        idTimerHead=null;
        console.log("queryHeadSetup done");
      }
    };
    
    function queryGlassUrl(){
      console.log("queryGlassUrl");
      var tempglassurl=fileurlgenerator.getGlassUrl();
      if(tempglassurl!==""){
        clearInterval(idTimerGlass);
        glassFileInfo.fileurl=tempglassurl;
        glassloader.downloadData(glassFileInfo);
        idTimerGlass=setInterval(queryGlassData,glassDownloadInterval);
        console.log("queryGlassUrl done");
      }
    };
    
    function queryGlassData(){
      console.log("queryGlassData");
      if(glassloader.queryResovedBinFiles().length>0&&display.queryIsHeadSetup()){
        var framematerial=$("#"+frameDesignInfo.classhead+"-selected").parent().attr("material");
        var legmaterial=$("#"+legDesignInfo.classhead+"-selected").parent().attr("material");
        progress.completeUpdate();
        display.deleteGlass();
        display.setupGlass(glassloader.queryResovedBinFiles(),framematerial,legmaterial);
        clearInterval(idTimerGlass);
        idTimerGlass=setInterval(queryGlassSetup,setupDispInterval);
        console.log("queryGlassData done");
      }
    };
    
    function queryGlassSetup(){
      console.log("queryGlassSetup");
      if(display.queryIsGlassSetup()){
        clearInterval(idTimerGlass);
        idTimerGlass=null;
        console.log("queryGlassSetup done");
        $('div.tab-content').css('pointerEvents','');
      }
    };
    
    //glass data and display can update anytime
    function updateGlass(){
      progress.startUpdate();
      $('div.tab-content').css('pointerEvents','none');
      fileurlgenerator.glassUrlGenerator();
      idTimerGlass=setInterval(queryGlassUrl,glassUrlInterval);
      console.log("updating Glass");
    };
    
    function queryColorSetup(){
      console.log("queryColorSetup");
      if(color.queryIsSetup()){
        console.log("queryColorSetup done");
        clearInterval(idTimerColor);
        idTimerColor=null;
        
        display.changeFrameColor($('#Fcolor-selected').parent().attr('data'));
        display.changeLegsColor($('#Lcolor-selected').parent().attr('data'));
        slidereffect.changeColor($('#Fcolor-selected').parent().attr('data'));
        
        //frame color selection
        $('div.Fcolor-grid').click(function (){
          if($(this).children('img').attr('id')!=='Fcolor-selected'){
            $('#Fcolor-selected').removeAttr('id');
            $(this).children('img').attr('id','Fcolor-selected');
            display.changeFrameColor($(this).attr('data'));
            slidereffect.changeColor($(this).attr('data'));
          }
        });
        
        //leg color selection
        $('div.Lcolor-grid').click(function (){
          if($(this).children('img').attr('id')!=='Lcolor-selected'){
            $('#Lcolor-selected').removeAttr('id');
            $(this).children('img').attr('id','Lcolor-selected');
            display.changeLegsColor($(this).attr('data'));
            var legmaterial=$("#"+legDesignInfo.classhead+"-selected").parent().attr("material");
            if(legmaterial==="metal"){
              alert("金属镜腿的颜色是固定的，不能修改！！！");
            }
          }
        });
      }
    };
    
    //if Fdesign setup, update layout and init event
    function queryFdesignSetup(){
      console.log("queryFdesignSetup");
      if(framedesign.queryIsSetup()){
        console.log("queryFdesignSetup done");
        clearInterval(idTimerFdesign);
        idTimerFdesign=null;
        fdListHeight=Math.ceil($('a.Fdesign').length/3)*designPerHeight;
        updateLayout();
        $('a.Fdesign').click(function (){
          if($(this).children('img').attr('id')!=='Fdesign-selected'){
            console.log("Frame Design Selection: "+$(this).attr('data'));
            $('#Fdesign-selected').removeAttr('id');
            $(this).children('img').attr('id','Fdesign-selected');
            updateGlass();
          }
        });
      }
    };
    
    //if Ldesign setup, update layout and init event
    function queryLdesignSetup(){
      console.log("queryLdesignSetup");
      if(legdesign.queryIsSetup()){
        console.log("queryLdesignSetup done");
        clearInterval(idTimerLdesign);
        idTimerLdesign=null;
        ldListHeight=Math.ceil($('a.Ldesign').length/3)*designPerHeight;
        updateLayout();
        $('a.Ldesign').click(function (){
          if($(this).children('img').attr('id')!=='Ldesign-selected'){
            console.log("Leg Design Selection: "+$(this).attr('data'));
            $('#Ldesign-selected').removeAttr('id');
            $(this).children('img').attr('id','Ldesign-selected');
            updateGlass();
          }
        });
      }
    };
    
    //param change update
    $('#button-param-update').click(function(){
      console.log("Params update event");
      slidereffect.updateParameter();
      updateGlass();
    });
    
    //deal submit
    $('#button-deal-submit').click(function(){
      console.log("deal submit event");
      slidereffect.resetCanvasPreview();
      if(window.confirm('您确定要生成订单吗？')){
        $('div.tab-content').css('pointerEvents','none');
        fileurlgenerator.glassUrlGenerator();
        idTimerCreateDeal=setInterval(queryCreateDeal,createDealInterval);
      }
    });
    
    function queryCreateDeal(){
      console.log("queryCreateDeal");
      //create a new deal by orderuuid and configuuid
      var tempglassurl=fileurlgenerator.getGlassUrl();
      if(tempglassurl!==""){
        clearInterval(idTimerCreateDeal);
        var configuuid=fileurlgenerator.getPresentConfigUuid();
        $.ajax({
          url: "/deal",
          type: "POST",
          data: {
            action: "create",
            owneruuid: orderUuid,
            config: configuuid,
          },
          cache: false,
          success: function(response) {
            location.href=adminUrl;
          },
          error: function(err) {
            alert("提交订单错误："+err);
            $('div.tab-content').css('pointerEvents','');
          },
        })
      }
    }
    
    //deal(head data) download   
    $('#button-deal-download').click(function(){
      console.log("head download event");
      window.open(fileurlgenerator.getHeadUrl());
    });
    
    //camera perspective
    $('#camera-up-button').click(function(){
      display.perspectiveUp();
    });
    $('#camera-front-button').click(function(){
      display.perspectiveFront();
    });
    $('#camera-left-button').click(function(){
      display.perspectiveLeft();
    });
    $('#camera-right-button').click(function(){
      display.perspectiveRight();
    });
    
    //head effect
    $('#head-hide-button').click(function(){
      if(display.headEffectHide()){
        $(this).attr('src','images/glassclient/head_effect_hidden.png');
      }
      else{
        $(this).attr('src','images/glassclient/head_effect_hide.png');
      }
    });
    
    //resizing
    function updateLayout(){
      var windowwidth=window.innerWidth,
          interfacewidth=$('#accordionArea').innerWidth(),
          canvaswidth=Math.ceil(window.innerWidth-interfacewidth-interfaceMarginR),
          canvasheight=window.innerHeight-headerHeight,
          interfaceheight=canvasheight-interfaceMarginB,
          tempcontentheight=interfaceheight-4*headingHeight-tabFixedHeight,
          uppwidth=parseInt($('#updateprogress').css('width')),
          uppheight=parseInt($('#updateprogress').css('height')),
          ldpwidth=parseInt($('#loadprogress').css('width')),
          ldpheight=parseInt($('#loadprogress').css('height'));
          
      //update #interface width & height
      if(windowwidth<1750){
        $('#interface').css('width',minInterfaceWidth);
      }
      else{
        $('#interface').css('width','');
      }
      $('#accordionArea').css('height',interfaceheight);
      
      //update #(F/L)design-list height
      if(tempcontentheight<fdListHeight+detaHeight){
        tempcontentheight-=(scrollHeight)<<1;
        $('#Fdesign-list').css('height',tempcontentheight);
        $('#scroll-up-Fdesign').parent().css('display','block');
        $('#scroll-down-Fdesign').parent().css('display','block');
      }
      else{
        $('#Fdesign-list').css('height',fdListHeight);
        $('#scroll-up-Fdesign').parent().css('display','none');
        $('#scroll-down-Fdesign').parent().css('display','none');
      }
      if(tempcontentheight<ldListHeight+detaHeight){
        tempcontentheight-=(scrollHeight)<<1;
        $('#Ldesign-list').css('height',tempcontentheight);
        $('#scroll-up-Ldesign').parent().css('display','block');
        $('#scroll-down-Ldesign').parent().css('display','block');
      }
      else{
        $('#Ldesign-list').css('height',ldListHeight);
        $('#scroll-up-Ldesign').parent().css('display','none');
        $('#scroll-down-Ldesign').parent().css('display','none');
      }
      
      //update #slider-list-Param display style
      if(tempcontentheight<sliderListHeight+detaHeight){
        $('#canvasPreview').css('display','none');
      }
      else{
        $('#canvasPreview').css('display','block');
      }
      
      //update #updateprogress position
      $('#updateprogress').css({'left':((canvaswidth-uppwidth)>>1),'top':((canvasheight-uppheight)>>1)});
      
      //update #loadprogress position
      $('#loadprogress').css({'left':((canvaswidth-ldpwidth)>>1),'top':((canvasheight-ldpheight)>>1)});
      
      //update #display size
      if(display.queryIsHeadSetup()){
        //update #canvasDisp size
        display.resizeCanvas(canvaswidth,canvasheight);
        //resizing in a sudden needs compensation
        var interfacewidthchanged=$('#accordionArea').innerWidth();
        if(interfacewidthchanged>interfacewidth+1){
          updateLayout();
          console.log("compensation");
        }
      }
      else{
        //update #canvasDisp size
        $('#canvasDisp').attr({'width':canvaswidth,'height':canvasheight});
      }
    };
    
  })
    
}());

