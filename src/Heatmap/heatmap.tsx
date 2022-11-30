import * as React from 'react';
import {useState, useEffect, useMemo, useRef, useCallback} from 'react';
import ReactMap, {Source, Layer, GeolocateControl, FullscreenControl, NavigationControl, Marker, MapRef, MapboxStyle} from 'react-map-gl';
import { format } from 'date-fns';
import {
  scaleOrdinal, scaleQuantize
} from 'd3-scale'
import { extent } from 'd3-array';
import bbox from '@turf/bbox';
import GeoMapControlPanel from './heatmap-control-panel';
import { ACCESS_TOKEN } from '../constants/constants';
import Pin from '../Utils/Pin/pin';
import { Container } from 'react-bootstrap';
import { Typography } from '@mui/material';
import { Style } from 'mapbox-gl';
import { ClassNames } from '@emotion/react';


type HeatMapProps = {
  geojsonUrl: string,
  dataUrl: string,
}

function getLatLong(coords): Number[]  {
  
  const points = coords[0];
  //console.log(points);
  if(points.length == 2) return points[0];

  for(let i=0;i<points.length;i++){
    if(points[i].length == 2) {
      return points[i];
    }
  }
}

function getPinLocations(allData) {
  if(allData.json){
    let pinCoords: Number[][] = [];
    allData.json.features.map((x) => pinCoords.concat(getLatLong(x.geometry.coordinates)))
    return pinCoords;
  }
  
}

