define(function(){'use strict';
  var orderUuid="",
      orderData=null,
      configUuid="",
      headFileUrl="",
      glassFileUrl="",
      glassIndex=-1,
      j=0,
    tempconfigparam,
      domConfigInfo={
        selectiveitems:{
          Fdesign:{
            name:"LensProfileIdentifier",
            domid:"#Fdesign-selected"
          },
          Fcolor:{
            name:"FrameColor",
            domid:"#Fcolor-selected"
          },
          Ldesign:{
            name:"LegProfile",
            domid:"#Ldesign-selected"
          },
          Lcolor:{
            name:"LegColor",
            domid:"#Lcolor-selected"
          }
        },
        sliderparams:{
          Param0:{
            name:"WidthScale",
            domid:"#sliderbarParam0"
          },
          Param1:{
            name:"BridgeSpanRatio",
            domid:"#sliderbarParam1"
          }
        }
      };

 function glassupLoad(orderUuid){
   tempconfigparam=$("#Fdesign-list").children().children();
    configUuid="";
    glassFileUrl="";
    j++;
  var tempconfig = "",
      tempobj,
      tempselectiveitems=domConfigInfo.selectiveitems,
      tempsliderparams=domConfigInfo.sliderparams;

        for(tempobj in tempselectiveitems){
          tempconfig+=tempselectiveitems[tempobj].name+" "+tempconfigparam.eq(j).attr("data")+"\n";;
        }
        for(tempobj in tempsliderparams){
          tempconfig+=tempsliderparams[tempobj].name+" "+$(tempsliderparams[tempobj].domid).attr("data")+"\n";

        console.log(tempconfig)
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
        console.log(configinfo,j);
        configUuid=configinfo.uuid;
        if(configinfo.result==="true"){
          var i=0,
              len=orderData.config.length;
          for(;i<len;++i){
            if(configUuid===orderData.config[i]){
              glassIndex=i;

              //_generateOldGlassUrl();
              break;
            }
          }
          if(i===len){
            glassIndex=len;
           if(j<tempconfigparam.length){
            console.log(j)
             glassupLoad(orderUuid)
          }
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
    }
  }
  function startGenerator(fromorderuuid){
    orderUuid=fromorderuuid;
    $.ajax({
      url: "/order", type: 'POST', 
      data: {"action": "query", "uuid": orderUuid, "head": "", "config": "", "genobj": "", "params":"", "deals":""},
      success: function(data) {
        orderData=JSON.parse(data);
        console.log("initial orderdata:");
        console.log(orderData);
        if(orderData.head===""){
          headFileUrl=undefined;
        }
        else{
          headFileUrl="/data?action=download&type=head&uuid="+orderData.head;
          glassUrlGenerator();
        }
      },
      error: function(err) {
        console.log("order query error: ");
        console.log(err);
      }
    });
  };
  
  function glassUrlGenerator(){
    configUuid="";
    glassFileUrl="";
    
    var tempconfig = "",
        tempobj,
        tempselectiveitems=domConfigInfo.selectiveitems,
        tempsliderparams=domConfigInfo.sliderparams;
    for(tempobj in tempselectiveitems){
      tempconfig+=tempselectiveitems[tempobj].name+" "+$(tempselectiveitems[tempobj].domid).parent().attr("data")+"\n";
    }
    for(tempobj in tempsliderparams){
      tempconfig+=tempsliderparams[tempobj].name+" "+$(tempsliderparams[tempobj].domid).attr("data")+"\n";
    }
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
             // _generateOldGlassUrl();
              break;
            }
          }
          if(i===len){
            glassIndex=len;
          //  _generateNewGlassUrl();
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
    
    console.log(j,tempconfigparam.length);
    if(j<tempconfigparam.length){
      glassupLoad(orderUuid)

    }
    glassFileUrl="/data?action=download&type=genobj&uuid="+orderData.genobj[glassIndex];
  };
  
  function _generateNewGlassUrl(){
    console.log("_generateNewGlassUrl  "+glassIndex);
    $.ajax({
      url: "/order", type: 'POST', 
      data: {"action": "query", "uuid": orderUuid, "head": "", "config": "", "genobj": "", "params":"", "deals":""},
      success: function(data) {
       
         glassupLoad(orderUuid);
    
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
        
          console.log(j,tempconfigparam.length);
      
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
  
  return{
    startGenerator: startGenerator,
    glassUrlGenerator: glassUrlGenerator,
    getHeadUrl: getHeadUrl,
    getGlassUrl: getGlassUrl,
    getPresentConfigUuid: getPresentConfigUuid,
    glassupLoad: glassupLoad
  };

});