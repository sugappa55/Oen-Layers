import GeoJSON from "ol/format/GeoJSON";


export const exportVectorFeaturesAsGeoJSON = (features, config={}) => {
    const geoJson = (new GeoJSON()).writeFeaturesObject(features, {
      dataProjection: config.dataProjection || 'EPSG:4326',
      featureProjection: config.featureProjection || 'EPSG:3857'
    });
    geoJson.features.forEach((feature) => {
      if (feature.properties === null) feature.properties = {};
    });
    const geoJsonBlob = new Blob([JSON.stringify(geoJson)], { type: 'application/geo+json' });
    const url = window.URL.createObjectURL(geoJsonBlob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'map.geojson';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  