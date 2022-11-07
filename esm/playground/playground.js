import * as React from 'react';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Map, { Source, Layer } from 'react-map-gl';
import { dataLayer } from './map-style-playground';
import bbox from '@turf/bbox';
const MAPBOX_TOKEN = "pk.eyJ1IjoicHVydmFzaW5naCIsImEiOiJjbDQ4amRrYjQwc3RwM2NsbGttbnlpaTRmIn0.djnJ9PjVpJ7g8aIWHHnPGA"; // Set your mapbox token here
export default function PlaygroundApp() {
    const mapRef = useRef();
    const [allData, setAllData] = useState(null);
    const [hoverInfo, setHoverInfo] = useState(null);
    const [viewport, setViewPort] = useState(null);
    useEffect(() => {
        /* global fetch */
        fetch('https://raw.githubusercontent.com/purvasingh96/Mapbox-react-app/main/src/data/playground.json')
            .then(resp => resp.json())
            .then(json => setAllData(json))
            .catch(err => console.error('Could not load data', err)); // eslint-disable-line
    }, []);
    const onHover = useCallback(event => {
        const { features, point: { x, y } } = event;
        const hoveredFeature = features && features[0];
        // prettier-ignore
        setHoverInfo(hoveredFeature && { feature: hoveredFeature, x, y });
    }, []);
    const onClick = (event) => {
        const feature = event.features[0];
        if (feature) {
            console.log(feature);
            const [minLng, minLat, maxLng, maxLat] = bbox(feature);
            console.log(minLng, minLat, maxLng, maxLat);
            mapRef.current.fitBounds([
                [minLng, minLat],
                [maxLng, maxLat]
            ], { padding: 40, duration: 1000 });
        }
    };
    const data = useMemo(() => {
        return allData;
    }, [allData]);
    return (React.createElement(React.Fragment, null,
        React.createElement(Map, { ref: mapRef, initialViewState: {
                longitude: 42.7339,
                latitude: 25.4858,
                zoom: 1
            }, style: { width: '40vw', height: '80vh' }, mapboxAccessToken: MAPBOX_TOKEN, interactiveLayerIds: ['data'], onMouseMove: onHover, renderWorldCopies: false, onClick: onClick },
            React.createElement(Source, { type: "geojson", data: data },
                React.createElement(Layer, { ...dataLayer })),
            hoverInfo && (React.createElement("div", { className: "tooltip", style: { left: hoverInfo.x, top: hoverInfo.y } },
                React.createElement("div", null,
                    "State: ",
                    hoverInfo.feature.properties.name))))));
}
// export function renderToDom(container) {
//   render(
//     <div>
//   <div>
//     <h1>Playground Map</h1>
//     <PlaygroundApp />
//   </div>
//   <div>
//   <h1>Playground Map</h1>
//   <PlaygroundApp />
// </div>
// </div>, container);
// }
//# sourceMappingURL=playground.js.map