import "./style.css"
import Draw from 'ol/interaction/Draw';
import Modify from 'ol/interaction/Modify';
import GeoJSON from "ol/format/GeoJSON";
import Map from 'ol/Map';
import View from 'ol/View';
import {OSM, Raster, Vector, Vector as VectorSource, XYZ} from 'ol/source';
import {Group, Tile as TileLayer, Vector as VectorLayer, VectorImage} from 'ol/layer';
import { exportVectorFeaturesAsGeoJSON } from "./Helpers/exportGeoJson";

const raster = new TileLayer({
  source: new OSM(),
});

const source = new VectorSource({wrapX: false});

const vector = new VectorLayer({
  source: source,
 
  title:"defaultLayer"
},
);

const map = new Map({
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

//Base map Layers and Switching


const Humanitarian=new TileLayer({
  source:new OSM({
    url:"https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
  }),
  visible:false,
  title:"Humanitarian"
})


const Standard=new TileLayer({
  source:new OSM(),
  visible:true,
  title:"Standard"
})


const Stamen=new TileLayer({
source:new XYZ({
  url:"https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg",
  attributions:'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
 
}),
visible:false,
title:"Stamen"
})

const allLayers=new Group({
  layers:[Standard,Humanitarian,Stamen,vector ]
})

map.addLayer(allLayers)


const LayerElements=document.querySelectorAll("#layers>input[type=radio]")
for (const layer of LayerElements) {
      layer.addEventListener("change",function(){
            var LayerValue=this.value;
            allLayers.getLayers().forEach(elem=>{
              let layerTitle=elem.get("title")
              if(layerTitle) elem.setVisible(layerTitle===LayerValue)
            })
      })
}



//Switch layers CSS

let switcher=document.getElementById("layer-switcher")
switcher.addEventListener("click",()=>{
  const layers=document.getElementById("layers")
  layers.classList.toggle("visible")
})

const closeLayers=document.getElementById("close-layers")
closeLayers.addEventListener("click",()=>{
  const layers=document.getElementById("layers")
  layers.classList.toggle("visible")
})





//Draw Features

let draw,modify; // global so we can remove it later
function addInteraction(type) {
  let drawFeatures=["LineString","Circle","Polygon","Point"]
console.log(drawFeatures.includes(type))
  if (drawFeatures.includes(type)) {
    map.removeInteraction(draw)

    draw = new Draw({
      source: source,
      type: type//lineString polygon circle point
    });
    map.addInteraction(draw)
  }
  else if(type==="remove"){
    draw.removeLastPoint()
    map.removeInteraction(draw);
    map.removeInteraction(modify);
  }
  else if(type==="edit") {
    console.log("modifying")
      //Adding Modify feature

     modify=new Modify({
    source:source
   })
     map.addInteraction(modify)
  }
  else if(type==="download"){
    downloadGeoJson(vector.getSource().getFeatures())
  }
}

//Adding different draw features


var types=document.getElementsByClassName("interactions")
for(let elem of types){

    elem.addEventListener('click', function () {
      
      for (const activebtn of types) {
        if(activebtn.id===elem.id)activebtn.classList.add("bg-gray")
        else activebtn.classList.remove("bg-gray")
      }
      addInteraction(elem.id)


      })
      
  
}


//Download GeoJson

const downloadGeoJson=(layerFeatures)=>{
  exportVectorFeaturesAsGeoJSON(layerFeatures)
}



//Get all imported files

// let vectorLayers=[vector]

document.getElementById("files-upload").addEventListener("change",getFiles)


function getFiles(){
  let arr=[],importedfiles=this.files
  for (const elem of importedfiles) {
    let reader=new FileReader()
    reader.addEventListener("load",()=>{
        let res=reader.result
      arr.push(res)
    })
    
  reader.readAsDataURL(elem)

}
console.log(arr)//the source collecetion after using file reader


//   ==>by using the souce after reading but no changes in the UI


// arr.forEach((layerSource,index)=>{
//   console.log(layerSource)
//   let newVecorLayer=new VectorImage({
//     source:new Vector({
//       url:layerSource,
//       format:new GeoJSON()
//     }),
//     visible:true,
//     title:importedfiles[index]
//   })
//   map.addLayer(newVecorLayer)
// })


//==> failed to add vector layers getting XHR:https:localhost:5173/${imported file name}

// for (const layerSource of importedfiles) {
//   console.log(layerSource)
//   let newVecorLayer=new VectorImage({
//     source:new Vector({
//       url:layerSource,
//       format:new GeoJSON()
//     }),
//     visible:true,
//     title:"layerSource"
//   })
//   map.addLayer(newVecorLayer)
// }




}