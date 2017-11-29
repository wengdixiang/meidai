define(function(){'use strict';
  var orderUuid="",
      orderData=null,
      configUuid="",
      headFileUrl="",
      glassFileUrl="",
      glassIndex=-1,
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
  
  return{
    startGenerator: startGenerator,
    glassUrlGenerator: glassUrlGenerator,
    getHeadUrl: getHeadUrl,
    getGlassUrl: getGlassUrl,
    getPresentConfigUuid: getPresentConfigUuid,
    getPInfo: getPInfo
  };

});