define(function(){'use strict';
  var orderUuid="",
      orderData=null,
      configUuid="",
      headFileUrl="",
      glassFileUrl="",
      glassIndex=-1,
      glass_params_data={},
      pInfo=null;
      
  function startGenerator(fromorderuuid, tempconfig){
    orderUuid=fromorderuuid;
    $.ajax({
      url: "/order", type: 'POST', 
      data: {"action": "query", "uuid": orderUuid, "head": "", "config": "", "genobj": "", "params":"", "deals":"", "createdate": "", "pinfo": ""},
      success: function(data) {
        orderData=JSON.parse(data);
        console.log("initial orderdata:");
        console.log(orderData);
        pInfo=orderData.pinfo;
        if(orderData.head===""){
          headFileUrl=undefined;
        }
        else{
          headFileUrl="/data?action=download&type=head&uuid="+orderData.head;
          glassUrlGenerator(tempconfig);
        }
      },
      error: function(err) {
        console.log("order query error: ");
        console.log(err);
      }
    });
  };
  
  function glassUrlGenerator(tempconfig){
    
    configUuid="";
    glassFileUrl="";
    
    console.log("uploading config:");
    console.log(tempconfig);

    var blob = new Blob([tempconfig], {type : 'application/json'}),
        formdata = new FormData();       
    formdata.append('file', blob);
    formdata.append('owneruuid', orderUuid);
    formdata.append('type', 'config');
    $.ajax({
      url: "/data?action=upload",
      type: "POST",
      processData: false,
      contentType: false,
      enctype: "multipart/form-data",
      data: formdata,
      cache: false,
      success: function(data) {
        var configinfo=JSON.parse(data);
        console.log("configinfo");
        console.log(configinfo);
        configUuid=configinfo.uuid;
        if(configinfo.result==="true"){
          var i=0,
              len=orderData.config.length;
          for(;i<len;++i){
            if(configUuid===orderData.config[i]){
              glassIndex=i;
              _generateOldGlassUrl();
              break;
            }
          }
          if(i===len){
            glassIndex=len;
            _generateNewGlassUrl();
          }
        }
        else{
          console.log("invalid config file upload: ");          
        }
      },
      error: function(err) {
        console.log("config upload error: ");
        console.log(err);
      },
    });
  };
  
  function _generateOldGlassUrl(){
    load_params_data(orderUuid,glassIndex)
    console.log("_generateOldGlassUrl  "+glassIndex);
    glassFileUrl="/data?action=download&type=genobj&uuid="+orderData.genobj[glassIndex];
  };
  
  function _generateNewGlassUrl(){
    console.log("_generateNewGlassUrl  "+glassIndex);
    $.ajax({
      url: "/order", type: 'POST', 
      data: {"action": "query", "uuid": orderUuid, "head": "", "config": "", "genobj": "", "params":"", "deals":""},
      success: function(data) {
        orderData=JSON.parse(data);
        if(glassIndex>orderData.genobj.length-1){
          console.log("waiting for making glass...");
          setTimeout(_generateNewGlassUrl,1000);
        }
        else{
          console.log("new orderdata:");
          load_params_data(orderUuid,glassIndex)
          console.log(orderData);
          glassFileUrl="/data?action=download&type=genobj&uuid="+orderData.genobj[glassIndex];          
        }
      },
      error: function(err) {
        console.log("order query error: ");
        console.log(err);
      }
    });
  };
  
  function getHeadUrl(){
    return headFileUrl;
  };
  
  function getGlassUrl(){
    return glassFileUrl;
  };
  
  function getPresentConfigUuid(){
    if(glassIndex>=0){
      return orderData.config[glassIndex];
    }else{
      return "";
    }
  }
  
  function getPInfo(){
    return pInfo;
  }
  function load_params_data(orderUuid,index) {
    console.log(orderUuid)
    var order_data = {
      "action": "query",
      "uuid": orderUuid,
      "params": '',
    }
    console.log(order_data)
    $.ajax({
      type: "post",
      data: order_data,
      dataType: "json",
      url: "/order",
      success: function (data) {
        console.log(data)
        
        var params_uuid = '';
        if (data.params!= undefined) {
          params_uuid = data.params[index]
          var post_data = {
            'action': 'download',
            'type': 'params',
            'uuid': params_uuid
          };
          console.log(post_data)
          $.ajax({
            type: 'post',
            data: post_data,
            async: false,
            dataType: 'json',
            url: "/data",
            success: function (data) {
                for(var  i in data){
                  glass_params_data[i] = data[i];
              }
              userInfo();
              console.log(glass_params_data)
            },
            error: function () {

            }
          })
        }

      },
      error: function () {
        console.log("获取失败")
      }
    })
  };
  function userInfo() {
    function inspect_data(obj, key) {
      var tmp_key = obj.hasOwnProperty(key) ? obj[key] : '';
      return tmp_key;
    }
    // 脸部宽度 EPWidth
    $('#user_EPWidth').val(inspect_data(glass_params_data, "EPWidth"));
    // 脸部长度 FaceHeight
    $('#user_FaceHeight').val(inspect_data(glass_params_data, "FaceHeight"));
    // 鼻梁宽度 NoseWidth
    $('#user_NoseWidth').val(inspect_data(glass_params_data, "NoseWidth"));
    // 鼻梁高度 NoseHeight
    $('#user_NoseHeight').val(inspect_data(glass_params_data, "NoseHeight"));
    // 左侧脸宽 LeftFaceWidth
    $('#user_LeftFaceWidth').val(inspect_data(glass_params_data, "LeftFaceWidth"));
    // 右侧脸宽 RightFaceWidth
    $('#user_RightFaceWidth').val(inspect_data(glass_params_data, "RightFaceWidth"));
    // // 左眼视力  left_degrees
    // $('#user_left_degrees').val(inspect_data(glass_collecteddata_data,"left_degrees"));
    // // 右眼视力 right_degrees
    // $('#user_right_degrees').val(inspect_data(glass_collecteddata_data,"right_degrees"));
    // // 左眼散光 left_cyl
    // $('#user_left_cyl').val(inspect_data(glass_collecteddata_data,"left_cyl"));
    // // 右眼散光 right_cyl
    // $('#user_right_cyl').val(inspect_data(glass_collecteddata_data,"right_cyl"));


    // // 左眼轴向 left_axis
    // $('#user_left_axis').val(inspect_data(glass_collecteddata_data,"left_axis"));
    // // 右眼轴向 right_axis
    // $('#user_right_axis').val(inspect_data(glass_collecteddata_data,"right_axis"));

    // 瞳距 PupilDistance
    // $('#user_PupilDistance').val(PupilDistance);

    // left_axis

    // 镜框宽度 FrameWidth
    $('#user_FrameWidth').val(inspect_data(glass_params_data, "FrameWidth"));
    // 镜框高度 FrameHeight
    $('#user_FrameHeight').val(inspect_data(glass_params_data, "FrameHeight"));
    // 左鼻托高 LeftNosePadHeight
    $('#user_LeftNosePadHeight').val(inspect_data(glass_params_data, "LeftNosePadHeight"));
    // 右鼻托高 RightNosePadHeight
    $('#user_RightNosePadHeight').val(inspect_data(glass_params_data, "RightNosePadHeight"));
    // 左腿长度 LeftLegLength
    $('#user_LeftLegLength').val(inspect_data(glass_params_data, "LeftLegLength"));
    // 右腿长度 RightLegLength
    $('#user_RightLegLength').val(inspect_data(glass_params_data, "RightLegLength"));
    // 镜片宽度 LensWidth
    $('#user_LensWidth').val(inspect_data(glass_params_data, "LensWidth"));
    // 镜片高度 LensHeight
    $('#user_LensHeight').val(inspect_data(glass_params_data, "LensHeight"));
    // 中梁宽 BridgeWidth
    $('#user_BridgeWidth').val(inspect_data(glass_params_data, "BridgeWidth"));
  }
  return{
    startGenerator: startGenerator,
    glassUrlGenerator: glassUrlGenerator,
    getHeadUrl: getHeadUrl,
    getGlassUrl: getGlassUrl,
    getPresentConfigUuid: getPresentConfigUuid,
    getPInfo: getPInfo,
    load_params_data:load_params_data
  };

});