export default function Heatmap(props) {

const MAPBOX_TOKEN = ACCESS_TOKEN;
const legendItems = ['_layerId', 'name', 'density', 'population','state','updated'];

const colors = (specifier) => {
  var n = specifier.length / 6 | 0, colors = new Array(n), i = 0;
  while (i < n) colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
  return colors;

}

const schemeCategory10 = colors("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");
const scale = scaleOrdinal(schemeCategory10);

const toLabel = (text) => {
  let spaced = text.replace(/([A-Z])/g, ' $1');
  let capped = spaced.charAt(0).toUpperCase() + spaced.slice(1);
  let shrunk = capped.replace(' Per One ', '/');
  return shrunk.replace(/(Today)\s(\w+)/, '$2 $1');
}

  const [patternLayerVisibility, setPatternLayerVisibility] = useState('none');
  const [title, setTitle] = useState('');
  const mapRef = useRef<MapRef>();

  const [hoverInfo, setHoverInfo] = useState(null);
  const [allData, setAllData] = useState({json: undefined, dimensionMap:undefined});
  const [heatMapLayer, setHeatMapLayer] = useState(null);
  const [patternLayer, setPatternLayer] = useState(null);
  const [dimension, setDimension] = useState({
    value: "cases",
    label: 'Cases',
    color: '#1f77b4',
  });

  
  
  

  useEffect(() => {
    /* global fetch */
    fetch(
      props.geojsonUrl
    )
      .then(resp => resp.json())
      .then(json => setAllData({json:json, dimensionMap:splitDimensions(json)}))
      .catch(err => console.error('Could not load data', err)); // eslint-disable-line
      
  }, [props]);


  const quantizeProperty = (jsonData, dimz, property) => {
		let domain = [];
		let fillProperty;
		jsonData.features.forEach((f) => {
			domain.push(f.properties[dimz.value]);
		});

    // extent: calculates min and max in an array
    if(property == "opacity"){
      if (extent(domain)[0] === extent(domain)[1]) {
        fillProperty = 0.2;
      } else {
        const opacity = scaleQuantize()
          .domain(extent(domain))
          .range([0.2, 0.35, 0.5, 0.65, 0.8]);
  
          fillProperty = [
          'step',
          ['get', dimz.value],
          0.1,
          opacity.invertExtent(0.2)[0],
          0.2,
          opacity.invertExtent(0.35)[0],
          0.35,
          opacity.invertExtent(0.5)[0],
          0.5,
          opacity.invertExtent(0.65)[0],
          0.65,
          opacity.invertExtent(0.8)[0],
          0.8,
        ];
      }
    } else {
      if (extent(domain)[0] === extent(domain)[1]) {
        fillProperty = "tmpoly-plus-100-black";
    } else {
        const opacity = scaleQuantize()
            .domain(extent(domain))
            .range([0.2, 0.35, 0.5, 0.65, 0.8]);

            fillProperty = [
            'step',
            ['get', dimz.value],
            "tmpoly-plus-100-black",
            opacity.invertExtent(0.2)[0],
            "tmpoly-circle-light-100-black",
            opacity.invertExtent(0.35)[0],
            "tmpoly-grid-light-200-black",
            opacity.invertExtent(0.5)[0],
            "tmpoly-line-vertical-down-light-100-black",
            opacity.invertExtent(0.65)[0],
            "tmpoly-caret-200-black",
            opacity.invertExtent(0.8)[0],
            "tmpoly-caret-200-black",
        ];
      }
    }
		console.log("property: ", property, fillProperty);
		return fillProperty;
	};
  
  const data = useMemo(() => {
   if(allData.json){
     console.log(allData.json);

      const zoomLong = allData.json.initialViewState[0];
      const zoomLat = allData.json.initialViewState[1];
      
      setTitle(allData.json.name);
      mapRef.current?.flyTo({center: [zoomLong, zoomLat], duration: 2000});

      setHeatMapLayer({
        id: 'data',
        type: 'fill',
        source: {
          type:"geojson",
          data: allData.json
        },
        paint: {
          "fill-outline-color": "black",
          'fill-color': allData.dimensionMap.get(dimension.value).color,
          'fill-opacity': quantizeProperty(allData.json, dimension, "opacity")
        },
      });

      setPatternLayer({
        id: 'patternLayer',
        type: 'fill',
        source: {
          type:"geojson",
          data: allData.json
        },
        "layout": {
          "visibility": patternLayerVisibility
        },
        paint: {
          "fill-outline-color": "black",
          'fill-color': allData.dimensionMap.get(dimension.value).color,
          'fill-pattern': quantizeProperty(allData.json, dimension, "pattern")
        },
      }) 
   }

    return allData;
    
  }, [allData, patternLayerVisibility, dimension]);



  

 

  const onHover = useCallback(event => {
    
    const {
      features,
      lngLat: {lng, lat},
      point: {x, y}
    } = event;
    const hoveredFeature = features && features[0];
    
    // prettier-ignore
    setHoverInfo(hoveredFeature && {feature: hoveredFeature, x, y, lng, lat});
    
  }, []);


  

  function splitDimensions(allData) {
      let index = 0;
      let dimensionsMap = new Map();
        Object.keys(allData.features[0].properties).forEach((d) => {
          if (!legendItems.includes(d)) {
            const label = toLabel(d);
            const color = scale(index.toString());
            dimensionsMap.set(d, { label: label, color: color});
            index++;
          }
        });
        
        if(dimensionsMap){
          setDimension({
            value: dimensionsMap.keys().next().value,
            label: dimensionsMap.values().next().value.label,
            color: dimensionsMap.values().next().value.color,
          })
        }
        return dimensionsMap;
  };

  // let heatmapLayer, patternLayer;



  // if(allData.dimensionMap) {
  //     heatmapLayer= 
  //          {
  //           id: 'data',
  //           type: 'fill',
  //           source: {
  //             type:"geojson",
  //             data: data.json
  //           },
  //           paint: {
  //             "fill-outline-color": "black",
  //             'fill-color': allData.dimensionMap.get(dimension.value).color,
  //             'fill-opacity': quantizeProperty(dimension, "opacity")
  //           },
  //         }
      
  //     patternLayer = {
  //       id: 'patternLayer',
  //       type: 'fill',
  //       source: {
  //         type:"geojson",
  //         data: data.json
  //       },
  //       "layout": {
  //         "visibility": patternLayerVisibility
  //       },
  //       paint: {
  //         "fill-outline-color": "black",
  //         'fill-color': allData.dimensionMap.get(dimension.value).color,
  //         'fill-pattern': quantizeProperty(dimension, "pattern")
  //       },
  //     }

  // }


  return (
    <Container fluid>
      <Typography variant="h6" aria-label={title}>
          {title}
        </Typography>

        {data.json &&  (
          <ReactMap
          ref={mapRef}
          initialViewState={{
            zoom: 1.5
          }}
          
          style={{width: '90vw', height: '80vh'}}
          mapStyle={"mapbox://styles/purvasingh/clb2khfje000j14mjt6dwbau8"}
          mapboxAccessToken={MAPBOX_TOKEN}
          interactiveLayerIds={['data', 'patternLayer']}
          onMouseMove={onHover}
          renderWorldCopies={false}
        >
          
          <GeolocateControl showUserHeading={true} position='top-left'/>
          <FullscreenControl position="top-left" />
          <NavigationControl position="top-left" />
          <div>
            <Source type="geojson" data={data.json}>
            <Layer 
            { ...heatMapLayer}
            />
           <Layer 
            { ...patternLayer}
            />
          </Source>
          {hoverInfo && dimension && (
					<div
						className="tooltip-custom"
						style={{ left: hoverInfo.x, top: hoverInfo.y }}
					>
						<div>State: {hoverInfo.feature.properties.name}</div>
						<div>
							Population:{' '}
							{hoverInfo.feature.properties.population.toLocaleString()}
						</div>
						<div>
							{allData.dimensionMap.get(dimension.value).label}:{' '}
							{hoverInfo.feature.properties[dimension.value].toLocaleString()}
						</div>
					</div>
				)}


          {dimension && <GeoMapControlPanel
						name={"COVID-19 STATE-BY-STATE DAILY STATISTIC HEATMAP LAYER"}
						dimensions={data.dimensionMap as Map<string, string>}
						onChange={(e) => {
              setDimension({
                value: e.toLocaleString(),
                label: allData.dimensionMap.get(e.toLocaleString()).label,
                color: allData.dimensionMap.get(e.toLocaleString()).color,
              })}}
              onChangeCheck={(e) => {
                console.log("e: ", e);
                e == true ? setPatternLayerVisibility('visible'): setPatternLayerVisibility('none');
              }}
              dataUrl={props.dataUrl}
					/>}
					
          </div>
          </ReactMap>
				)
      }
      
      </Container>
  );
}


