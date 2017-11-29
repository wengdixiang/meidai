define(function(){'use strict';
  
  var colorCommonType="color_profiles",
      queryColorUuid="",
      localColor={},
      
      colorPerLength=30,
      dateObj=new Date(),
      todaysDate =Math.ceil(Date.now()/86400000),
      
      isColorSetup=false;
  
  function setupColor(){

    localColor=JSON.parse(localStorage.getItem(colorCommonType))||{};
    if(localColor.date===undefined||localColor.date<todaysDate){
      console.log("if(localColor.date===undefined||localColor.date<todaysDate)");
      localColor.date=todaysDate;
      //list /common to get entrance
      $.ajax({
        url: "/common", type: 'POST',
        data: {'action': "list", 'type': colorCommonType},
        //got entrance
        success: function(data) {
          var colorlist=JSON.parse(data);
          queryColorUuid=colorlist.list[0];
          console.log(colorCommonType+" list: ");
          console.log(colorlist);
          _downloadColor();
        },  
        error: function(err) {
          console.log(colorCommonType+" list error: ");
          console.log(err);
        }
      }); 
    }
    else{
      _readColor();
    }
  };
  
  function queryIsSetup(){
    return isColorSetup;
  };
  
  function _downloadColor(){
    console.log("_downloadColor()");
    localColor.queryuuid=queryColorUuid;
    //query /common to get colorCommonType and *.png uuid
    $.ajax({
      url: "/common", type: 'POST',
      data: {'action': "query", 'type': colorCommonType, 'uuid': queryColorUuid, 'content':""},
      success: function(data) {
        localColor.querydata=JSON.parse(JSON.parse(data).content);
        
        _generateList();
        
        isColorSetup=true;
        
        try {
          localStorage.setItem(colorCommonType, JSON.stringify(localColor));
        }
        catch (err) {
          console.log(colorCommonType+"storage failed: " + err);                
        }
      },
      error: function(err) {
        console.log(colorCommonType+" query error: ");
        console.log(err);
      }
    }); 
  };
  
  function _readColor(){
    _generateList();
    isColorSetup=true;
  };
  
  function _generateList(){
    var colorinfo=localColor.querydata;
    //first, generate children as <li><a><div><image/></div></a></li>
    var len=colorinfo.alias.length,
        fcolordomlist=$("#Fcolor-list"),
        lcolordomlist=$("#Lcolor-list");
        
    for(var i=0;i<len;++i){
      var fli=$("<li></li>"),
          falink=$('<a name="'+colorinfo.alias[i]+'"></a>'),
          fdiv=$('<div class="Fcolor-grid" data="'+colorinfo.data[i]+'" style="background-color:#'+colorinfo.data[i].slice(4)+'"></div>'),
          fimg=$('<img class="Fcolor-png" src="images/glassclient/checkbox_color.png"/>');
      fcolordomlist.append(fli);
      fli.append(falink);
      falink.append(fdiv);
      fdiv.append(fimg);
      if(i===0){
        fimg.attr('id','Fcolor-selected');
      }
      
      var lli=$("<li></li>"),
          lalink=$('<a name="'+colorinfo.alias[i]+'"></a>'),
          ldiv=$('<div class="Lcolor-grid" data="'+colorinfo.data[i]+'" style="background-color:#'+colorinfo.data[i].slice(4)+'"></div>'),
          limg=$('<img class="Lcolor-png" src="images/glassclient/checkbox_color.png"/>');
      lcolordomlist.append(lli);
      lli.append(lalink);
      lalink.append(ldiv);
      ldiv.append(limg);
      if(i===0){
        limg.attr('id','Lcolor-selected');
      } 
    }
  };
  
  return{
    setupColor: setupColor,
    queryIsSetup: queryIsSetup
  };

});