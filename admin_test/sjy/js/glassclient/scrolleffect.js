define(function(){'use strict';

  var scrollJObj=null,
      idTimerScroll=null,
      scrollCounting=0;
      
  //scroll-png effects
  $('img.scroll-up-png').mouseenter(function (){
    $(this).attr('src','images/glassclient/scrollup_hover.png');
  });
  $('img.scroll-up-png').mouseleave(function (){
    if($(this).css('pointerEvents')!=="none"){
      $(this).attr('src','images/glassclient/scrollup_normal.png');
    }
  });
  $('img.scroll-down-png').mouseenter(function (){
    $(this).attr('src','images/glassclient/scrolldown_hover.png');
  });
  $('img.scroll-down-png').mouseleave(function (){
    if($(this).css('pointerEvents')!=="none"){
      $(this).attr('src','images/glassclient/scrolldown_normal.png');
    }
  });
  
  //scroll-Fdesign events
  $('#scroll-up-Fdesign').click(function (){
    if(scrollJObj===null){
      scrollJObj=$('#Fdesign-list');
      idTimerScroll=setInterval(_scrollUp,80);
      scrollCounting=6;
    }
  });
  $('#scroll-down-Fdesign').click(function (){
    if(scrollJObj===null){
      scrollJObj=$('#Fdesign-list');
      idTimerScroll=setInterval(_scrollDown,80);
      scrollCounting=6;
    }
  });
  
  //scroll-Ldesign events
  $('#scroll-up-Ldesign').click(function (){
    if(scrollJObj===null){
      scrollJObj=$('#Ldesign-list');
      idTimerScroll=setInterval(_scrollUp,80);
      scrollCounting=6;
    }
  });
  $('#scroll-down-Ldesign').click(function (){
    if(scrollJObj===null){
      scrollJObj=$('#Ldesign-list');
      idTimerScroll=setInterval(_scrollDown,80);
      scrollCounting=6;
    }
  });
  
  //scroll excution
  function _scrollUp(){
    if(scrollCounting>0){
      var topbefore=scrollJObj.scrollTop();
      scrollJObj.scrollTop(scrollJObj.scrollTop()-10);
      --scrollCounting;
      scrollJObj.next().children().attr('src','images/glassclient/scrolldown_normal.png').css('pointerEvents','auto');
      if(topbefore===scrollJObj.scrollTop()||scrollJObj.scrollTop()===0){
        scrollJObj.prev().children().attr('src','images/glassclient/scrollup_disabled.png').css('pointerEvents','none');
        scrollCounting=0;
      }
    }
    else{
      clearInterval(idTimerScroll);
      idTimerScroll=null;
      scrollJObj=null;
    }
  };
  function _scrollDown(){
      if(scrollCounting>0){
        var topbefore=scrollJObj.scrollTop();
        scrollJObj.scrollTop(scrollJObj.scrollTop()+10);
        --scrollCounting;
        scrollJObj.prev().children().attr('src','images/glassclient/scrollup_normal.png').css('pointerEvents','auto');
        if(topbefore===scrollJObj.scrollTop()){
          scrollJObj.next().children().attr('src','images/glassclient/scrolldown_disabled.png').css('pointerEvents','none');
          scrollCounting=0;
        }
      }
      else{
        clearInterval(idTimerScroll);
        idTimerScroll=null;
        scrollJObj=null;
      }
    };
  
  return{
    
  };

});