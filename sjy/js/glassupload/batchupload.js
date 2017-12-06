  define(function(){'use strict';
    var orderUuid="",
    orderData=null,
    configUuid="",
    glassIndex=-1,
    tempconfigparam="",

    domConfigInfo={
      selectiveitems:{
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

    function startUpload(fromorderuuid){
      orderUuid=fromorderuuid;
      tempconfigparam=$("#Fdesign-list").children().children();
      $.ajax({
        url: "/order", type: 'POST', 
        data: {"action": "query", "uuid": orderUuid, "head": "", "config": "", "genobj": "", "params":"", "deals":""},
        success: function(data) {
          orderData=JSON.parse(data);
          console.log("initial orderdata:");
          console.log(orderData);
          if(orderData.head===""){
          }
          else{
            uploadConfigAll(-1);
          }
        },
        error: function(err) {
          console.log("order query error: ");
          console.log(err);
        }
      });
    };

    function uploadConfigAll(index){
    // tempconfigparam==$("#Fdesign-list").children().children();
    if(index<tempconfigparam.length-1){
      configUuid="";
      index++;
      var tempconfig = "",
      tempobj,
      tempselectiveitems=domConfigInfo.selectiveitems,
      tempsliderparams=domConfigInfo.sliderparams;
      tempconfig="LensProfileIdentifier"+" "+tempconfigparam.eq(index).attr("data")+"\n";

      for(tempobj in tempselectiveitems){
        tempconfig+=tempselectiveitems[tempobj].name+" "+$(tempselectiveitems[tempobj].domid).parent().attr("data")+"\n";
      }
      for(tempobj in tempsliderparams){
        tempconfig+=tempsliderparams[tempobj].name+" "+$(tempsliderparams[tempobj].domid).attr("data")+"\n";
      }
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
          console.log("index :"+index);
          configUuid=configinfo.uuid;
          if(configinfo.result==="true"){
            var i=0,
            len=orderData.config.length;
            for(;i<len;++i){
              if(configUuid===orderData.config[i]){
                glassIndex=i;
                console.log("_generateOldConfig  "+glassIndex); 
                uploadConfigAll(index)               
                break;
              }
            }   
            if(i===len){
              glassIndex=len;  
              _generateNewConfig(index)
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
    }else{
      console.log("Upload end");
      alert("批量上传完成")
    }
  };

  function _generateNewConfig(index){
    console.log("_generateNewConfig  "+glassIndex);
    $.ajax({
      url: "/order", type: 'POST', 
      async: false,
      data: {"action": "query", "uuid": orderUuid, "head": "", "config": "", "genobj": "", "params":"", "deals":""},
      success: function(data) {    
        orderData=JSON.parse(data);
        if(glassIndex>orderData.genobj.length-1){
          console.log("waiting for making glass...");
          setTimeout(_generateNewConfig(index),1000);
        }
        else{
         uploadConfigAll(index);         
       } 

     },
     error: function(err) {
      console.log("order query error: ");
      console.log(err);
    }
  });
  };
  return{
   startUpload: startUpload
 };
});