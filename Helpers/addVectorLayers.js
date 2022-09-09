import { exportVectorFeaturesAsGeoJSON } from "./exportGeoJson";

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

  function showVecorLayers(vectors,container,map){
    container.innerHTML=null;
    if(vectors.length>=2)vectors.shift()
    console.log(vectors)
    vectors.forEach((singleLayer,index)=>{
      let div=document.createElement("div");
      div.classList.add("flex","singlevectorlayer")
    let styleLayer=document.createElement("button");
    styleLayer.classList.add("singlelayericons")
    styleLayer.innerHTML='<i class="fa-solid fa-palette"></i>'
    let hideLayer=document.createElement("button");
    if(vectors.length<=1)hideLayer.setAttribute("disabled",true)
    hideLayer.classList.add("singlelayericons")
    hideLayer.innerHTML='<i class="fa-solid fa-eye-slash"></i>'
    hideLayer.addEventListener("click",()=>{
      let isVisible=singleLayer.get("visible")
      singleLayer.set("visible",!isVisible)
      hideLayer.firstChild.classList.toggle("fa-eye")
      hideLayer.firstChild.classList.toggle("fa-eye-slash")
    })
    let title=document.createElement("p");
    title.innerText=singleLayer.get("title")
    let downloadLayer=document.createElement("button");
    downloadLayer.classList.add("singlelayericons")
    downloadLayer.innerHTML='<i class="fa-solid fa-cloud-arrow-down"></i>'
    downloadLayer.addEventListener("click",()=>{
      exportVectorFeaturesAsGeoJSON(singleLayer.getSource().getFeatures())
    })
    let zoomLayer=document.createElement("button");
    zoomLayer.classList.add("singlelayericons")
    zoomLayer.innerHTML='<i class="fa-solid fa-magnifying-glass-plus"></i>'
    zoomLayer.addEventListener("click",()=>{
   
      map.getView().fit(singleLayer.getSource().getExtent());

    })

    let deleteLayer=document.createElement("button");
    deleteLayer.classList.add("singlelayericons")
    deleteLayer.innerHTML='<i class="fa-solid fa-trash-can"></i>'
    deleteLayer.addEventListener("click",()=>{
      console.log("removing")
      map.removeLayer(singleLayer)
      vectors.splice(index,1)
      showVecorLayers(vectors,container,map)
      
    })
    div.append(styleLayer,hideLayer,title,downloadLayer,zoomLayer,deleteLayer)
    container.append(div)
    })

  }

  export {showVecorLayers}