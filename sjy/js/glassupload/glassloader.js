define(['3rd/pako/pako_inflate.min'],function(pako){'use strict';
  
  var fileURL="",
      ursFileList=[],
      ursBinFileList=[],
      resovedBinFiles=[],
      dataUint8=[],
      dataInt32=[],
      dataFloat32=[];
  
  function downloadData(fileinfo){
    fileURL=fileinfo.fileurl;
    ursFileList=fileinfo.ursfilelist.slice(0);
    ursBinFileList=fileinfo.ursbinfilelist.slice(0);
    resovedBinFiles=[];
    dataUint8=[];
    dataInt32=[];
    dataFloat32=[];
    _downloadTarFile();
  };
  
  function queryResovedBinFiles(){
    return resovedBinFiles;
  };
  
  function _downloadTarFile(){
    //somehow 'arraybuffer' does not work in IE
    var xhr=new XMLHttpRequest();
    xhr.open("post",fileURL,true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function() {
      if (xhr.status === 200) {
        var arraybuffer = xhr.response,
            bytes=new Uint8Array(arraybuffer);
        //console.log(fileURL+": "+bytes.length+" downloaded");
        dataUint8=pako.inflate(bytes);
        //console.log(fileURL+": "+dataUint8.length+" extracted");
        dataInt32=new Int32Array(dataUint8.buffer);
        dataFloat32=new Float32Array(dataUint8.buffer);
        _resolveTarFile();
      }
    };
    xhr.send(null);
    //console.log(fileURL+": downloading");
  };
  
  function _resolveTarFile(){
    //console.log(fileURL+": "+dataUint8.length+" resolving");
    for(var offset=0,len=dataUint8.length;offset<len;offset+=512){
      var tempfilename="";
      for(var i=0;i<30;++i){
        var j=i+offset,
            tempchar=String.fromCharCode(dataUint8[j]);
        tempfilename=tempfilename+tempchar;
      }
      
      var i=0,
          numu=ursFileList.length,
          numuu=ursBinFileList.length;
      while(i<numu){
        if(numuu===0){
          //console.log("all bin files located");
          return;
        }
        
        if(tempfilename.indexOf(ursFileList[i])===0){
          var tempfilesize=0;
          for(var j=125;j<135;++j){
            var k=j+offset,
                tempchar=String.fromCharCode(dataUint8[k]);
            tempfilesize=(tempfilesize<<3)+parseInt(tempchar);
          }
          //console.log(ursFileList[i]+" located at "+offset +": "+tempfilesize+" bytes");

          for(var j=0;j<numuu;++j){
            if(ursFileList[i]===ursBinFileList[j]){
              ursBinFileList.splice(j,1);
              --numuu;
              _resolveBinFile(ursFileList[i],tempfilesize>>2,(offset+512)>>2);
            }
          }
          ursFileList.splice(i,1);
          offset+=((Math.ceil(tempfilesize>>9))<<9);
        }
        ++i;
      }
    }
    
    var numuu=ursBinFileList.length;
    if(numuu>0){
      for(var i=0;i<numuu;++i){
        //console.log(ursBinFileList[i]+" unlocated");
      }
    }
    else{
      //console.log("all files located");
    }
  };
  
  //consider 4 bytes as one data unit
  function _resolveBinFile(filename,filesize,offset){
    var datasize=filesize-2,
        numv=dataInt32[offset],
        numf=dataInt32[offset+1];
        
    if(3*numv+3*numf===datasize){
      //console.log(filename+" resolving: numv= "+numv+" numf= "+numf+" 3 3");
      var offsetv=offset+2,
          offsetn=offsetv+3*numv,
          offsetf=offsetn,
          normalexist=false,
          facetype=3;
    }
    else if(6*numv+3*numf===datasize){
      //console.log(filename+" resolving: numv= "+numv+" numf= "+numf+" 6 3");
      var offsetv=offset+2,
          offsetn=offsetv+3*numv,
          offsetf=offsetn+3*numv,
          normalexist=true,
          facetype=3;
    }
    else if(6*numv+(numf<<2)===datasize){
      //console.log(filename+" resolving: numv= "+numv+" numf= "+numf+" 6 4");
      var offsetv=offset+2,
          offsetn=offsetv+3*numv,
          offsetf=offsetn+3*numv,
          normalexist=true,
          facetype=4;
    }
    else if(3*numv+(numf<<2)===datasize){
      //console.log(filename+" resolving: numv= "+numv+" numf= "+numf+" 3 4");
      var offsetv=offset+2,
          offsetn=offsetv+3*numv,
          offsetf=offsetn,
          normalexist=false,
          facetype=4;
    }
    else{
      console.log(filename+" format error: failed to resolve");
      return;
    }
    //resolve points, normals, and faces in sequence
    var binfile={
      filename: filename,
      facetype: facetype
    };
    binfile.points=new Float32Array(dataUint8.buffer,offsetv<<2,3*numv);
    if(normalexist){
      binfile.normals=new Float32Array(dataUint8.buffer,offsetn<<2,3*numv);
    }
    else{
      binfile.normals=[];
    }
    binfile.faces=new Int32Array(dataUint8.buffer,offsetf<<2,facetype*numf);
    resovedBinFiles.push(binfile);
  };
  
  return{
    downloadData: downloadData,
    queryResovedBinFiles: queryResovedBinFiles,
  };

});


