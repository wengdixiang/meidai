define(function () {
  'use strict';

  var canvasDispJObj = $('#canvasDisp'),
    canvasColor = 0xbbbbbb,
    envLightValue = 0xaaaaaa,
    pointLightValue = 0x333333,
    myRenderer = null,
    myScene = null,
    myCamera = null,
    myControls = null,

    headGeometry = null,
    headMaterialNormal = null,
    headMesh = null,
    isHeadSetup = false,
    isHeadHiden = false,
    headColor = 0x555555,

    glassGeometries = {
      frame: null,
      legs: [],
      lens: []
    },
    glassMeshes = {
      frame: null,
      legs: [],
      lens: []
    },
    isGlassSetup = false,
    glassFrameColor = 0x000000,
    glassLegsColor = 0x000000,
    glassLensColor = 0xffffff,
    glassEnvMap = null,

    frameMaterial = "",
    legMaterial = "",
    frameMaterialList = {
      plastic: null
    },
    legMaterialList = {
      plastic: null,
      metal: null
    },
    lenMaterial = null;

  function setupHead(headobj) {
    //console.log(headobj.filename);
    //geometry mesh
    headGeometry = _generateGeometry(headobj),
      headGeometry.computeBoundingBox();
    headGeometry.computeVertexNormals();
    headMaterialNormal = new THREE.MeshNormalMaterial();
    headMesh = new THREE.Mesh(headGeometry, headMaterialNormal);

    // camera
    var headboundingbox = headGeometry.boundingBox,
      xcenter = (headboundingbox.min.x + headboundingbox.max.x) >> 1,
      ycenter = (headboundingbox.min.y + headboundingbox.max.y) >> 1,
      zcenter = (headboundingbox.min.z + headboundingbox.max.z) >> 1,
      zwidth = headboundingbox.max.z - headboundingbox.min.z,
      canvaswidth = canvasDispJObj.attr('width'),
      canvasheight = canvasDispJObj.attr('height');
    myCamera = new THREE.PerspectiveCamera(20, canvaswidth / canvasheight, 1, 10000);
    myCamera.position.set(xcenter, ycenter, headboundingbox.max.z + 1000);

    //scene
    myScene = new THREE.Scene();
    myScene.add(headMesh);
    myScene.add(myCamera);

    var ambientlight = new THREE.AmbientLight(envLightValue);
    myScene.add(ambientlight);

    //lights
    var pointlight1 = new THREE.PointLight(pointLightValue, 2, 1500),
      pointlight2 = new THREE.PointLight(pointLightValue, 2, 1500),
      pointlight3 = new THREE.PointLight(pointLightValue, 2, 1500),
      pointlight4 = new THREE.PointLight(pointLightValue, 2, 1500),
      dirlight1 = new THREE.DirectionalLight();
    myScene.add(pointlight1);
    myScene.add(pointlight2);
    myScene.add(pointlight3);
    myScene.add(pointlight4);
    myScene.add(dirlight1);
    pointlight1.position.set(xcenter - 400, ycenter + 500, headboundingbox.max.z - 400);
    pointlight2.position.set(xcenter + 400, ycenter + 500, headboundingbox.max.z - 400);
    pointlight3.position.set(xcenter - 400, ycenter - 1000, headboundingbox.max.z + 400);
    pointlight4.position.set(xcenter + 400, ycenter - 1000, headboundingbox.max.z + 400);
    dirlight1.position.set(0, 10, 3);

    // render
    myRenderer = new THREE.WebGLRenderer({
      canvas: canvasDispJObj[0],
      antialias: true
    });
    myRenderer.setClearColor(canvasColor);

    // controls
    myControls = new THREE.OrbitControls(myCamera, canvasDispJObj[0]);
    myControls.addEventListener('change', _renderCanvas);
    /*
    myControls.minPolarAngle = Math.PI * 0.15;
    myControls.maxPolarAngle = Math.PI * 0.40;
    myControls.minAzimuthAngle=-Math.PI * 0.5;
    myControls.maxAzimuthAngle=Math.PI * 0.5;
    */
    myControls.minDistance = 500;
    myControls.maxDistance = 1500;
    myControls.target.set(xcenter, ycenter, zcenter);
    myControls.enablePan = false;
    myControls.update();

    _renderCanvas();

    //pre-set some glass config
    frameMaterialList.plastic = new THREE.MeshPhongMaterial({
      color: glassFrameColor,
      specular: 0x000000, shininess: 80
    });
    legMaterialList.plastic = new THREE.MeshPhongMaterial({
      color: glassLegsColor,
      specular: 0x000000, shininess: 80
    });

    legMaterialList.metal = new THREE.MeshPhongMaterial({
      color: 0x997765,
      specular: 0x666666, emissive: 0x000000, shininess: 40
    });

    glassEnvMap = new THREE.TextureLoader().load('images/glassclient/envmap.png', _renderCanvas);
    glassEnvMap.mapping = THREE.SphericalReflectionMapping;
    lenMaterial = new THREE.MeshBasicMaterial({
      color: glassLensColor, premultipliedAlpha: true,
      transparent: true, opacity: 0.12, envMap: glassEnvMap
    });

    isHeadSetup = true;
    console.log("isHeadSetup=true;");
  };

  function setupGlass(glassobjs, framematerial, legmaterial) {
    frameMaterial = framematerial;
    legMaterial = legmaterial;

    console.log(frameMaterial);
    console.log(legMaterial);


    for (var k = 0, numo = glassobjs.length; k < numo; ++k) {
      var glassobj = glassobjs[k],
        tempgeometry = _generateGeometry(glassobj),
        tempmaterial = null,
        tempmesh = null;

      if (glassobj.filename.indexOf("frame") >= 0) {
        tempmaterial = frameMaterialList[frameMaterial];
        if (frameMaterial !== "metal") {
          tempmaterial.color.setHex(glassFrameColor);
        }
        tempmesh = new THREE.Mesh(tempgeometry, tempmaterial);
        glassGeometries.frame = tempgeometry;
        glassMeshes.frame = tempmesh;
      }
      else if (glassobj.filename.indexOf("legs") >= 0) {
        tempmaterial = legMaterialList[legMaterial];
        if (legMaterial !== "metal") {
          tempmaterial.color.setHex(glassLegsColor);
        }
        tempmesh = new THREE.Mesh(tempgeometry, tempmaterial);
        glassGeometries.legs.push(tempgeometry);
        glassMeshes.legs.push(tempmesh);
      }
      else if (glassobj.filename.indexOf("lens") >= 0) {
        tempmaterial = lenMaterial;
        tempmesh = new THREE.Mesh(tempgeometry, tempmaterial);
        glassGeometries.lens.push(tempgeometry);
        glassMeshes.lens.push(tempmesh);
      }
      else {
        console.log("invalid glass obj");
      }
      myScene.add(tempmesh);
    }
    _renderCanvas();
    isGlassSetup = true;
  };

  function queryIsHeadSetup() {
    return isHeadSetup;
  };

  function queryIsGlassSetup() {
    return isGlassSetup;
  };

  function deleteGlass() {
    //console.log("deleting glass");
    if (isGlassSetup) {
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
      glassGeometries = {
        frame: null,
        legs: [],
        lens: []
      },
        glassMeshes = {
          frame: null,
          legs: [],
          lens: []
        },
        isGlassSetup = false;
    }
  }

  function resizeCanvas(width, height) {
    myCamera.aspect = width / height;
    myCamera.updateProjectionMatrix();
    myRenderer.setSize(width, height);
    _renderCanvas();
  };

  function changeFrameColor(framecolor) {
    framecolor = parseInt(framecolor);
    if (framecolor !== glassFrameColor) {
      console.log("changeFrameColor: " + framecolor.toString(16));
      glassFrameColor = framecolor;
      if (isGlassSetup && frameMaterial !== "metal") {
        glassMeshes.frame.material.color.setHex(framecolor);
        _renderCanvas();
      }
    }
  };

  function changeLegsColor(legscolor) {
    legscolor = parseInt(legscolor);
    if (legscolor !== glassLegsColor) {
      console.log("changeLegsColor: " + legscolor.toString(16));
      glassLegsColor = legscolor;
      if (isGlassSetup && legMaterial !== "metal") {
        glassMeshes.legs[0].material.color.setHex(legscolor);
        //glassMeshes.legs[1].material.color.setHex(legscolor);
        _renderCanvas();
      }
    }
  };

  function perspectiveUp() {
    if (isHeadSetup) {
      myControls.adjustCameraTo(new THREE.Spherical(1121, Math.PI * 0.15, 0));
    }
  };

  function perspectiveFront() {
    if (isHeadSetup) {
      myControls.adjustCameraTo(new THREE.Spherical(1121, Math.PI * 0.40, 0));
    }
  };

  function perspectiveLeft() {
    if (isHeadSetup) {
      myControls.adjustCameraTo(new THREE.Spherical(1121, Math.PI / 2, Math.PI / 2));
    }
  };

  function perspectiveRight() {
    if (isHeadSetup) {
      myControls.adjustCameraTo(new THREE.Spherical(1121, Math.PI / 2, -Math.PI / 2));
    }
  };

  function headEffectHide() {
    if (isHeadSetup) {
      if (isHeadHiden) {
        //display here
        isHeadHiden = false;
        myScene.add(headMesh);
        _renderCanvas();
      }
      else {
        //hide here
        isHeadHiden = true;
        myScene.remove(headMesh);
        _renderCanvas();
      }
    }
    return isHeadHiden;
  };

  function _renderCanvas() {

    myRenderer.render(myScene, myCamera);
  };

  function _generateGeometry(obj) {
    var geometry = new THREE.BufferGeometry(),
      positions = null,
      normals = null,
      indices = null,
      i,
      len;

    //points
    i = 0;
    len = obj.points.length;
    positions = new Float32Array(len);
    while (i < len) {
      positions[i] = obj.points[i];
      ++i;
      positions[i] = obj.points[i];
      ++i;
      positions[i] = obj.points[i];
      ++i;
    }
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3).onUpload(_disposeArray));

    //normals
    if (obj.normals.length !== 0) {
      //console.log("normals exist");
      i = 0;
      len = obj.normals.length;
      normals = new Float32Array(len);
      while (i < len) {
        normals[i] = obj.normals[i];
        ++i;
        normals[i] = obj.normals[i];
        ++i;
        normals[i] = obj.normals[i];
        ++i;
      }
      geometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3).onUpload(_disposeArray));
    }
    else {
      //console.log("normals not exist");
    }

    //faces
    if (obj.facetype === 3) {
      //console.log("face type: 3");
      //console.log("index number: "+obj.faces.length);
      //console.log("face number: "+obj.faces.length/3);
      i = 0;
      len = obj.faces.length;
      indices = new Uint32Array(len);
      while (i < len) {
        indices[i] = obj.faces[i];
        ++i;
        indices[i] = obj.faces[i];
        ++i;
        indices[i] = obj.faces[i];
        ++i;
      }
      geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    }
    else {
      //console.log("face type: 4");
      //console.log("index number: "+obj.faces.length);
      //console.log("face number: "+(obj.faces.length>>2));
      i = 0;
      len = obj.faces.length;
      //console.log("len: "+len);
      indices = new Uint32Array((len * 3) >> 1);
      while (i < len) {
        var j = (i * 3) >> 1;
        indices[j] = obj.faces[i];
        indices[j + 1] = obj.faces[i + 1];
        indices[j + 2] = obj.faces[i + 2];
        indices[j + 3] = obj.faces[i];
        indices[j + 4] = obj.faces[i + 2];
        indices[j + 5] = obj.faces[i + 3];
        i = i + 4;
      }
      geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    }

    return geometry;
  };

  function _disposeArray() {
    this.array = null;
  };

  return {
    setupHead: setupHead,
    setupGlass: setupGlass,
    queryIsHeadSetup: queryIsHeadSetup,
    queryIsGlassSetup: queryIsGlassSetup,
    deleteGlass: deleteGlass,
    resizeCanvas: resizeCanvas,
    changeFrameColor: changeFrameColor,
    changeLegsColor: changeLegsColor,
    perspectiveUp: perspectiveUp,
    perspectiveFront: perspectiveFront,
    perspectiveLeft: perspectiveLeft,
    perspectiveRight: perspectiveRight,
    headEffectHide: headEffectHide,
  };

});