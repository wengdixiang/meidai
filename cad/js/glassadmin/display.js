define(function(){'use strict';

  var canvasDispJObj=$('#canvasDisp'),
      canvasMarkJObj=$('#canvasMark'),
      isMarkPHiden=false,
      isMarkIHiden=false,
      
      originMarkVec3Points=[],
      newMarkVec3Points=[],
      pupilDistance=0.0,
      marksOffsetX=0.0,
      marksOffsetY=0.0,
      earPointOffsetY=0.0,
      earPointOffsetX0=0.0,
      earPointOffsetX1=0.0,
      
      forceEarPointOverlap=true,
      earPointOffset=0.0,
      
      axisVec3X=null,
      axisVec3MX=null,
      axisVec3Y=null,
      axisVec3MY=null,
      axisVec3Z=null,
      axisVec3MZ=null,
      
      sphericalFront=null,
      sphericalRear=null,
      sphericalUp=null,
      sphericalLeft=null,
      sphericalRight=null,
      
      cameraUpVec3=null,
      
      presentView=1,
      
      canvasColor=0xbbbbbb,
      envLightValue=0xaaaaaa,
      pointLightValue=0x333333,
      myRenderer = null,
      my2DRenderer = null,
      myScene = null,
      myCamera=null,
      myControls=null,
      
      headGeometry=null,
      headMaterialNormal=null,
      headMesh=null,
      isHeadSetup=false,
      isHeadHiden=false,
      headColor=0x555555,
      
      glassGeometries={
        frame: null,
        legs: [],
        lens: []
      },
      glassMeshes={
        frame: null,
        legs: [],
        lens: []
      },
      isGlassSetup=false,
      glassFrameColor=0x000000,
      glassLegsColor=0x000000,
      glassLensColor=0xffffff,
      glassEnvMap=null,
      
      frameMaterial="",
      legMaterial="",
      frameMaterialList={
        plastic: null
      },
      legMaterialList={
        plastic: null,
        metal: null
      },
      lenMaterial=null;
  
  function setupHead(headobj){
    //console.log(headobj.filename);
    //geometry mesh
    headGeometry=_generateGeometry(headobj),
    headGeometry.computeBoundingBox();
    headGeometry.computeVertexNormals();
    headMaterialNormal = new THREE.MeshNormalMaterial();
    headMesh = new THREE.Mesh( headGeometry, headMaterialNormal );
    
    // camera
    var headboundingbox=headGeometry.boundingBox,
        xcenter=(headboundingbox.min.x+headboundingbox.max.x)>>1,
        ycenter=(headboundingbox.min.y+headboundingbox.max.y)>>1,
        zcenter=(headboundingbox.min.z+headboundingbox.max.z)>>1,
        xwidth=headboundingbox.max.x-headboundingbox.min.x,
        ywidth=headboundingbox.max.y-headboundingbox.min.y,
        zwidth=headboundingbox.max.z-headboundingbox.min.z,
        canvaswidth=canvasDispJObj.attr('width'),
        canvasheight=canvasDispJObj.attr('height');
        
        myCamera= new THREE.OrthographicCamera(-xwidth*canvaswidth/canvasheight*0.75, xwidth*canvaswidth/canvasheight*0.75, xwidth*0.75, -xwidth*0.75, 0, 1000);
      
    //scene
    myScene = new THREE.Scene();
    myScene.add(headMesh);
    myScene.add(myCamera);
    
    var ambientlight = new THREE.AmbientLight(envLightValue);
    myScene.add(ambientlight);
    
    //lights
    var pointlight1 = new THREE.PointLight( pointLightValue, 2, 1500 ),
        pointlight2 = new THREE.PointLight( pointLightValue, 2, 1500 ),
        pointlight3 = new THREE.PointLight( pointLightValue, 2, 1500 ),
        pointlight4 = new THREE.PointLight( pointLightValue, 2, 1500 ),
        dirlight1 = new THREE.DirectionalLight();
    myScene.add( pointlight1 );
    myScene.add( pointlight2 );
    myScene.add( pointlight3 );
    myScene.add( pointlight4 );
    myScene.add( dirlight1 );
    pointlight1.position.set(xcenter-400, ycenter+500, headboundingbox.max.z-400);
    pointlight2.position.set(xcenter+400, ycenter+500, headboundingbox.max.z-400);
    pointlight3.position.set(xcenter-400, ycenter-1000, headboundingbox.max.z+400);
    pointlight4.position.set(xcenter+400, ycenter-1000, headboundingbox.max.z+400);
    dirlight1.position.set(0,10,3);
    
    // render
    myRenderer = new THREE.WebGLRenderer({
      canvas: canvasDispJObj[0],
      antialias: true
    });
    myRenderer.setClearColor(canvasColor);
    
    // controls
    myControls = new THREE.OrbitControls( myCamera, canvasDispJObj[0] );
    myControls.addEventListener( 'change', _renderCanvas );
    /*
    myControls.minPolarAngle = Math.PI * 0.15;
    myControls.maxPolarAngle = Math.PI * 0.40;
    myControls.minAzimuthAngle=-Math.PI * 0.5;
    myControls.maxAzimuthAngle=Math.PI * 0.5;
    */
    myControls.timeAdjustCamera = 500;
    myControls.frequencyAdjustCamera = 20;
    myControls.minDistance = 500;
    myControls.maxDistance = 1500;
    myControls.target.set(xcenter,ycenter,zcenter);
    myControls.enablePan=true;
    myControls.zoomSpeed=7.0;
    //myControls.enableZoom=false;
    myControls.enableRotate=false;
    myControls.update();
    
    _renderCanvas();
    
    //pre-set some glass config
    frameMaterialList.plastic=new THREE.MeshPhongMaterial( { color: glassFrameColor,
                              specular: 0x000000,shininess: 80} );
    legMaterialList.plastic=new THREE.MeshPhongMaterial( { color: glassLegsColor,
                              specular: 0x000000,shininess: 80} );
                              
    legMaterialList.metal=new THREE.MeshPhongMaterial( { color: 0x997765,
                              specular: 0x666666,emissive:0x000000 ,shininess: 40} );
      
    glassEnvMap=new THREE.TextureLoader().load( 'images/glassclient/envmap.png',_renderCanvas);
    glassEnvMap.mapping = THREE.SphericalReflectionMapping;
    lenMaterial=new THREE.MeshBasicMaterial( { color: glassLensColor, premultipliedAlpha: true,
				transparent: true, opacity: 0.12, envMap: glassEnvMap }  );
                              
    isHeadSetup=true; 
    console.log("isHeadSetup=true;");
  };
  
  function setupMarkPoints(marktxt, forceep){
    
    forceEarPointOverlap=forceep;
    
    var txtcontent=marktxt.content;
    var linelist=txtcontent.split("\n");
    var markpointnum=parseInt(linelist[0]);
    for(var i=1;i<=markpointnum;++i){
      var markpointtxt=linelist[i];
      var axisvalues=markpointtxt.split(" ");
      var xvalue=parseFloat(axisvalues[0]);
      var yvalue=parseFloat(axisvalues[1]);
      var zvalue=parseFloat(axisvalues[2]);
      
      var originmarkpoint=new THREE.Vector3(xvalue,yvalue,zvalue);
      originMarkVec3Points.push(originmarkpoint);
      var newmarkpoint=new THREE.Vector3(xvalue,yvalue,zvalue);
      newMarkVec3Points.push(newmarkpoint);
    }
    
    pupilDistance=parseFloat($("#sliderbarParam0").val());
    marksOffsetX=parseFloat($("#sliderbarParam5").val());
    marksOffsetY=parseFloat($("#sliderbarParam6").val());
    earPointOffsetY=parseFloat($("#sliderbarParam8").val());
    earPointOffsetX0=parseFloat($("#sliderbarParam9").val());
    earPointOffsetX1=parseFloat($("#sliderbarParam10").val());
    
    axisVec3X=new THREE.Vector3(1.0,0.0,0.0);
    axisVec3MX=new THREE.Vector3(-1.0,0.0,0.0);
    axisVec3Y=new THREE.Vector3(0.0,1.0,0.0);
    axisVec3MY=new THREE.Vector3(0.0,-1.0,0.0);
    axisVec3Z=new THREE.Vector3(0.0,0.0,1.0);
    axisVec3MZ=new THREE.Vector3(0.0,0.0,-1.0);
    
    sphericalFront=new THREE.Spherical();
    sphericalFront.setFromVector3(axisVec3Z);
    sphericalRear=new THREE.Spherical();
    sphericalRear.setFromVector3(axisVec3MZ);
    sphericalUp=new THREE.Spherical();
    sphericalUp.setFromVector3(axisVec3Y);
    sphericalLeft=new THREE.Spherical();
    sphericalLeft.setFromVector3(axisVec3MX);
    sphericalRight=new THREE.Spherical();
    sphericalRight.setFromVector3(axisVec3X);
    
    cameraUpVec3=new THREE.Vector3(0.0,1.0,0.0);
    
    _relocateMarkPoints();
  }
  
  function updateMarkPoints(axistxt){
    
    pupilDistance=parseFloat($("#sliderbarParam0").val());
    marksOffsetX=parseFloat($("#sliderbarParam5").val());
    marksOffsetY=parseFloat($("#sliderbarParam6").val());
    earPointOffsetY=parseFloat($("#sliderbarParam8").val());
    earPointOffsetX0=parseFloat($("#sliderbarParam9").val());
    earPointOffsetX1=parseFloat($("#sliderbarParam10").val());
    
    //update axis here
    var txtcontent=axistxt.content;
    var axislist=txtcontent.split("\n");
    
    var axistxt=axislist[0],
        axisvalues=axistxt.split(","),
        xvalue=parseFloat(axisvalues[0]),
        yvalue=parseFloat(axisvalues[1]),
        zvalue=parseFloat(axisvalues[2]);
    axisVec3X.setX(xvalue);
    axisVec3X.setY(yvalue);
    axisVec3X.setZ(zvalue);
    axisVec3MX.setX(-xvalue);
    axisVec3MX.setY(-yvalue);
    axisVec3MX.setZ(-zvalue);
    
    axistxt=axislist[1];
    axisvalues=axistxt.split(",");
    xvalue=parseFloat(axisvalues[0]),
    yvalue=parseFloat(axisvalues[1]),
    zvalue=parseFloat(axisvalues[2]);
    axisVec3Y.setX(xvalue);
    axisVec3Y.setY(yvalue);
    axisVec3Y.setZ(zvalue);
    axisVec3MY.setX(-xvalue);
    axisVec3MY.setY(-yvalue);
    axisVec3MY.setZ(-zvalue);
    
    axistxt=axislist[2];
    axisvalues=axistxt.split(",");
    xvalue=parseFloat(axisvalues[0]),
    yvalue=parseFloat(axisvalues[1]),
    zvalue=parseFloat(axisvalues[2]);
    axisVec3Z.setX(xvalue);
    axisVec3Z.setY(yvalue);
    axisVec3Z.setZ(zvalue);
    axisVec3MZ.setX(-xvalue);
    axisVec3MZ.setY(-yvalue);
    axisVec3MZ.setZ(-zvalue);
    
    sphericalFront.setFromVector3(axisVec3Z);
    sphericalRear.setFromVector3(axisVec3MZ);
    sphericalUp.setFromVector3(axisVec3Y);
    
    sphericalLeft.setFromVector3(axisVec3MX);
    sphericalRight.setFromVector3(axisVec3X);
    
    _relocateMarkPoints();
  }
  
  function _relocateMarkPoints(){
    
    for(var i=0, len=originMarkVec3Points.length;i<len;++i){
      newMarkVec3Points[i].copy(originMarkVec3Points[i]);
    }
    
    //set origin pupil distance
    newMarkVec3Points[73].copy(newMarkVec3Points[27]);
    newMarkVec3Points[73].add(newMarkVec3Points[28]);
    newMarkVec3Points[73].add(newMarkVec3Points[29]);
    newMarkVec3Points[73].add(newMarkVec3Points[30]);
    newMarkVec3Points[73].multiplyScalar(0.25);
    
    newMarkVec3Points[74].copy(newMarkVec3Points[31]);
    newMarkVec3Points[74].add(newMarkVec3Points[32]);
    newMarkVec3Points[74].add(newMarkVec3Points[33]);
    newMarkVec3Points[74].add(newMarkVec3Points[34]);
    newMarkVec3Points[74].multiplyScalar(0.25);
    
    //set assigned pupil distance
    var center=new THREE.Vector3(0.0,0.0,0.0);
    center.add(newMarkVec3Points[73]);
    center.add(newMarkVec3Points[74]);
    center.multiplyScalar(0.5);
    
    var tpvector1=new THREE.Vector3();
    var tpvector2=new THREE.Vector3();
    
    tpvector1.copy(newMarkVec3Points[73]);
    tpvector1.sub(center);
    tpvector1.normalize();
    tpvector1.multiplyScalar(0.5*pupilDistance);
    newMarkVec3Points[73].copy(center);
    newMarkVec3Points[73].add(tpvector1);
    
    tpvector1.copy(newMarkVec3Points[74]);
    tpvector1.sub(center);
    tpvector1.normalize();
    tpvector1.multiplyScalar(0.5*pupilDistance);
    newMarkVec3Points[74].copy(center);
    newMarkVec3Points[74].add(tpvector1);
    
    //nose points
    tpvector1.copy(newMarkVec3Points[35]);
    tpvector1.add(newMarkVec3Points[43]);
    var meany=0.5*tpvector1.dot(axisVec3Y);
    
    tpvector1.copy(newMarkVec3Points[35]);
    tpvector2.copy(axisVec3X);
    tpvector2.multiplyScalar(tpvector1.dot(axisVec3X));
    newMarkVec3Points[35].copy(tpvector2);
    tpvector2.copy(axisVec3Z);
    tpvector2.multiplyScalar(tpvector1.dot(axisVec3Z));
    newMarkVec3Points[35].add(tpvector2);
    tpvector2.copy(axisVec3Y);
    tpvector2.multiplyScalar(meany);
    newMarkVec3Points[35].add(tpvector2);
    
    tpvector1.copy(newMarkVec3Points[43]);
    tpvector2.copy(axisVec3X);
    tpvector2.multiplyScalar(tpvector1.dot(axisVec3X));
    newMarkVec3Points[43].copy(tpvector2);
    tpvector2.copy(axisVec3Z);
    tpvector2.multiplyScalar(tpvector1.dot(axisVec3Z));
    newMarkVec3Points[43].add(tpvector2);
    tpvector2.copy(axisVec3Y);
    tpvector2.multiplyScalar(meany);
    newMarkVec3Points[43].add(tpvector2);
    
    //ear points
    newMarkVec3Points[75].copy(newMarkVec3Points[75]);
    tpvector1.copy(axisVec3Y);
    tpvector1.multiplyScalar(earPointOffsetY);
    tpvector2.copy(axisVec3X);
    tpvector2.multiplyScalar(earPointOffsetX0);
    newMarkVec3Points[75].add(tpvector1);
    newMarkVec3Points[75].add(tpvector2);
    
    newMarkVec3Points[76].copy(newMarkVec3Points[76]);
    tpvector1.copy(axisVec3Y);
    tpvector1.multiplyScalar(earPointOffsetY);
    tpvector2.copy(axisVec3X);
    tpvector2.multiplyScalar(earPointOffsetX1);
    newMarkVec3Points[76].add(tpvector1);
    newMarkVec3Points[76].add(tpvector2);
    
    //general offset
    tpvector1.copy(axisVec3X);
    tpvector1.multiplyScalar(marksOffsetX);
    tpvector2.copy(axisVec3Y);
    tpvector2.multiplyScalar(marksOffsetY);
    for(var i=0;i<75;++i){
      newMarkVec3Points[i].add(tpvector1);
      newMarkVec3Points[i].add(tpvector2);
    }
    
    //force ear point overlap
    var v1=[],
        v2=[];
    v1[0]=newMarkVec3Points[76].dot(axisVec3X);
    v1[1]=newMarkVec3Points[76].dot(axisVec3Y);
    v1[2]=newMarkVec3Points[76].dot(axisVec3Z);
    v2[0]=newMarkVec3Points[75].dot(axisVec3X);
    v2[1]=newMarkVec3Points[75].dot(axisVec3Y);
    v2[2]=newMarkVec3Points[75].dot(axisVec3Z);
    var x=v1[0],
        y=v1[1],
        z=v1[2];
    if(forceEarPointOverlap){
      y=(v1[1]+v2[1])/2;
      z=(v1[2]+v2[2])/2;
    }
    z-=earPointOffset;
    tpvector1.copy(axisVec3X);
    tpvector1.multiplyScalar(x);
    newMarkVec3Points[76].copy(tpvector1);
    tpvector1.copy(axisVec3Y);
    tpvector1.multiplyScalar(y);
    newMarkVec3Points[76].add(tpvector1);
    tpvector1.copy(axisVec3Z);
    tpvector1.multiplyScalar(z);
    newMarkVec3Points[76].add(tpvector1);    
    x=v2[0];
    if(!forceEarPointOverlap){
      y=v2[1];
      z=v2[2];
    }
    z-=earPointOffset;
    tpvector1.copy(axisVec3X);
    tpvector1.multiplyScalar(x);
    newMarkVec3Points[75].copy(tpvector1);
    tpvector1.copy(axisVec3Y);
    tpvector1.multiplyScalar(y);
    newMarkVec3Points[75].add(tpvector1);
    tpvector1.copy(axisVec3Z);
    tpvector1.multiplyScalar(z);
    newMarkVec3Points[75].add(tpvector1); 
  }
  
  function setupGlass(glassobjs,framematerial,legmaterial){
    frameMaterial=framematerial;
    legMaterial=legmaterial;
    
    console.log(frameMaterial);
    console.log(legMaterial);
    
    for(var k=0,numo=glassobjs.length;k<numo;++k){
      var glassobj=glassobjs[k],
          tempgeometry=_generateGeometry(glassobj),
          tempmaterial = null,
          tempmesh=null;
      
      if(glassobj.filename.indexOf("frame")>=0){
        tempmaterial = frameMaterialList[frameMaterial];
        if(frameMaterial!=="metal"){
          tempmaterial.color.setHex(glassFrameColor);
        }
        tempmesh=new THREE.Mesh( tempgeometry, tempmaterial );
        glassGeometries.frame=tempgeometry;
        glassMeshes.frame=tempmesh;
      }
      else if(glassobj.filename.indexOf("legs")>=0){
        tempmaterial = legMaterialList[legMaterial];
        if(legMaterial!=="metal"){
          tempmaterial.color.setHex(glassLegsColor);
        }
        tempmesh=new THREE.Mesh( tempgeometry, tempmaterial );
        glassGeometries.legs.push(tempgeometry);
        glassMeshes.legs.push(tempmesh);
      }
      else if(glassobj.filename.indexOf("lens")>=0){
        tempmaterial = lenMaterial;
        tempmesh=new THREE.Mesh( tempgeometry, tempmaterial );
        glassGeometries.lens.push(tempgeometry);
        glassMeshes.lens.push(tempmesh);
      }
      else{
        console.log("invalid glass obj");
      }
      myScene.add(tempmesh);
    }
    _renderCanvas();
    
    switch(presentView){
      case 0: perspectiveUp();break;
      case 1: perspectiveFront();break;
      case 2: perspectiveRear();break;
      case 3: perspectiveLeft();break;
      case 4: perspectiveRight();break;
    }
    isGlassSetup=true;
  };
  
  function queryIsHeadSetup(){
    return isHeadSetup;
  };
  
  function queryIsGlassSetup(){
    return isGlassSetup;
  };
  
  function deleteGlass(){
    //console.log("deleting glass");
    if(isGlassSetup){
      glassGeometries.frame.dispose();
      glassGeometries.legs[0].dispose();
      glassGeometries.legs[1].dispose();
      glassGeometries.lens[0].dispose();
      glassGeometries.lens[1].dispose();
      
      myScene.remove(glassMeshes.frame);
      myScene.remove(glassMeshes.legs[0]);
      myScene.remove(glassMeshes.legs[1]);
      myScene.remove(glassMeshes.lens[0]);
      myScene.remove(glassMeshes.lens[1]);
        
      _renderCanvas();
      glassGeometries={
          frame: null,
          legs: [],
          lens: []
        },
        glassMeshes={
          frame: null,
          legs: [],
          lens: []
        },
      isGlassSetup=false;
    }
  }
  
  function resizeCanvas(width,height){
    
    var headboundingbox=headGeometry.boundingBox,
        xwidth=headboundingbox.max.x-headboundingbox.min.x,
        ywidth=headboundingbox.max.y-headboundingbox.min.y,
        zwidth=headboundingbox.max.z-headboundingbox.min.z;
        
        myCamera.left=-xwidth*width/height*0.75;
        myCamera.right=xwidth*width/height*0.75;
        myCamera.top=xwidth*0.75;
        myCamera.buttom=-xwidth*0.75;  
        
    myCamera.updateProjectionMatrix();
    myRenderer.setSize( width, height );
    _renderCanvas();
  };
  
  function changeFrameColor(framecolor){
    framecolor=parseInt(framecolor);
    if(framecolor!==glassFrameColor){
      console.log("changeFrameColor: "+framecolor.toString(16));
      glassFrameColor=framecolor;
     
      if(isGlassSetup&&frameMaterial!=="metal"){
        glassMeshes.frame.material.color.setHex(framecolor);
        _renderCanvas();        
      }
    }
  };
  
  function changeLegsColor(legscolor){
    legscolor=parseInt(legscolor);
    if(legscolor!==glassLegsColor){
      console.log("changeLegsColor: "+legscolor.toString(16));
      glassLegsColor=legscolor;
      if(isGlassSetup&&legMaterial!=="metal"){
        glassMeshes.legs[0].material.color.setHex(legscolor);
        //glassMeshes.legs[1].material.color.setHex(legscolor);
        _renderCanvas();
      }
    }    
  };
  
  function perspectiveUp(){
    if(isHeadSetup){
      myControls.adjustCameraTo(sphericalUp);   
      presentView=0;
      cameraUpVec3.copy(axisVec3Z);
    }
  };
  
  function perspectiveFront(){
    if(isHeadSetup){
      myControls.adjustCameraTo(sphericalFront); 
      presentView=1;
      cameraUpVec3.copy(axisVec3Y);
    }
  };
  
  function perspectiveRear(){
    if(isHeadSetup){
      myControls.adjustCameraTo(sphericalRear);      
      presentView=2;
      cameraUpVec3.copy(axisVec3Y);
    }
  };
  
  function perspectiveLeft(){
    if(isHeadSetup){
      myControls.adjustCameraTo(sphericalLeft);
      presentView=3;
      cameraUpVec3.copy(axisVec3Y);
    }
  };
  
  function perspectiveRight(){
    if(isHeadSetup){
      myControls.adjustCameraTo(sphericalRight);   
      presentView=4;
      cameraUpVec3.copy(axisVec3Y);
    }
  };
  
  function headEffectHide(){
    if(isHeadSetup){
      if(isHeadHiden){
        //display here
        isHeadHiden=false;
        myScene.add(headMesh);
        _renderCanvas();
      }
      else{
        //hide here
        isHeadHiden=true;
        myScene.remove(headMesh);
        _renderCanvas();
      }
    }
    return isHeadHiden;
  };
  
  function markPEffectHide(){
    isMarkPHiden=!isMarkPHiden;
    _renderCanvas();
  };
  
  function markIEffectHide(){
    isMarkIHiden=!isMarkIHiden;
    _renderCanvas();
  };

  function _renderCanvas(){
    myCamera.up.copy(cameraUpVec3);
    
    myRenderer.render(myScene, myCamera);
    
    var halfWidth=canvasDisp.width/2;
    var halfHeight=canvasDisp.height/2;
    canvasMarkJObj.clearCanvas();
    for(var i=0, len=newMarkVec3Points.length;i<len;++i){
      var vector=new THREE.Vector3(newMarkVec3Points[i].x,newMarkVec3Points[i].y,newMarkVec3Points[i].z);
      vector.project(myCamera);
      var wx=Math.round(vector.x*halfWidth+halfWidth);
      var wy=Math.round(halfHeight-vector.y*halfHeight);
      if(!isMarkPHiden){
        canvasMarkJObj.drawEllipse({
          fillStyle: '#f00',
          x: wx, y: wy,
          width: 6, height: 6,
        });
      }
      if(!isMarkIHiden){
        canvasMarkJObj.drawText({
          strokeStyle: '#ff0',
          strokeWidth: 0.5,
          x: wx+9, y: wy-2,
          fontSize: 10,
          fontFamily: 'Arial',
          text: i
        });
      }
    }
  };
  
  function _generateGeometry(obj){
    var geometry = new THREE.BufferGeometry(),
        positions = null,
        normals = null,
        indices = null,
        i,
        len;
        
    //points
    i=0;
    len=obj.points.length;
    positions = new Float32Array( len );
    while(i<len){
      positions[i]=obj.points[i];
      ++i;
      positions[i]=obj.points[i];
      ++i;
      positions[i]=obj.points[i];
      ++i;
    }
    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ).onUpload( _disposeArray ) );
    
    //normals
    if(obj.normals.length!==0){
      //console.log("normals exist");
      i=0;
      len=obj.normals.length;
      normals = new Float32Array( len );
      while(i<len){
        normals[i]=obj.normals[i];
        ++i;
        normals[i]=obj.normals[i];
        ++i;
        normals[i]=obj.normals[i];
        ++i;
      }
      geometry.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ).onUpload( _disposeArray ) );
    }
    else{
      //console.log("normals not exist");
    }
    
    //faces
    if(obj.facetype===3){
      //console.log("face type: 3");
      //console.log("index number: "+obj.faces.length);
      //console.log("face number: "+obj.faces.length/3);
      i=0;
      len=obj.faces.length;
      indices = new Uint32Array( len );
      while(i<len){
        indices[i]=obj.faces[i];
        ++i;
        indices[i]=obj.faces[i];
        ++i;
        indices[i]=obj.faces[i];
        ++i;
      }
      geometry.setIndex( new THREE.BufferAttribute( indices, 1 ) );
    }
    else{
      //console.log("face type: 4");
      //console.log("index number: "+obj.faces.length);
      //console.log("face number: "+(obj.faces.length>>2));
      i=0;
      len=obj.faces.length;
      //console.log("len: "+len);
      indices = new Uint32Array( (len*3)>>1 );
      while(i<len){
        var j=(i*3)>>1;
        indices[j]=obj.faces[i];
        indices[j+1]=obj.faces[i+1];
        indices[j+2]=obj.faces[i+2];
        indices[j+3]=obj.faces[i];
        indices[j+4]=obj.faces[i+2];
        indices[j+5]=obj.faces[i+3];
        i=i+4;
      }
      geometry.setIndex( new THREE.BufferAttribute( indices, 1 ) );
    }
    
    return geometry;
  };

  function _disposeArray() { 
    this.array = null; 
  };
  
  return{
    setupHead: setupHead,
    setupMarkPoints: setupMarkPoints,
    updateMarkPoints: updateMarkPoints,
    setupGlass: setupGlass,
    queryIsHeadSetup: queryIsHeadSetup,
    queryIsGlassSetup: queryIsGlassSetup,
    deleteGlass: deleteGlass,
    resizeCanvas: resizeCanvas,
    changeFrameColor:changeFrameColor,
    changeLegsColor:changeLegsColor,
    perspectiveUp: perspectiveUp,
    perspectiveFront: perspectiveFront,
    perspectiveRear: perspectiveRear,
    perspectiveLeft: perspectiveLeft,
    perspectiveRight: perspectiveRight,
    headEffectHide: headEffectHide,
    markPEffectHide: markPEffectHide,
    markIEffectHide: markIEffectHide
  };

});