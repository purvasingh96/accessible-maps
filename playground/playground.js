"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_1 = require("react");
var react_map_gl_1 = require("react-map-gl");
var map_style_playground_1 = require("./map-style-playground");
var bbox_1 = require("@turf/bbox");
var MAPBOX_TOKEN = "pk.eyJ1IjoicHVydmFzaW5naCIsImEiOiJjbDQ4amRrYjQwc3RwM2NsbGttbnlpaTRmIn0.djnJ9PjVpJ7g8aIWHHnPGA"; // Set your mapbox token here
function PlaygroundApp() {
    var mapRef = (0, react_1.useRef)();
    var _a = __read((0, react_1.useState)(null), 2), allData = _a[0], setAllData = _a[1];
    var _b = __read((0, react_1.useState)(null), 2), hoverInfo = _b[0], setHoverInfo = _b[1];
    var _c = __read((0, react_1.useState)(null), 2), viewport = _c[0], setViewPort = _c[1];
    (0, react_1.useEffect)(function () {
        /* global fetch */
        fetch('https://raw.githubusercontent.com/purvasingh96/Mapbox-react-app/main/src/data/playground.json')
            .then(function (resp) { return resp.json(); })
            .then(function (json) { return setAllData(json); })
            .catch(function (err) { return console.error('Could not load data', err); }); // eslint-disable-line
    }, []);
    var onHover = (0, react_1.useCallback)(function (event) {
        var features = event.features, _a = event.point, x = _a.x, y = _a.y;
        var hoveredFeature = features && features[0];
        // prettier-ignore
        setHoverInfo(hoveredFeature && { feature: hoveredFeature, x: x, y: y });
    }, []);
    var onClick = function (event) {
        var feature = event.features[0];
        if (feature) {
            console.log(feature);
            var _a = __read((0, bbox_1.default)(feature), 4), minLng = _a[0], minLat = _a[1], maxLng = _a[2], maxLat = _a[3];
            console.log(minLng, minLat, maxLng, maxLat);
            mapRef.current.fitBounds([
                [minLng, minLat],
                [maxLng, maxLat]
            ], { padding: 40, duration: 1000 });
        }
    };
    var data = (0, react_1.useMemo)(function () {
        return allData;
    }, [allData]);
    return (React.createElement(React.Fragment, null,
        React.createElement(react_map_gl_1.default, { ref: mapRef, initialViewState: {
                longitude: 42.7339,
                latitude: 25.4858,
                zoom: 1
            }, style: { width: '40vw', height: '80vh' }, mapboxAccessToken: MAPBOX_TOKEN, interactiveLayerIds: ['data'], onMouseMove: onHover, renderWorldCopies: false, onClick: onClick },
            React.createElement(react_map_gl_1.Source, { type: "geojson", data: data },
                React.createElement(react_map_gl_1.Layer, __assign({}, map_style_playground_1.dataLayer))),
            hoverInfo && (React.createElement("div", { className: "tooltip", style: { left: hoverInfo.x, top: hoverInfo.y } },
                React.createElement("div", null,
                    "State: ",
                    hoverInfo.feature.properties.name))))));
}
exports.default = PlaygroundApp;
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