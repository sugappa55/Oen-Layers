import "./style.css"
import Draw from 'ol/interaction/Draw';
import Modify from 'ol/interaction/Modify';

import Map from 'ol/Map';
import View from 'ol/View';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';

const raster = new TileLayer({
  source: new OSM(),
});

const source = new VectorSource({wrapX: false});

const vector = new VectorLayer({
  source: source,
});

const map = new Map({
  layers: [raster, vector],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 4,
  }),
});


let draw,modify; // global so we can remove it later
function addInteraction(type) {
  if (type !== 'remove' && type !== 'edit') {
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
  else {

      //Adding Modify feature

     modify=new Modify({
    source:source
   })
     map.addInteraction(modify)
  }
}

//Adding draw features


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


