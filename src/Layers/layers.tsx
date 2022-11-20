import type {LayerProps} from 'react-map-gl';
import MAP_STYLE from "../constants/mapbox-style.json"

export const backgroundLayer: LayerProps = {
    
        id: 'bg',
        type: 'background',
        paint: {
          "background-color": "#fff"
        }
      
};

export const polygonLayer: LayerProps = {
    id: "polygons-texture",
    type: "fill",
    source: "sample",
    // layout: {
    //   visibility: "none"
    // },
    paint: {
      "fill-pattern": [
        "step",
        ["get", "cases"],
        "tmpoly-plus-100-black",
        1,
        "tmpoly-circle-light-100-black",
        2,
        "tmpoly-grid-light-200-black",
        3,
        "tmpoly-line-vertical-down-light-100-black",
        4,
        "tmpoly-caret-200-black",
        5,
        "tmpoly-square-100-black",
        6,
        "tmpoly-slash-forward-100-black",
        7,
        "tmpoly-line-vertical-light-100-black",
        8,
        "tmpoly-plus-200-black"
      ],
      "fill-opacity": 0.75
    }
  }

// Make a copy of the map style
export default {
  ...MAP_STYLE,
  sources: {
    ...MAP_STYLE.sources
  },
  
  layers: [backgroundLayer]
};