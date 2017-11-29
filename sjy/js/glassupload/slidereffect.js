define(function(){'use strict';
  
  var canvasPrwObj=$('#canvasPreview'),
      canvasWidth=parseInt(canvasPrwObj.attr('width')),
      canvasHeight=parseInt(canvasPrwObj.attr('height')),
      materialWidthMax=10,
      glassWidthMax=(canvasWidth*11)>>4,
      bridgeWidthMax=canvasWidth>>3,
      defaultParam=[],
      presentParam=[],
      lenRatio=3/4,
      glassFrameColor=0xff000000;
      
  $('input.sliderbarParam').on('slide', function(slideEvt) {
    var id=slideEvt.target.id,
        index=id[id.length-1],
        param=slideEvt.value;
    presentParam[index]=param;
    $('#'+id).attr('data',param);
    _updateCanvas();
  });
  $('input.sliderbarParam').on('change', function(slideEvt) {
    var id=slideEvt.target.id,
        index=id[id.length-1],
        param=slideEvt.value.newValue;
    presentParam[index]=param;
    $('#'+id).attr('data',param);
    _updateCanvas();
  });
  $('#button-param-reset').click(function(){
    _resetCanvasPreview();
  });
  
  function initCanvasPreview(fromcolor){
    //initialize sliderbar
    $('input.sliderbarParam').slider({
      formatter: function(value) {
        return 'Current value: ' + value;
      }
    });
    defaultParam[0]=$('#sliderbarParam0').slider('getValue');
    defaultParam[1]=$('#sliderbarParam1').slider('getValue');
    presentParam=defaultParam.slice(0);
    _updateCanvas();
  };
  
  function updateParameter(){
    defaultParam=presentParam.slice(0);
  };
  
  function changeColor(fromcolor){
    if(fromcolor!==undefined){
      glassFrameColor=fromcolor;
      _updateCanvas();
    }
  };
  
  function resetCanvasPreview(){
    _resetCanvasPreview();
  };
  
  function _resetCanvasPreview(){
    presentParam=defaultParam.slice(0);
    $('#sliderbarParam0').slider('setValue', defaultParam[0]);
    $('#sliderbarParam1').slider('setValue', defaultParam[1]);
    $('#sliderbarParam2').slider('setValue', defaultParam[2]);
    _updateCanvas();
  };
  
  function _updateCanvas(){
    var tempcolor=glassFrameColor,
        tempbgr=[],
        tempfillcolor="rgba(";
    for(var i=0;i<3;++i){
      tempbgr.push(tempcolor&0xff);
      tempcolor=tempcolor>>>8;
    }
    for(var i=2;i>=0;--i){
      tempfillcolor+=tempbgr[i]+",";
    }
    tempfillcolor+=(tempcolor/255)+")";
    
    //calculate respective values to be draw
    var glasswidth=Math.ceil(glassWidthMax*presentParam[0]),
        bridgewidth=Math.ceil(bridgeWidthMax*presentParam[1]),
        materialwidth=Math.ceil(materialWidthMax*presentParam[0]),
        lenwidth=(glasswidth-bridgewidth)>>1,
        lenheight=Math.ceil(lenwidth*lenRatio),
        lenleftposx=((canvasWidth-bridgewidth)>>1)-lenwidth,
        lenrightposx=(canvasWidth+bridgewidth)>>1,
        lenposy=Math.floor((canvasHeight-lenheight)/10),
        k=((lenposy+((lenheight-materialwidth)>>1))-(lenposy+materialwidth))/0.9,
        b=(lenposy+((lenheight-materialwidth)>>1))-k,
        bridgeposx=(canvasWidth-bridgewidth)>>1,
        bridgeposy=Math.ceil(k*0.5+b);  //here 0.5 is temp for old version HeightScale
    //reset canvas  
    canvasPrwObj.clearCanvas();
    //draw lens
    canvasPrwObj.drawRect({
      fillStyle: tempfillcolor,
      x: lenleftposx, y: lenposy,
      width: lenwidth, height: lenheight,
      cornerRadius: 15, fromCenter: false
    });
    canvasPrwObj.clearCanvas({
      x: lenleftposx+materialwidth, y: lenposy+materialwidth,
      width: lenwidth-(materialwidth<<1), height: lenheight-(materialwidth<<1),
      fromCenter: false
    });
    canvasPrwObj.drawRect({
      fillStyle: 'rgba(255,255,255,0.6)',
      x: lenleftposx+materialwidth, y: lenposy+materialwidth,
      width: lenwidth-(materialwidth<<1), height: lenheight-(materialwidth<<1),
      fromCenter: false
    });
    canvasPrwObj.drawRect({
      fillStyle: tempfillcolor,
      x: lenrightposx, y: lenposy,
      width: lenwidth, height: lenheight,
      cornerRadius: 15, fromCenter: false
    });
    canvasPrwObj.clearCanvas({
      x: lenrightposx+materialwidth, y: lenposy+materialwidth,
      width: lenwidth-(materialwidth<<1), height: lenheight-(materialwidth<<1),
      fromCenter: false
    });
    canvasPrwObj.drawRect({
      fillStyle: 'rgba(255,255,255,0.6)',
      x: lenrightposx+materialwidth, y: lenposy+materialwidth,
      width: lenwidth-(materialwidth<<1), height: lenheight-(materialwidth<<1),
      fromCenter: false
    });
    //draw bridge
    bridgeposx-=materialwidth>>1;
    bridgewidth+=materialwidth;
    canvasPrwObj.drawRect({
      fillStyle: tempfillcolor,
      x: bridgeposx, y: bridgeposy,
      width: bridgewidth, height: materialwidth,
      fromCenter: false
    });
  };
  
  return{
    initCanvasPreview: initCanvasPreview,
    updateParameter: updateParameter,
    changeColor: changeColor,
    resetCanvasPreview: resetCanvasPreview
  };

});