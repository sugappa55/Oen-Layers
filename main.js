import "./style.css"
import {Draw,DragAndDrop,defaults as defaultInteractions,} from 'ol/interaction';
import Modify from 'ol/interaction/Modify';
import GeoJSON from "ol/format/GeoJSON";
import Map from 'ol/Map';
import View from 'ol/View';
import {OSM, Vector as VectorSource, XYZ} from 'ol/source';
import {Group, Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import { exportVectorFeaturesAsGeoJSON } from "./Helpers/exportGeoJson";
import VectorImageLayer from "ol/layer/VectorImage";
import { showVecorLayers } from "./Helpers/addVectorLayers";


window.onload=displayLayers

const dragAndDropInteraction = new DragAndDrop({
  formatConstructors: [GeoJSON]
});

const source = new VectorSource({wrapX: false});

var vector = new VectorLayer({
  source: source,
  title:"defaultLayer",
},
);

const map = new Map({
  interactions: defaultInteractions().extend([dragAndDropInteraction]),
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

//Adding Drag and drop feature
dragAndDropInteraction.on('addfeatures', function (event) {
  console.log(event.file.name)
  const vectorSource = new VectorSource({
    features: event.features,
  });
  map.addLayer(
    new VectorImageLayer({
      source: vectorSource,
      title:event.file.name
    })
  );
  map.getView().fit(vectorSource.getExtent());

 displayLayers()
 let vectors=document.querySelector(".vectorLayers")
 const layers=document.getElementById("layers")
 vectors.classList.add("visible")
 layers.classList.remove("visible")
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

export const allLayers=new Group({
  layers:[Standard,Humanitarian,Stamen,vector ]
})

map.addLayer(allLayers)

//Switch layers Logic implementation

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
  let vectors=document.querySelector(".vectorLayers")
  vectors.classList.remove("visible")

})

const closeLayers=document.getElementById("close-layers")
closeLayers.addEventListener("click",()=>{
  const layers=document.getElementById("layers")
  layers.classList.toggle("visible")
})





//Draw Features

let draw,modify; // global so we can remove it later
function addInteraction(type) {
  let vectors=document.querySelector(".vectorLayers")
  const layers=document.getElementById("layers")
  let drawFeatures=["LineString","Circle","Polygon","Point"]
console.log(drawFeatures.includes(type))
  if (drawFeatures.includes(type)) {
    map.removeInteraction(draw)

    draw = new Draw({
      source: source,
      type: type//lineString polygon circle point
    });
    map.addInteraction(draw)
    vectors.classList.add("visible")
    layers.classList.remove("visible")
  }
  else if(type==="remove"){
    draw.removeLastPoint()
    map.removeInteraction(draw);
    map.removeInteraction(modify);
    vectors.classList.add("visible")
    layers.classList.remove("visible")


  }
  else if(type==="edit") {
    console.log("modifying")
      //Adding Modify feature

     modify=new Modify({
    source:source
   })
     map.addInteraction(modify)
     vectors.classList.add("visible")
    layers.classList.remove("visible")


  }
  else if(type==="download"){
    downloadGeoJson(vector.getSource().getFeatures())
  }
}

//Adding Css to selected draw features


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


function displayLayers(){
  var allMapLayers=map.getAllLayers().filter(layer=>layer.getVisible())
  let container=document.getElementById("AllVectorImages")
  showVecorLayers(allMapLayers,container,map)
}









