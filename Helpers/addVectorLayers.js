const readData = (file) => {
    return (e) => {
      try {
        const geoJson = JSON.parse(e.target.result);
       let  vectorSource = new VectorSource({
          wrapX: false,
          features: (new GeoJSON()).readFeatures(geoJson, {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'})
        });
        const vectorLayer = new VectorLayer({
          zIndevectorSourcex: 1,
          source: vectorSource
        });
        vectorLayer.set('name', 'File: ' + file.name);
        map.addLayer(vectorLayer);
       
      } catch (ex) {
        alert('An error occurred while trying to read this file: ' + ex);
      }
    };
  };
  
  const importData = (files) => {
    files
    .map(f => f.originFileObj)
    .forEach((file) => {
      var reader = new FileReader();
      reader.onload = readData(file);
      reader.readAsText(file);
    });
  };



  //Adding individual layers

  function showVecorLayers(vectors,container){
    container.innerHTML=null;
    vectors.shift()
    vectors.forEach(singleLayer=>{
      let div=document.createElement("div");
      div.classList.add("flex","singlevectorlayer")
    let styleLayer=document.createElement("button");
    styleLayer.classList.add("singlelayericons")
    styleLayer.innerHTML='<i class="fa-solid fa-palette"></i>'
    let hideLayer=document.createElement("button");
    hideLayer.classList.add("singlelayericons")
    hideLayer.innerHTML='<i class="fa-solid fa-eye-slash"></i>'
    let title=document.createElement("p");
    title.innerText=singleLayer.get("title")
    let downloadLayer=document.createElement("button");
    downloadLayer.classList.add("singlelayericons")
    downloadLayer.innerHTML='<i class="fa-solid fa-cloud-arrow-down"></i>'
    let zoomLayer=document.createElement("button");
    zoomLayer.classList.add("singlelayericons")
    zoomLayer.innerHTML='<i class="fa-solid fa-magnifying-glass-plus"></i>'
    let deleteLayer=document.createElement("button");
    deleteLayer.classList.add("singlelayericons")
    deleteLayer.innerHTML='<i class="fa-solid fa-trash-can"></i>'
    div.append(styleLayer,hideLayer,title,downloadLayer,zoomLayer,deleteLayer)
    container.append(div)
    })

  }

  export {showVecorLayers}