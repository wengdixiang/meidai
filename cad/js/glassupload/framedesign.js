define(function(){'use strict';
  
  var designCommonType="",
      designClassHead="",
      queryDesignUuid="",
      localDesign={},
      
      designPerLength=80,
      todaysDate =Math.ceil(Date.now()/86400000),
      
      isDesignSetup=false;
  
  function setupDesign(fromdesigninfo){
    designCommonType=fromdesigninfo.commontype;
    designClassHead=fromdesigninfo.classhead;
    localDesign=JSON.parse(localStorage.getItem(designCommonType))||{};
    if(localDesign.date===undefined||localDesign.date<todaysDate){
      console.log("if(localDesign.date===undefined||localDesign.date<todaysDate)");
      localDesign.date=todaysDate;
      //list /common to get entrance
      $.ajax({
        url: "/common", type: 'POST',
        data: {'action': "list", 'type': designCommonType},
        //got entrance
        success: function(data) {
          var designlist=JSON.parse(data);
          queryDesignUuid=designlist.list[0];
          console.log(designCommonType+" list: ");
          console.log(designlist);
          _downloadDesign();
        },  
        error: function(err) {
          console.log(designCommonType+" list error: ");
          console.log(err);
        }
      }); 
    }
    else{
      _readDesign();
    }
  };
  
  function queryIsSetup(){
    return isDesignSetup;
  };
  
  function _downloadDesign(){
    console.log("_downloadDesign()");
    localDesign.queryuuid=queryDesignUuid;
    //query /common to get designCommonType and *.png uuid
    $.ajax({
      url: "/common", type: 'POST',
      data: {'action': "query", 'type': designCommonType, 'uuid': queryDesignUuid, 'content':"", 'description':""},
      success: function(data) {
        localDesign.querydata=JSON.parse(data);
        //got designCommonType and *.png uuid
        var designdata=localDesign.querydata,
            designinfo=designdata.description[designCommonType],
            designimguuid=designdata.content;
        console.log(designCommonType+" query data:");
        console.log(designdata);
        //first, generate children as <li><a><image/><div></div></a></li>
        var len=designinfo.alias.length,
            designdomlist=$("#"+designClassHead+"-list"),
            imgs=[];
        for(var i=0;i<len;++i){
          var li=$("<li></li>"),
              alink=$('<a class="'+designClassHead+'" data="'+designinfo.data[i]+'" material="'+designinfo.material[i]+'"></a>'),
              img=$('<img class="'+designClassHead+'"/>'),
              div=$('<div class="'+designClassHead+'">'+designinfo.alias[i]+'</div>');
          designdomlist.append(li);
          li.append(alink);
          alink.append(img,div);
          if(i===0){
            img.attr('id',designClassHead+'-selected');
          }
          imgs.push(img);
        }
        //then, download image and cut it, and setup image src and event handler
        var serverimage = new Image();
        serverimage.src="/common?action=download&type="+designCommonType+"&uuid="+designimguuid;
        serverimage.onload=function(){
          _cutAndSetImage(serverimage,imgs,designinfo.dimensions);
          isDesignSetup=true;
          
          var canvas = document.createElement('canvas'),
              context = canvas.getContext('2d');
          canvas.width = serverimage.width;
          canvas.height = serverimage.height;
          context.drawImage(serverimage, 0, 0, serverimage.width, serverimage.height);
          localDesign.img = canvas.toDataURL("image/png");
          try {
            localStorage.setItem(designCommonType, JSON.stringify(localDesign));
          }
          catch (err) {
            console.log(designCommonType+"storage failed: " + err);                
          }
        }
      },
      error: function(err) {
        console.log(designCommonType+" query error: ");
        console.log(err);
      }
    }); 
  };
  
  function _readDesign(){
    console.log("_readDesign()");
    var designdata=localDesign.querydata,
        designinfo=designdata.description[designCommonType];
    //first, generate children as <li><a><image/><div></div></a></li>
    var len=designinfo.alias.length,
        designdomlist=$("#"+designClassHead+"-list"),
        imgs=[];
    for(var i=0;i<len;++i){
      var li=$("<li></li>"),
          alink=$('<a class="'+designClassHead+'" data="'+designinfo.data[i]+'" material="'+designinfo.material[i]+'"></a>'),
          img=$('<img class="'+designClassHead+'"/>'),
          div=$('<div class="'+designClassHead+'">'+designinfo.alias[i]+'</div>');
      designdomlist.append(li);
      li.append(alink);
      alink.append(img,div);
      if(i===0){
        img.attr('id',designClassHead+'-selected');
      }
      imgs.push(img);
    }
    //then, read image locally and cut it, and setup image src and event handler
    var localimage = new Image();
    localimage.src=localDesign.img;
    localimage.onload=function(){
      _cutAndSetImage(localimage,imgs,designinfo.dimensions);
      isDesignSetup=true;
    }
  };
  
  function _cutAndSetImage(img,imgs,dimens){
    var xdimen=dimens[0],
        ydimen=dimens[1],
        perwidth=Math.floor(img.width/xdimen),
        perheight=Math.floor(img.height/ydimen),
        scaledheight=Math.ceil(perheight/perwidth*designPerLength),
        ytranslate=((designPerLength-scaledheight)>>1),
        canvas=null,
        context=null,
        imagepieces = [];
    for(var y = 0; y < ydimen; ++y){
      for(var x = 0; x < xdimen; ++x){
        canvas = document.createElement('canvas');
        context = canvas.getContext('2d');
        canvas.width = canvas.height = designPerLength;
        context.drawImage(img, x * perwidth, y * perheight, perwidth, perheight, 0, ytranslate, designPerLength, scaledheight);
        imagepieces.push(canvas.toDataURL());
      }
    }
    for(var i=0,len=imgs.length;i<len;++i){
      imgs[i].attr('src',imagepieces[i]);
    }
  };
  
  return{
    setupDesign: setupDesign,
    queryIsSetup: queryIsSetup
  };

});