


function showLayers(elem,layers){

}


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