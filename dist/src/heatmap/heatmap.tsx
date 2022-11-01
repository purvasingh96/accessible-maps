import * as React from 'react';
import {useState, useEffect, useMemo, useRef, useCallback} from 'react';
import {render} from 'react-dom';
import ReactMap, {Source, Layer, MapRef, MapLayerMouseEvent, FillLayer} from 'react-map-gl';
import ControlPanel from './heatmap-control-panel';
import { format } from 'date-fns';
import {
  scaleOrdinal, scaleQuantize
} from 'd3-scale'
import { extent } from 'd3-array';
import bbox from '@turf/bbox';
import GeoMapControlPanel from './heatmap-control-panel';

const MAPBOX_TOKEN = "pk.eyJ1IjoicHVydmFzaW5naCIsImEiOiJjbDQ4amRrYjQwc3RwM2NsbGttbnlpaTRmIn0.djnJ9PjVpJ7g8aIWHHnPGA"; // Set your mapbox token here
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




export default function HeatMap() {
  const mapRef = useRef<MapRef>();
  const [hoverInfo, setHoverInfo] = useState(null);
  const [allData, setAllData] = useState({json: undefined, dimensionMap:undefined});
  const [dimension, setDimension] = useState({
    value: "cases",
    label: 'Cases',
    color: '#1f77b4',
  });
  
  

  useEffect(() => {
    console.log("fetching new data");
    /* global fetch */
    fetch(
      'https://raw.githubusercontent.com/purvasingh96/Mapbox-react-app/main/src/data/COVID.json'
    )
      .then(resp => resp.json())
      .then(json => setAllData({json:json, dimensionMap:splitDimensions(json)}))
      .catch(err => console.error('Could not load data', err)); // eslint-disable-line
      
  }, []);
  
  

  const data = useMemo(() => {
    console.log("memoized data");
    return allData;
  }, [allData]);
  
  

  const quantizeOpacity = (dimz) => {
    //console.log("dimension: ", dimz);
		let domain = [];
		let fillOpacity;
		allData.json.features.forEach((f) => {
			domain.push(f.properties[dimz.value]);
		});

    // extent: calculates min and max in an array
		if (extent(domain)[0] === extent(domain)[1]) {
			fillOpacity = 0.2;
		} else {
			const opacity = scaleQuantize()
				.domain(extent(domain))
				.range([0.2, 0.35, 0.5, 0.65, 0.8]);
			fillOpacity = [
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
		return fillOpacity;
	};

//  console.log("allData.dimensionMap beofre seting dimension: ", allData.dimensionMap);

  

  const onHover = useCallback(event => {
    const {
      features,
      point: {x, y}
    } = event;
    const hoveredFeature = features && features[0];
    console.log(hoveredFeature)
    
    // prettier-ignore
    setHoverInfo(hoveredFeature && {feature: hoveredFeature, x, y});
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

  let heatmapLayer;

  if(allData.dimensionMap) {
      heatmapLayer= {
        id: 'data',
        type: 'fill',
        paint: {
          "fill-outline-color": "black",
          'fill-color': allData.dimensionMap.get(dimension.value).color,
          'fill-opacity': quantizeOpacity(dimension)
        }  
   }}

  return (

      <ReactMap
        initialViewState={{
          latitude: 40,
          longitude: -100,
          zoom: 3
        }}
        style={{width: '90vw', height: '80vh'}}
        mapStyle="mapbox://styles/mapbox/light-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={['data']}
        onMouseMove={onHover}
        renderWorldCopies={false}
      >
        {data.json &&  (
          <>
          <Source type="geojson" data={data.json}>
            <Layer 
            { ...heatmapLayer}
            />
          </Source>
          {hoverInfo && dimension && (
					<div
						className="tooltip"
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
						<div>
							Updated:{' '}
							{format(hoverInfo.feature.properties.updated, 'MMM d yyyy')}
						</div>
					</div>
				)}
          {dimension && <GeoMapControlPanel
						name={"COVID-19 State-By-State Daily Statistic Heatmap Layer"}
						dimensions={data.dimensionMap as Map<string, string>}
						onChange={(e) => {
              setDimension({
                value: e.toLocaleString(),
                label: allData.dimensionMap.get(e.toLocaleString()).label,
                color: allData.dimensionMap.get(e.toLocaleString()).color,
              })}}
					/>}
					
          </>
				)
      }
      </ReactMap>
  );
}

// export function renderToDom(container) {
//   render(<HeatMap />, container);
// }
