define(function(){'use strict';

  var iteratorInitial=20,
      detaTime=80,
      idTrLoad=null,
      iteratorLoad=iteratorInitial,
      idTrUpdate=null,
      iteratorUpdate=iteratorInitial;

  function startLoad(){
    $('#loadprogressMessage').html("Loading");
    $('#loadprogressPercent').html("0%").css('left','110px');
    $('#loadprogress').css('display','block');
    iteratorLoad=iteratorInitial;
    idTrLoad=setInterval(_iteratorLoadPercent,detaTime);
  };
  
  function completeLoad(){
    clearInterval(idTrLoad);
    idTrLoad=null;
    $('#loadprogressMessage').html("Loaded");
    $('#loadprogressPercent').html("100%").css('left','100px');
    $('#loadprogress').css('display','none');
    //window.setTimeout(function(){;},200);
  };
  
  function startUpdate(){
    $('#updateprogressMessage').html("读取数据...");
    $('#updateprogressPercent').html("&nbsp&nbsp&nbsp&nbsp&nbsp0%");
    $('#updateprogress').css('display','block');
    iteratorUpdate=iteratorInitial;
    idTrUpdate=setInterval(_iteratorUpdatePercent,detaTime);
  };
  
  function completeUpdate(){
    clearInterval(idTrUpdate);
    idTrUpdate=null;
    $('#updateprogressMessage').html("读取完成...");
    $('#updateprogressPercent').html("&nbsp&nbsp&nbsp&nbsp&nbsp100%");
    window.setTimeout(function(){$('#updateprogress').css('display','none');},200);
  };
  
  function _iteratorLoadPercent(){
    var temppercent=Math.floor((1-iteratorInitial/iteratorLoad)*100);
    $('#loadprogressPercent').html(temppercent+"%").css('left','110px');
    ++iteratorLoad;
  };
  
  function _iteratorUpdatePercent(){
    var temppercent=Math.floor((1-iteratorInitial/iteratorUpdate)*100);
    $('#updateprogressPercent').html("&nbsp&nbsp&nbsp&nbsp&nbsp"+temppercent+"%");
    ++iteratorUpdate;
  };
  
  return{
    startLoad: startLoad,
    completeLoad: completeLoad,
    startUpdate: startUpdate,
    completeUpdate: completeUpdate
  };

});